const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../repositories/user.repository');
const tokenRepository = require('../repositories/token.repository');
const emailService = require('./email.service');

class AuthService {
    async register(userData) {
        const { name, email, password, role } = userData;
        
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Omit password from return
        user.password = undefined;
        return user;
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const accessToken = this.generateAccessToken(user._id, user.role);
        const refreshToken = this.generateRefreshToken(user._id);

        // Store refresh token
        await tokenRepository.createToken({
            userId: user._id,
            token: refreshToken,
            type: 'refresh',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        user.password = undefined;
        return { user, accessToken, refreshToken };
    }

    async logout(refreshToken) {
        await tokenRepository.deleteToken(refreshToken, 'refresh');
    }

    async refreshToken(oldRefreshToken) {
        const tokenDoc = await tokenRepository.findToken(oldRefreshToken, 'refresh');
        if (!tokenDoc) {
            throw new Error('Invalid refresh token');
        }

        try {
            const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await userRepository.findById(decoded.id);

            if (!user) throw new Error('User not found');

            const newAccessToken = this.generateAccessToken(user._id, user.role);
            const newRefreshToken = this.generateRefreshToken(user._id);

            // Replace old refresh token
            await tokenRepository.deleteToken(oldRefreshToken, 'refresh');
            await tokenRepository.createToken({
                userId: user._id,
                token: newRefreshToken,
                type: 'refresh',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (err) {
            await tokenRepository.deleteToken(oldRefreshToken, 'refresh');
            throw new Error('Invalid refresh token');
        }
    }

    async forgotPassword(email) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        // Delete any existing reset tokens for user
        await tokenRepository.deleteAllUserTokens(user._id, 'resetPassword');

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        await tokenRepository.createToken({
            userId: user._id,
            token: hashedToken,
            type: 'resetPassword',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        await emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    async resetPassword(resetToken, newPassword) {
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenDoc = await tokenRepository.findToken(hashedToken, 'resetPassword');

        if (!tokenDoc) {
            throw new Error('Invalid or expired password reset token');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userRepository.updatePassword(tokenDoc.userId, hashedPassword);
        await tokenRepository.deleteToken(hashedToken, 'resetPassword');
    }

    generateAccessToken(id, role) {
        return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
            expiresIn: process.env.JWT_EXPIRE || '15m'
        });
    }

    generateRefreshToken(id) {
        return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refreshSecret', {
            expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
        });
    }
}

module.exports = new AuthService();

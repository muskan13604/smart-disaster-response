const authService = require('../services/auth.service');
const { sendResponse } = require('../utils/response.util');

class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            sendResponse(res, 201, true, 'User registered successfully', { user });
        } catch (error) {
            sendResponse(res, 400, false, error.message);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await authService.login(email, password);
            
            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            sendResponse(res, 200, true, 'Login successful', { user, accessToken });
        } catch (error) {
            sendResponse(res, 401, false, error.message);
        }
    }

    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            res.clearCookie('refreshToken');
            sendResponse(res, 200, true, 'Logged out successfully');
        } catch (error) {
            sendResponse(res, 500, false, 'Server Error during logout');
        }
    }

    async refreshToken(req, res) {
        try {
            const oldRefreshToken = req.cookies.refreshToken;
            if (!oldRefreshToken) {
                return sendResponse(res, 401, false, 'No refresh token provided');
            }

            const { accessToken, refreshToken } = await authService.refreshToken(oldRefreshToken);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            sendResponse(res, 200, true, 'Token refreshed', { accessToken });
        } catch (error) {
            res.clearCookie('refreshToken');
            sendResponse(res, 401, false, error.message);
        }
    }

    async forgotPassword(req, res) {
        try {
            await authService.forgotPassword(req.body.email);
            sendResponse(res, 200, true, 'Email sent');
        } catch (error) {
            sendResponse(res, 404, false, error.message);
        }
    }

    async resetPassword(req, res) {
        try {
            await authService.resetPassword(req.params.resetToken, req.body.password);
            sendResponse(res, 200, true, 'Password updated successfully');
        } catch (error) {
            sendResponse(res, 400, false, error.message);
        }
    }
}

module.exports = new AuthController();

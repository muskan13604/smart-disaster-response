const User = require('../models/user.model');

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }
    async findByEmail(email) {
        return await User.findOne({ email }).select('+password');
    }
    async findById(id) {
        return await User.findById(id);
    }
    async updatePassword(id, newPassword) {
        const user = await User.findById(id);
        if(user) {
            user.password = newPassword;
            await user.save();
        }
        return user;
    }
}
module.exports = new UserRepository();

const Token = require('../models/token.model');

class TokenRepository {
    async createToken(tokenData) {
        return await Token.create(tokenData);
    }
    async findToken(token, type) {
        return await Token.findOne({ token, type });
    }
    async deleteToken(token, type) {
        return await Token.findOneAndDelete({ token, type });
    }
    async deleteAllUserTokens(userId, type) {
        return await Token.deleteMany({ userId, type });
    }
}
module.exports = new TokenRepository();

const { sendResponse } = require('../utils/response.util');

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendResponse(res, 403, false, `User role ${req.user.role} is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { authorize };

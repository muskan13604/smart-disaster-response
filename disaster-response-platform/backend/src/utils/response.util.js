const sendResponse = (res, statusCode, success, message, data = {}, errors = []) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        errors
    });
};

module.exports = {
    sendResponse
};

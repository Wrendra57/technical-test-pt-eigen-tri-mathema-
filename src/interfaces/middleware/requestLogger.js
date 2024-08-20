const requestLoggerMiddleware = (req, res, next) => {
    console.log(`Request ID: ${req.requestId} - ${req.method} ${req.originalUrl} - at ${new Date()}`);
    next();
};

module.exports = requestLoggerMiddleware;
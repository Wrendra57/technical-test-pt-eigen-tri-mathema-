const requestLoggerMiddleware = (req, res, next) => {
    console.log(`Request ID: ${req.requestId} - ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = requestLoggerMiddleware;
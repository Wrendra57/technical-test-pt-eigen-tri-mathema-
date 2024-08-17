const { v4: uuidv4 } = require('uuid');

const requestIdMiddleware = (req, res, next) => {
    // Check if request ID exists in headers
    let requestId = req.headers['x-request-id'];

    if (!requestId) {
        requestId = uuidv4();
        req.headers['x-request-id'] = requestId;
    }
    req.requestId = requestId;

    res.setHeader('x-request-id', requestId);

    next();
};

module.exports = requestIdMiddleware;
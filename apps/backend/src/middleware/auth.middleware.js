const jwt = require('jsonwebtoken');
const { failure } = require('../utils/response');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return failure(res, 401, 'UNAUTHORIZED', 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return failure(res, 401, 'INVALID_TOKEN', 'Invalid or expired token');
  }
}

module.exports = { authMiddleware };
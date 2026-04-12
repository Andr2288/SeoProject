const jwt = require('jsonwebtoken');
const { failure } = require('../utils/response');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.admin_token;
  let token = cookieToken || null;

  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return failure(res, 401, 'UNAUTHORIZED', 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return failure(res, 401, 'INVALID_TOKEN', 'Invalid or expired token');
  }
}

module.exports = { authMiddleware };
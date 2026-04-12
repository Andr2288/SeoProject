const { failure } = require('../utils/response');

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function requireTrustedAdminRequest(req, res, next) {
  if (!MUTATING_METHODS.has(req.method)) {
    return next();
  }

  const adminHeader = req.get('x-admin-request');
  if (adminHeader !== '1') {
    return failure(res, 403, 'FORBIDDEN', 'Missing trusted admin request header');
  }

  const frontendUrl = process.env.FRONTEND_URL;
  const origin = req.get('origin');

  if (frontendUrl && origin && origin !== frontendUrl) {
    return failure(res, 403, 'FORBIDDEN', 'Invalid request origin');
  }

  return next();
}

module.exports = { requireTrustedAdminRequest };

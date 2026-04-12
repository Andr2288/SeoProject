const router = require('express').Router();
const { login, logout, me } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireTrustedAdminRequest } = require('../middleware/admin-request.middleware');

router.post('/login', requireTrustedAdminRequest, login);
router.post('/logout', requireTrustedAdminRequest, logout);
router.get('/me', authMiddleware, me);

module.exports = router;
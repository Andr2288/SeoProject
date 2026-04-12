const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  listAdminArticles,
  getAdminMeta,
  getAdminArticleById,
  createAdminArticle,
  updateAdminArticle,
  deleteAdminArticle,
} = require('../controllers/admin.controller');

router.use(authMiddleware);

router.get('/meta', getAdminMeta);

router.get('/articles', listAdminArticles);
router.get('/articles/:id', getAdminArticleById);
router.post('/articles', createAdminArticle);
router.put('/articles/:id', updateAdminArticle);
router.delete('/articles/:id', deleteAdminArticle);

module.exports = router;
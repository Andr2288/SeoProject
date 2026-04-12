const router = require('express').Router();
const publicController = require('../controllers/public.controller');

router.get('/articles', publicController.listArticles);
router.get('/articles/:slug', publicController.getArticle);
router.get('/articles/:slug/related', publicController.relatedArticles);
router.post('/articles/:id/view', publicController.addView);

router.get('/categories', publicController.listCategories);
router.get('/categories/:slug/articles', publicController.categoryArticles);

router.get('/tags', publicController.listTags);
router.get('/tags/:slug/articles', publicController.tagArticles);

router.get('/authors/:slug', publicController.getAuthor);
router.get('/authors/:slug/articles', publicController.authorArticles);

router.get('/search', publicController.search);

router.get('/authors', publicController.listAuthors);

module.exports = router;
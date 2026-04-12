const { success, failure } = require('../utils/response');
const { getPublishedArticles, getArticleBySlug, getRelatedArticles, incrementViews } = require('../services/article.service');
const { getCategories, getCategoryArticles } = require('../services/category.service');
const { getTags, getTagArticles } = require('../services/tag.service');
const { getAuthorBySlug, getAuthorArticles } = require('../services/author.service');
const { searchArticles } = require('../services/search.service');

async function listArticles(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);
    const category = req.query.category || '';

    const result = await getPublishedArticles({ page, perPage, category });
    return success(res, result.data, result.meta);
  } catch (error) {
    return failure(res, 500, 'ARTICLES_FETCH_FAILED', error.message);
  }
}

async function getArticle(req, res) {
  try {
    const article = await getArticleBySlug(req.params.slug);

    if (!article) {
      return failure(res, 404, 'ARTICLE_NOT_FOUND', 'Article not found');
    }

    return success(res, article);
  } catch (error) {
    return failure(res, 500, 'ARTICLE_FETCH_FAILED', error.message);
  }
}

async function relatedArticles(req, res) {
  try {
    const articles = await getRelatedArticles(req.params.slug);
    return success(res, articles);
  } catch (error) {
    return failure(res, 500, 'RELATED_FETCH_FAILED', error.message);
  }
}

async function addView(req, res) {
  try {
    const article = await incrementViews(Number(req.params.id));

    if (!article) {
      return failure(res, 404, 'ARTICLE_NOT_FOUND', 'Article not found');
    }

    return success(res, article);
  } catch (error) {
    return failure(res, 500, 'VIEW_INCREMENT_FAILED', error.message);
  }
}

async function listCategories(req, res) {
  try {
    const categories = await getCategories();
    return success(res, categories);
  } catch (error) {
    return failure(res, 500, 'CATEGORIES_FETCH_FAILED', error.message);
  }
}

async function categoryArticles(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const result = await getCategoryArticles(req.params.slug, { page, perPage });

    if (!result) {
      return failure(res, 404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }

    return success(res, {
      category: result.category,
      articles: result.articles,
    }, result.meta);
  } catch (error) {
    return failure(res, 500, 'CATEGORY_ARTICLES_FETCH_FAILED', error.message);
  }
}

async function listTags(req, res) {
  try {
    const tags = await getTags();
    return success(res, tags);
  } catch (error) {
    return failure(res, 500, 'TAGS_FETCH_FAILED', error.message);
  }
}

async function tagArticles(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const result = await getTagArticles(req.params.slug, { page, perPage });

    if (!result) {
      return failure(res, 404, 'TAG_NOT_FOUND', 'Tag not found');
    }

    return success(res, {
      tag: result.tag,
      articles: result.articles,
    }, result.meta);
  } catch (error) {
    return failure(res, 500, 'TAG_ARTICLES_FETCH_FAILED', error.message);
  }
}

async function getAuthor(req, res) {
  try {
    const author = await getAuthorBySlug(req.params.slug);

    if (!author) {
      return failure(res, 404, 'AUTHOR_NOT_FOUND', 'Author not found');
    }

    return success(res, author);
  } catch (error) {
    return failure(res, 500, 'AUTHOR_FETCH_FAILED', error.message);
  }
}

async function authorArticles(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const result = await getAuthorArticles(req.params.slug, { page, perPage });

    if (!result) {
      return failure(res, 404, 'AUTHOR_NOT_FOUND', 'Author not found');
    }

    return success(res, {
      author: result.author,
      articles: result.articles,
    }, result.meta);
  } catch (error) {
    return failure(res, 500, 'AUTHOR_ARTICLES_FETCH_FAILED', error.message);
  }
}

async function search(req, res) {
  try {
    const q = String(req.query.q || '').trim();
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    if (!q) {
      return success(res, [], {
        total: 0,
        page,
        perPage,
        totalPages: 0,
      });
    }

    const result = await searchArticles(q, { page, perPage });
    return success(res, result.data, result.meta);
  } catch (error) {
    return failure(res, 500, 'SEARCH_FAILED', error.message);
  }
}

async function listAuthors(req, res) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, slug')
      .order('name', { ascending: true });

    if (error) throw error;

    return success(res, data);
  } catch (error) {
    return failure(res, 500, 'AUTHORS_FETCH_FAILED', error.message);
  }
}

module.exports = {
  listArticles,
  getArticle,
  relatedArticles,
  addView,
  listCategories,
  categoryArticles,
  listTags,
  tagArticles,
  getAuthor,
  authorArticles,
  search,
    listAuthors
};
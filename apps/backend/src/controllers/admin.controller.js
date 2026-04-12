const { supabase } = require('../lib/supabase');
const { success, failure } = require('../utils/response');

async function listAdminArticles(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        status,
        views,
        published_at,
        created_at,
        category:categories(id, name, slug),
        author:users(id, name, slug)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return success(res, data, {
      total: count || 0,
      page,
      perPage,
      totalPages: Math.ceil((count || 0) / perPage),
    });
  } catch (error) {
    return failure(res, 500, 'ADMIN_ARTICLES_FETCH_FAILED', error.message);
  }
}

async function getAdminMeta(req, res) {
  try {
    const [{ data: authors, error: authorsError }, { data: categories, error: categoriesError }, { data: tags, error: tagsError }] =
      await Promise.all([
        supabase.from('users').select('id, name, slug').order('name', { ascending: true }),
        supabase.from('categories').select('id, name, slug').order('name', { ascending: true }),
        supabase.from('tags').select('id, name, slug').order('name', { ascending: true }),
      ]);

    if (authorsError) throw authorsError;
    if (categoriesError) throw categoriesError;
    if (tagsError) throw tagsError;

    return success(res, {
      authors,
      categories,
      tags,
    });
  } catch (error) {
    return failure(res, 500, 'ADMIN_META_FETCH_FAILED', error.message);
  }
}

async function getAdminArticleById(req, res) {
  try {
    const articleId = Number(req.params.id);

    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        cover_url,
        author_id,
        category_id,
        status,
        views,
        meta_title,
        meta_description,
        published_at,
        created_at,
        updated_at
      `)
      .eq('id', articleId)
      .single();

    if (error || !article) {
      return failure(res, 404, 'ARTICLE_NOT_FOUND', 'Article not found');
    }

    const { data: articleTags, error: tagsError } = await supabase
      .from('article_tags')
      .select('tag_id')
      .eq('article_id', articleId);

    if (tagsError) throw tagsError;

    return success(res, {
      ...article,
      tag_ids: articleTags.map((item) => item.tag_id),
    });
  } catch (error) {
    return failure(res, 500, 'ADMIN_ARTICLE_FETCH_FAILED', error.message);
  }
}

async function createAdminArticle(req, res) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      cover_url,
      author_id,
      category_id,
      status,
      meta_title,
      meta_description,
      published_at,
      tag_ids = [],
    } = req.body;

    if (!title || !slug || !content) {
      return failure(res, 400, 'VALIDATION_ERROR', 'title, slug and content are required');
    }

    const normalizedStatus = status === 'published' ? 'published' : 'draft';

    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      cover_url: cover_url || null,
      author_id: author_id || null,
      category_id: category_id || null,
      status: normalizedStatus,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      published_at:
        normalizedStatus === 'published'
          ? (published_at || new Date().toISOString())
          : null,
    };

    const { data: createdArticle, error } = await supabase
      .from('articles')
      .insert(payload)
      .select('id')
      .single();

    if (error) throw error;

    if (Array.isArray(tag_ids) && tag_ids.length) {
      const rows = tag_ids.map((tagId) => ({
        article_id: createdArticle.id,
        tag_id: Number(tagId),
      }));

      const { error: articleTagsError } = await supabase
        .from('article_tags')
        .insert(rows);

      if (articleTagsError) throw articleTagsError;
    }

    return success(res, {
      id: createdArticle.id,
      message: 'Article created',
    });
  } catch (error) {
    return failure(res, 500, 'ADMIN_ARTICLE_CREATE_FAILED', error.message);
  }
}

async function updateAdminArticle(req, res) {
  try {
    const articleId = Number(req.params.id);

    const {
      title,
      slug,
      excerpt,
      content,
      cover_url,
      author_id,
      category_id,
      status,
      meta_title,
      meta_description,
      published_at,
      tag_ids = [],
    } = req.body;

    if (!title || !slug || !content) {
      return failure(res, 400, 'VALIDATION_ERROR', 'title, slug and content are required');
    }

    const normalizedStatus = status === 'published' ? 'published' : 'draft';

    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      cover_url: cover_url || null,
      author_id: author_id || null,
      category_id: category_id || null,
      status: normalizedStatus,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      published_at:
        normalizedStatus === 'published'
          ? (published_at || new Date().toISOString())
          : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', articleId);

    if (error) throw error;

    const { error: deleteTagsError } = await supabase
      .from('article_tags')
      .delete()
      .eq('article_id', articleId);

    if (deleteTagsError) throw deleteTagsError;

    if (Array.isArray(tag_ids) && tag_ids.length) {
      const rows = tag_ids.map((tagId) => ({
        article_id: articleId,
        tag_id: Number(tagId),
      }));

      const { error: insertTagsError } = await supabase
        .from('article_tags')
        .insert(rows);

      if (insertTagsError) throw insertTagsError;
    }

    return success(res, {
      id: articleId,
      message: 'Article updated',
    });
  } catch (error) {
    return failure(res, 500, 'ADMIN_ARTICLE_UPDATE_FAILED', error.message);
  }
}

async function deleteAdminArticle(req, res) {
  try {
    const articleId = Number(req.params.id);

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (error) throw error;

    return success(res, {
      id: articleId,
      message: 'Article deleted',
    });
  } catch (error) {
    return failure(res, 500, 'ADMIN_ARTICLE_DELETE_FAILED', error.message);
  }
}

module.exports = {
  listAdminArticles,
  getAdminMeta,
  getAdminArticleById,
  createAdminArticle,
  updateAdminArticle,
  deleteAdminArticle,
};
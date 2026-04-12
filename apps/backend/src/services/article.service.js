const { supabase } = require('../lib/supabase');

async function getPublishedArticles({ page = 1, perPage = 10, category }) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_url,
      published_at,
      views,
      category:categories(id, name, slug),
      author:users(id, name, slug)
    `, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to);

  if (category) {
    const { data: categoryRow } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (!categoryRow) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          perPage,
          totalPages: 0,
        },
      };
    }

    query = query.eq('category_id', categoryRow.id);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data,
    meta: {
      total: count || 0,
      page,
      perPage,
      totalPages: Math.ceil((count || 0) / perPage),
    },
  };
}

async function getArticleBySlug(slug) {
  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      cover_url,
      published_at,
      views,
      meta_title,
      meta_description,
      category:categories(id, name, slug, description),
      author:users(id, name, slug, bio, avatar_url),
      article_tags(
        tag:tags(id, name, slug)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;

  return {
    ...article,
    tags: article.article_tags.map((item) => item.tag),
  };
}

async function getRelatedArticles(slug) {
  const article = await getArticleBaseBySlug(slug);
  if (!article) return [];

  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_url,
      published_at
    `)
    .eq('status', 'published')
    .eq('category_id', article.category_id)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) throw error;

  return data;
}

async function incrementViews(id) {
  const { data: article, error: getError } = await supabase
    .from('articles')
    .select('id, views')
    .eq('id', id)
    .single();

  if (getError || !article) return null;

  const { data, error } = await supabase
    .from('articles')
    .update({ views: (article.views || 0) + 1 })
    .eq('id', id)
    .select('id, views')
    .single();

  if (error) throw error;

  return data;
}

async function getArticleBaseBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, category_id')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data;
}

module.exports = {
  getPublishedArticles,
  getArticleBySlug,
  getRelatedArticles,
  incrementViews,
};
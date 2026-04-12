const { supabase } = require('../lib/supabase');

async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

async function getCategoryArticles(slug, { page = 1, perPage = 10 }) {
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .eq('slug', slug)
    .single();

  if (categoryError || !category) return null;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data: articles, error, count } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_url,
      published_at,
      author:users(id, name, slug)
    `, { count: 'exact' })
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    category,
    articles,
    meta: {
      total: count || 0,
      page,
      perPage,
      totalPages: Math.ceil((count || 0) / perPage),
    },
  };
}

module.exports = {
  getCategories,
  getCategoryArticles,
};
const { supabase } = require('../lib/supabase');

async function getAuthorBySlug(slug) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, slug, bio, avatar_url')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

async function getAuthorArticles(slug, { page = 1, perPage = 10 }) {
  const author = await getAuthorBySlug(slug);
  if (!author) return null;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_url,
      published_at,
      category:categories(id, name, slug)
    `, { count: 'exact' })
    .eq('status', 'published')
    .eq('author_id', author.id)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    author,
    articles: data,
    meta: {
      total: count || 0,
      page,
      perPage,
      totalPages: Math.ceil((count || 0) / perPage),
    },
  };
}

module.exports = {
  getAuthorBySlug,
  getAuthorArticles,
};
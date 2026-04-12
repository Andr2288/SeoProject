const { supabase } = require('../lib/supabase');

async function searchArticles(query, { page = 1, perPage = 10 }) {
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
      author:users(id, name, slug),
      category:categories(id, name, slug)
    `, { count: 'exact' })
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .range(from, to);

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

module.exports = {
  searchArticles,
};
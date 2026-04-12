const { supabase } = require('../lib/supabase');

async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

async function getTagArticles(slug, { page = 1, perPage = 10 }) {
  const { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();

  if (tagError || !tag) return null;

  const { data: articleTagRows, error: joinError } = await supabase
    .from('article_tags')
    .select('article_id')
    .eq('tag_id', tag.id);

  if (joinError) throw joinError;

  const articleIds = articleTagRows.map((row) => row.article_id);

  if (!articleIds.length) {
    return {
      tag,
      articles: [],
      meta: {
        total: 0,
        page,
        perPage,
        totalPages: 0,
      },
    };
  }

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
    .in('id', articleIds)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    tag,
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
  getTags,
  getTagArticles,
};
export function formatDate(dateString?: string | null) {
  if (!dateString) return '—';

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}
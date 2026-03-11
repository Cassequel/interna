// The Muse API — free, no auth required for basic access
// Docs: https://www.themuse.com/developers/api/v2

export async function fetchTheMuse() {
  const { default: fetch } = await import('node-fetch');
  const categories = ['Data Science', 'Data Analysis', 'Software Engineer'];
  const results = [];

  for (const category of categories) {
    try {
      const url = new URL('https://www.themuse.com/api/public/jobs');
      url.searchParams.set('category', category);
      url.searchParams.set('level', 'Internship');
      url.searchParams.set('page', '1');

      const res = await fetch(url.toString());
      if (!res.ok) continue;
      const data = await res.json();

      for (const job of data.results ?? []) {
        results.push({
          title: job.name,
          company: job.company?.name ?? 'Unknown',
          location: job.locations?.[0]?.name ?? null,
          source: 'themuse',
          url: job.refs?.landing_page ?? null,
          description: null,
          date_posted: job.publication_date
            ? new Date(job.publication_date).toISOString().split('T')[0]
            : null,
        });
      }
    } catch (err) {
      console.error('The Muse error:', err.message);
    }
  }

  return results;
}

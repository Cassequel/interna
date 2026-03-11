// Adzuna API — requires ADZUNA_APP_ID and ADZUNA_APP_KEY env vars
// Docs: https://developer.adzuna.com/

const KEYWORDS = 'machine learning data engineering intern';
const COUNTRY = 'us';

export async function fetchAdzuna() {
  const { default: fetch } = await import('node-fetch');
  const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;

  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    console.warn('Adzuna API keys not set — skipping');
    return [];
  }

  const url = new URL(
    `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1`
  );
  url.searchParams.set('app_id', ADZUNA_APP_ID);
  url.searchParams.set('app_key', ADZUNA_APP_KEY);
  url.searchParams.set('what', KEYWORDS);
  url.searchParams.set('results_per_page', '50');
  url.searchParams.set('content-type', 'application/json');

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return (data.results ?? []).map((job) => ({
      title: job.title,
      company: job.company?.display_name ?? 'Unknown',
      location: job.location?.display_name ?? null,
      source: 'adzuna',
      url: job.redirect_url,
      description: job.description ?? null,
      date_posted: job.created ? new Date(job.created).toISOString().split('T')[0] : null,
    }));
  } catch (err) {
    console.error('Adzuna error:', err.message);
    return [];
  }
}

// Greenhouse public API — no auth required
// Pattern: https://boards.greenhouse.io/v1/boards/{company}/jobs

const COMPANIES = [
  'palantir',
  'scaleai',
  'huggingface',
  'wandb',
  'cohere',
];

export async function fetchGreenhouse() {
  const { default: fetch } = await import('node-fetch');
  const results = [];

  for (const company of COMPANIES) {
    try {
      const res = await fetch(
        `https://boards.greenhouse.io/v1/boards/${company}/jobs?content=true`
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const job of data.jobs ?? []) {
        results.push({
          title: job.title,
          company,
          location: job.location?.name ?? null,
          source: 'greenhouse',
          url: job.absolute_url,
          description: job.content ?? null,
          date_posted: job.updated_at ? new Date(job.updated_at).toISOString().split('T')[0] : null,
        });
      }
    } catch (err) {
      console.error(`Greenhouse error for ${company}:`, err.message);
    }
  }

  return results;
}

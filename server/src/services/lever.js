// Lever public API — no auth required
// Pattern: https://api.lever.co/v0/postings/{company}?mode=json

const COMPANIES = [
  'openai',
  'anthropic',
  'mistral',
  'together',
];

export async function fetchLever() {
  const { default: fetch } = await import('node-fetch');
  const results = [];

  for (const company of COMPANIES) {
    try {
      const res = await fetch(
        `https://api.lever.co/v0/postings/${company}?mode=json`
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const job of data) {
        results.push({
          title: job.text,
          company,
          location: job.categories?.location ?? null,
          source: 'lever',
          url: job.hostedUrl,
          description: job.descriptionPlain ?? null,
          date_posted: job.createdAt
            ? new Date(job.createdAt).toISOString().split('T')[0]
            : null,
        });
      }
    } catch (err) {
      console.error(`Lever error for ${company}:`, err.message);
    }
  }

  return results;
}

// Filter engine — applied to all incoming jobs before DB insertion

const KEYWORDS = [
  'machine learning',
  'data engineering',
  'ml intern',
  'data science',
  'mlops',
  'data analyst',
  'artificial intelligence',
  'deep learning',
];

const LOCATIONS = [
  'remote',
  'salt lake',
  'san francisco',
  'new york',
  'seattle',
  'austin',
  'boston',
];

const EXCLUSION_KEYWORDS = [
  'senior',
  'staff',
  'principal',
  'director',
  'manager',
  'lead',
  'full-time only',
];

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

function matchesKeyword(job) {
  const text = `${job.title} ${job.description ?? ''}`.toLowerCase();
  return KEYWORDS.some((kw) => text.includes(kw));
}

function matchesLocation(job) {
  if (!job.location) return false;
  const loc = job.location.toLowerCase();
  return LOCATIONS.some((l) => loc.includes(l));
}

function isRecent(job) {
  if (!job.date_posted) return true; // assume recent if unknown
  const posted = new Date(job.date_posted);
  return Date.now() - posted.getTime() <= TWO_WEEKS_MS;
}

function isExcluded(job) {
  const title = job.title.toLowerCase();
  return EXCLUSION_KEYWORDS.some((ex) => title.includes(ex));
}

export function filterJobs(jobs) {
  return jobs.filter(
    (job) =>
      matchesKeyword(job) &&
      matchesLocation(job) &&
      isRecent(job) &&
      !isExcluded(job)
  );
}

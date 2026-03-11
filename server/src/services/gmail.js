// Gmail parser for LinkedIn job alert emails
// Requires Google OAuth credentials in env vars

import { google } from 'googleapis';

function getOAuthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return oauth2Client;
}

function parseJobsFromEmailBody(body) {
  // LinkedIn alert emails contain structured job blocks — basic regex extraction
  const jobs = [];
  const jobPattern = /([^\n]+)\nat ([^\n]+)\n([^\n]*(?:Remote|Hybrid|On-site)[^\n]*)\n(https:\/\/www\.linkedin\.com\/jobs\/view\/[^\s]+)/gi;
  let match;
  while ((match = jobPattern.exec(body)) !== null) {
    jobs.push({
      title: match[1].trim(),
      company: match[2].trim(),
      location: match[3].trim(),
      source: 'linkedin',
      url: match[4].trim(),
      description: null,
      date_posted: new Date().toISOString().split('T')[0],
    });
  }
  return jobs;
}

export async function fetchLinkedInFromGmail() {
  const { GOOGLE_CLIENT_ID } = process.env;
  if (!GOOGLE_CLIENT_ID) {
    console.warn('Google credentials not set — skipping Gmail parser');
    return [];
  }

  try {
    const auth = getOAuthClient();
    const gmail = google.gmail({ version: 'v1', auth });

    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:jobalerts@linkedin.com newer_than:14d',
      maxResults: 50,
    });

    const messages = listRes.data.messages ?? [];
    const jobs = [];

    for (const msg of messages) {
      const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' });
      const parts = detail.data.payload?.parts ?? [];
      let body = '';

      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          body += Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      }

      jobs.push(...parseJobsFromEmailBody(body));
    }

    return jobs;
  } catch (err) {
    console.error('Gmail parser error:', err.message);
    return [];
  }
}

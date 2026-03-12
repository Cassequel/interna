import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';  // ADD THIS

import jobsRouter from './routes/jobs.js';
import queueRouter from './routes/queue.js';
import trackerRouter from './routes/tracker.js';

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 3001;

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDist = join(__dirname, '../../client/dist');

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobsRouter);
app.use('/api/queue', queueRouter);
app.use('/api/tracker', trackerRouter);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use(express.static(clientDist));
app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
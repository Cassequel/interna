import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import jobsRouter from './routes/jobs.js';
import queueRouter from './routes/queue.js';
import trackerRouter from './routes/tracker.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobsRouter);
app.use('/api/queue', queueRouter);
app.use('/api/tracker', trackerRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

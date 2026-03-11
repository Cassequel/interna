import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /api/queue — all queued jobs with their job details
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT q.*, j.title, j.company, j.location, j.url
       FROM queue q
       JOIN jobs j ON j.id = q.job_id
       ORDER BY q.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/queue — queue a job for tailoring
router.post('/', async (req, res) => {
  const { job_id } = req.body;
  if (!job_id) return res.status(400).json({ error: 'job_id is required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO queue (job_id) VALUES ($1) RETURNING *`,
      [job_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PATCH /api/queue/:id — update status / urls after tailoring
router.patch('/:id', async (req, res) => {
  const { status, resume_url, cover_letter_url } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE queue SET status=$1, resume_url=$2, cover_letter_url=$3
       WHERE id=$4 RETURNING *`,
      [status, resume_url, cover_letter_url, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

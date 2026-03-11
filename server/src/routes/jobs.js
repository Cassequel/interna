import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /api/jobs — return all jobs (filtered)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM jobs ORDER BY date_posted DESC, created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/jobs/manual — add a job by manual paste
router.post('/manual', async (req, res) => {
  const { title, company, location, url, description } = req.body;
  if (!title || !company) {
    return res.status(400).json({ error: 'title and company are required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO jobs (title, company, location, source, url, description)
       VALUES ($1, $2, $3, 'manual', $4, $5)
       RETURNING *`,
      [title, company, location, url, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

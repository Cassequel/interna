import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /api/tracker — all submitted applications
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*, j.title, j.company, j.location, j.source, j.url
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       ORDER BY a.date_applied DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/tracker — log a new application
router.post('/', async (req, res) => {
  const { job_id, notes } = req.body;
  if (!job_id) return res.status(400).json({ error: 'job_id is required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO applications (job_id, notes) VALUES ($1, $2) RETURNING *`,
      [job_id, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PATCH /api/tracker/:id — update status or notes
router.patch('/:id', async (req, res) => {
  const { status, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE applications SET status=COALESCE($1, status), notes=COALESCE($2, notes)
       WHERE id=$3 RETURNING *`,
      [status, notes, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;

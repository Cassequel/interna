CREATE TABLE IF NOT EXISTS jobs (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  company     TEXT NOT NULL,
  location    TEXT,
  source      TEXT NOT NULL,           -- greenhouse | lever | adzuna | themuse | linkedin | manual
  url         TEXT,
  description TEXT,
  date_posted DATE,
  match_score NUMERIC(4,2),            -- 0-100
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS queue (
  id               SERIAL PRIMARY KEY,
  job_id           INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'generating', -- generating | ready | applied
  resume_url       TEXT,
  cover_letter_url TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id           SERIAL PRIMARY KEY,
  job_id       INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  date_applied DATE DEFAULT CURRENT_DATE,
  status       TEXT NOT NULL DEFAULT 'applied', -- applied | interviewing | rejected | offer
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

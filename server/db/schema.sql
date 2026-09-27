CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE CHECK (length(username) BETWEEN 3 AND 30),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS manga (
  id BIGSERIAL PRIMARY KEY,
  anilist_id INTEGER NOT NULL UNIQUE CHECK (anilist_id > 0),
  title TEXT NOT NULL,
  cover_url TEXT,
  synopsis TEXT,
  genres JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  manga_id BIGINT NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
  current_chapter NUMERIC(8, 2) NOT NULL DEFAULT 0 CHECK (current_chapter >= 0),
  status TEXT NOT NULL DEFAULT 'Plan to Read' CONSTRAINT progress_status_allowed_check CHECK (status IN ('Coming Soon', 'Releasing', 'Reading', 'Completed', 'Plan to Read', 'On Hold', 'Dropped')),
  rating INTEGER CHECK (rating IS NULL OR rating BETWEEN 1 AND 10),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, manga_id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS progress_user_idx ON progress(user_id);
CREATE INDEX IF NOT EXISTS refresh_token_user_idx ON refresh_tokens(user_id);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'manga' AND column_name = 'mal_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'manga' AND column_name = 'anilist_id'
  ) THEN
    ALTER TABLE manga RENAME COLUMN mal_id TO anilist_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'progress'::regclass AND conname = 'progress_status_check'
  ) THEN
    ALTER TABLE progress DROP CONSTRAINT progress_status_check;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'progress'::regclass AND conname = 'progress_status_allowed_check'
  ) THEN
    ALTER TABLE progress ADD CONSTRAINT progress_status_allowed_check
      CHECK (status IN ('Coming Soon', 'Releasing', 'Reading', 'Completed', 'Plan to Read', 'On Hold', 'Dropped'));
  END IF;
END $$;

-- ============================================================
-- 007_auth.sql  –  Supabase Auth integration
-- BrindaWorld Platform
-- Must run after 001_operational.sql
-- Adds supabase_id to users table for JWT verification
-- ============================================================

-- Add supabase_id column (IF NOT EXISTS requires MySQL 8.0.3+)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS supabase_id VARCHAR(255) NULL AFTER id;

-- Unique index so each Supabase UID maps to exactly one MySQL user
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_supabase_id ON users (supabase_id);

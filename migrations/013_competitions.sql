-- ============================================================
-- 013_competitions.sql  –  Group Competitions System
-- BrindaWorld Platform
-- CMMI L5: age-banded, school-safe, COPPA compliant (first names only)
--
-- Tables: 3 | Running total: 112 tables
--   1. competitions              – tournament definitions
--   2. competition_entries       – child entry + running score
--   3. competition_leaderboard   – public-safe ranked view (first name + last initial only)
-- ============================================================

-- 1. competitions ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS competitions (
  id                 INT              NOT NULL AUTO_INCREMENT,
  public_id          VARCHAR(36)      NOT NULL DEFAULT (UUID()),
  title              VARCHAR(200)     NOT NULL,
  description        TEXT             NULL,
  competition_type   ENUM(
                       'weekly_chess',
                       'class_tournament',
                       'monthly_grand_prix',
                       'custom'
                     )                NOT NULL,
  age_band           ENUM('6-8','9-11','12-14','all') NOT NULL DEFAULT 'all',
  game_category      VARCHAR(50)      NULL     COMMENT 'NULL = all categories',
  created_by         INT              NULL     COMMENT 'FK to users.id — NULL = system-created',
  scope              ENUM('global','province','school','class') NOT NULL DEFAULT 'global',
  province_code      VARCHAR(10)      NULL,
  school_code        VARCHAR(100)     NULL,
  starts_at          TIMESTAMP        NOT NULL,
  ends_at            TIMESTAMP        NOT NULL,
  status             ENUM(
                       'upcoming',
                       'active',
                       'ended',
                       'cancelled'
                     )                NOT NULL DEFAULT 'upcoming',
  max_participants   INT              NULL,
  prize_description  VARCHAR(200)     NULL     COMMENT 'e.g. Digital Trophy + Certificate',
  created_at         TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_competitions_public_id (public_id),
  INDEX idx_comp_status   (status),
  INDEX idx_comp_type     (competition_type),
  INDEX idx_comp_age      (age_band),
  INDEX idx_comp_dates    (starts_at, ends_at),
  INDEX idx_comp_scope    (scope)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Competition / tournament definitions — one row per event';

-- 2. competition_entries ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS competition_entries (
  id                 INT              NOT NULL AUTO_INCREMENT,
  competition_id     INT              NOT NULL,
  child_id           INT              NOT NULL,
  entered_at         TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_score        INT              NOT NULL DEFAULT 0,
  sessions_count     INT              NOT NULL DEFAULT 0,
  rank               INT              NULL     COMMENT 'Computed at end of competition',
  badge_awarded      VARCHAR(100)     NULL,
  certificate_issued TINYINT(1)       NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE KEY uq_entry (competition_id, child_id),
  INDEX idx_entry_comp  (competition_id),
  INDEX idx_entry_child (child_id),
  INDEX idx_entry_score (total_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='One row per child per competition; tracks cumulative score and rank';

-- 3. competition_leaderboard ───────────────────────────────────────────────────
-- COPPA: display_name = first name + last initial only. No full names. No parent info.
CREATE TABLE IF NOT EXISTS competition_leaderboard (
  id                 INT              NOT NULL AUTO_INCREMENT,
  competition_id     INT              NOT NULL,
  child_id           INT              NOT NULL,
  display_name       VARCHAR(100)     NOT NULL COMMENT 'First name + last initial only — COPPA compliant',
  province_code      VARCHAR(10)      NULL,
  score              INT              NOT NULL DEFAULT 0,
  rank               INT              NOT NULL,
  updated_at         TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_leaderboard (competition_id, child_id),
  INDEX idx_lb_comp_rank (competition_id, rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Public-safe leaderboard — first name + last initial only per COPPA';

-- ── Seed: first system competitions ───────────────────────────────────────────
INSERT IGNORE INTO competitions
  (title, description, competition_type, age_band, starts_at, ends_at, status, prize_description)
VALUES
  (
    'Weekly Chess Challenge — Week 1',
    'Compete against girls your age in chess puzzles. Top 3 win a digital trophy!',
    'weekly_chess', '9-11',
    NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'active',
    'Digital Trophy Badge + Printable Certificate'
  ),
  (
    'Monthly Grand Prix — March 2026',
    'Earn points across all games this month. The all-round champion wins!',
    'monthly_grand_prix', 'all',
    '2026-03-01 00:00:00', '2026-03-31 23:59:59', 'active',
    'Champion Crown Badge + Featured on Homepage'
  );

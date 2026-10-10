/*
# Public Feedback Form — Tokenless Submission Support

## Overview
Updates the feedback table to support a public feedback form that does NOT require a
feedback token link. The customer can now pick their service type and location directly
on the form, and optionally provide their name and email. This makes the form usable as
a general feedback page (e.g. linked from the website) in addition to the existing
token-based flow (for post-visit email feedback).

## Changes to `feedback` table

### Relaxed NOT NULL constraints
- `vehicle_model_id` → nullable (customers may not select a specific vehicle model)
- `dealership_id` → nullable (replaced by the new `location_id` column for clarity)
- `customer_name` → nullable (optional on the public form)
- `customer_email` → nullable (optional on the public form)

### New columns
- `service_type` (text, nullable) — the type of service the customer received
  (e.g. Oil Change, Brake Service, Diagnostics, etc.)
- `location_id` (uuid, FK → locations, ON DELETE SET NULL, nullable) — which location
  the customer visited

## RLS Changes
- Replaces the token-gated `anon_insert_feedback` policy with a broader one that allows
  public inserts without a token. This is intentional: the feedback form is now a public
  page accessible from the website. The token-based flow still works (token_id is set
  when a token is used), but it is no longer the only way to submit.

## Important Notes
1. Existing token-based submissions continue to work unchanged — the token_id and
   visit_id columns remain and are populated when a token is used.
2. The `dealership_id` column remains for backward compatibility with existing dashboard
   code but is no longer required. New public submissions will set `location_id` instead.
3. No data is lost — only constraints are relaxed and new nullable columns are added.
*/

-- ============================================================
-- 1. Relax NOT NULL constraints on feedback table
-- ============================================================
ALTER TABLE feedback ALTER COLUMN vehicle_model_id DROP NOT NULL;
ALTER TABLE feedback ALTER COLUMN dealership_id DROP NOT NULL;
ALTER TABLE feedback ALTER COLUMN customer_name DROP NOT NULL;
ALTER TABLE feedback ALTER COLUMN customer_email DROP NOT NULL;

-- ============================================================
-- 2. Add new columns
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'service_type') THEN
    ALTER TABLE feedback ADD COLUMN service_type text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'location_id') THEN
    ALTER TABLE feedback ADD COLUMN location_id uuid REFERENCES locations(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_feedback_service_type ON feedback(service_type);
CREATE INDEX IF NOT EXISTS idx_feedback_location_id ON feedback(location_id);

-- ============================================================
-- 3. Update RLS: allow public inserts without a token
-- ============================================================
DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon WITH CHECK (true);
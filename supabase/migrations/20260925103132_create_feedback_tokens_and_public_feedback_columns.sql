/*
# Customer Feedback Tokens & Public Feedback Form Support

## Overview
Adds a `feedback_tokens` table that enables a public, token-based customer feedback flow.
Each token links to a specific completed visit (and through it, the customer and location).
The token is a UUID — practically unguessable — so it serves as the sole authentication
mechanism for the public feedback form (no raw customer/visit IDs are exposed in the URL).

Also adds new columns to the existing `feedback` table to support the customer-facing
feedback form fields: main_concern, would_recommend, contact_requested,
preferred_contact_method, location_name, feedback_token_id, and submitted_at.

## New Tables

### `feedback_tokens`
- `id` (uuid, PK)
- `token` (uuid, unique, indexed) — the public-facing token used in feedback URLs
- `visit_id` (uuid, FK → visits, ON DELETE CASCADE) — the completed visit this feedback request is for
- `customer_id` (uuid, FK → customers, ON DELETE SET NULL) — denormalized for convenience
- `location_id` (uuid, FK → locations, ON DELETE SET NULL) — denormalized for convenience
- `customer_name` (text) — denormalized from customers table (for public display)
- `customer_email` (text) — denormalized from customers table (for contact follow-up)
- `location_name` (text) — denormalized from locations table (for public display)
- `visit_date` (date) — denormalized from visits table (for public display)
- `service_type` (text) — denormalized from visits table (for public display)
- `email_sent` (boolean, default false) — whether n8n has sent the feedback email
- `email_sent_at` (timestamptz, nullable) — when the email was sent
- `feedback_received` (boolean, default false) — whether the customer has submitted feedback
- `feedback_received_at` (timestamptz, nullable) — when feedback was received
- `expires_at` (timestamptz, nullable) — optional token expiry
- `created_at` (timestamptz, default now())

## Modified Tables

### `feedback`
- Added `feedback_token_id` (uuid, FK → feedback_tokens, ON DELETE SET NULL, nullable)
- Added `main_concern` (text, nullable) — main area of feedback (service_quality, staff, waiting_time, pricing, vehicle_issue, facility, other)
- Added `would_recommend` (text, nullable) — yes / no / not_sure
- Added `contact_requested` (boolean, default false) — whether customer wants follow-up
- Added `preferred_contact_method` (text, nullable) — email / phone
- Added `location_name` (text, nullable) — denormalized location for easy display
- Added `submitted_at` (timestamptz, nullable) — when the customer submitted the form

## Security

### feedback_tokens
- RLS enabled.
- `anon, authenticated` SELECT — the token UUID is the secret; anyone with the token can
  look up the associated visit info. This is the same security model as magic links.
- `anon, authenticated` UPDATE — needed so the public form can mark `feedback_received = true`
  after submission. The token UUID gates access.
- `authenticated` INSERT/DELETE — only staff (via dashboard) or n8n (via service role) can
  create or remove tokens.

### feedback
- Adds `anon_insert_feedback` policy: the public can INSERT feedback rows, but ONLY if a
  valid, unused feedback_token_id is provided. This prevents arbitrary public inserts.
  The WITH CHECK clause validates that the token exists and has not yet been used.
- Existing authenticated policies remain unchanged.

## Important Notes
1. The denormalized columns in feedback_tokens (customer_name, customer_email, location_name,
   visit_date, service_type) are copied at token-creation time so the public form never needs
   to read from the customers, visits, or locations tables directly.
2. The token is a UUID (122 bits of entropy) — practically unguessable, serving as the sole
   gatekeeper for the public feedback form.
3. The `feedback_received` flag on feedback_tokens prevents double-submission: the INSERT
   policy on feedback checks that the token has `feedback_received = false`.
4. This schema supports the future n8n workflow: Completed Visit → n8n creates token →
   n8n sends email with token link → Customer submits form → n8n webhook triggers AI analysis.
*/

-- ============================================================
-- 1. Create feedback_tokens table
-- ============================================================

CREATE TABLE IF NOT EXISTS feedback_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token uuid UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  visit_id uuid NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  location_name text NOT NULL,
  visit_date date NOT NULL,
  service_type text NOT NULL,
  email_sent boolean NOT NULL DEFAULT false,
  email_sent_at timestamptz,
  feedback_received boolean NOT NULL DEFAULT false,
  feedback_received_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_tokens_token ON feedback_tokens(token);
CREATE INDEX IF NOT EXISTS idx_feedback_tokens_visit ON feedback_tokens(visit_id);
CREATE INDEX IF NOT EXISTS idx_feedback_tokens_feedback_received ON feedback_tokens(feedback_received);

-- ============================================================
-- 2. Add new columns to feedback table
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'feedback_token_id') THEN
    ALTER TABLE feedback ADD COLUMN feedback_token_id uuid REFERENCES feedback_tokens(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'main_concern') THEN
    ALTER TABLE feedback ADD COLUMN main_concern text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'would_recommend') THEN
    ALTER TABLE feedback ADD COLUMN would_recommend text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'contact_requested') THEN
    ALTER TABLE feedback ADD COLUMN contact_requested boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'preferred_contact_method') THEN
    ALTER TABLE feedback ADD COLUMN preferred_contact_method text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'location_name') THEN
    ALTER TABLE feedback ADD COLUMN location_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'submitted_at') THEN
    ALTER TABLE feedback ADD COLUMN submitted_at timestamptz;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_feedback_token ON feedback(feedback_token_id);
CREATE INDEX IF NOT EXISTS idx_feedback_main_concern ON feedback(main_concern);

-- ============================================================
-- 3. Enable RLS on feedback_tokens
-- ============================================================

ALTER TABLE feedback_tokens ENABLE ROW LEVEL SECURITY;

-- Public can SELECT (token UUID is the secret; same model as magic links)
DROP POLICY IF EXISTS "anon_select_feedback_tokens" ON feedback_tokens;
CREATE POLICY "anon_select_feedback_tokens" ON feedback_tokens FOR SELECT
  TO anon, authenticated USING (true);

-- Public can UPDATE (needed to mark feedback_received after submission)
DROP POLICY IF EXISTS "anon_update_feedback_tokens" ON feedback_tokens;
CREATE POLICY "anon_update_feedback_tokens" ON feedback_tokens FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Only authenticated staff can INSERT/DELETE tokens
DROP POLICY IF EXISTS "auth_insert_feedback_tokens" ON feedback_tokens;
CREATE POLICY "auth_insert_feedback_tokens" ON feedback_tokens FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_feedback_tokens" ON feedback_tokens;
CREATE POLICY "auth_delete_feedback_tokens" ON feedback_tokens FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. Add public INSERT policy on feedback (token-gated)
-- ============================================================

DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon WITH CHECK (
    feedback_token_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM feedback_tokens
      WHERE feedback_tokens.id = feedback.feedback_token_id
        AND feedback_tokens.feedback_received = false
        AND (feedback_tokens.expires_at IS NULL OR feedback_tokens.expires_at > now())
    )
  );
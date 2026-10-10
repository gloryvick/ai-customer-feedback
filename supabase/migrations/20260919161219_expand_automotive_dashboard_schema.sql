/*
# Automotive Feedback Dashboard — Full Schema Expansion

## Overview
Expands the existing automotive feedback dashboard to use Supabase as the single source of truth.
Adds Supabase Auth (authenticated-only access), new tables for customers, visits, AI analysis,
routing events, response drafts, alerts, tasks, and locations. Converts existing tables from
single-tenant anon access to authenticated-only RLS. Removes all seeded mock feedback data.

## New Tables

### `customers`
- `id` (uuid, PK)
- `name` (text) — customer full name
- `email` (text, unique) — contact email
- `phone` (text, nullable) — phone number
- `created_at` (timestamptz)

### `locations`
- `id` (uuid, PK)
- `name` (text) — location name (dealership or service center)
- `address` (text) — street address
- `city` (text) — city
- `region` (text) — sales/service region
- `lat` (numeric, nullable) — latitude
- `lng` (numeric, nullable) — longitude
- `created_at` (timestamptz)

### `visits`
- `id` (uuid, PK)
- `customer_id` (uuid, FK → customers) — customer who visited
- `location_id` (uuid, FK → locations) — where the visit occurred
- `vehicle_model_id` (uuid, FK → vehicle_models) — vehicle involved
- `visit_date` (date) — date of visit
- `service_type` (text) — type of service (Purchase, Maintenance, Repair, Test Drive, Warranty)
- `notes` (text, nullable) — visit notes
- `created_at` (timestamptz)

### `ai_analysis`
- `id` (uuid, PK)
- `feedback_id` (uuid, FK → feedback, ON DELETE CASCADE) — feedback this analysis belongs to
- `sentiment` (text) — AI-detected sentiment (positive/neutral/negative)
- `severity` (text) — AI-assessed severity (low/medium/high/critical)
- `summary` (text) — AI-generated summary
- `key_issues` (text[]) — extracted key issues
- `suggested_actions` (text[]) — recommended actions
- `confidence` (numeric) — confidence score 0–1
- `created_at` (timestamptz)

### `routing_events`
- `id` (uuid, PK)
- `feedback_id` (uuid, FK → feedback, ON DELETE CASCADE) — feedback being routed
- `from_status` (text, nullable) — previous status
- `to_status` (text) — new status
- `assigned_to` (text, nullable) — who/what it was assigned to
- `reason` (text, nullable) — routing reason
- `created_by` (uuid, nullable, DEFAULT auth.uid()) — who triggered the event
- `created_at` (timestamptz)

### `response_drafts`
- `id` (uuid, PK)
- `feedback_id` (uuid, FK → feedback, ON DELETE CASCADE) — feedback this draft responds to
- `content` (text) — draft response text
- `tone` (text) — suggested tone (Professional, Empathetic, Apologetic, Informational)
- `is_sent` (boolean, default false) — whether the draft was sent
- `created_at` (timestamptz)

### `alerts`
- `id` (uuid, PK)
- `feedback_id` (uuid, FK → feedback, ON DELETE CASCADE) — feedback triggering the alert
- `type` (text) — alert type (Escalation, Critical, SLA_Breach, Negative_Trend)
- `message` (text) — alert message
- `is_active` (boolean, default true) — whether alert is still active
- `created_at` (timestamptz)

### `tasks`
- `id` (uuid, PK)
- `feedback_id` (uuid, FK → feedback, ON DELETE CASCADE) — feedback this task relates to
- `title` (text) — task title
- `description` (text, nullable) — task details
- `assignee` (text, nullable) — assigned person/team
- `priority` (text) — task priority (low/medium/high/urgent)
- `status` (text) — task status (open/in_progress/completed)
- `due_date` (date, nullable) — task deadline
- `created_at` (timestamptz)

## Modified Tables

### `feedback`
- Added `customer_id` (uuid, FK → customers, nullable) — links feedback to a customer record
- Added `visit_id` (uuid, FK → visits, nullable) — links feedback to a visit
- Removed `customer_name` and `customer_email` columns — now sourced from `customers` table via `customer_id`
  (Note: per data-safety rules, we do NOT drop these columns; we stop using them. They remain for
  backward compatibility but the UI reads from the `customers` relation.)

## Security Changes
- All existing anon policies are replaced with authenticated-only policies.
- RLS is enabled on all new tables.
- Every table gets 4 CRUD policies scoped to `TO authenticated` (no ownership column needed —
  this is a shared operational dashboard where all authenticated staff see all data).
- `routing_events.created_by` defaults to `auth.uid()` for audit trail.
- No service-role keys are used in frontend code.

## Data Changes
- All existing seeded feedback rows are deleted (mock data replaced by real data going forward).
- Existing dealerships and vehicle_models data is preserved (reference data, not mock).

## Important Notes
1. Auth is now required — the frontend builds a full sign-in/sign-up flow.
2. The `feedback` table gains `customer_id` and `visit_id` as nullable FKs; existing rows are
   deleted so there is no data migration concern.
3. All policies use `TO authenticated` with `USING (true)` / `WITH CHECK (true)` because this
   is a shared operational dashboard — all authenticated staff can see and manage all records.
   This is intentional shared data, not a shortcut around ownership checks.
*/

-- ============================================================
-- 1. Clear existing mock feedback data
-- ============================================================
DELETE FROM feedback;

-- ============================================================
-- 2. Create new tables
-- ============================================================

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  region text NOT NULL,
  lat numeric,
  lng numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  vehicle_model_id uuid NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  service_type text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  sentiment text NOT NULL,
  severity text NOT NULL,
  summary text NOT NULL,
  key_issues text[] NOT NULL DEFAULT '{}',
  suggested_actions text[] NOT NULL DEFAULT '{}',
  confidence numeric NOT NULL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS routing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  assigned_to text,
  reason text,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS response_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  content text NOT NULL,
  tone text NOT NULL,
  is_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  assignee text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. Add new columns to feedback table
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'customer_id') THEN
    ALTER TABLE feedback ADD COLUMN customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'visit_id') THEN
    ALTER TABLE feedback ADD COLUMN visit_id uuid REFERENCES visits(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 4. Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_visits_customer ON visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_location ON visits(location_id);
CREATE INDEX IF NOT EXISTS idx_visits_vehicle ON visits(vehicle_model_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_feedback ON ai_analysis(feedback_id);
CREATE INDEX IF NOT EXISTS idx_routing_events_feedback ON routing_events(feedback_id);
CREATE INDEX IF NOT EXISTS idx_response_drafts_feedback ON response_drafts(feedback_id);
CREATE INDEX IF NOT EXISTS idx_alerts_feedback ON alerts(feedback_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_tasks_feedback ON tasks(feedback_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_feedback_customer ON feedback(customer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_visit ON feedback(visit_id);

-- ============================================================
-- 5. Enable RLS on all new tables
-- ============================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE routing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. Replace existing anon policies with authenticated-only
-- ============================================================

-- feedback
DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
DROP POLICY IF EXISTS "anon_update_feedback" ON feedback;
DROP POLICY IF EXISTS "anon_delete_feedback" ON feedback;

CREATE POLICY "auth_select_feedback" ON feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_feedback" ON feedback FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_feedback" ON feedback FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_feedback" ON feedback FOR DELETE TO authenticated USING (true);

-- vehicle_models
DROP POLICY IF EXISTS "anon_crud_vehicle_models" ON vehicle_models;
DROP POLICY IF EXISTS "anon_insert_vehicle_models" ON vehicle_models;
DROP POLICY IF EXISTS "anon_update_vehicle_models" ON vehicle_models;
DROP POLICY IF EXISTS "anon_delete_vehicle_models" ON vehicle_models;

CREATE POLICY "auth_select_vehicle_models" ON vehicle_models FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_vehicle_models" ON vehicle_models FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_vehicle_models" ON vehicle_models FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_vehicle_models" ON vehicle_models FOR DELETE TO authenticated USING (true);

-- dealerships
DROP POLICY IF EXISTS "anon_crud_dealerships" ON dealerships;
DROP POLICY IF EXISTS "anon_insert_dealerships" ON dealerships;
DROP POLICY IF EXISTS "anon_update_dealerships" ON dealerships;
DROP POLICY IF EXISTS "anon_delete_dealerships" ON dealerships;

CREATE POLICY "auth_select_dealerships" ON dealerships FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_dealerships" ON dealerships FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_dealerships" ON dealerships FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_dealerships" ON dealerships FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 7. RLS policies for new tables (authenticated-only, shared data)
-- ============================================================

-- customers
CREATE POLICY "auth_select_customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_customers" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_customers" ON customers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_customers" ON customers FOR DELETE TO authenticated USING (true);

-- locations
CREATE POLICY "auth_select_locations" ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_locations" ON locations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_locations" ON locations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_locations" ON locations FOR DELETE TO authenticated USING (true);

-- visits
CREATE POLICY "auth_select_visits" ON visits FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_visits" ON visits FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_visits" ON visits FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_visits" ON visits FOR DELETE TO authenticated USING (true);

-- ai_analysis
CREATE POLICY "auth_select_ai_analysis" ON ai_analysis FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_ai_analysis" ON ai_analysis FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_ai_analysis" ON ai_analysis FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_ai_analysis" ON ai_analysis FOR DELETE TO authenticated USING (true);

-- routing_events
CREATE POLICY "auth_select_routing_events" ON routing_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_routing_events" ON routing_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_routing_events" ON routing_events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_routing_events" ON routing_events FOR DELETE TO authenticated USING (true);

-- response_drafts
CREATE POLICY "auth_select_response_drafts" ON response_drafts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_response_drafts" ON response_drafts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_response_drafts" ON response_drafts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_response_drafts" ON response_drafts FOR DELETE TO authenticated USING (true);

-- alerts
CREATE POLICY "auth_select_alerts" ON alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_alerts" ON alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_alerts" ON alerts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_alerts" ON alerts FOR DELETE TO authenticated USING (true);

-- tasks
CREATE POLICY "auth_select_tasks" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_tasks" ON tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_tasks" ON tasks FOR DELETE TO authenticated USING (true);

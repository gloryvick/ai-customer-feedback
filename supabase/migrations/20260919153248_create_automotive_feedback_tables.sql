/*
# Automotive Customer Feedback Management Dashboard

## Overview
Creates the schema for an automotive customer feedback management system. This is a single-tenant
app (no sign-in screen) used by dealership/automotive staff to review, triage, and resolve customer
feedback across vehicle models, components, and dealerships.

## New Tables

### `vehicle_models`
- `id` (uuid, PK) — unique identifier
- `name` (text) — e.g. "Aurora S", "Vortex EV"
- `year` (int) — model year
- `category` (text) — e.g. "Sedan", "SUV", "EV", "Truck"

### `dealerships`
- `id` (uuid, PK)
- `name` (text) — dealership name
- `city` (text) — city location
- `region` (text) — sales region

### `feedback`
- `id` (uuid, PK)
- `customer_name` (text) — name of the customer who submitted feedback
- `customer_email` (text) — contact email
- `vehicle_model_id` (uuid, FK → vehicle_models) — vehicle the feedback is about
- `dealership_id` (uuid, FK → dealerships) — dealership visited
- `component` (text) — affected component area (Infotainment, Powertrain, Interior, Exterior, Safety, Software)
- `rating` (int, 1–5) — overall satisfaction rating
- `title` (text) — short summary
- `body` (text) — full feedback text
- `sentiment` (text) — positive / neutral / negative (auto-tagged)
- `severity` (text) — low / medium / high / critical
- `status` (text) — new / reviewing / resolved / escalated
- `is_escalated` (bool) — whether this needs urgent management attention
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- Single-tenant (no auth): policies allow `anon, authenticated` full CRUD since data is intentionally
  shared among dashboard operators.
*/

CREATE TABLE IF NOT EXISTS vehicle_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year int NOT NULL,
  category text NOT NULL
);

CREATE TABLE IF NOT EXISTS dealerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  region text NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  vehicle_model_id uuid NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
  dealership_id uuid NOT NULL REFERENCES dealerships(id) ON DELETE CASCADE,
  component text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  body text NOT NULL,
  sentiment text NOT NULL DEFAULT 'neutral',
  severity text NOT NULL DEFAULT 'low',
  status text NOT NULL DEFAULT 'new',
  is_escalated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX IF NOT EXISTS idx_feedback_severity ON feedback(severity);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_vehicle_model ON feedback(vehicle_model_id);

ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_vehicle_models" ON vehicle_models;
CREATE POLICY "anon_crud_vehicle_models" ON vehicle_models FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_vehicle_models" ON vehicle_models FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_vehicle_models" ON vehicle_models FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_vehicle_models" ON vehicle_models FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_crud_dealerships" ON dealerships;
CREATE POLICY "anon_crud_dealerships" ON dealerships FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_dealerships" ON dealerships FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_dealerships" ON dealerships FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_dealerships" ON dealerships FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback" ON feedback FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_feedback" ON feedback;
CREATE POLICY "anon_update_feedback" ON feedback FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_feedback" ON feedback;
CREATE POLICY "anon_delete_feedback" ON feedback FOR DELETE
  TO anon, authenticated USING (true);

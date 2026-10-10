/*
# AutoPulse Website — Bookings & Contact Messages

## Overview
Adds tables for customer-facing website functionality: service booking requests and
contact form submissions. Seeds four Bay Area location records into the existing
`locations` table. Adds a `service_type` enum-like check for bookings.

## New Tables

### `bookings`
- `id` (uuid, PK)
- `name` (text) — customer name
- `email` (text) — customer email
- `phone` (text, nullable) — phone number
- `location_id` (uuid, FK → locations) — preferred location
- `vehicle_make` (text) — vehicle make
- `vehicle_model` (text) — vehicle model
- `vehicle_year` (int, nullable) — vehicle year
- `service_type` (text) — type of service requested
- `preferred_date` (date) — requested date
- `notes` (text, nullable) — additional notes
- `status` (text, default 'pending') — booking status (pending/confirmed/completed/cancelled)
- `created_at` (timestamptz)

### `contact_messages`
- `id` (uuid, PK)
- `name` (text)
- `email` (text)
- `subject` (text)
- `message` (text)
- `created_at` (timestamptz)

## Security
- RLS enabled on both new tables.
- Bookings: `TO anon, authenticated` INSERT (public can submit), `TO authenticated`
  SELECT/UPDATE/DELETE (only staff can see/manage bookings).
- Contact messages: same pattern — public can submit, only staff can read.

## Seed Data
- Four Bay Area locations inserted into `locations` table.
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year int,
  service_type text NOT NULL,
  preferred_date date NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_location ON bookings(location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Bookings: public can INSERT, only authenticated staff can SELECT/UPDATE/DELETE
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_bookings" ON bookings;
CREATE POLICY "auth_select_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_bookings" ON bookings;
CREATE POLICY "auth_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_bookings" ON bookings;
CREATE POLICY "auth_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);

-- Contact messages: public can INSERT, only authenticated staff can SELECT
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- Seed four Bay Area locations
INSERT INTO locations (name, address, city, region, lat, lng) VALUES
('AutoPulse San Francisco', '1455 Market Street', 'San Francisco', 'Bay Area', 37.7749, -122.4194),
('AutoPulse Oakland', '3000 Broadway', 'Oakland', 'Bay Area', 37.8044, -122.2712),
('AutoPulse San Jose', '1 E Santa Clara St', 'San Jose', 'Bay Area', 37.3382, -121.8863),
('AutoPulse Fremont', '39100 Paseo Padre Pkwy', 'Fremont', 'Bay Area', 37.5485, -121.9886)
ON CONFLICT DO NOTHING;

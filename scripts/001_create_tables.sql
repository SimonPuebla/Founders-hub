-- Founders Hub - Database Schema
-- Creates all tables for the Andén Founders Hub application

-- Settings table for app configuration
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  weekly_focus TEXT,
  google_refresh_token TEXT,
  google_connected BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OKRs (Objectives and Key Results)
CREATE TABLE IF NOT EXISTS okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  quarter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'off_track', 'completed', 'paused')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner TEXT,
  deadline DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPIs linked to OKRs
CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID REFERENCES okrs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  current_value NUMERIC DEFAULT 0,
  target_value NUMERIC DEFAULT 0,
  unit TEXT,
  frequency TEXT DEFAULT 'monthly',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- People / Contacts
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  organization TEXT,
  relationship TEXT NOT NULL DEFAULT 'other' CHECK (relationship IN ('team', 'investor', 'government', 'ecosystem', 'startup', 'media', 'other')),
  notes TEXT,
  last_contact DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'waiting', 'blocked', 'done', 'delegated')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner TEXT,
  due_date DATE,
  okr_id UUID REFERENCES okrs(id) ON DELETE SET NULL,
  project TEXT,
  opportunity_id UUID,
  input_id UUID,
  people TEXT[],
  context_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'other' CHECK (type IN ('investor', 'gov_contact', 'startup', 'institutional_partner', 'ecosystem_ally', 'media_kol', 'hire', 'product', 'deal', 'other')),
  origin TEXT,
  person TEXT,
  entity TEXT,
  okr_id UUID REFERENCES okrs(id) ON DELETE SET NULL,
  potential_value TEXT,
  urgency TEXT NOT NULL DEFAULT 'this_quarter' CHECK (urgency IN ('immediate', 'this_month', 'this_quarter', 'no_rush')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status TEXT NOT NULL DEFAULT 'captured' CHECK (status IN ('captured', 'reviewing', 'mapped', 'active', 'parked', 'delegated', 'ignored', 'closed')),
  recommended_action TEXT,
  owner TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inputs (meetings, notes, transcripts, etc.)
CREATE TABLE IF NOT EXISTS inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'note' CHECK (type IN ('meeting', 'note', 'transcript', 'voice_note', 'quick_idea', 'day_update', 'weekly_recap')),
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('fundraising', 'government', 'product', 'demo', 'event', 'strategy', 'ecosystem', 'other')),
  content TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  people TEXT[],
  extracted_tasks JSONB,
  extracted_opps JSONB,
  extracted_decisions TEXT[],
  extracted_followups TEXT[],
  linked_okr_ids UUID[],
  linked_opportunity_ids UUID[],
  calendar_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key reference for tasks.opportunity_id after opportunities table exists
ALTER TABLE tasks 
  ADD CONSTRAINT tasks_opportunity_id_fkey 
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE SET NULL;

-- Add foreign key reference for tasks.input_id after inputs table exists
ALTER TABLE tasks 
  ADD CONSTRAINT tasks_input_id_fkey 
  FOREIGN KEY (input_id) REFERENCES inputs(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_okr_id ON tasks(okr_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project);

CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_urgency ON opportunities(urgency);
CREATE INDEX IF NOT EXISTS idx_opportunities_okr_id ON opportunities(okr_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);

CREATE INDEX IF NOT EXISTS idx_inputs_type ON inputs(type);
CREATE INDEX IF NOT EXISTS idx_inputs_date ON inputs(date);
CREATE INDEX IF NOT EXISTS idx_inputs_category ON inputs(category);

CREATE INDEX IF NOT EXISTS idx_kpis_okr_id ON kpis(okr_id);

CREATE INDEX IF NOT EXISTS idx_people_relationship ON people(relationship);
CREATE INDEX IF NOT EXISTS idx_people_name ON people(name);

-- Insert default settings row
INSERT INTO settings (id, weekly_focus, google_connected, updated_at)
VALUES ('default', '', false, NOW())
ON CONFLICT (id) DO NOTHING;

-- MINDCHAIN SUPABASE SCHEMA (Idempotent Version)
-- This script is safe to run multiple times. It will only create what's missing.

-- 0. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Pages Table (Confluence-style)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Untitled',
  content JSONB DEFAULT '{}'::jsonb,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Issues Table (Jira-style)
-- Types check
DO $$ BEGIN
    CREATE TYPE issue_status AS ENUM ('Backlog', 'Todo', 'In Progress', 'Done');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_priority AS ENUM ('Low', 'Med', 'High');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status issue_status DEFAULT 'Backlog' NOT NULL,
  priority issue_priority DEFAULT 'Med' NOT NULL,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Phase 2 Update: Add linked_page_id if it doesn't exist
DO $$ BEGIN
    ALTER TABLE issues ADD COLUMN linked_page_id UUID REFERENCES pages(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Policies (Idempotent)
DO $$ BEGIN
    -- Workspaces
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view workspaces they own') THEN
        CREATE POLICY "Users can view workspaces they own" ON workspaces FOR SELECT USING (auth.uid() = owner_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert workspaces') THEN
        CREATE POLICY "Users can insert workspaces" ON workspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update workspaces they own') THEN
        CREATE POLICY "Users can update workspaces they own" ON workspaces FOR UPDATE USING (auth.uid() = owner_id);
    END IF;

    -- Pages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view pages in their workspaces') THEN
        CREATE POLICY "Users can view pages in their workspaces" ON pages FOR SELECT USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert pages in their workspaces') THEN
        CREATE POLICY "Users can insert pages in their workspaces" ON pages FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update pages in their workspaces') THEN
        CREATE POLICY "Users can update pages in their workspaces" ON pages FOR UPDATE USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete pages in their workspaces') THEN
        CREATE POLICY "Users can delete pages in their workspaces" ON pages FOR DELETE USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
    END IF;

    -- Issues
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view issues in their workspaces') THEN
        CREATE POLICY "Users can view issues in their workspaces" ON issues FOR SELECT USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert issues in their workspaces') THEN
        CREATE POLICY "Users can insert issues in their workspaces" ON issues FOR INSERT WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update issues in their workspaces') THEN
        CREATE POLICY "Users can update issues in their workspaces" ON issues FOR UPDATE USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete issues in their workspaces') THEN
        CREATE POLICY "Users can delete issues in their workspaces" ON issues FOR DELETE USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
    END IF;
EXCEPTION WHEN others THEN null; END $$;

-- 4. Enable Realtime for tables
-- Note: Publications are global, we just ensure they include these tables
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE pages;
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE issues;
EXCEPTION WHEN others THEN null; END $$;

-- 5. Helper function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
DO $$ BEGIN
    CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

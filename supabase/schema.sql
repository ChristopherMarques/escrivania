-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Better Auth will handle this, but we define it for reference)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Synopses table
CREATE TABLE IF NOT EXISTS synopses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_project_id ON chapters(project_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_scenes_chapter_id ON scenes(chapter_id);
CREATE INDEX IF NOT EXISTS idx_scenes_order ON scenes(chapter_id, order_index);
CREATE INDEX IF NOT EXISTS idx_characters_project_id ON characters(project_id);
CREATE INDEX IF NOT EXISTS idx_synopses_project_id ON synopses(project_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE synopses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chapters
CREATE POLICY "Users can view chapters of own projects" ON chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = chapters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert chapters in own projects" ON chapters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = chapters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update chapters of own projects" ON chapters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = chapters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete chapters of own projects" ON chapters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = chapters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for scenes
CREATE POLICY "Users can view scenes of own projects" ON scenes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chapters 
      JOIN projects ON projects.id = chapters.project_id
      WHERE chapters.id = scenes.chapter_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert scenes in own projects" ON scenes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chapters 
      JOIN projects ON projects.id = chapters.project_id
      WHERE chapters.id = scenes.chapter_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update scenes of own projects" ON scenes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chapters 
      JOIN projects ON projects.id = chapters.project_id
      WHERE chapters.id = scenes.chapter_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete scenes of own projects" ON scenes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM chapters 
      JOIN projects ON projects.id = chapters.project_id
      WHERE chapters.id = scenes.chapter_id 
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for characters
CREATE POLICY "Users can view characters of own projects" ON characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = characters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert characters in own projects" ON characters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = characters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update characters of own projects" ON characters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = characters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete characters of own projects" ON characters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = characters.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for synopses
CREATE POLICY "Users can view synopses of own projects" ON synopses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = synopses.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert synopses in own projects" ON synopses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = synopses.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update synopses of own projects" ON synopses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = synopses.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete synopses of own projects" ON synopses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = synopses.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Functions to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_synopses_updated_at BEFORE UPDATE ON synopses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
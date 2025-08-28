-- Migration to add missing fields to characters table
-- This migration adds all the fields defined in the ICharacter interface

-- Add role field
ALTER TABLE characters ADD COLUMN IF NOT EXISTS role VARCHAR(255);

-- Add avatar URL field
ALTER TABLE characters ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add archetype field
ALTER TABLE characters ADD COLUMN IF NOT EXISTS archetype VARCHAR(255);

-- Add motivation fields as JSONB
ALTER TABLE characters ADD COLUMN IF NOT EXISTS motivation JSONB DEFAULT '{}';

-- Add conflict field
ALTER TABLE characters ADD COLUMN IF NOT EXISTS conflict TEXT;

-- Add appearance fields as JSONB
ALTER TABLE characters ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT '{}';

-- Add biography field
ALTER TABLE characters ADD COLUMN IF NOT EXISTS biography TEXT;

-- Add relationships field as JSONB array
ALTER TABLE characters ADD COLUMN IF NOT EXISTS relationships JSONB DEFAULT '[]';

-- Create indexes for better performance on JSONB fields
CREATE INDEX IF NOT EXISTS idx_characters_motivation ON characters USING GIN (motivation);
CREATE INDEX IF NOT EXISTS idx_characters_appearance ON characters USING GIN (appearance);
CREATE INDEX IF NOT EXISTS idx_characters_relationships ON characters USING GIN (relationships);

-- Add index for role field
CREATE INDEX IF NOT EXISTS idx_characters_role ON characters (role);

-- Add index for archetype field
CREATE INDEX IF NOT EXISTS idx_characters_archetype ON characters (archetype);

-- Update the updated_at trigger to include the new fields
-- (The trigger should already exist from the main schema)

-- Add comments for documentation
COMMENT ON COLUMN characters.role IS 'Character role in the story (e.g., protagonist, antagonist, supporting)';
COMMENT ON COLUMN characters.avatar_url IS 'URL for character portrait/avatar image';
COMMENT ON COLUMN characters.archetype IS 'Character archetype (e.g., Hero, Mentor, Shadow)';
COMMENT ON COLUMN characters.motivation IS 'Character motivations as JSON object with internal and external fields';
COMMENT ON COLUMN characters.conflict IS 'Main conflict or challenge the character faces';
COMMENT ON COLUMN characters.appearance IS 'Character appearance details as JSON object with physical, clothing, and mannerisms fields';
COMMENT ON COLUMN characters.biography IS 'Character background and biography';
COMMENT ON COLUMN characters.relationships IS 'Character relationships as JSON array of objects with characterId, type, and description';
-- Run in Supabase SQL Editor
-- Add is_admin column to posts and comments

ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Run in Supabase SQL Editor to support Debate category and migrate existing posts
-- Add 'debate' to the gallery CHECK constraint
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_gallery_check;
ALTER TABLE posts ADD CONSTRAINT posts_gallery_check
  CHECK (gallery IN ('execution', 'achievement', 'philosophy', 'debate'));

-- Migrate existing posts to debate
UPDATE posts
SET gallery = 'debate'
WHERE gallery IN ('execution', 'achievement', 'philosophy');

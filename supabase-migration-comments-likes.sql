-- Run this if you already have the posts table and only need comments + post_likes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  nickname TEXT DEFAULT 'hustler',
  content TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (true);

-- Post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_likes_select" ON post_likes FOR SELECT USING (true);
CREATE POLICY "post_likes_insert" ON post_likes FOR INSERT WITH CHECK (true);

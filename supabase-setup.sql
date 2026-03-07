-- Run this in Supabase SQL Editor

-- 1. Posts table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  nickname TEXT DEFAULT 'hustler',
  password TEXT NOT NULL,
  image_url TEXT,
  gallery TEXT NOT NULL CHECK (gallery IN ('execution', 'achievement', 'philosophy')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (true);

-- 2. Storage bucket: Create "post-images" in Dashboard (Storage > New bucket, set Public: ON)
--    Then run the policies below, or add via Dashboard Policies UI

CREATE POLICY "post_images_upload" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "post_images_read" ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

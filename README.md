# Hustler Group

Minimal anonymous community MVP — execution, achievement, philosophy.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Supabase (Postgres + Storage)
- Image upload (Supabase Storage)

## Setup

1. Create a [Supabase](https://supabase.com) project.

2. Copy `.env.example` to `.env.local` and set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Run `supabase-setup.sql` in the Supabase SQL Editor to create the `posts` table and storage policies.

4. Create a storage bucket `post-images` in Supabase Dashboard (Storage > New bucket) and make it public, or use the SQL in the setup file.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Galleries

- **Execution Log** (`/gallery/execution`) — too much talk. just move
- **Achievement** (`/gallery/achievement`) — make it.
- **Philosophy** (`/gallery/philosophy`) — think hard

## Admin

- URL: `/admin` (no links in frontend; type manually)
- Username: `admin`
- Password: `admin123`

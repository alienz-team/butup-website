-- Row Level Security for Beautup. Safe to re-run.
--
-- The storefront and admin talk to Postgres only through Prisma, using the
-- server-side `postgres` role, which bypasses RLS. Nothing in the app uses the
-- Supabase Data API, so `anon` and `authenticated` get no policies and no
-- table privileges: the publishable key in the browser can read nothing.
-- If you later want public catalog reads through supabase-js, add explicit
-- SELECT policies for Category, SubCategory and active Product only.

alter table "Category"    enable row level security;
alter table "SubCategory" enable row level security;
alter table "Product"     enable row level security;
alter table "Order"       enable row level security;
alter table "OrderItem"   enable row level security;
alter table "User"        enable row level security;

-- Defense in depth: also remove table privileges for the API roles.
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;

-- Tables created later by `prisma db push` stay closed by default too.
alter default privileges for role postgres in schema public revoke all on tables    from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated;

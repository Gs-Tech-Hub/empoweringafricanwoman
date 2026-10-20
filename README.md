# Empowering the African Woman

A regional, database-managed charity website built with Next.js App Router, TypeScript,
Tailwind CSS, Prisma, PostgreSQL, and NextAuth.

## Requirements

- Node.js supported by the installed Next.js version
- pnpm 10
- PostgreSQL
- A configured Supabase or Google Drive media provider for uploads

## Local setup

1. Install dependencies with `pnpm install`.
2. Configure the environment variables listed below.
3. Apply the Prisma migrations with `pnpm exec prisma migrate deploy`.
4. Generate the Prisma client with `pnpm db:generate`.
5. Start the development server with `pnpm dev`.

The public site reads its editable copy, media references, programmes, locations, and
consented stories from the database. Use the authenticated `/admin` area to manage
website content and media. Global content is the fallback; a region-specific value
overrides it.

## Environment

Required for database-backed pages:

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — seed administrator credentials

Configure `ALLOWED_ADMIN_EMAILS` for any additional administrators. Google sign-in
requires `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

For Supabase media storage, configure `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_BUCKET`, and a server-side `SUPABASE_SERVICE_ROLE_KEY`.
Alternatively, configure `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, and `GOOGLE_DRIVE_FOLDER_ID`.

Do not commit credentials, private donor data, or service-role keys.

## Content and publishing

- Create and publish website content, programmes, locations, and stories through admin.
- Publish participant stories only after confirming consent for both the copy and selected
  media.
- Use only approved, licensed imagery and verified impact information. Unverified metrics
  should be omitted or clearly identified as targets.
- The database migration preserves existing records but unpublishes legacy boutique-era
  programme, location, and review rows. Review and approve records before republishing.
- Online donations remain unavailable until the server-side checkout, provider
  verification, and webhook flow are implemented and tested.

## Quality checks

```text
pnpm exec prisma validate
pnpm exec tsc --noEmit
pnpm build
```

The application requires a reachable database for admin and dynamic content at runtime.

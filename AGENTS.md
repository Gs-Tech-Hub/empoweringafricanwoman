# Empowering the African Woman — Engineering Rules

## Mission

Build a premium, accessible, responsive charity website that faithfully follows the approved brand graphics.

## Stack

- Next.js App Router
- TypeScript with strict checking
- Tailwind CSS
- React Server Components by default
- Netlify hosting and Edge Functions
- GitHub for source control

## Design rules

- Use the approved cocoa, gold, orange, ivory and white palette.
- Use Playfair Display for headings and Inter for body text.
- Use reusable components and centralised design tokens.
- Follow the approved editorial layout and photography direction.
- Do not use the full-page design graphic as the actual webpage.
- Optimise all images and test desktop, tablet and mobile layouts.

## Content rules

- Never invent impact statistics, testimonials, registrations or partnerships.
- Mark unverified metrics as targets or remove them.
- Use authentic, appropriately licensed images and consented participant stories.

## Architecture rules

- Share components across regional pages.
- Keep regional copy and currency configuration separate from presentation.
- Use Netlify Edge Functions for country-based initial routing.
- Preserve explicit visitor region preferences.
- Keep payment credentials and privileged logic server-side.
- Verify payment notifications before recording successful donations.

## Quality rules

- Use accessible semantic HTML and keyboard-friendly controls.
- Validate inputs on the server.
- Run linting, type checking, tests and a production build.
- Never commit secrets, credentials or private donor data.
- Make focused changes and explain significant architectural decisions.

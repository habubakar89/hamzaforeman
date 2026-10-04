# Eman & Hamza — hamzaforeman.com

The wedding site. Three days in Jeddah, 11–13 December 2026.

Two self-contained pages:

- `index.html` — the invitation suite: an envelope, then one card per piece
  (the invitation, the three days, getting here with a visa route finder,
  your stay, good to know, the reply) on a marble table. This is the site.
- `story.html` — the original save-the-date (the lacquered room at night),
  kept as it was and linked as "Start from the beginning".

## Local development

```bash
npm install
npm run dev          # http://127.0.0.1:5173
```

Clean paths land on a chapter and skip the veil: `/details`, `/travel`,
`/stay`, `/know`, `/rsvp`. They work locally and in production, because
CloudFront answers every path with `index.html`.

## How the page is put together

- `index.html` is the whole site: CSS, markup and script in one file, pure
  ASCII (typographic marks are entities / `\u` escapes).
- The piano score is `src/score.mp3`. `vite.config.ts` inlines it as base64
  into the `scoreb64` block at dev and build time, so the shipped file is
  still self-contained but the source stays editable.
- `public/og.jpg` is the link-preview card.

## RSVP

The form posts to a Google Apps Script web app that appends a row to a
Google Sheet. Setup steps are at the top of
[`scripts/rsvp-apps-script.gs`](./scripts/rsvp-apps-script.gs). Paste the
deployed URL into `ENDPOINT` in `index.html` (done, 2026-10-03; notifications go
to Hamza's Gmail). With `ENDPOINT` empty the form runs in draft mode on a local
host only; a live page with no endpoint shows the fallback card instead of
losing the reply. If the script code changes, redeploy it as a NEW VERSION of
the same deployment, or the URL keeps running the old code.

## Before launch

- Set the WhatsApp / email links in the closing (search `data-contact`).
- Check the visa rules in `index.html` (search `ROUTES`) against
  https://visa.visitsaudi.com/ — they change. Passports offered: India,
  Nepal, UK, US; anyone else is sent to the portal's eligibility check.
- Replace `public/og.jpg` with a light card to match the new look.
- Fill in venues, times and dress per day as they're set.

## Build & deploy

```bash
npm run build        # dist/
```

Pushing to `main` runs `.github/workflows/deploy.yml`: build, sync `dist/`
to S3, invalidate CloudFront. **A push to `main` is a deploy.** Work on a
branch until it's ready.

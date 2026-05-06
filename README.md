# Hamza & Eman — Wedding Invite

Digital wedding invite website for Hamza & Eman.
Nikaah in Makkah · Ring Ceremony in Jeddah · June 18–20, 2026.

## Local development

```bash
npm install
npm run dev
# opens at http://localhost:5173
```

## Build

```bash
npm run build
# output in dist/
```

## Preview production build locally

```bash
npm run preview
```

## Deploy

Deploy the `dist/` folder to any static host.

**Vercel (recommended):**
- Connect the repo, set build command `npm run build`, output directory `dist`.
- No environment variables required.

**Manual:**
- Run `npm run build`, then upload the `dist/` folder.

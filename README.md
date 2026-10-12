# KERA — Brussels

Pre-opening single-page site for KERA, a Georgian restaurant being built on
Rue Saint-Quentin in Brussels, opening autumn 2026.

Next.js (App Router) + TypeScript, statically exported. GSAP for motion. No CMS,
no backend, no runtime data.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → out/
npm start        # serve the export on :3000
```

Deploy `out/` anywhere that serves static files.

## Deploying

`.github/workflows/deploy.yml` publishes to **GitHub Pages** on every push to
`main`. There is no server: the workflow runs the static export and hands `out/`
to Pages. `.github/workflows/ci.yml` runs the same install → typecheck → build
on pull requests, so nothing reaches `main` that cannot be published.

Live at **https://nihadmammadli.github.io/Kera/**. The path is the repo name
and it is case-sensitive: `/kera/` is a 404.

### The base path, which is the only tricky part

A project repo is served from `/<repo>/`, not from the domain root, so every
absolute asset URL needs that prefix or it 404s. `next/link`, `next/image` and
`app/icon.svg` are handled by `basePath` in `next.config.mjs`; a raw `<img src>`
and everything in `metadata` are not, so they go through `asset()` in
[lib/paths.ts](lib/paths.ts).

The workflow gets the value from `actions/configure-pages` and passes it in as
`NEXT_PUBLIC_BASE_PATH`, so **nothing needs editing when the domain changes** —
add a custom domain in the repo's Pages settings and the next build emits
root-relative URLs on its own. A build step greps the emitted HTML and fails the
deploy if the prefix did not land, because a wrong base path produces a page
that loads and then shows no images at all.

Locally both values are unset, which is correct for `npm run dev`. To see what
Pages will actually serve:

```bash
NEXT_PUBLIC_BASE_PATH=/Kera npm run build
mkdir -p /tmp/pages && rm -rf /tmp/pages/Kera && cp -r out /tmp/pages/Kera
npx serve /tmp/pages   # then open http://localhost:3000/Kera/
```

### Renaming the repo breaks the live site until the next deploy

The base path is baked into the HTML at build time. Rename the repo and Pages
starts serving the *old* build from the *new* path: the page itself loads, but
every stylesheet, script, font and image still points at the old name and
404s, so the visitor gets unstyled text and no pictures. Nothing redeploys on
its own, because the workflow only runs on a push to `main`.

After a rename, run the deploy by hand once:

```bash
gh workflow run deploy.yml --ref main
```

or Actions → *Deploy to GitHub Pages* → *Run workflow*. `configure-pages`
picks up the new name and the build follows.

### Other hosts

Vercel and Netlify serve from a domain root, so leave both variables unset and
they will build this repo as-is (`npm run build`, publish `out/`). Only the
sub-path case needs `NEXT_PUBLIC_BASE_PATH`.

## Editing content

**Every word on this site lives in `content/site.json`, and nobody is expected
to edit that by hand.** The client works in a spreadsheet; you run one command.

```bash
npm run content:export                       # → kera-content.xlsx, send this
npm run content:update -- ~/Downloads/kera-content.xlsx   # ← when it comes back
```

There is no CMS, no admin panel and no service to keep alive. The workbook is
the interchange format; `content/site.json` is the committed truth, so every
client revision arrives as a readable git diff.

### The workbook

Eight sheets, generated from the current site so the client edits over real
words rather than filling in a blank form:

| Sheet | What it holds |
|---|---|
| **Read me first** | The tutorial, written for a restaurant owner |
| **Text** | Every single string — 81 of them, each with a plain-language note |
| **Menu** | One row per dish. A new value in `Category` becomes a new tab |
| **The kitchen** · **Rooms** · **Progress** · **Georgian words** | The repeatable lists |
| **Images** | The fixed picture slots, by file name |

Labels and notes are locked; only the value cells are editable. Choice columns
are dropdowns. Row insertion and deletion are allowed on every list sheet, so
adding a category or a dish needs no explanation beyond "add a row".

### What the client can and cannot break

`content:update` writes nothing until the new content passes `content:check`,
so a bad workbook leaves the site exactly as it was:

```
✗ Text › Section: the rooms › Heading — has an odd number of * characters.
✗ Menu › row 2 — "Dish" is empty, and it cannot be.
✗ Images › The big photo at the very top — names "my-photo.JPG", but there is
  no such file in public/img/.

content:update — nothing was changed. Fix the workbook and run it again.
```

It checks required fields, dropdown values, unbalanced `*`, broken encoding
(the Georgian script is the thing most likely to be destroyed by saving from
the wrong program), missing image files, missing `.webp` siblings, and that
exactly one Progress row is marked `now`.

On success it prints what actually moved before you commit:

```
· filled in: Phone number, Opening hours
· Menu: +3 −1 (29 → 31 rows)
· Progress: +2 −2 (4 → 4 rows)
```

### The conventions the client is taught

- **Empty means pending, not broken.** Clear the phone, email or hours cell and
  the site writes its own line — *"There is no phone in an empty room yet."*
  Fill it in and the line resolves itself. Nothing ever renders as a blank gap.
- **`*stars*` make gold italic.** `five rooms, *none of them* finished`.
- **Blank line = new paragraph**, `Alt+Enter` = new line inside a cell.
- **Prices are free text** — `14`, `14,50`, `9 / 42`. The currency symbol is set
  once on the Text sheet.
- **`menu.isDraft`** prints the "this is a working draft" note above the tabs.
  It is the client's switch, not yours.
- **A room shows its drawing until it is given a photograph.** Fill in the two
  photo columns on the Rooms sheet and that room — only that room — becomes a
  picture. The building site converts itself one room at a time.

### Adding a new field

`content/registry.mjs` is the single source of truth. Add an entry there and
the spreadsheet, the importer and the validator all follow. Then read it in a
component with `t('your.path')`. **No user-visible string belongs in `.tsx`** —
if it is not in the registry, the client cannot change it.

## Images

`public/img/` holds every shipping image. They are derived from the four
reference photographs in `images/` with ffmpeg, and each carries its origin in
its own metadata (`node .claude/skills/impeccable/scripts/embed-prompt.mjs
public/img/ridge.jpg --read`).

**None of them are photographs of KERA.** They show Georgia, and the page never
claims otherwise. The five rooms are drawn rather than photographed for exactly
this reason. When real photographs of the room exist, they belong in the rooms
section first.

`public/img/og.jpg` is the social preview card, rendered by
`.impeccable/tools/og.mjs` against the running site.

## Design

The visual world is recorded in `DESIGN.md`; the durable product record in
`PRODUCT.md`; the page-level strategy in `.impeccable/surfaces/app-page-tsx.md`.
The direction contract ships as an HTML comment at the top of `<body>` and
survives the production build — `grep fddb4283 out/index.html`.

Two rules are load-bearing and easy to break by accident:

1. **The page renders finished in CSS.** A two-line script in `<head>` adds a
   `motion` class only when motion is welcome, and that class is the only thing
   that hides anything; it removes itself after three seconds if the JavaScript
   never arrives. No visitor is ever left looking at an empty wall. Do not invert
   this by hiding things in the base stylesheet.
2. **Anchor jumps belong to `Motion.tsx`, not the browser.** The rooms section
   pins, so native smooth scrolling crawls through the pin's scroll length and
   reads as the page sticking on the rooms. A delegated click handler tweens the
   window over a fixed one second instead, whatever the distance.
3. **Gold is rationed.** `--gilt` means one thing: what is alight — the primary
   action, an arch as it fires, today's stage of the build. Every other accent is
   pigment (`--cinnabar`, `--ochre`, `--malachite`). Gold used decoratively
   costs the page its only emphasis.

## Screenshots

With the export being served, `node .impeccable/tools/shots.mjs` recaptures
`.impeccable/review/` at desktop and mobile — full pages under reduced motion,
and each section with motion settled — and reports overflow and console errors.
`node .impeccable/tools/states.mjs` captures the menu, focus, hover and the
inscription band.

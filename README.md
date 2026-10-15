# KERA — Brussels

Single-page site for KERA, a modern Georgian restaurant on Rue Saint-Quentin
in Brussels, open since 16 October 2026: About Us, Our Cuisine, the full menu,
Spaces and Visit.

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

Live at **https://www.kera.brussels/**. Every push to `main` publishes it:
`.github/workflows/deploy.yml` typechecks, builds the static export, uploads
`out/` to the Hetzner server and fetches the page back from it to check the new
build is the one being served. `.github/workflows/ci.yml` runs the same install
→ typecheck → build on pull requests, so nothing reaches `main` that cannot be
published.

```bash
gh workflow run deploy.yml --ref main   # deploy again without a commit
```

### On the server

The site shares `95.216.162.140` with the Damla Group app. That server's ports
80 and 443 belong to Traefik, run by Dokploy, which also issues every Let's
Encrypt certificate — so KERA does not run its own web server on the host. It
is one nginx container on Traefik's network, described in [deploy/](deploy/):

| On the server | From the repo | What it is |
|---|---|---|
| `/opt/kera/docker-compose.yml` | `deploy/docker-compose.yml` | The `kera-web` container and its Traefik routes |
| `/opt/kera/nginx.conf` | `deploy/nginx.conf` | Static serving, caching, security headers |
| `/opt/kera/site/` | `out/` | The built site — the only thing a deploy changes |

The routes: `https://www.kera.brussels` is the site; `http://www…` and
`kera.brussels` (either scheme, path kept) redirect there permanently.

CI uploads with a key that can do one thing — `rsync` into `/opt/kera/site` as
the unprivileged `kera-deploy` user (`rrsync` is its forced command). It cannot
open a shell or reach anything else on the box. The private key and the
server's host key are the repo secrets `KERA_DEPLOY_KEY` and
`KERA_KNOWN_HOSTS`.

A change to `deploy/` is **not** deployed by CI. Copy it over and restart:

```bash
scp deploy/nginx.conf deploy/docker-compose.yml root@95.216.162.140:/opt/kera/
ssh root@95.216.162.140 'cd /opt/kera && docker compose up -d --force-recreate'
```

### DNS

The domain's DNS is at behostings.net. `kera.brussels` and `www.kera.brussels`
are `A` records pointing at `95.216.162.140`. The mail records
(`mail.kera.brussels`, the `MX` and the SPF `TXT`) stay on behostings and must
not be touched — email still runs there.

### The base path

Everything is served from the domain root, so `NEXT_PUBLIC_BASE_PATH` is unset.
The plumbing for a sub-path (`asset()` in [lib/paths.ts](lib/paths.ts),
`basePath` in `next.config.mjs`) is still there from the GitHub Pages days; it
costs nothing at the root.

### Local builds

`next build` and `next dev` write to separate folders (`.next` and `.next-dev`,
see `next.config.mjs`), so building while the dev server runs no longer breaks
it. To look at exactly what the server gets: `npm run build && npm start`.

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

Seven sheets, generated from the current site so the client edits over real
words rather than filling in a blank form:

| Sheet | What it holds |
|---|---|
| **Read me first** | The tutorial, written for a restaurant owner |
| **Text** | Every single string — 68 of them, each with a plain-language note |
| **Menu** | One row per dish or drink. A new value in `Category` becomes a new tab |
| **The kitchen** | The two lists under Our Cuisine — `fire` left, `table` right — each dish with its little drawing |
| **Spaces** | One photo card per space. A space with no photo is not shown |
| **Georgian words** | The scrolling strip under the first screen |
| **Images** | The fixed picture slots, by picture name |

Labels and notes are locked; only the value cells are editable. Choice columns
are dropdowns. Row insertion and deletion are allowed on every list sheet, so
adding a category or a dish needs no explanation beyond "add a row".

### What the client can and cannot break

`content:update` writes nothing until the new content passes `content:check`,
so a bad workbook leaves the site exactly as it was:

```
✗ Text › Section: the rooms › Heading — has an odd number of * characters.
✗ Menu › row 2 — "Dish" is empty, and it cannot be.
✗ Images › The big photo at the very top — the picture names "my-photo", but
  there is no picture by that name. The pictures are: ridge, georgian-table, …

content:update — nothing was changed. Fix the workbook and run it again.
```

It checks required fields, dropdown values, unbalanced `*`, broken encoding
(the Georgian script is the thing most likely to be destroyed by saving from
the wrong program), and picture names that `npm run images` has not produced.

On success it prints what actually moved before you commit:

```
· reworded: 2 fields (Tagline, Opening hours)
· Menu: +3 −1 (138 → 140 rows)
```

### The conventions the client is taught

- **Empty means left out, not broken.** Clear a cell and that part of the page
  goes, rather than rendering as a blank gap. The phone, email and hours fall
  back to a sentence of the client's own if they ever write one.
- **`*stars*` make gold italic.** `Visit *KERA* in Brussels`.
- **Blank line = new paragraph**, `Alt+Enter` = new line inside a cell.
- **Prices are free text** — `15.00`, `6.50 glass / 30.00 bottle`. The currency
  symbol is set once on the Text sheet and written before every number, so the
  second reads `€6.50 glass · €30.00 bottle`.
- **Hours in the form `Monday–Friday: 12:00–15:00 and 18:00–00:00`** are also
  read into the page's structured data for Google; a line in any other form (the
  kitchen note) is shown on the page and skipped there.
- **Every "Book a table" button calls `contact.phone`.** Change the number and
  they all follow.
- **`menu.isDraft`** prints the "this is a working draft" note above the tabs.
  It is the client's switch, not yours.
- **One heading over both kitchen lists.** Leave the right list's heading empty
  and the left one stands for both; the right list keeps the line so the dishes
  still start level.

### Adding a new field

`content/registry.mjs` is the single source of truth. Add an entry there and
the spreadsheet, the importer and the validator all follow. Then read it in a
component with `t('your.path')`. **No user-visible string belongs in `.tsx`** —
if it is not in the registry, the client cannot change it.

## Images

Every picture is cut and resized by one command:

```bash
npm run images
```

`scripts/images.config.mjs` lists each picture: its original, the shape to cut
it to (matching the arch it is shown in) and which part of the photo to keep.
The script writes `public/img/<name>-<width>.webp` at 480, 800 and 1200px —
never wider than the original — and `content/images.json`, which the `Photo`
component reads to build `srcset`. A phone downloads the 480px file, roughly
20–50 KB.

The originals are not in git. The client's photos live in `docs/images/`
(ignored, along with their workbook); the hero is the reference photograph in
`images/`. To replace a picture, put the new original under the same `src` and
run the command again; for a new one, add a recipe and give its name to the
client for the workbook.

Notes on the current set:

- The client calls these photos placeholders, to be replaced. Some look like
  stock photography — confirm the licence before they stay.
- `wine-pour` is cut from the top of `wine.kera.jpg` on purpose: the wrapping
  paper and cloth below carry another restaurant's printed branding.

`public/img/og.jpg` is the social preview card: 1200 × 630 JPEG, because some
apps still do not show WebP previews.

## Design

The visual world is recorded in `DESIGN.md`; the durable product record in
`PRODUCT.md`; the page-level strategy in `.impeccable/surfaces/app-page-tsx.md`.
The direction contract ships as an HTML comment at the top of `<body>` and
survives the production build — `grep fddb4283 out/index.html`.

Three rules are load-bearing and easy to break by accident:

1. **The page renders finished in CSS.** A two-line script in `<head>` adds a
   `motion` class only when motion is welcome, and that class is the only thing
   that hides anything; it removes itself after three seconds if the JavaScript
   never arrives. No visitor is ever left looking at an empty wall. Do not invert
   this by hiding things in the base stylesheet.
2. **Anchor jumps belong to `Motion.tsx`, not the browser.** Native smooth
   scrolling crawls the whole distance at its own pace. A delegated click
   handler tweens the window over a fixed one second instead, leaving the same
   room the browser would: the page's `scroll-padding-top` plus the target's
   `scroll-margin-top` (which is how a menu category clears the sticky bar).
3. **Gold is rationed.** `--gilt` means one thing: what is alight — the primary
   action (Book a table), an arch as it fires. Every other accent is
   pigment (`--cinnabar`, `--ochre`, `--malachite`). Gold used decoratively
   costs the page its only emphasis.

## Screenshots

With the export being served, `node .impeccable/tools/shots.mjs` recaptures
`.impeccable/review/` at desktop and mobile — full pages under reduced motion,
and each section with motion settled — and reports overflow and console errors.
`node .impeccable/tools/states.mjs` captures the menu, focus, hover and the
inscription band.

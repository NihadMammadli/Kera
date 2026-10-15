# Product

<!-- impeccable:product-schema 1 -->

## Status — open since 16 October 2026

The restaurant is open; the sections below describe the site as it was first
designed, before opening, and their pre-opening premises no longer hold. What
changed at launch, from the client's launch brief:

- **The primary action is booking.** Every "Book a table" button calls the
  restaurant; there is no booking system. Gold belongs to that button.
- **The menu is real.** All of it — food, drinks and the bar, 23 categories —
  sits in the menu section of the one page, as text, with prices.
- **The building site is gone.** The build-out timeline, the opening date and
  the "tell me when you open" form were removed. Spaces show photographs; the
  room drawings were retired with them.
- **Search matters now.** The visible H1 is "Georgian Restaurant in Brussels";
  the page has its own title, description and canonical on
  `https://www.kera.brussels/`, and the page carries Restaurant structured data
  with the opening hours.
- **The photographs are placeholders** the client will replace.

## Platform

web

## Stack

Next.js (App Router) + TypeScript, static export, GSAP for motion. Chosen by the
user from a stack question offering plain static HTML/CSS, Next.js, or Astro.
No CMS. All editable content lives in one file so a non-developer can update it.

## Users

Two audiences arrive on the same page, both from a phone, both in under a minute:

1. **Brussels diners who have not heard of KERA** — sent by a friend, an
   Instagram story, or a passing sign on Rue Saint-Quentin. They are deciding
   whether this is worth waiting for. They know little to nothing about Georgian
   food; "Georgian" may even read as ambiguous to them.
2. **People already following the build-out** — returning to see progress and to
   find out when they can finally book a table.

Neither can eat here yet. The site's job is to convert interest into a follow,
and to hold that interest until opening.

## Product Purpose

KERA is a Georgian restaurant under construction in Brussels, opening autumn
2026. This is its pre-opening single-page site. Success is a visitor who
understands what Georgian hospitality is, believes this particular room will be
worth the trip, and leaves connected — Instagram follow first, email second — so
KERA can reach them on opening day.

It is explicitly *not* a menu site or a booking site yet. It must not pretend to
be either.

## Positioning

"Kera" (ქერა) is the Georgian hearth — the fire at the centre of the home where
people gather, stories are told, and food is made. The name is the entire
argument: the restaurant is not selling dishes, it is selling the supra, the
Georgian table. Modern Georgian cooking rooted in Caucasus tradition, with a
selected set of Azerbaijani specialities alongside it — a combination no
neighbouring Brussels restaurant can truthfully claim.

The pre-opening moment is itself an asset, not an apology: the visitor is
invited into the building of the place, not made to wait outside it.

## Operating Context

- Read overwhelmingly on phones, in a few seconds, often from an Instagram link.
- Brussels: multilingual, dense with restaurants, sceptical of hype. The
  European Quarter around Rue Saint-Quentin is offices by day, residential by
  evening.
- The physical venue is confirmed: two dining halls, a private VIP room, a
  terrace, and a veranda.
- Progress is being documented daily on Instagram stories — that channel is
  live now, the restaurant is not.

## Capabilities and Constraints

- **English only**, confirmed by the user. No FR/NL versions in this build.
- Single page, anchor navigation, no sub-pages, no CMS, no backend.
- **Confirmed facts:** address Rue Saint-Quentin 29, Brussels, Belgium;
  Instagram `@kera_brussels`; opening autumn 2026; two dining halls, VIP room,
  terrace, veranda.
- **Not yet known — must not be invented:** phone number, email address,
  opening hours, chef or team names, exact opening date. The user intended to
  supply phone and email and did not; the page treats both as pending rather
  than guessing.
- **The menu is a labelled placeholder.** On the user's explicit instruction the
  site carries a full sample menu — six categories, invented dishes, invented
  euro prices — so the layout can be seen and judged. It is not the kitchen's
  menu and does not claim to be: `menu.draft` in `content/site.ts` prints the
  disclaimer above the tabs, and removing the flag without replacing the
  contents is the one way this section could become a lie.
- Email capture is a stated want; no form backend exists yet, so the markup must
  leave a clean, documented hook rather than a dead form.

## Handoff

The client owns every word. All content lives in `content/site.json`, exchanged
with them as a generated Excel workbook (`npm run content:export` /
`content:update`) — no CMS, no admin panel, no service. A validator refuses any
workbook that would break the page, and the images are placed by the developer
from file names the client writes in the sheet.

This is the constraint behind "no hardcoded strings": a string a developer has
to change is a string the restaurant cannot correct on the day it is wrong.

## Brand Commitments

- Name **KERA**, from the Georgian hearth. The meaning is the story and must be
  told on the page.
- Voice from the user's own copy: warm, first-person plural, direct, unhurried.
  "Welcome Home. Welcome to KERA." Fire and hearth are the recurring images.
- The user's supplied copy (`text.md`) is the source of truth for what the page
  says; it may be enhanced and extended, not contradicted.
- Structural reference: brocnbroll.be — single page, anchor nav.
- Motion reference: gsap-cocktail-showcase.surge.sh — cinematic scroll-driven
  animation, large display typography, moving text.

## Evidence on Hand

- `text.md` — the founder's own announcement copy, 19 lines.
- `images/` — four licensed-unknown photographs used as *mood* reference:
  Svaneti stone towers under snow peaks, a supra table laid above a green
  valley, a mountain church at sunrise with a full table in the foreground, a
  church on a ridge under the Caucasus. They depict Georgia, not the restaurant.
- **There are no photographs of KERA itself** — the room does not exist yet.
  The site must never present a stock or reference image as the venue.
- No testimonials, no press, no reviews, no awards. None may be fabricated.

## Product Principles

1. **The hearth is the argument.** Every section should trace back to fire,
   gathering, and the table — not to food photography clichés.
2. **Honest about what does not exist yet.** Unknown facts are shown as
   deliberately pending, never guessed. An empty state designed with care reads
   as confidence; a fabricated one destroys it.
3. **Teach Georgia in passing.** Most visitors do not know khachapuri, supra, or
   tamada. Introduce them inside the experience, never in a lecture.
4. **The build-out is the content.** Being unfinished is the story worth
   following; the page should make a visitor want to watch it happen.
5. **One action.** Follow on Instagram. Everything else is subordinate.

## Accessibility & Inclusion

Phone-first, one-handed. All scroll-driven motion must have a static, complete
fallback: `prefers-reduced-motion` and no-JavaScript visitors get the finished
page, never an empty one. Georgian script appears as accent, always paired with
a Latin reading.

# Deployment notes — Space Apps 2026 concept templates

## 🌐 Live site
**https://spaceapps-silent-fleet-2026.netlify.app/**

> **12 Nov 2026 — Age 7-8 Junior upgrade + GitHub:** Junior Explorer mode was
> rebuilt for younger readers (7-8+): a **tap-to-answer picker** (3 big word
> buttons under the answer input — typing is now optional), **kid-rewritten
> questions** ("What did NASA leave on the Moon? 🌙"), **kid zone names**
> ("Cislunar Space" → "Between Earth and the Moon"), **auto read-aloud** of
> every question with a stop/toggle, simpler Patch tips/hints, and wider
> plain-language swaps across comics and fact files. `kid-mode.js` +
> `kid-mode.css` only — no page files changed. Project is now on GitHub at
> <https://github.com/DamienLeong834/Space-Apps-2026>.


| Page | Path |
|---|---|
| Main experience: The Ghost Atlas | `/` |
| Chapter Zero: PATCHWORK (illustrated story) | `/patchwork.html` (also `/patchwork`) |
| Concept archive (former comparison hub) | `/concepts.html` |
| Ghost Atlas standalone route | `/06-ghost-atlas.html` |
| Ghost Map | `/01-ghost-rover-map.html` |
| Graphic Novel | `/02-graphic-novel.html` |
| Signal Lost (podcast) | `/03-signal-lost-podcast.html` |
| The Silent Fleet (timeline) | `/04-silent-fleet-timeline.html` |
| The Deep Dive (typing quiz) | `/05-the-deep-dive.html` |
| Junior Explorer shared layer | `/kid-mode.css`, `/kid-mode.js` |

- **Helper-tab visual fix:** 12 November 2026 — the collapsed Patch helper on
  reading pages is now a complete little face in a rounded edge tab instead of
  a clipped half-face; it still covers no story text. See the Junior Explorer
  section below. Production deploy `6af5b2a98f508b259985c3c4`.
- **Comic-upgrade release:** 12 November 2026 — every case card and every
  one of the 14 zones now has fully drawn comic art (see the section at the
  end of this file). Production deploy `6af5ac39dc9b2f5c575d2956`.
- **Junior Explorer release (ages 8–9):** 12 November 2026 — ON-by-default
  child-friendly layer on all ten pages (see the section at the end of this
  file). First production deploy `6af5a02e92d9dd654cdd2b90`; edge-tuck
  hotfix `6af5a363114246aa6754cd79` (Patch no longer covers words on the
  reading pages). A docs-only sync deploy follows; all IDs are on the
  deploys page.
- **Site ID:** `7d74a0ac-ce4a-4d01-a560-5ddcf4d091d4`
- **Team:** DamienLeong834's team (`damienleong834`, Free plan)
- **Chapter Zero: PATCHWORK release:** deploy `6af5922f864a2729667f2803`
  (12 November 2026) — the illustrated story became a public route and was
  wired into the atlas game (see the section at the end of this file).
- **Mobile-optimisation release:** deploy `6af475ed893b428a3ac1a76b`
  (11 November 2026) — the phone-first rebuild of the Ghost Atlas (see the
  section below). The newest deploy ID is always listed on the deploys page.
  Earlier
  in the day deploy `6af454216b7ebc87fe4b6497` promoted the Ghost Atlas
  (concepts 01 + 02 + 05) to `/`; the former comparison hub was preserved
  at `/concepts.html` and the standalone prototype at `/06-ghost-atlas.html`.
  The clean publish removed `quiz-answers.md` and `quiz-answers.csv`
  from the public site. The CLI prints
  a deploy ID on every run; all deploys are listed at
  <https://app.netlify.com/projects/spaceapps-silent-fleet-2026/deploys>.

  > `netlify deploy --json` returns `JSONHTTPError: Unprocessable Entity` on
  > this CLI (v27.4.2); deploying without `--json` works. Netlify also
  > rewrites internal `.html` links in the served HTML to pretty URLs
  > (`patchwork.html` → `/patchwork`, `index.html` → `/`, etc.) and injects a
  > short hosting comment. Those are the only differences between live bytes
  > and the local publish copy. Both spellings return HTTP 200; automated
  > checks should match on class + `href` text, not the exact `.html` string.

## 📱 Mobile layout (The Ghost Atlas)
`index.html` and `06-ghost-atlas.html` are byte-identical and were made
phone-first in November 2026. Before that change the 720px-wide atlas forced
the whole grid to ~776px, so on a 390px phone the casework desk, card index
and half the map were clipped and unreachable.

Key changes:
- **No page-level horizontal scrolling.** `.work > *`, `.ledger .top > *`
  and `.mapscroll` are `min-width:0`; the atlas pans *inside its own* scroll
  box (`.mapscroll`) instead of stretching the document. Verified
  `document.documentElement.scrollWidth === innerWidth` at 320/360/390/414/
  768/1440 px.
- **Sticky HUD: 160px → 47px.** Four equal stat cells + a 4px progress bar;
  `viewport-fit=cover` and `env(safe-area-inset-*)` handle notches.
- **Intro reduced from 688px → 321px.** "How the investigation works" is a
  `<details>` that starts collapsed on phones (tap to expand) and open on
  desktop.
- **Order:** map → casework desk → card index on narrow screens, so the quiz
  is no longer buried below 20 case cards. Four quick-jump links jump to the
  desk, map, concept archive and the original Deep Dive.
- **Touch:** all buttons ≥40px, 16px answer input (no iOS zoom), hover effects
  gated behind `@media(hover:hover)`, `touch-action:manipulation`, body scroll
  locked while a modal is open.
- **Modals:** drawer is full-width `100dvh`; chapter comic collapses from six
  41px columns to one readable column. The map auto-pans to follow the probe
  when the descent reaches a new zone.
- Pan hint and a compact legend sit outside the scrollable stage so they stay
  visible while swiping. `prefers-reduced-motion` is honoured.

Verified with headless Chrome + CDP device emulation: 6 viewport sizes have
zero overflow, zero off-screen elements and zero undersized tap targets;
31/31 interactive checks pass (drawer, chapter comic, quiz start, answer
submission, evidence pin, map pan, lens filter). Harnesses:
`_mobile_probe.py`, `_mobile_flow.py` in the workspace.

## 🚀 Redeploy after edits
Manual CLI deploys upload **every file under `--dir`**. The Netlify CLI does
**not** honour `.netlifyignore` for `netlify deploy --dir .`, so publishing
straight from this folder would expose the answer keys. Use the clean staging
copy instead:
```powershell
python "C:\Users\Asus\WorkBuddy AI\2026-11-11-13-45-29\_publish.py"
netlify deploy --dir "C:\Users\Asus\WorkBuddy AI\2026-11-11-13-45-29\_netlify_publish" --site 7d74a0ac-ce4a-4d01-a560-5ddcf4d091d4 --prod --no-build --message "your note"
```
`_publish.py` copies all public pages and quiz assets while excluding
`quiz-answers.md`, `quiz-answers.csv`, `DATABASE-PROMPT.md`, `sync-quiz.py`,
`.netlifyignore` and `.netlify/`. The `.netlifyignore` file is retained for any
future Git-based deploy, where Netlify does honour it.

> **Pretty URLs:** Netlify rewrites deployed `.html` links to extensionless
> paths (`/concepts`, `/05-the-deep-dive`, `/06-ghost-atlas`). Both forms
> resolve; local `file://` copies keep the `.html` links.
>
> **Note:** the `netlify` CLI mangles JSON passed through PowerShell. Use
> `Invoke-RestMethod` with `-ContentType "application/json"` for any API calls.

## 📦 Quiz data (The Deep Dive)

`05-the-deep-dive.html` reads **`quiz-data.json`** — that file is the single
source of truth. It is a **question bank**: 20 questions (`q01`–`q20`), 179
accepted answers, covering all 14 descent zones.

**Only 10 questions are played per dive.** `ROUND_SIZE = 10` in the page;
`newRound()` Fisher-Yates shuffles the *entire* bank and slices the first 10,
so both the selection and the order change on every dive (`?ordered` aside).
That is 20-choose-10 sets × 10! orderings — a player will not see the same
round twice.

- `QUIZ_POOL` — the whole bank in canonical `q01`…`q20` order.
- `QUESTIONS` — the 10 prompts for the current dive, mutated in place so
  `window.__T.QUESTIONS` stays live. The engine reads only this array.
- `MAX_DEPTH` — recomputed **from the selected 10**, not the whole bank.
  Summing all 20 would make a 100% descent unreachable. Every question has
  at least one `rarity >= 80` answer, so a full round is always 250 depth and
  the zone thresholds stay balanced.

Browsers block `fetch()` of local JSON over `file://`, so a generated shim
**`quiz-data.js`** ships alongside it for double-click use. On the deployed
site the live `quiz-data.json` is fetched and wins.

After any edit to `quiz-data.json`, validate the schema and regenerate the shim:

```powershell
python sync-quiz.py
```

`sync-quiz.py` enforces the bank rules (≥10 questions, unique zero-padded ids,
zones 0–13, 6–10 answers each, 3–8 lowercase aliases, rarity 1–99 with no
duplicates, at least one ≥80 per question, commonest-first ordering).

Deploy all three together — `netlify deploy --dir .` already does. To check
which copy a deployed page is actually reading, open DevTools and inspect
`window.__T.source`: it should say `quiz-data.json (live)` on Netlify.

For a deterministic round during judging, screenshots or repeatable tests,
append `?ordered` to the URL, e.g. `/05-the-deep-dive.html?ordered`. It draws
the first 10 canonical questions (`q01`–`q10`) with no shuffle. DevTools can
toggle it live with `window.__T.setShuffle(false)` and redraw with
`window.__T.newRound()`. Useful hooks:
`window.__T.poolSize` (20), `roundSize` (10), `poolIds`, `roundIds`,
`MAX_DEPTH` (250) and `source`.

Accepted answers stay in commonest-first order on purpose: the typing engine
matches aliases top-down, so shuffling them would change which answer a vague
input lands on. `findAnswer()` requires an exact alias match for 2-character
input (so "Io" works) and whole-word matching for aliases shorter than four
characters (`io`, `lro`, `rtg`, `ds1`) so "mission" or "ion" cannot falsely
land Io.

## ⚙️ Settings changed on this site

| Setting | Before | After | Scope |
|---|---|---|---|
| `sso_login` | `true` | **`false`** | **This site only** |
| `built_with_badge_enabled` | `true` | **`false`** | **This site only** |

**Team-wide `site_sso_login` is still `true` (context: `all`) and was NOT changed.**
Your other and future sites remain behind Netlify sign-in. Only this site is public.

### Why a site-level override
The public Netlify API does **not** expose the SSO/protection setting at the account
level — `updateAccount` only accepts `name`, `slug`, `type_id`, `extra_seats_block`,
`billing_name`, `billing_email`, `billing_details`. Setting `sso_login: false` on the
site itself is what actually works.

## ✅ Verification (run again after any change)
```powershell
# Site still public? Badge still off?
$r = Invoke-RestMethod -Uri "https://spaceapps-silent-fleet-2026.netlify.app/" -UseBasicParsing
```
Or check the settings directly:
```powershell
$j = Get-Content "$env:APPDATA\netlify\Config\config.json" -Raw | ConvertFrom-Json
$u = $j.users.PSObject.Properties | Select-Object -First 1
$tok = $u.Value.auth.token
Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/7d74a0ac-ce4a-4d01-a560-5ddcf4d091d4" `
  -Headers @{Authorization="Bearer $tok"} |
  Select-Object sso_login, built_with_badge_enabled, has_password
```

## ⚠️ Before you submit
1. **Resources tab opens Friday, 13 November 2026.** The official datasets are not
   published yet — re-check then and align every figure to what NASA provides.
2. **Verify all mission facts against primary sources.** Figures in these templates
   were compiled from published NASA/JPL records as a starting point. Keep a
   claim → source URL spreadsheet.
3. Cite sources on the final submission page.

## 🖥️ Local preview (optional)
```powershell
cd "C:\Users\Asus\OneDrive\Desktop\Space Apps 2026"
python -m http.server 8747 --bind 127.0.0.1
# → http://127.0.0.1:8747/
```
Pages 01–04 are fully self-contained. The new `index.html` and
`06-ghost-atlas.html` embed their 20-question bank, so they also work by
double-clicking. Page 05 needs its sibling `quiz-data.js` in the same folder
(see above). No server is needed for any page; running one simply lets page 05
read the live `quiz-data.json` instead of the bundled shim.


## 📖 Chapter Zero: PATCHWORK (story integration)
`patchwork.html` is a **live public route** — the approved seven-beat comic, not a
prototype. It is linked from the Ghost Atlas masthead, HUD, mobile quick-jump bar,
every chapter modal, the footer, and its own card in `concepts.html`.

The story is also wired into the game itself:

| Beat | Where it lives | What happens |
|---|---|---|
| Chapter Zero | `ZONES[1]` (Low Earth Orbit) | Unlocks as a normal comic chapter with its own `sfx`, bubble and fact file. |
| Beat 6 | `submitAnswer()` | Each accepted answer is pushed into `S.learned`, shown in **PATCH'S WORD BAG**, logged as `PATCH LEARNED:` and saved to `sessionStorage['ghostAtlasLearned']`. |
| Beat 7 | `showChapter(13)` + `endInvestigation()` | Zone 13's bubble and the closing case file are built from `S.learned`, so Patch's "first original sentence" uses the reader's own answers. |
| Live comic | `patchwork.html` | Reads the same `sessionStorage` key and rewrites the "Your words in this story" panel and the finale bubble. |

Diagnostics: `window.__G.chapterZero`, `window.__G.learned`, `window.__G.patchLine`
on the atlas; `window.__P.words`, `window.__P.sentence`, `window.__P.panels` on the
comic. `index.html` and `06-ghost-atlas.html` remain byte-identical.

Public routes to verify after deploy: `/patchwork.html`, `/patchwork`, `/`, `/concepts.html`.
Answer keys (`quiz-answers.md`, `quiz-answers.csv`) must still return **404**.


## 📦 Static comic assets (public)
Deployed alongside the Chapter Zero route so the comic can be saved, printed or
shared without JavaScript:

| Asset | Path | Use |
|---|---|---|
| Standalone / print edition | `/patchwork-comic.html` | Chrome-free comic with a small back-nav; linked from `patchwork.html`. |
| Full comic sheet | `/patchwork-comic-sheet.png` | 1440 × 2560 desktop PNG of the whole seven-panel sheet. |
| Phone edition | `/patchwork-comic-phone.png` | 390 × 2600 narrow PNG for mobile viewing. |

`patchwork.html` has a **"Take the comic with you"** panel with thumbnails and links
to all three. The standalone edition keeps the original production notes but marks
them as historical, since the integration is now live.

Still deliberately **not** public: `quiz-answers.md`, `quiz-answers.csv`,
`quiz-answers-mobile.pdf`, `DATABASE-PROMPT.md`, `sync-quiz.py` and all
`_*.py` verification harnesses (those live in the workspace, not the site folder).


## 🧒 Junior Explorer mode (readers aged 8–9)
**ON by default on every public page.** A "Grown-up view" switch restores the
original design instantly — no reload, so quiz progress survives. The choice
lives in `localStorage['ghostAtlasKidMode']`; star rewards in
`localStorage['ghostAtlasKidStars']`.

Two shared files are loaded by all ten HTML pages, inserted just before
`</head>`:

- **`kid-mode.css`** — every visual rule is scoped to `html.kid`, so classic
  view is exactly the original design. Rounded Trebuchet type instead of
  Impact/Georgia, warmer palette, 22–26px panel corners, 44–54px buttons,
  larger comic caption/dialogue text. `#qInput` stays **exactly 16px** to
  avoid iOS zoom. At ≤640px it also fixes two pre-existing narrow-screen
  overflows: `.rec`'s 300px grid minimum on the concept archive, and page 04's
  wide summary table (now in an `overflow-x:auto` container).
- **`kid-mode.js`** — loaded synchronously in `<head>` so `html.kid` is set
  before first paint. It **never edits any page's own JavaScript**; it observes
  the existing DOM with `MutationObserver`s.

| What kids get | How it works |
|---|---|
| Patch welcome strip | A cream banner on the atlas with three plain-language steps, drawn from the same twin-lens SVG face as the comic. |
| Plain-language labels | `GHOST ATLAS / FIELD UNIT` → `SPACE DETECTIVE CLUB`, `Casework Desk` → `Answer Desk`, `Prompt` → `Question`, `zone` → `place`, `evidence` → `clues`, plus a soft "not quite, try again" nudge. Saved `innerHTML` / text nodes make every change reversible. **Question text and the answer bank are never touched.** |
| Patch helper dock | Collapsed to one round buddy + star badge. **On reading pages** (comics, archive, concept pages, standalone quiz) it tucks into the right edge as a 26px rounded peek-tab, because those pages carry text to the right gutter — a floating face covered the last words of a line. The tab has its **own complete mini face** (two whole eyes, smile, cheeks, a chevron and the star badge); the old version clipped a sliver out of the big face and looked like a chopped-off head. A transparent 46×64px hit area around it keeps the target easy for a child to tap. One tap slides the full dock back in. The atlas keeps the whole round buddy since its right column is empty. Tap for rotating tips, a three-step hint ladder (place → starting letters → a peek with "Use this answer"), and optional read-aloud via `speechSynthesis`. |
| Star rewards | +1 per correct answer, +3 for closing the case, +1 for reading a story page. Toast + persisted star jar. Peeking is never punished. |
| Grown-up view | Hides the buddy and shows a small "Turn on Junior mode" pill; `body.modal-open` hides the dock behind drawers/chapter comics; `@media print` hides it entirely for the print edition. |

Diagnostics: `window.__KID` exposes `enabled`, `stars`, `hints`, `intro`,
`dock`, `relabeled`, `bubbleOpen`, plus `set(v)`, `toggle()`, `hint()`,
`tip()`, `read()`, `resetStars()`.

**Verification:** `_kid_verify.py` (workspace) checks all 10 pages × 3 widths
(1440 / 390 / 320) for kid mode ON, zero horizontal overflow / off-screen
elements / undersized tap targets, comic `blockers === 0`, 7 panels on both
comic routes, plus an edge-tab assertion on every reading page: dock ≤52px,
**no `clip-path`**, the complete 26px mini face visible (big face hidden),
a 44px+ tap target, and **zero rendered word lines behind the tab** (measured
with `Range.getClientRects()` over real text nodes). A live tap → open → close
round-trip confirms the faces swap back. It also runs
33/33 interactive checks (relabels, reversible classic
switch with the quiz still running, hint ladder, star reward, question
integrity), plus `localStorage` persistence across real reloads.
Existing harnesses still pass: `_mobile_flow.py` **44/44**, `_mobile_probe.py`
zero overflow at 320/390/768/1440, `_pw_assets_verify.py`, `_pw_syntax.py`,
`_pw_concepts.py`. `index.html` and `06-ghost-atlas.html` remain byte-identical.

**Production verification (deploy `6af5a02e92d9dd654cdd2b90`, re-run after
hotfix `6af5a363114246aa6754cd79`):** the same harnesses were run against the
live HTTPS origin — `_kid_verify.py --url=…` **PASS, 33/33** across all 10
pages × 3 widths plus `localStorage` persistence, edge-tuck assertions on
every reading page and the tap → open → close round-trip;
`_mobile_flow.py --url=…` **44/44**; `_mobile_probe.py --url=…`
zero overflow / off-screen elements / undersized tap targets and `16px`
inputs at 320, 390, 768 and 1440; `_pw_live_verify.py` **PASS** including the
atlas → comic word hand-off; `_pw_assets_verify.py --live` **PASS**. All 21
public routes return 200, `/kid-mode.css` and `/kid-mode.js` are byte-identical
to the local files, and `/quiz-answers.md`, `/quiz-answers.csv`,
`/quiz-answers-mobile.pdf`, `/DATABASE-PROMPT.md` and `/sync-quiz.py` still
return 404.

**Helper-tab fix (deploy `6af5b2a98f508b259985c3c4`):** the collapsed reading
helper was a 26px sliver clipped out of the full-size Patch face, which looked
like a chopped-off head with a chevron stamped on its eye. It is now a rounded
edge tab with its own complete mini face (two whole eyes, smile, cheeks),
chevron and star badge. The visible width stays 26px in the right gutter, so
no story word is covered; a transparent 46×64px hit area keeps it tappable.
`_kid_verify.py` now asserts no `clip-path`, the mini-face swap, a 44px+
target and zero rendered word lines behind the tab, on all 10 pages × 3 widths.
Live re-verification after this deploy: kid mode **33/33**, mobile flow
**44/44**, sandbox **55/55**, mobile probe zero overflow at 320/390/768/1440,
Patchwork + asset verification **PASS**, private files still 404.


## 🎨 Upgraded case-card comics (all 14 zones, all case files)
`index.html` and `06-ghost-atlas.html` are still byte-identical, and the whole
upgrade is inline — **no new public files, no new requests**.

- **One reusable SVG sprite** (23 `<symbol>`s) drawn in the flat comic ink
  style: friendly twin-lens Kess and Patch, lander, rover, probe, telescope,
  satellite, booster stage, Golden Record, fairing, solar wing, cube, Earth,
  Moon, Mars, Sun, Jupiter, Saturn, asteroid, comet, belt and wave.
- **All 14 zones now have a chapter comic.** Only 8 had one before. Each is a
  three-beat story (`BEAT 1/2/3`), with its own scene palette, hardware props,
  dialogue, field-note fact file and hand-authored captions.
- **Every case file** (`openCase()`) is now three drawn panels plus the mission
  fact file and the full field reading, instead of text over a gradient.
- **Every visible card tile** now carries its own comic thumbnail — the same
  art system, scaled to the card — so the story is visible before you tap.
- **Nothing covers the artwork.** Each frame is three stacked zones:
  `.pnl` (art only), `.cdialog` (speech balloons with speaker labels), and
  `.cframe > .cap` (narration strip). Sound lettering is SVG `<text>` placed
  in empty sky. Panels use `preserveAspectRatio="xMidYMid meet"`, so the whole
  drawing is visible at 320 / 390 / 1440 px and never cropped. The harness
  asserts `.pnl .bub, .pnl .cap, .pnl .sfx === 0` for all 14 chapters and
  every case file.
- Captions clip on a word boundary (no mid-word truncation) and keep inline
  `<b>` balanced.

**Verification:** a dedicated CDP harness runs 55/55 checks — every card has
art, all 14 chapter comics and every case file render 3 clean frames with real
`<use>` symbols, zero blockers, zero horizontal overflow at 320/390/1440,
zero runtime errors, and no `.html` link regressions. Existing harnesses still
pass: `_kid_verify.py` 33/33, `_mobile_flow.py` 44/44, `_mobile_probe.py`
zero overflow / off-screen / undersized targets, `_pw_concepts.py`,
`_pw_assets_verify.py`, `_pw_syntax.py` (`node --check` OK on all pages).

**Production verification (deploy `6af5ac39dc9b2f5c575d2956`):** the same
55/55 checks pass against the live HTTPS origin, including `sessionStorage`
restore across a real reload. Live `_kid_verify.py --url=…` **33/33**,
`_mobile_flow.py --url=…` **44/44**, `_mobile_probe.py --url=…` zero overflow
/ off-screen / undersized targets at 320, 390, 768 and 1440,
`_pw_live_verify.py` **PASS**, `_pw_assets_verify.py --live` **PASS**. All 21
public routes return 200; the six shared assets are byte-identical to the
local publish copy; the five private answer/authoring files still return 404.
`index.html` and `06-ghost-atlas.html` remain byte-identical.

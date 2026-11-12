# 🛰️ THE GHOST ATLAS — An Evidence Map of the Silent Fleet

> **NASA Space Apps 2026** · Challenge track: *Abandoned but not Forgotten*
>
> 🌐 **Live site:** <https://spaceapps-silent-fleet-2026.netlify.app/>

An interactive, story-driven evidence map of **real NASA hardware abandoned in space** — from Apollo descent stages on the Moon to Voyager crossing into interstellar space. Plot what you learn where the machines were left, read their stories as comic case files, and follow the pattern until the case closes.

---

## 🗺️ The main experience

**The Ghost Atlas** fuses three concepts into one investigation across **14 zones** of the solar system (Surface → Low Earth Orbit → Van Allen Belts → Cislunar → Lunar Surface → Solar Orbit → Martian Transfer → Martian Surface → Asteroid Belt → Jovian System → Saturnian System → Kuiper Belt → Heliopause → Interstellar Space):

| Step | What you do |
|---|---|
| 📍 **Plot** | Tap ghost beacons on the solar-system map to open comic **case files** about real NASA hardware |
| 🔎 **Verify** | Type answers in the **casework desk** — every correct name plants an evidence pin at its zone |
| 🧠 **Infer** | Watch the pins cluster: three patterns and a field conclusion unlock as evidence grows |

A typed **rarity-descent quiz engine** (think Family Feud × space probe) draws 10 random questions from a 20-question bank on every dive — no two rounds are the same.

## 📖 Chapter Zero: PATCHWORK

The seven-beat illustrated comic that explains *why this map exists* — Kess, a scrap-collector robot, refuses to compact a numbered payload fairing and instead assembles **Patch**, a small robot who can't speak. The story is wired into the game itself:

- Every correct quiz answer becomes a **word Patch gets to keep**
- Patch's "first original sentence" in the finale is built **from your own answers**
- Read the comic on one page, and the atlas remembers your words between the two

## 📚 Pages & routes

| Route | What it is |
|---|---|
| `/` | **The Ghost Atlas** — main experience (map + casework desk + 20 case cards) |
| `/patchwork` | **Chapter Zero: PATCHWORK** — the seven-beat comic story |
| `/01-ghost-rover-map` | Concept 01 — Ghost Map prototype |
| `/02-graphic-novel` | Concept 02 — Graphic novel |
| `/03-signal-lost-podcast` | Concept 03 — Signal Lost podcast player |
| `/04-silent-fleet-timeline` | Concept 04 — The Silent Fleet timeline |
| `/05-the-deep-dive` | Concept 05 — The Deep Dive typing quiz |
| `/06-ghost-atlas` | The Ghost Atlas (standalone route, identical to `/`) |
| `/concepts` | Concept archive |
| `/patchwork-comic` | Print-friendly comic edition |

## 🧒 Junior Explorer mode (ages 8–9)

**ON by default** on every page. A "Grown-up view" switch restores the classic design instantly, no reload:

- Patch buddy dock with rotating tips and a three-step hint ladder
- Plain-language relabels ("Casework Desk" → "Answer Desk")
- Star rewards for correct answers and reading story pages
- Optional read-aloud via speech synthesis
- Quiz questions and answer banks are never altered

## ✨ Technical highlights

- **Zero build step** — pure static HTML/CSS/JS, every page self-contained
- **All comic art is inline SVG** — no image requests for the 14 chapter comics, case files and card thumbnails (a 23-symbol sprite system)
- **Phone-first layout** — verified zero horizontal overflow at 320–1440 px, 44px+ tap targets, safe-area/notch handling, sticky HUD
- **`prefers-reduced-motion` honoured**, dialogs use proper `role`/`aria-modal`, inputs sized to avoid iOS zoom
- **Deterministic judging mode** — append `?ordered` to the quiz for a fixed repeatable round
- **Verification harnesses** — headless Chrome suites: 55/55 comic-render checks, 44/44 mobile flow, 33/33 kid-mode checks across 10 pages × 3 viewports
- Quiz bank lives in **`quiz-data.json`** (single source of truth); run `python sync-quiz.py` to validate the schema and refresh the bundled `quiz-data.js` shim

## 🚀 Run it locally

No server needed — just double-click any page. For the live quiz data fetch:

```powershell
python -m http.server 8747 --bind 127.0.0.1
# → http://127.0.0.1:8747/
```

## 📁 Repo structure

```
├── index.html              # The Ghost Atlas (main experience)
├── patchwork.html          # Chapter Zero: PATCHWORK comic story
├── patchwork-comic.html    # Standalone / print comic edition
├── 01…06-*.html            # Concept pages 01–05 + standalone atlas route
├── concepts.html           # Concept archive
├── kid-mode.css / .js      # Shared Junior Explorer layer (all pages)
├── quiz-data.json / .js    # Question bank (single source of truth + shim)
├── quiz-answers.md / .csv  # Answer keys (team reference — see note below)
├── sync-quiz.py            # Quiz bank validator / shim generator
├── DEPLOY.md               # Full deploy, settings & verification notes
└── DATABASE-PROMPT.md      # Prompt used to author/extend the quiz bank
```

> ⚠️ **Note:** the answer-key files are public **in this repo on purpose** so the whole team can work from one source. They are **excluded from the live website** deploy — the playable site never exposes them.

## 🌐 Deployment

Static hosting on **Netlify** (`spaceapps-silent-fleet-2026.netlify.app`). Full deploy procedure, settings and post-deploy verification checklists live in **[DEPLOY.md](DEPLOY.md)**.

## 👥 Team

**Team DamienLeong834** — built for the 2026 NASA Space Apps Challenge.

## 🙏 Credits & data

- Facts compiled from published **NASA/JPL** mission records
- 2026 NASA Space Apps Challenge track: *Abandoned but not Forgotten*
- Official challenge datasets open **13 November 2026** — figures will be aligned to them before final submission

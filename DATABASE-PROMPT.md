# Prompt: generate the quiz database for "The Deep Dive"

Copy everything below the `---` into another AI. It outputs one JSON file.
Save the result as **`quiz-data.json`** in this same folder, then run
`python sync-quiz.py` to validate it and refresh the bundled `quiz-data.js`
shim that `05-the-deep-dive.html` uses when opened via `file://`.

`quiz-data.json` is a **question bank, not a single round**. The game draws
**10 questions at random from the whole bank on every dive** (Fisher-Yates),
so the bank can be as large as you like — it only needs at least 10. The
current bank has **20 questions (`q01`–`q20`) covering all 14 zones**.

`id` and `zone` are metadata, **not display order**: prompts are shuffled, and
`zone` never controls the descent (depth comes from answer rarity). Append new
questions at the END so `?ordered` still draws the original `q01`–`q10` for
judging and screenshots.

---

You are building a quiz database for an educational web game about **NASA hardware
abandoned in space** (2026 NASA Space Apps track "Abandoned but not Forgotten").

Output **ONLY valid JSON** — no markdown fences, no commentary. Must be parseable
by `JSON.parse()`.

## Output shape

```json
{ "version": 1, "questions": [ ] }
```

## Question object

```json
{
  "id": "q01",
  "zone": 4,
  "topic": "Lunar surface",
  "prompt": "Name something NASA left behind on the Moon.",
  "time": 25,
  "answers": [
    { "display": "Apollo 11 descent stage",
      "match": ["apollo 11", "descent stage", "eagle", "tranquility"],
      "rarity": 38,
      "note": "Left at Tranquility Base when the crew lifted off in July 1969." }
  ],
  "reveal": "Its laser retroreflector still bounces lasers from Earth today."
}
```

### Field rules

- **id** — `q01`, `q02`, … unique and zero-padded. Number the whole bank
  consecutively; never reuse an id.
- **zone** — integer 0–13:
  `0 Surface, 1 Low Earth Orbit, 2 Van Allen Belts, 3 Cislunar Space,
   4 Lunar Surface, 5 Solar Orbit, 6 Martian Transfer, 7 Martian Surface,
   8 Asteroid Belt, 9 Jovian System, 10 Saturnian System, 11 Kuiper Belt,
   12 Heliopause, 13 Interstellar Space`
- **topic** — short label, e.g. `"Lunar surface"`.
- **prompt** — **open-ended**, never multiple choice. Must admit *many* valid
  answers so rarity has room to vary. Use patterns like "Name something …",
  "Give one …", "Name a piece of …".
- **time** — always `25` (seconds).
- **answers** — 6 to 10 accepted answers, ordered **commonest first**.
  - `display` — how the game shows it.
  - `match` — 3–8 lowercase aliases/typos/partial phrases the player might type.
    The engine normalises input (lowercase, strip punctuation/articles) and
    checks substring containment both ways.
  - `rarity` — integer **1–99**. Lower = more people would say it.
    Assign realistically: a well-known answer = 5–25; something only an
    enthusiast would say = 55–75; genuinely obscure = 80–99.
    **Do not duplicate the same rarity twice inside one question.**
  - `note` — one sentence, shown when the player lands it.
- **reveal** — one sentence of science shown when the question ends.

### Difficulty spread (required)

Across the whole bank, accepted rarity values must cover the full range.
**Every** question needs at least one answer with `rarity >= 80`: the game
computes the round's maximum descent from each question's rarest answer, so
this keeps a perfect 10-question dive worth the same 250 depth every time.

## Content requirements

- **Accuracy is graded.** Use only published NASA/JPL mission facts.
- Cover **all 14 zones at least once**. Zones `4 Lunar Surface` and
  `7 Martian Surface` carry several questions each; `5 Solar Orbit` and
  `9 Jovian System` carry two. A single round draws 10 of the bank at random,
  so zone coverage is a property of the BANK, not of any one dive.
- Total: **at least 10 questions**. The current bank has 20; add new ones at
  the end (`q21`, `q22`, …) rather than renumbering.
- Every `display` value must be real, verifiable hardware or mission facts.
- No multiple-choice. No answers that are opinions.
- Keep answers commonest-first: the typing engine matches aliases top-down,
  so shuffling them would change which answer a vague input lands on.
- Avoid answers whose whole name is only two letters unless you also add a
  longer alias (the engine requires an exact alias match for 2-letter input).

## Output only the JSON object. Nothing else.

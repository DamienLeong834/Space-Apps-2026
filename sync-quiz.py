#!/usr/bin/env python3
"""Validate quiz-data.json and regenerate quiz-data.js from it.

quiz-data.json is the single source of truth for The Deep Dive quiz. It is a
QUESTION BANK (20 questions at time of writing), not a single round: the game
draws 10 of them at random for every dive (ROUND_SIZE in 05-the-deep-dive.html).

Browsers block fetch() of local JSON over file://, so 05-the-deep-dive.html
also loads quiz-data.js, a generated shim exposing the same object as
window.QUIZ_DATA. On http(s) the page fetches the live quiz-data.json
instead and that copy wins.

Run after any edit to quiz-data.json:

    python sync-quiz.py
"""

import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "quiz-data.json"
OUT = HERE / "quiz-data.js"

MIN_QUESTIONS = 10          # a dive draws this many; the bank must supply at least it
MIN_ANSWERS, MAX_ANSWERS = 6, 10
MIN_ALIASES, MAX_ALIASES = 3, 8


def fail(msg):
    raise SystemExit("quiz-data.json: " + msg)


def validate(data):
    if data.get("version") != 1:
        fail("expected version 1")
    questions = data.get("questions")
    if not isinstance(questions, list):
        fail("'questions' must be an array")
    if len(questions) < MIN_QUESTIONS:
        fail(f"need at least {MIN_QUESTIONS} questions, got {len(questions)}")

    seen_ids = set()
    for i, q in enumerate(questions):
        qid = q.get("id", f"<index {i}>")
        if not re.fullmatch(r"q\d{2}", str(qid)):
            fail(f"{qid}: id must be zero-padded like q01, q20")
        if qid in seen_ids:
            fail(f"duplicate id {qid}")
        seen_ids.add(qid)

        zone = q.get("zone")
        if not isinstance(zone, int) or not 0 <= zone <= 13:
            fail(f"{qid}: zone must be an integer 0-13")
        if not q.get("topic") or not q.get("prompt") or not q.get("reveal"):
            fail(f"{qid}: topic, prompt and reveal are required")
        if q.get("time") != 25:
            fail(f"{qid}: time must be 25")

        answers = q.get("answers")
        if not isinstance(answers, list) or not (MIN_ANSWERS <= len(answers) <= MAX_ANSWERS):
            fail(f"{qid}: need {MIN_ANSWERS}-{MAX_ANSWERS} answers, got "
                 f"{len(answers) if isinstance(answers, list) else 'none'}")

        rarities, displays = [], set()
        for a in answers:
            for k in ("display", "match", "rarity", "note"):
                if k not in a:
                    fail(f"{qid}: answer missing {k}")
            if not a["display"] or a["display"] in displays:
                fail(f"{qid}: empty or duplicate display '{a['display']}'")
            displays.add(a["display"])
            if not a["note"]:
                fail(f"{qid}: empty note on '{a['display']}'")

            aliases = a["match"]
            if not isinstance(aliases, list) or not (MIN_ALIASES <= len(aliases) <= MAX_ALIASES):
                fail(f"{qid}/{a['display']}: need {MIN_ALIASES}-{MAX_ALIASES} aliases")
            for alias in aliases:
                if not isinstance(alias, str) or not alias.strip() or alias != alias.lower():
                    fail(f"{qid}/{a['display']}: aliases must be non-empty lowercase strings")

            r = a["rarity"]
            if not isinstance(r, int) or isinstance(r, bool) or not 1 <= r <= 99:
                fail(f"{qid}/{a['display']}: rarity must be an integer 1-99")
            rarities.append(r)

        if len(set(rarities)) != len(rarities):
            fail(f"{qid}: duplicate rarity inside one question")
        if max(rarities) < 80:
            fail(f"{qid}: at least one answer must have rarity >= 80")
        if rarities != sorted(rarities):
            fail(f"{qid}: answers must be ordered commonest-first (ascending rarity)")

    return questions


def main():
    data = json.loads(SRC.read_text(encoding="utf-8"))
    questions = validate(data)

    header = (
        "/* GENERATED FILE - do not edit by hand.\n"
        "   Source of truth: quiz-data.json\n"
        "   Regenerate with: python sync-quiz.py\n"
        "   This shim keeps the page working over file:// (fetch of local JSON\n"
        "   is blocked by browsers). On http(s) the live JSON is fetched instead. */\n"
    )
    body = json.dumps(data, ensure_ascii=True, indent=2)
    OUT.write_text(header + "window.QUIZ_DATA = " + body + ";\n",
                   encoding="utf-8", newline="\n")
    n_answers = sum(len(q["answers"]) for q in questions)
    zones = sorted({q["zone"] for q in questions})
    print(f"wrote {OUT.name}: {len(questions)} questions, {n_answers} answers, "
          f"{OUT.stat().st_size} bytes")
    print(f"validated: zones {zones[0]}-{zones[-1]} ({len(zones)} distinct), "
          f"min bank {MIN_QUESTIONS}, round draws 10")


if __name__ == "__main__":
    main()

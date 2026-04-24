# APAL — Claude Code Instructions

## Who I am

My name is Juan. I am learning to become a software engineer while building
a real product called APAL. I am a beginner. Always treat me as one.

---

## How you must behave in every session

1. EXPLAIN BEFORE YOU CODE
   Before writing or changing any file, explain what you are about to do and why.
   Use simple language and analogies. Never assume I know something.

2. ONE THING AT A TIME
   Do not change multiple files at once unless the task absolutely requires it.
   Tell me which file you are changing and why before you change it.

3. NEVER TOUCH FILES I DIDN'T ASK ABOUT
   Only modify files directly related to the current task.
   If you think another file needs changing, stop and ask me first.

4. COMMIT AFTER EVERY TASK
   After completing each task, stage and commit the changes to git.
   Use a clear, plain-English commit message describing what changed and why.
   Always ask for my permission before committing.
   Example: "Ready to commit: 'Add past.html shell with chat layout'. Shall I go ahead?"

5. ASK BEFORE ARCHITECTURE DECISIONS
   If a task requires a decision that affects folders, file structure, or patterns,
   stop and ask me before proceeding.

6. REMIND ME WHERE WE ARE
   At the start of each task, briefly remind me which phase we are in
   and what we are building, so I always understand the bigger picture.

---

## Read these docs at the start of every session

Before doing any task, read all files in the docs/ folder.
These are the source of truth for APAL's rules, modes, and behaviour.
Do not rely on summaries — read the actual files.

Key docs to read:
- docs/apal-architecture.md   ← overall system design and principles
- docs/apal-roadmap.md        ← phases and what is already built
- docs/apal-rules.md          ← all guardrails, validation rules, premium logic
- docs/past-mode-spec.md      ← full PAST mode stage structure and spec
- docs/ui-spec.md             ← visual and interaction spec for PAST mode
- docs/ux-improvements.md    ← deferred UX ideas (do not build yet)


Only after reading these should you begin any task.

---

## What APAL is

APAL is a mobile-first web app that helps users manage social anxiety using CBT.

It is NOT a chatbot. It is a structured, stage-based CBT engine.
- Flow is always controlled by the app, never by AI
- AI is only used inside specific steps (not yet integrated)
- Sessions are structured: each session has a mode, stages, and collected data

---

## Current tech stack

- HTML, CSS, vanilla JavaScript (no frameworks)
- Supabase (auth already built and working)
- No AI integrated yet

---

## Folder structure

```
APAL/
├── index.html                        ← landing page
├── CLAUDE.md                         ← this file
├── pages/
│   ├── app/
│   │   └── past.html                 ← PAST mode session page (Phase 4 focus)
│   ├── auth/
│   │   ├── signup.html
│   │   ├── login.html
│   │   ├── confirm-email.html
│   │   └── auth-callback.html
│   └── simulation-environment/
│       └── past-simulation.html      ← engine test page (no UI)
├── js/
│   ├── app.js                        ← landing page JS
│   └── apal-js/
│       └── past/
│           ├── pastStages.js         ← all stage ID constants
│           ├── createPastSession.js  ← creates a session object
│           ├── pastFlow.js           ← decides next stage
│           ├── pastValidation.js     ← validates input before saving
│           ├── submitPastAnswer.js   ← saves answer + moves stage
│           └── pastUI.js             ← renders bubbles, connects UI to engine
├── css/
│   ├── style.css                     ← landing page styles only
│   └── app.css                       ← shared styles for all app pages
├── images/
└── docs/                             ← spec and architecture docs
    ├── apal-architecture.md
    ├── apal-roadmap.md
    ├── apal-rules.md
    ├── past-mode-spec.md
    ├── ui-spec.md
    └── designs/                      ← reference screenshots from Orchid
```

---

## APAL modes (planned)

- PAST → reflect on a past social situation (currently building)
- DURING → real-time guidance (later)
- FUTURE → prepare for upcoming situations (later)
- GENERAL → explore patterns (later)
- DEMO → showcase experience (later)
- REVIEW → reflect on saved entries (much later)

---

## Build phases

- Phase 1 — Engine definition ✅ DONE
- Phase 2 — Validation rules ✅ DONE
- Phase 3 — UI Shell ✅ DONE
- Phase 4 — PAST mode end-to-end ✅ DONE
- Phase 5 — Connect onboarding 👈 CURRENT FOCUS
- Phase 6 — Save to Supabase
- Phase 7 — Features (entries, tracker)
- Phase 8 — REVIEW mode
- Phase 9 — AI and premium depth

---

## Current focus: Phase 5 — Connect onboarding

We are building Phase 5 — Connect onboarding to APAL.

Phase 4 is complete. The full PAST mode flow works end-to-end.
Flow issues were fixed, the summary stage pauses correctly,
responses feel natural with a delay, and the back arrow works.

Phase 5 goals:
- Route users from onboarding into the correct APAL mode
- Pass onboarding context into the session object
- Connect the existing auth pages to the app flow

---

## Key rules for this project

- Structure controls everything. AI is a helper, not the driver.
- Use session objects to store data (already defined in createPastSession.js)
- Use stage IDs from pastStages.js — never hardcode stage names as strings
- Keep flow logic separate from UI
- Keep validation separate from flow
- Prefer simple solutions. No frameworks. No unnecessary complexity.
- Free and premium users share the same engine — only limits differ

---

## Engine quick reference

Starting a session:
  createPastSession(isPremium)  →  returns a session object

Submitting an answer:
  submitPastAnswer(session, answer)  →  returns { session, validation }

Checking validation:
  validation.valid     →  true or false
  validation.message   →  the message to show the user if invalid

Getting current stage:
  session.currentStage  →  a string like "situation" or "evidence_for"

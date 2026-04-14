# APAL Architecture

## What APAL is

APAL is a mobile-first web app that helps users manage social anxiety using structured CBT.

APAL is NOT a free chatbot.

APAL is:
- A structured CBT engine (flow controlled by the app)
- A session-based system
- AI-assisted in specific steps only

---

## Core Principles

1. Structure is controlled by the app
2. AI is used only inside selected steps
3. AI does NOT control:
   - stage order
   - branching
   - completion
   - premium logic
   - safety handling

---

## APAL Engine

APAL works as a session engine:

- Each interaction = 1 session
- Each session has:
  - a mode (past, during, future, etc)
  - a current stage
  - structured data
- Each mode has predefined stages

---

## APAL Modes

- PAST → reflect on a past situation
- DURING → guidance in real time
- FUTURE → prepare for situations
- GENERAL → explore patterns
- DEMO → showcase experience
- REVIEW → reflect on saved entries (built later)

---

## Onboarding

Onboarding is NOT separate from APAL.

Onboarding:
- collects initial context
- routes user into the real APAL engine

---

## AI Role

AI can:
- expand situation context
- clean thoughts
- generate suggestions
- summarize
- help create rational responses

AI cannot:
- control flow
- decide stages
- complete sessions
- handle safety decisions

---

## Premium Model

Premium is NOT a separate system.

Premium affects:
- character limits
- richness of AI suggestions
- access to extra thought reviews

Free and premium share the same core engine.

---

## Key System Design Rule

APAL = structured engine first  
AI = helper second
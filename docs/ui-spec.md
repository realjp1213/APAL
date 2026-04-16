# APAL UI Spec — PAST Mode

## Source designs
Reference images are in: docs/designs/
- past-mode-design.png          ← initial screen (situation stage)
- past-mode-design-complete.png ← full conversation flow + complete state

---

## Overview

APAL PAST mode is a single-page chat interface.
It looks and feels like a messaging app, but the flow is fully
controlled by the engine — not the user.

The tone is calm, minimal, and warm. Nothing flashy.
This is a safe space, not a productivity tool.

---

## Page layout

- Background: #FAFAFA (very light grey)
- Single column, centered
- Max width: 500px (mobile-first, works on desktop too)
- Three fixed zones:
  1. Header (top, fixed)
  2. Message area (scrollable, middle)
  3. Input bar (bottom, fixed)

---

## Zone 1 — Header

Fixed to top of screen.
Semi-transparent background with blur: rgba(250,250,250,0.85), backdrop-filter: blur

### Row 1 — Navigation bar
Height: 56px

- Left: back arrow icon (← ), grey, links back to previous page
- Center: text "APAL", font-weight 500, ~18px, dark grey #333333
- Right: empty space (same width as back button, for balance)

### Row 2 — Progress strip
Sits below the nav bar.
Only visible when session is active (not on complete stage).

- Left: stage label in small text — e.g. "Situation", "Evidence for"
  Font size: 12px, color: #999999
- Right: step counter — e.g. "Step 1 of 11"
  Font size: 12px, color: #999999
- Below both: thin progress bar
  Height: 3px
  Background track: #EEEEEE
  Filled portion: #F9A8A8 (soft rose)
  Fills left to right based on current stage
  Smooth transition animation when it advances

---

## Zone 2 — Message area

Scrollable. Starts below header, ends above input bar.
Padding: 24px top (extra to clear header), 24px bottom (to clear input bar).
Gap between messages: 20px.

Messages appear in order from top to bottom.
New messages appear at the bottom.
Page auto-scrolls to bottom when a new message is added.

### APAL message bubble

Alignment: left
Avatar: small brain emoji image, 28x28px, circular
  Positioned bottom-left of the bubble
  Sits outside the bubble to the left

Bubble style:
- Background: #FFF0F0 (very soft pink/rose)
- Border: 1px solid rgba(249, 168, 168, 0.3) (faint rose)
- Border radius: 20px, with bottom-left corner set to 4px (flattened)
- Padding: 14px 16px
- Max width: 85% of container
- Text color: #554444 (warm dark rose-grey)
- Font size: 15px
- Line height: 1.6
- Supports multi-line and line breaks (whitespace: pre-line)

### User message bubble

Alignment: right
No avatar.

Bubble style:
- Background: #EFEFEF (light grey)
- No border
- Border radius: 20px, with bottom-right corner set to 4px (flattened)
- Padding: 14px 16px
- Max width: 85% of container
- Text color: #444444
- Font size: 15px
- Line height: 1.6

### Option buttons (thought_select stage)

Shown inline inside the chat, below an APAL message.
Replaces the input bar during thought_select — user must tap an option.

Each button:
- Full width of the bubble area (same max-width as bubbles)
- Background: white
- Border: 1px solid #F9A8A8 (rose)
- Border radius: 16px
- Padding: 12px 16px
- Text color: #554444
- Font size: 14px
- Text aligned left
- Hover state: background #FFF5F5, border #F48A8A
- Stacked vertically, gap: 8px between buttons

When a button is tapped:
- It renders as a user message bubble (grey, right-aligned)
  showing the selected text
- The option buttons disappear
- APAL responds with the next message

### Typing indicator (future — not Phase 3)

Note: a small animated "..." indicator before APAL responds
can be added later. Skip for now.

---

## Zone 3 — Input bar

Fixed to bottom of screen.
Background: rgba(250,250,250,0.92), backdrop-filter: blur
Top border: 1px solid #EEEEEE
Padding: 12px 16px, plus extra bottom padding for mobile safe area (pb-safe)

### Default state (free text input)

Three elements in a horizontal row:

1. Plus button (left)
   - Circle, 40x40px
   - Background: #E5E5E5
   - Icon: + symbol, grey
   - Non-functional in Phase 3 (placeholder for future use)

2. Text input (center, flex: 1)
   - Background: #EDEDED
   - Border radius: 999px (pill shape)
   - Padding: 12px 20px
   - Font size: 15px
   - Placeholder text: "Message..."
   - Placeholder color: #AAAAAA
   - No visible border
   - Focus state: subtle rose ring (box-shadow: 0 0 0 2px rgba(249,168,168,0.4))
   - Pressing Enter submits the answer (same as tapping send)

3. Send button (right)
   - Circle, 40x40px
   - Background: #3BB9FF (blue) when input has text
   - Background: #3BB9FF at 40% opacity when input is empty (disabled state)
   - Icon: arrow pointing up ↑, white, strokeWidth heavy
   - Disabled when input is empty

### Hidden state (thought_select stage)

Entire input bar is hidden.
User must select one of the option buttons in the chat.

### Complete state

Input bar is replaced by a single full-width button:
- Text: "View my entries"
- Background: #F87171 (rose red)
- Hover: slightly darker rose
- Border radius: 999px (pill)
- Padding: 14px
- Text color: white
- Font size: 15px
- Full width of container

---

## Stage-by-stage UI behaviour

Each stage controls what the user sees and interacts with.

| Stage | Input type | Input visible |
|---|---|---|
| situation | free text | yes |
| avoidance | free text | yes |
| thought_input | free text | yes |
| thought_select | option buttons | NO — hidden |
| evidence_for | free text | yes |
| evidence_against | free text | yes |
| alternative_explanation | free text | yes |
| realistic_impact | free text | yes |
| rational_response | free text | yes |
| takeaway | free text | yes |
| close_rumination | free text | yes |
| save | none | NO |
| complete | none — show "View my entries" button | NO |

---

## APAL prompt text (per stage)

These are the exact messages APAL sends at each stage.

**situation**
"Hi. This is a space to reflect on something that happened recently.

What happened? Describe the situation briefly — where you were,
who was there, and what you were doing."

**avoidance**
"Did you avoid anything, or do anything to feel safer in that moment?
(e.g. staying quiet, avoiding eye contact, leaving early)"

**thought_input**
"What thoughts went through your mind? You can write up to 3 —
separate them with a full stop or comma."

**thought_select** (when multiple thoughts exist)
"You mentioned a few thoughts. Which one feels most prominent
right now — the one you'd most like to work on?"
→ followed by option buttons listing each thought

**thought auto-selected** (when only 1 thought)
"Got it. The thought we'll work on is:

"[thought text]"

[evidence_for prompt follows immediately]"

**evidence_for**
"Let's look at the thought you selected. What evidence supports it?
What made it feel true in that moment?"

**evidence_against**
"Now, what evidence goes against that thought?
Was there anything that contradicted it?"

**alternative_explanation**
"Is there another way to explain what happened —
one that's less harsh on yourself?"

**realistic_impact**
"If the worst did happen, how bad would it really be?
Could you handle it?"

**rational_response**
"Based on everything above, what's a more balanced or realistic
way to see this?"

**takeaway**
"What's one thing you're taking away from this reflection?"

**close_rumination**
"You've done the work. The goal now is to let this go rather than
keep replaying it. When you're ready, type anything to finish."

**complete**
"You've finished this reflection. It's been saved as an entry.

Well done for taking the time to look at this honestly."
→ Input bar replaced by "View my entries" button

---

## Validation error display

When the engine returns validation.valid = false:

- Do NOT add a new user message bubble
- Show APAL's validation message as a new APAL bubble
  (same pink style as normal APAL messages)
- Stay on the same stage
- Keep input active so user can try again
- Do not show a red error state or shake animation — keep it calm

Example:
User types: "   " (empty)
APAL responds: "Give me a quick summary of what happened, even if it's short."
Stage stays at: situation

---

## Colours (full reference)

| Name | Hex | Used for |
|---|---|---|
| Page background | #FAFAFA | whole page |
| APAL bubble | #FFF0F0 | APAL messages |
| APAL bubble border | rgba(249,168,168,0.3) | APAL message border |
| APAL text | #554444 | APAL message text |
| User bubble | #EFEFEF | user messages |
| User text | #444444 | user message text |
| Input background | #EDEDED | text input field |
| Send button | #3BB9FF | send button active |
| Progress bar fill | #F9A8A8 | progress bar |
| Option button border | #F9A8A8 | thought select buttons |
| Complete button | #F87171 | view entries button |
| Muted text | #999999 | stage label, step count |
| Page title | #333333 | "APAL" in header |

---

## Typography

Font: system-ui or Work Sans (already used in auth pages)
Base size: 15px
Line height: 1.6
Stage label / step count: 12px
Header title: 18px, weight 500

---

## Spacing

Header height (nav only): 56px
Header total (nav + progress strip): ~90px
Message area top padding: 100px (clears header)
Message area bottom padding: 100px (clears input bar)
Message gap: 20px
Input bar height: ~72px
Input bar bottom padding: 16px + safe area

---

## What is NOT in Phase 3

These are noted so Claude Code does not build them yet:

- AI suggestions or expansions (👑 features)
- Premium vs free UI differences
- Help icon ("?") on messages
- Typing indicator / loading animation
- Back navigation within a session
- Editing previous answers
- Saving to Supabase
- "View my entries" page (button exists but links nowhere yet)

# APAL Rules & Guardrails

## Input Handling

System must handle:

- Empty input
- Very short input
- Nonsense input
- Repeated input
- Skipped questions

---

## Off-Topic Handling

If user input is not related to social anxiety:
- redirect gently back to context
- do not fully engage unrelated topics

---

## Safety Handling

System must detect:

- Suicidal content
- Self-harm references
- Violent intent

When detected:
- stop normal flow
- provide safe response
- suggest external help if needed

---

## Scope Control

APAL is for social anxiety.

If user asks for:
- relationship advice
- general life advice
- unrelated problems

System should:
- redirect back to situation
- avoid becoming a general chatbot

---

## Thought vs Facts

System should guide user to:
- separate facts from assumptions
- avoid treating thoughts as reality

---

## Premium Rules

Free users:
- limited character input
- limited AI help
- no extra thought reviews

Premium users:
- extended inputs
- AI suggestions
- extra thought review loop

---

## UX Behavior

- Each message can include a help icon ("?")
- Help explains the question in simple terms

---

## Flow Control

System must manage:

- skipping questions
- going back
- editing answers (future feature)

------------------------------------------------------------------------------------


# PAST Mode Rules Spec

This document defines the rule system for PAST mode.

Each rule answers:
- What counts as that rule
- How it is checked
- When it is checked
- How APAL should respond
- Developer rule

---

## 1. Empty Input Rules

### What counts as empty input?
Empty input means:
- user submits nothing
- user submits only spaces
- user presses continue without typing
- user does not select an option when a choice is required

Examples:
- `""`
- `"   "`
- no button selected at `thought_select`
- no yes/no choice at `extra_thought_offer`

### How is it checked?
Checked with **JavaScript only**.

JS checks:
- trimmed text length is 0
- required selection is missing
- required yes/no answer is missing

### When is it checked?
Checked immediately when user submits an answer.

Stages where this applies:
- `situation`
- `avoidance`
- `thought_input`
- `thought_select`
- `evidence_for`
- `evidence_against`
- `alternative_explanation`
- `realistic_impact`
- `rational_response`
- `takeaway`
- `extra_thought_offer`

Notes:
- `summary`, `close_rumination`, `save`, and `complete` usually do not need typed input
- if a stage expects a button or choice, empty means no valid choice was made

### How should APAL respond?
APAL should:
- stay on the same stage
- not save the answer
- ask again with a short helpful prompt

Example response at `situation`:
> Give me a quick summary of what happened, even if it’s short.

Example response at `evidence_against`:
> Try writing one reason that the thought may not be fully true.

### Developer rule
- do not save empty input
- do not move to next stage
- return a validation message
- keep `session.currentStage` unchanged

---

## 2. Too Short / Too Vague Rules

### What counts as too short or too vague?
This means the answer is technically not empty, but it is too weak to move the session forward.

Examples:
- `bad`
- `awkward`
- `idk`
- `stuff happened`
- `nothing`
- `they were weird`
- `because yes`

For `situation`, a vague answer is one that does not describe what actually happened.
For `thought_input`, a vague answer is one that is not a clear thought.
For `alternative_explanation`, a vague answer is one that does not offer a realistic alternative.

### How is it checked?
Checked with **JavaScript first**, and **AI later when needed**.

JS checks:
- minimum length threshold
- minimum word count threshold
- blocked vague patterns like:
  - `idk`
  - `don't know`
  - `nothing`
  - `stuff`
  - `whatever`

AI checks later:
- whether the answer is meaningful enough for the current stage
- whether the answer actually addresses the question
- whether the answer is still too vague despite passing simple JS rules

### When is it checked?
Checked immediately after empty-input check.

Best stages for this rule:
- `situation`
- `avoidance`
- `thought_input`
- `evidence_for`
- `evidence_against`
- `alternative_explanation`
- `realistic_impact`
- `rational_response`
- `takeaway`

JS version is checked in Version 1.
AI version can be added later to these stages:
- `situation`
- `thought_input`
- `alternative_explanation`
- `rational_response`

### How should APAL respond?
APAL should:
- stay on the same stage
- ask a more guided version of the same question
- offer a short example if useful

Example response at `situation`:
> What actually happened in that moment? For example, who were you with, what happened, and what made it feel awkward?

Example response at `thought_input`:
> Try writing the actual thought in your mind, like: “They think I’m weird” or “I looked awkward.”

Example response at `alternative_explanation`:
> What is another normal explanation, besides the worst-case one?

### Developer rule
- do not advance stage
- usually do not save the answer
- show a guided retry message
- later, AI can classify borderline answers as `valid`, `too_vague`, or `needs_followup`

---

## 3. Nonsense / Invalid Input Rules

### What counts as nonsense or invalid input?
This means the input is unreadable, random, or clearly not a meaningful answer.

Examples:
- `asdfgh`
- `123123`
- `.....`
- random symbols only
- repeated gibberish
- keyboard smash
- answer format that does not match the stage

Examples by stage:
- `thought_select`: user submits text instead of choosing one option
- `extra_thought_offer`: user submits something other than yes/no
- `thought_input`: random symbols instead of thoughts

### How is it checked?
Checked with **JavaScript first**, and **AI only if needed later**.

JS checks:
- regex or simple pattern detection for keyboard smash
- symbols-only input
- numbers-only input
- invalid option selected
- invalid yes/no response
- repeated punctuation only

AI checks later:
- only if the input looks like language but still seems meaningless

### When is it checked?
Checked after empty-input and before stage progression.

Stages where this matters most:
- `thought_input`
- `thought_select`
- `extra_thought_offer`
- all typed text stages

### How should APAL respond?
APAL should:
- stay on the same stage
- say it could not understand the answer
- ask again in a simple way

Example response:
> I didn’t quite get that. Try answering in a short sentence.

Example response at `thought_select`:
> Pick one of the thoughts above so we can focus on it first.

Example response at `extra_thought_offer`:
> Choose yes or no so I know whether to review another thought.

### Developer rule
- do not save invalid input
- do not move to next stage
- show a retry message
- keep stage unchanged
- optional future improvement: count repeated invalid attempts

---

## 4. Off-Topic Input Rules

### What counts as off-topic input?
This means the answer is readable, but it does not match the current APAL stage or the purpose of PAST mode.

Examples:
- asking for dating advice during `evidence_against`
- talking about money problems in a social-anxiety session
- asking unrelated general questions
- switching into a different life topic with no connection to the current situation

Examples:
- `Should I text her again?`
- `I hate my job and my manager is unfair`
- `What should I invest in?`

### How is it checked?
Checked with **JavaScript first for obvious cases**, and **AI for subtle cases**.

JS checks:
- maybe simple keyword flags for clearly unrelated categories
- stage mismatch for button-based stages

AI checks:
- whether the answer actually responds to the stage question
- whether the input is outside the scope of social anxiety
- whether the input is related but not relevant enough to continue this stage

### When is it checked?
Best checked on meaning-heavy stages:
- `situation`
- `thought_input`
- `evidence_for`
- `evidence_against`
- `alternative_explanation`
- `realistic_impact`
- `rational_response`
- `takeaway`

This is mostly an **AI-later rule**, not a pure JS rule.

### How should APAL respond?
APAL should:
- stay on the same stage
- gently redirect back to the current task
- avoid becoming a general chatbot

Example response at `evidence_against`:
> Let’s stay with this situation for now. What evidence goes against the thought that they think you’re weird?

Example response at `situation`:
> Let’s focus on one social situation first. What happened in that moment?

### Developer rule
- do not advance stage
- usually do not save off-topic input into the stage field
- redirect to current stage prompt
- later AI can return categories like:
  - `on_topic`
  - `partly_on_topic`
  - `off_topic`

---

## 5. Safety / Crisis Rules

### What counts as safety or crisis input?
This includes:
- suicidal thoughts
- self-harm mentions
- violent intent
- threats toward self or others
- crisis language that suggests immediate risk

Examples:
- `I want to kill myself`
- `I want to hurt someone`
- `I don’t want to be here anymore`
- `I feel like ending it`

### How is it checked?
Checked with **JavaScript first**, and **AI later for better judgment**.

JS checks:
- keyword and phrase screening
- high-risk word list
- obvious harmful intent language

AI checks later:
- implied or indirect harmful intent
- unclear but concerning language
- context-sensitive risk review

### When is it checked?
Checked on **every typed input stage** before normal stage processing.

Stages:
- `situation`
- `avoidance`
- `thought_input`
- `evidence_for`
- `evidence_against`
- `alternative_explanation`
- `realistic_impact`
- `rational_response`
- `takeaway`

Safety check should happen early in the submit process.

### How should APAL respond?
APAL should:
- stop the normal PAST flow
- not continue the CBT question as normal
- show a supportive safe response
- encourage urgent real-world help if needed

Example response:
> I’m really sorry you’re going through this. If you might act on these thoughts or feel unsafe, contact local emergency services now or reach out to a crisis line or a trusted person nearby right away.

Important:
APAL should not continue the normal stage after a safety trigger.

### Developer rule
- pause or interrupt normal session progression
- do not continue to next CBT stage
- do not treat this like normal input
- later create a dedicated safety state or route
- JS handles obvious cases first
- AI can be used later for unclear cases

---

## 6. Free vs Premium Rules

### What counts as a free vs premium rule?
These rules control:
- character limits
- access to richer AI help
- access to extra thought review

Current agreed rules:
- Free users have character limits
- Premium users have unlimited characters
- Premium users get richer AI suggestions
- Premium users can review up to 2 extra thoughts

### How is it checked?
Checked with **JavaScript for access and limits**.
AI is not needed to decide plan access.

JS checks:
- whether `session.isPremium` is true or false
- input length against allowed limits
- whether premium-only features are being accessed

### When is it checked?
Checked:
- at session creation for feature access
- on every typed input stage for character limits
- at `close_rumination` and `extra_thought_offer` for premium extra-thought access

Character limit stages for free users:
- `situation`
- `thought_input`
- `avoidance`
- `evidence_for`
- `evidence_against`
- `alternative_explanation`
- `realistic_impact`
- `rational_response`
- `takeaway`

### How should APAL respond?
For over-limit free input:
- stay on the same stage
- show the character warning
- do not advance

Example response:
> Keep this short for now. You can use up to 250 characters here.

For premium-only extra thought review:
- free users should never be shown the extra review offer
- premium users can access it normally

### Developer rule
- use `session.isPremium` as the source of truth
- free and premium share the same engine
- only change:
  - input limits
  - AI help richness
  - extra thought review access
- do not create a separate premium flow
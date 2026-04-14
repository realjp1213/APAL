# PAST Mode Specification

## Overview

PAST mode helps users reflect on a past social situation using CBT principles.

Each session:
- focuses on ONE main thought
- can optionally review extra thoughts (premium only)

---

## Stage Structure

### Part 1 — Setup

1. situation (👑 “AI EXPANSION”. AI can ask more specific questions - easy and quick to answer - this will give better context and better outputs)
2. avoidance  (👑 - Based on context and situation - it auto-fills suggested options and registers it into sheet)
3. thought_input 🤖 (👑 - give suggestions/examples based on situation context)
4. thought_select 🤖 (if multiple thoughts)

---

### Part 2 — Main Thought Review

5. evidence_for 
6. evidence_against (👑 guidance)
7. alternative_explanation (👑 offers suggestions based on context)
8. realistic_impact  (👑 - based on context, AI can give suggestions)
9. summary 🤖
10. rational_response (👑 Insights available) 
11. takeaway (👑 generates options based on context, with a box to add any extra information)
12. close_rumination  

---

### Part 3 — Premium Extension 👑

13. extra_thought_offer  
14. extra_thought_review_loop  

---

### Part 4 — End

15. save  
16. complete  

---

## Core Logic

- User inputs 1 to 3 thoughts
- If 1 → automatically selected
- If more → user selects main thought
- Remaining thoughts become extra thoughts

---

## Main Thought Rule

Each session must have:
- ONE main thought

This is the only thought fully processed in the main flow.

---

## Premium Extra Thoughts

- Premium users can review up to 2 extra thoughts
- Maximum total thoughts per session = 3
- Extra thoughts:
  - do NOT restart session
  - only repeat the thought review block

---

## Thought Review Block

Each thought review includes:

- evidence_for  
- evidence_against  
- alternative_explanation  
- realistic_impact  
- rational_response  
- takeaway  

---

## Session Object Principles

- One session object per interaction
- Use named stage IDs (not numbers)
- Keep logic separate from UI
- Keep flow separate from content

---

## Data Structure

Main thought is stored in:
- mainThoughtReview

Extra thoughts are stored in:
- extraThoughts (list of thoughts)
- extraThoughtReviews (list of review objects)

---

## Premium vs Free

Free:
- limited characters
- no extra thought review
- limited AI help

Premium:
- unlimited characters
- AI suggestions available (marked as 👑)
- extra thought review enabled

---

## AI Usage

AI can help with:
- situation expansion
- thought cleanup
- suggestions
- summaries
- rational alternatives

AI does NOT:
- control flow
- change stage order
- control completion

---

## Close Rumination

Final stage helps user stop overthinking and move on.

---

## Save

Session is saved as an entry after completion.
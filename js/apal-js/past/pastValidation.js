// This file contains the basic JS-only validation rules for PAST mode.
// It checks simple things before the answer is saved or the stage moves forward.

// Basic safety phrases for first-pass screening
const SAFETY_KEYWORDS = [
  "kill myself",
  "suicide",
  "end my life",
  "hurt myself",
  "hurt someone",
  "want to die"
];

// Character limits for free users
const FREE_LIMITS = {
  situation: 250,
  thought_input: 150,
  default: 200
};

// Checks if input is empty
function isEmpty(input) {
  if (input === null || input === undefined) {
    return true;
  }

  if (typeof input !== "string") {
    return false;
  }

  return input.trim().length === 0;
}

// Returns the correct character limit for the current stage
function getCharacterLimit(stage) {
  if (stage === PAST_STAGES.SITUATION) {
    return FREE_LIMITS.situation;
  }

  if (stage === PAST_STAGES.THOUGHT_INPUT) {
    return FREE_LIMITS.thought_input;
  }

  return FREE_LIMITS.default;
}

// Checks if a free user's input is too long
function exceedsCharacterLimit(input, stage, isPremium) {
  if (isPremium) {
    return false;
  }

  if (typeof input !== "string") {
    return false;
  }

  const limit = getCharacterLimit(stage);
  return input.length > limit;
}

// Checks simple nonsense patterns
function isNonsense(input) {
  if (typeof input !== "string") {
    return false;
  }

  const trimmed = input.trim();

  // symbols only, no letters
  if (/^[^a-zA-Z]+$/.test(trimmed)) {
    return true;
  }

  // one repeated character only, like aaaaa or !!!!! or 11111
  if (/^(.)\1+$/.test(trimmed)) {
    return true;
  }

  return false;
}

// Checks simple yes/no answers
function isValidYesNo(input) {
  if (typeof input !== "string") {
    return false;
  }

  const value = input.trim().toLowerCase();
  return value === "yes" || value === "no";
}

// Checks if the selected thought exists in the available thought list
function isValidThoughtSelection(session, input) {
  return session.thoughts.items.includes(input);
}

// Checks for obvious safety risk language
function containsSafetyRisk(input) {
  if (typeof input !== "string") {
    return false;
  }

  const lower = input.toLowerCase();
  return SAFETY_KEYWORDS.some(keyword => lower.includes(keyword));
}

// Stage-specific nudge messages shown when the user submits empty input
const EMPTY_MESSAGES = {
  [PAST_STAGES.SITUATION]:               "Give me a quick summary of what happened, even if it's short.",
  [PAST_STAGES.AVOIDANCE]:               "Did you stay quiet, leave early, or do anything else to feel safer? Even a small thing counts.",
  [PAST_STAGES.THOUGHT_INPUT]:           "Try writing the actual thought in your mind, like: \"They think I'm weird\" or \"I looked awkward.\"",
  [PAST_STAGES.EVIDENCE_FOR]:            "What made that thought feel true in that moment? Even one small thing is fine.",
  [PAST_STAGES.EVIDENCE_AGAINST]:        "Try writing one reason that the thought may not be fully true.",
  [PAST_STAGES.ALTERNATIVE_EXPLANATION]: "What is another normal explanation, besides the worst-case one?",
  [PAST_STAGES.REALISTIC_IMPACT]:        "Even if the worst happened — how bad would it really be? Try to answer honestly.",
  [PAST_STAGES.RATIONAL_RESPONSE]:       "Based on everything above, what's a more balanced way to see this? Even one sentence helps.",
  [PAST_STAGES.TAKEAWAY]:                "What's one small thing you're taking away from this? It doesn't have to be perfect.",
  [PAST_STAGES.CLOSE_RUMINATION]:        "Type anything when you're ready to finish — even just \"done\"."
};

// Main validation function
function validatePastInput(session, answer) {
  const stage = session.currentStage;

  // Special case: extra thought review currently expects an object
  if (stage === PAST_STAGES.EXTRA_THOUGHT_REVIEW) {
    return { valid: true };
  }

  // 1. Empty input
  if (isEmpty(answer)) {
    const message = EMPTY_MESSAGES[stage] || "Please add an answer before continuing.";
    return {
      valid: false,
      reason: "empty",
      message
    };
  }

  // 2. Safety
  if (containsSafetyRisk(answer)) {
    return {
      valid: false,
      reason: "safety",
      message: "I’m sorry you’re going through this. If you feel unsafe, contact emergency services or a crisis line right away."
    };
  }

  // 3. Character limits for free users
  if (exceedsCharacterLimit(answer, stage, session.isPremium)) {
    return {
      valid: false,
      reason: "too_long",
      message: `Keep this shorter for now. This stage allows up to ${getCharacterLimit(stage)} characters for free users.`
    };
  }

  // 4. Nonsense
  if (isNonsense(answer)) {
    return {
      valid: false,
      reason: "nonsense",
      message: "I didn’t quite get that. Try answering in a short sentence."
    };
  }

  // 5. Stage-specific checks
  if (stage === PAST_STAGES.EXTRA_THOUGHT_OFFER && !isValidYesNo(answer)) {
    return {
      valid: false,
      reason: "invalid_yes_no",
      message: "Please answer yes or no."
    };
  }

  if (stage === PAST_STAGES.THOUGHT_SELECT && !isValidThoughtSelection(session, answer)) {
    return {
      valid: false,
      reason: "invalid_thought_selection",
      message: "Pick one of the thoughts shown so we can focus on it first."
    };
  }

  return {
    valid: true,
    reason: null,
    message: null
  };
}


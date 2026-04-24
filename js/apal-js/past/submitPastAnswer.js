// This file handles user answers in PAST mode.
// It saves the answer into the correct part of the session,
// then moves the session to the next stage.

/**
 * Splits the user's thought input into a list of thoughts.
 * Example:
 * "They think I'm weird. I looked awkward."
 * becomes:
 * ["They think I'm weird", "I looked awkward"]
 */
function parseThoughtInput(rawInput) {
  if (!rawInput) {
    return [];
  }

  return rawInput
    .split(/[.,]/)
    .map(thought => thought.trim())
    .filter(thought => thought.length > 0)
    .slice(0, 3); // limit to max 3 thoughts
}

/**
 * Creates an empty review object for an extra thought.
 * This keeps the structure consistent with the main thought review.
 */
function createEmptyThoughtReview(thought) {
  return {
    thought: thought || "",
    evidenceFor: "",
    evidenceAgainst: "",
    alternativeExplanation: "",
    realisticImpact: "",
    copingResponse: "",
    summary: "",
    rationalResponse: "",
    takeaway: ""
  };
}

/**
 * Finds the current extra thought being reviewed.
 * This is based on how many extra reviews already exist.
 */
function getCurrentExtraThought(session) {
  const currentIndex = session.extraThoughtReviews.length;

  if (!session.extraThoughts || currentIndex >= session.extraThoughts.length) {
    return null;
  }

  return session.extraThoughts[currentIndex];
}

/**
 * Saves the user's answer into the correct place in the session,
 * based on the current stage.
 */
function savePastAnswer(session, answer) {
  switch (session.currentStage) {
    case PAST_STAGES.SITUATION:
      session.situation.raw = answer;
      break;

    case PAST_STAGES.AVOIDANCE:
      // For now, keep avoidance simple and store as text.
      session.avoidance.details = answer;
      break;

    case PAST_STAGES.THOUGHT_INPUT: {
      session.thoughts.rawInput = answer;
      session.thoughts.items = parseThoughtInput(answer);

      // If user entered exactly one thought, make it the selected thought now.
      if (session.thoughts.items.length === 1) {
        session.selectedThought = session.thoughts.items[0];
        session.mainThoughtReview.thought = session.thoughts.items[0];
      }

      break;
    }

    case PAST_STAGES.THOUGHT_SELECT: {
      session.selectedThought = answer;
      session.mainThoughtReview.thought = answer;

      // Store the remaining thoughts as extra thoughts
      session.extraThoughts = session.thoughts.items.filter(
        thought => thought !== answer
      );

      break;
    }

    case PAST_STAGES.EVIDENCE_FOR:
      session.mainThoughtReview.evidenceFor = answer;
      break;

    case PAST_STAGES.EVIDENCE_AGAINST:
      session.mainThoughtReview.evidenceAgainst = answer;
      break;

    case PAST_STAGES.ALTERNATIVE_EXPLANATION:
      session.mainThoughtReview.alternativeExplanation = answer;
      break;

    case PAST_STAGES.REALISTIC_IMPACT:
      session.mainThoughtReview.realisticImpact = answer;
      break;

    case PAST_STAGES.SUMMARY:
      // Usually this stage is generated/displayed rather than typed by the user.
      // We leave it here in case you later want to store or edit summary text.
      session.mainThoughtReview.summary = answer || session.mainThoughtReview.summary;
      break;

    case PAST_STAGES.RATIONAL_RESPONSE:
      session.mainThoughtReview.rationalResponse = answer;
      break;

    case PAST_STAGES.TAKEAWAY:
      session.mainThoughtReview.takeaway = answer;
      break;

    case PAST_STAGES.EXTRA_THOUGHT_OFFER:
      session.extraThoughtOfferAccepted = answer === true || answer === "yes";
      break;

    case PAST_STAGES.EXTRA_THOUGHT_REVIEW: {
      const currentExtraThought = getCurrentExtraThought(session);

      if (!currentExtraThought) {
        break;
      }

      // For now, answer should be an object with the extra thought review fields.
      session.extraThoughtReviews.push({
        thought: currentExtraThought,
        evidenceFor: answer.evidenceFor || "",
        evidenceAgainst: answer.evidenceAgainst || "",
        alternativeExplanation: answer.alternativeExplanation || "",
        realisticImpact: answer.realisticImpact || "",
        copingResponse: answer.copingResponse || "",
        summary: answer.summary || "",
        rationalResponse: answer.rationalResponse || "",
        takeaway: answer.takeaway || ""
      });

      break;
    }

    default:
      break;
  }

  return session;
}

/**
 * Main handler for a PAST mode answer.
 * 1. Save the answer
 * 2. Move to the next stage
 * 3. Return the updated session
 */
function submitPastAnswer(session, answer) {
  const validation = validatePastInput(session, answer);

  // If invalid, do not save or move forward
  if (!validation.valid) {
    return {
      session,
      validation
    };
  }

  savePastAnswer(session, answer);
  goToNextPastStage(session);

  return {
    session,
    validation
  };
}

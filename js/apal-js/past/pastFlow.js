// This file will contain the flow logic for PAST mode.
// It will decide what the next stage should be after each answer.

/**
 * Checks whether the user can still review another extra thought.
 * Premium users can review up to 2 extra thoughts.
 */
function canReviewAnotherExtraThought(session) {
  if (!session.isPremium) {
    return false;
  }

  if (!session.extraThoughts || session.extraThoughts.length === 0) {
    return false;
  }

  if (session.extraThoughtReviews.length >= 2) {
    return false;
  }

  // There must still be at least one extra thought left that has not been reviewed.
  return session.extraThoughtReviews.length < session.extraThoughts.length;
}

/**
 * Returns the next stage for the current session.
 * This function does NOT change the session by itself.
 * It only decides where the user should go next.
 */
function getNextPastStage(session) {
  switch (session.currentStage) {
    case PAST_STAGES.SITUATION:
      return PAST_STAGES.AVOIDANCE;

    case PAST_STAGES.AVOIDANCE:
      return PAST_STAGES.THOUGHT_INPUT;

    case PAST_STAGES.THOUGHT_INPUT:
      // If user entered more than one thought, let them select the main one.
      if (session.thoughts.items.length > 1) {
        return PAST_STAGES.THOUGHT_SELECT;
      }

      // If there is only one thought, skip thought selection.
      return PAST_STAGES.EVIDENCE_FOR;

    case PAST_STAGES.THOUGHT_SELECT:
      return PAST_STAGES.EVIDENCE_FOR;

    case PAST_STAGES.EVIDENCE_FOR:
      return PAST_STAGES.EVIDENCE_AGAINST;

    case PAST_STAGES.EVIDENCE_AGAINST:
      return PAST_STAGES.ALTERNATIVE_EXPLANATION;

    case PAST_STAGES.ALTERNATIVE_EXPLANATION:
      return PAST_STAGES.REALISTIC_IMPACT;

    case PAST_STAGES.REALISTIC_IMPACT:
      return PAST_STAGES.SUMMARY;

    case PAST_STAGES.SUMMARY:
      return PAST_STAGES.RATIONAL_RESPONSE;

    case PAST_STAGES.RATIONAL_RESPONSE:
      return PAST_STAGES.TAKEAWAY;

    case PAST_STAGES.TAKEAWAY:
      return PAST_STAGES.CLOSE_RUMINATION;

    case PAST_STAGES.CLOSE_RUMINATION:
      // After the main thought is done, premium users may review extra thoughts.
      if (canReviewAnotherExtraThought(session)) {
        return PAST_STAGES.EXTRA_THOUGHT_OFFER;
      }

      return PAST_STAGES.SAVE;

    case PAST_STAGES.EXTRA_THOUGHT_OFFER:
      // This stage depends on whether the user accepted the extra review.
      // The UI or submit handler should store that answer before calling this.
      if (session.extraThoughtOfferAccepted === true) {
        return PAST_STAGES.EXTRA_THOUGHT_REVIEW;
      }

      return PAST_STAGES.SAVE;

    case PAST_STAGES.EXTRA_THOUGHT_REVIEW:
      // After reviewing one extra thought, check if another is still available.
      if (canReviewAnotherExtraThought(session)) {
        return PAST_STAGES.EXTRA_THOUGHT_OFFER;
      }

      return PAST_STAGES.SAVE;

    case PAST_STAGES.SAVE:
      return PAST_STAGES.COMPLETE;

    case PAST_STAGES.COMPLETE:
      return PAST_STAGES.COMPLETE;

    default:
      return PAST_STAGES.SITUATION;
  }
}

/**
 * Moves the session to the next stage.
 * This DOES change the session object.
 */
function goToNextPastStage(session) {
  const nextStage = getNextPastStage(session);
  session.currentStage = nextStage;

  if (nextStage === PAST_STAGES.COMPLETE) {
    session.status = "complete";
    session.meta.completedAt = new Date().toISOString();
  }

  return session;
}
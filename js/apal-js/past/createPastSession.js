// Creates a fresh PAST mode session.
// A session is one full APAL interaction from start to finish.
function createPastSession(isPremium = false) {
  return {
    // Unique session ID
    id: Date.now().toString(),

    // APAL mode for this session
    mode: "past",

    // The first stage shown when the session starts
    currentStage: PAST_STAGES.SITUATION,

    // Session state
    status: "active",

    // Premium affects limits and extra thought review and AI suggestions
    isPremium: isPremium,

    // Situation data
    situation: {
      raw: "",
      expanded: ""
    },

    // Avoidance data
    avoidance: {
      didAvoid: null,
      details: ""
    },

    // Automatic thoughts entered by user
    thoughts: {
      rawInput: "",
      items: []
    },

    // Main thought chosen for review
    selectedThought: "",
    // Remaining thoughts that may be reviewed later
    extraThoughts: [],
    
    // Stores whether the user accepted reviewing another extra thought
    extraThoughtOfferAccepted: null,

    // Remaining thoughts that may be reviewed later
    mainThoughtReview: {
      thought: "",
      evidenceFor: "",
      evidenceAgainst: "",
      alternativeExplanation: "",
      realisticImpact: "",
      copingResponse: "",
      summary: "",
      rationalResponse: "",
      takeaway: ""
    },

    // Premium extra thought reviews are stored here
    extraThoughtReviews: [],

    // Metadata about the session
    meta: {
      startedAt: new Date().toISOString(),
      completedAt: null
    }
  };
}
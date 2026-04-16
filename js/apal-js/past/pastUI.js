// ── DOM references ───────────────────────────────────────────────────────
// These lines find the HTML elements we need to read or change.
const messageArea  = document.getElementById('messageArea');
const messageInput = document.getElementById('messageInput');
const sendBtn      = document.getElementById('sendBtn');
const inputBar     = document.getElementById('inputBar');
const stageLabel   = document.querySelector('.stage-label');
const stepCount    = document.querySelector('.step-count');
const progressFill = document.querySelector('.progress-fill');

const AVATAR_PATH = '../../images/logo.png';
const TOTAL_STEPS = 11;

// ── Stage prompts ────────────────────────────────────────────────────────
// Maps each stage ID to the exact message APAL shows when that stage begins.
// Using PAST_STAGES constants (from pastStages.js) — never raw strings.
const STAGE_PROMPTS = {
  [PAST_STAGES.SITUATION]:
    "Hi. This is a space to reflect on something that happened recently.\n\nWhat happened? Describe the situation briefly — where you were, who was there, and what you were doing.",
  [PAST_STAGES.AVOIDANCE]:
    "Did you avoid anything, or do anything to feel safer in that moment?\n(e.g. staying quiet, avoiding eye contact, leaving early)",
  [PAST_STAGES.THOUGHT_INPUT]:
    "What thoughts went through your mind? You can write up to 3 —\nseparate them with a full stop.",
  [PAST_STAGES.THOUGHT_SELECT]:
    "You mentioned a few thoughts. Which one feels most prominent right now — the one you'd most like to work on?",
  [PAST_STAGES.EVIDENCE_FOR]:
    "Let's look at the thought you selected. What evidence supports it?\nWhat made it feel true in that moment?",
  [PAST_STAGES.EVIDENCE_AGAINST]:
    "Now, what evidence goes against that thought?\nWas there anything that contradicted it?",
  [PAST_STAGES.ALTERNATIVE_EXPLANATION]:
    "Is there another way to explain what happened —\none that's less harsh on yourself?",
  [PAST_STAGES.REALISTIC_IMPACT]:
    "If the worst did happen, how bad would it really be?\nCould you handle it?",
  [PAST_STAGES.RATIONAL_RESPONSE]:
    "Based on everything above, what's a more balanced or realistic\nway to see this?",
  [PAST_STAGES.TAKEAWAY]:
    "What's one thing you're taking away from this reflection?",
  [PAST_STAGES.CLOSE_RUMINATION]:
    "You've done the work. The goal now is to let this go rather than keep replaying it. When you're ready, type anything to finish.",
  [PAST_STAGES.COMPLETE]:
    "You've finished this reflection. It's been saved as an entry.\n\nWell done for taking the time to look at this honestly."
};

// ── Stage metadata ───────────────────────────────────────────────────────
// Maps each stage to a human-readable label and step number for the progress strip.
const STAGE_META = {
  [PAST_STAGES.SITUATION]:               { label: "Situation",         step: 1  },
  [PAST_STAGES.AVOIDANCE]:               { label: "Avoidance",         step: 2  },
  [PAST_STAGES.THOUGHT_INPUT]:           { label: "Thoughts",          step: 3  },
  [PAST_STAGES.THOUGHT_SELECT]:          { label: "Thoughts",          step: 3  },
  [PAST_STAGES.EVIDENCE_FOR]:            { label: "Evidence for",      step: 4  },
  [PAST_STAGES.EVIDENCE_AGAINST]:        { label: "Evidence against",  step: 5  },
  [PAST_STAGES.ALTERNATIVE_EXPLANATION]: { label: "Alternative",       step: 6  },
  [PAST_STAGES.REALISTIC_IMPACT]:        { label: "Realistic impact",  step: 7  },
  [PAST_STAGES.SUMMARY]:                 { label: "Summary",           step: 8  },
  [PAST_STAGES.RATIONAL_RESPONSE]:       { label: "Rational response", step: 9  },
  [PAST_STAGES.TAKEAWAY]:                { label: "Takeaway",          step: 10 },
  [PAST_STAGES.CLOSE_RUMINATION]:        { label: "Closing",           step: 11 },
  [PAST_STAGES.SAVE]:                    { label: "Closing",           step: 11 },
  [PAST_STAGES.COMPLETE]:                { label: "Complete",          step: 11 }
};

// ── Session state ────────────────────────────────────────────────────────
// Create a fresh session when the page loads.
// false = free user. This will be driven by real auth in a later phase.
let session = createPastSession(false);

// ── Bubble rendering ─────────────────────────────────────────────────────

function addApalMessage(text) {
  const row = document.createElement('div');
  row.className = 'message-row message-row--apal';

  const avatar = document.createElement('img');
  avatar.className = 'apal-avatar';
  avatar.src = AVATAR_PATH;
  avatar.alt = 'APAL';

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble--apal';
  bubble.textContent = text;

  row.appendChild(avatar);
  row.appendChild(bubble);
  messageArea.appendChild(row);
  messageArea.scrollTop = messageArea.scrollHeight;
}

function addUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'message-row message-row--user';

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble--user';
  bubble.textContent = text;

  row.appendChild(bubble);
  messageArea.appendChild(row);
  messageArea.scrollTop = messageArea.scrollHeight;
}

function addOptionButtons(options, onSelect) {
  const container = document.createElement('div');
  container.className = 'option-buttons';

  options.forEach(function(optionText) {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = optionText;
    btn.addEventListener('click', function() {
      container.remove();
      onSelect(optionText);
    });
    container.appendChild(btn);
  });

  messageArea.appendChild(container);
  messageArea.scrollTop = messageArea.scrollHeight;
}

// ── Progress bar ─────────────────────────────────────────────────────────

function updateProgress(stage) {
  const meta = STAGE_META[stage];
  if (!meta) return;
  stageLabel.textContent = meta.label;
  stepCount.textContent  = 'Step ' + meta.step + ' of ' + TOTAL_STEPS;
  progressFill.style.width = ((meta.step / TOTAL_STEPS) * 100) + '%';
}

// ── Input bar helpers ────────────────────────────────────────────────────

function showInputBar() {
  inputBar.style.display = 'flex';
}

function hideInputBar() {
  inputBar.style.display = 'none';
}

// Replaces the entire input bar with a single "View my entries" button
function showCompleteButton() {
  inputBar.innerHTML = '<button class="complete-btn">View my entries</button>';
  inputBar.style.display = 'flex';
}

// ── Stage display ────────────────────────────────────────────────────────
// Called every time the session moves to a new stage.
// Decides what to show based on which stage we've arrived at.

function showStage(stage) {
  updateProgress(stage);

  // thought_select: hide the text input, show tappable thought buttons instead
  if (stage === PAST_STAGES.THOUGHT_SELECT) {
    addApalMessage(STAGE_PROMPTS[PAST_STAGES.THOUGHT_SELECT]);
    hideInputBar();
    addOptionButtons(session.thoughts.items, function(selected) {
      addUserMessage(selected);
      showInputBar();
      const result = submitPastAnswer(session, selected);
      session = result.session;
      showStage(session.currentStage);
    });
    return;
  }

  // summary: no AI yet — build a brief text summary and auto-advance
  if (stage === PAST_STAGES.SUMMARY) {
    const summaryText =
      'Here\'s what you\'ve worked through so far:\n\n' +
      'Thought: "' + session.selectedThought + '"\n\n' +
      'Evidence for it: ' + session.mainThoughtReview.evidenceFor + '\n\n' +
      'Evidence against it: ' + session.mainThoughtReview.evidenceAgainst;
    addApalMessage(summaryText);
    goToNextPastStage(session);
    showStage(session.currentStage);
    return;
  }

  // save: no user action needed — Supabase saving comes in Phase 6
  if (stage === PAST_STAGES.SAVE) {
    goToNextPastStage(session);
    showStage(session.currentStage);
    return;
  }

  // complete: show final message and replace input bar with button
  if (stage === PAST_STAGES.COMPLETE) {
    addApalMessage(STAGE_PROMPTS[PAST_STAGES.COMPLETE]);
    showCompleteButton();
    return;
  }

  // evidence_for when only one thought was entered (thought_select was skipped):
  // show a confirmation before the evidence prompt so the user knows which thought we're working on
  if (stage === PAST_STAGES.EVIDENCE_FOR && session.thoughts.items.length === 1) {
    addApalMessage('Got it. The thought we\'ll work on is:\n\n"' + session.selectedThought + '"');
  }

  // Default: show this stage's prompt and wait for the user to type
  if (STAGE_PROMPTS[stage]) {
    addApalMessage(STAGE_PROMPTS[stage]);
  }
}

// ── Submit handler ───────────────────────────────────────────────────────
// Runs when the user presses send or hits Enter.

function handleSubmit() {
  const text = messageInput.value.trim();
  if (!text) return;

  addUserMessage(text);
  messageInput.value = '';
  sendBtn.disabled = true;

  const result = submitPastAnswer(session, text);
  session = result.session;

  if (!result.validation.valid) {
    // Show APAL's validation message and stay on the same stage
    addApalMessage(result.validation.message);
    return;
  }

  showStage(session.currentStage);
}

// ── Event listeners ──────────────────────────────────────────────────────

// Enable the send button only when the input has text
messageInput.addEventListener('input', function() {
  sendBtn.disabled = messageInput.value.trim().length === 0;
});

// Enter key submits (Shift+Enter is left free for future multi-line use)
messageInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
});

sendBtn.addEventListener('click', handleSubmit);

// ── Start the session ────────────────────────────────────────────────────
// This runs once when the page loads and shows the first APAL message.
showStage(session.currentStage);

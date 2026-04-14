const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");
const menuOverlay = document.getElementById("menuOverlay");
const menuCloseBtn = document.getElementById("menuCloseBtn");
const firstMenuLink = document.getElementById("firstMenuLink");
const hero = document.getElementById("hero");
const challengeThoughtBtn = document.getElementById("challengeThoughtBtn");
const menuLinks = document.querySelectorAll(".menu-list a");

console.log("app.js loaded");

function openMenu() {
  menuPanel.classList.add("is-open");
  menuOverlay.classList.add("is-visible");
  document.body.classList.add("menu-open");
  menuBtn.setAttribute("aria-expanded", "true");
  firstMenuLink.focus();
}

function closeMenu(options) {
  const shouldRestoreFocus = !options || options.restoreFocus !== false;

  menuPanel.classList.remove("is-open");
  menuOverlay.classList.remove("is-visible");
  document.body.classList.remove("menu-open");
  menuBtn.setAttribute("aria-expanded", "false");

  if (shouldRestoreFocus) {
    menuBtn.focus();
  }
}

if (menuBtn && menuPanel && menuOverlay && menuCloseBtn && firstMenuLink) {
  menuBtn.addEventListener("click", function () {
    const isOpen = menuPanel.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuOverlay.addEventListener("click", closeMenu);
  menuCloseBtn.addEventListener("click", closeMenu);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu({ restoreFocus: false });
    });
  });
}

if (challengeThoughtBtn && hero) {
  challengeThoughtBtn.addEventListener("click", function () {
    hero.classList.remove("hero-state-1");
    hero.classList.add("hero-state-2");
  });
}

/* Story carousel */

const storyPrevBtn = document.getElementById("storyPrevBtn");
const storyNextBtn = document.getElementById("storyNextBtn");
const storyViewport = document.querySelector(".story-viewport");
const sequenceOptions = document.querySelectorAll(".story-sequence-option");
const sequencePanels = document.querySelectorAll(".story-sequence");
const storySequenceCta = document.getElementById("storySequenceCta");
const storyNextSequenceBtn = document.getElementById("storyNextSequenceBtn");
const storyCarousel = document.getElementById("story-carousel");

if (
  storyPrevBtn &&
  storyNextBtn &&
  storyViewport &&
  sequenceOptions.length > 0 &&
  sequencePanels.length > 0 &&
  storySequenceCta &&
  storyNextSequenceBtn &&
  storyCarousel
) {
  const storyCtaTitle = storySequenceCta.querySelector(".story-cta-title");
  const storyCtaText = storySequenceCta.querySelector(".story-cta-text");

  const storySequences = {
    before: {
      panelId: "storySequenceBefore",
      label: "Before social moments",
      nextLabel: "Check APAL during social moments",
      nextSequence: "during",
      ctaTitle: "Ready to use APAL before real moments?",
      ctaText: "Start using APAL before social situations feel too overwhelming."
    },
    during: {
      panelId: "storySequenceDuring",
      label: "During social moments",
      nextLabel: "Check APAL after social moments",
      nextSequence: "after",
      ctaTitle: "Ready to use APAL during real moments?",
      ctaText: "Use grounding and CBT tools while the moment is still happening."
    },
    after: {
      panelId: "storySequenceAfter",
      label: "After social moments",
      nextLabel: "",
      nextSequence: null,
      ctaTitle: "Ready to use APAL in real moments?",
      ctaText: "Reflect, challenge anxious thoughts, and move forward with more clarity."
    }
  };

  let activeSequence = "before";
  let currentSequenceSlide = 0;

  const completedSequences = {
    before: false,
    during: false,
    after: false
  };

  function getActivePanel() {
    return document.getElementById(storySequences[activeSequence].panelId);
  }

  function getActiveTrack() {
    const activePanel = getActivePanel();
    return activePanel.querySelector(".story-track");
  }

  function getActiveSlides() {
    const activePanel = getActivePanel();
    return activePanel.querySelectorAll(".story-slide");
  }

  function updateSequencePicker() {
    sequenceOptions.forEach(function (option) {
      const optionSequence = option.dataset.sequence;
      const isActive = optionSequence === activeSequence;

      option.classList.toggle("is-active", isActive);
      option.classList.toggle("is-complete", completedSequences[optionSequence]);
      option.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateStoryArrows() {
    const activeSlides = getActiveSlides();

    if (currentSequenceSlide === 0) {
      storyPrevBtn.classList.add("is-disabled");
    } else {
      storyPrevBtn.classList.remove("is-disabled");
    }

    if (currentSequenceSlide === activeSlides.length - 1) {
      storyNextBtn.classList.add("is-disabled");
    } else {
      storyNextBtn.classList.remove("is-disabled");
    }
  }

  function updateStoryCta() {
    const sequenceConfig = storySequences[activeSequence];
    const activeSlides = getActiveSlides();
    const isLastSlide = currentSequenceSlide === activeSlides.length - 1;

    storyCtaTitle.textContent = sequenceConfig.ctaTitle;
    storyCtaText.textContent = sequenceConfig.ctaText;

    storySequenceCta.classList.toggle("is-visible", isLastSlide);

    if (isLastSlide && sequenceConfig.nextSequence) {
      storyNextSequenceBtn.style.display = "inline-block";
      storyNextSequenceBtn.textContent = sequenceConfig.nextLabel;
    } else {
      storyNextSequenceBtn.style.display = "none";
    }
  }

  function updateStoryCarousel() {
    sequencePanels.forEach(function (panel) {
      const isActivePanel = panel.dataset.sequencePanel === activeSequence;
      panel.classList.toggle("is-active", isActivePanel);
    });

    const activeTrack = getActiveTrack();
    activeTrack.style.transform = `translateX(-${currentSequenceSlide * 100}%)`;

    updateSequencePicker();
    updateStoryArrows();
    updateStoryCta();
  }

  function markSequenceAsComplete(sequenceName) {
    completedSequences[sequenceName] = true;
  }

  function goToSequence(sequenceName) {
    activeSequence = sequenceName;
    currentSequenceSlide = 0;
    updateStoryCarousel();
  }

  function goToNextStorySlide() {
    const activeSlides = getActiveSlides();

    if (currentSequenceSlide < activeSlides.length - 1) {
      currentSequenceSlide++;
    }

    if (currentSequenceSlide === activeSlides.length - 1) {
      markSequenceAsComplete(activeSequence);
    }

    updateStoryCarousel();
  }

  function goToPrevStorySlide() {
    if (currentSequenceSlide > 0) {
      currentSequenceSlide--;
      updateStoryCarousel();
    }
  }

  function scrollToCarousel() {
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    const extraSpacing = 16;

    const carouselTop = storyCarousel.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: carouselTop - headerHeight - extraSpacing,
      behavior: "smooth"
    });
  }

  sequenceOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      const selectedSequence = option.dataset.sequence;
      goToSequence(selectedSequence);
      scrollToCarousel();
    });
  });

  storyNextBtn.addEventListener("click", goToNextStorySlide);
  storyPrevBtn.addEventListener("click", goToPrevStorySlide);

  storyNextSequenceBtn.addEventListener("click", function () {
    const nextSequence = storySequences[activeSequence].nextSequence;

    if (nextSequence) {
      goToSequence(nextSequence);
      scrollToCarousel();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  storyViewport.addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].clientX;
  });

  storyViewport.addEventListener("touchend", function (event) {
    touchEndX = event.changedTouches[0].clientX;
    handleStorySwipe();
  });

  function handleStorySwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const swipeThreshold = 50;

    if (swipeDistance < -swipeThreshold) {
      goToNextStorySlide();
    }

    if (swipeDistance > swipeThreshold) {
      goToPrevStorySlide();
    }
  }

  updateStoryCarousel();
}

/* FAQ accordion */

const faqItems = document.querySelectorAll(".faq-item");
const faqQuestions = document.querySelectorAll(".faq-question");

if (faqItems.length > 0 && faqQuestions.length > 0) {
  faqQuestions.forEach(function (questionButton) {
    questionButton.addEventListener("click", function () {
      const currentItem = questionButton.closest(".faq-item");
      const isOpen = currentItem.classList.contains("is-open");

      faqItems.forEach(function (item) {
        item.classList.remove("is-open");
      });

      if (!isOpen) {
        currentItem.classList.add("is-open");
      }
    });
  });
}

/* Contact form */

const contactForm = document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");
const contactFormStatus = document.getElementById("contactFormStatus");

if (contactForm && contactSubmitBtn && contactFormStatus) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const originalButtonText = contactSubmitBtn.textContent;

    contactSubmitBtn.textContent = "Sending...";
    contactSubmitBtn.disabled = true;

    contactFormStatus.textContent = "";
    contactFormStatus.classList.remove("is-success", "is-error");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        contactFormStatus.textContent = "Thanks — your message has been sent.";
        contactFormStatus.classList.add("is-success");
        contactForm.reset();
      } else {
        contactFormStatus.textContent =
          result.message || "Something went wrong. Please try again.";
        contactFormStatus.classList.add("is-error");
      }
    } catch (error) {
      contactFormStatus.textContent = "Something went wrong. Please try again.";
      contactFormStatus.classList.add("is-error");
    } finally {
      contactSubmitBtn.textContent = originalButtonText;
      contactSubmitBtn.disabled = false;
    }
  });
}
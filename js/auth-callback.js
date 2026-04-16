const supabaseUrl = "https://yheeuynijsdlmnuopvbl.supabase.co";
const supabaseKey = "sb_publishable_6AmnKbTcF-0h40TE2RwUsQ_j9IvJttA";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const callbackError = document.getElementById("callbackError");

async function handleAuthCallback() {
  try {
    // Give Supabase a moment to process the URL and store the session
    await new Promise(function (resolve) {
      setTimeout(resolve, 700);
    });

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      callbackError.textContent = "We couldn't finish sign-in. Please log in.";
      console.error("Session error:", error);
      setTimeout(function () {
        window.location.href = "pages/auth/login.html";
      }, 1500);
      return;
    }

    if (data.session) {
      window.location.href = "pages/auth/onboarding.html";
      return;
    }

    callbackError.textContent = "Your email was confirmed. Please log in.";
    setTimeout(function () {
      window.location.href = "pages/auth/login.html";
    }, 1500);
  } catch (err) {
    callbackError.textContent = "Something went wrong. Please log in.";
    console.error("Unexpected callback error:", err);
    setTimeout(function () {
      window.location.href = "pages/auth/login.html";
    }, 1500);
  }
}

handleAuthCallback();
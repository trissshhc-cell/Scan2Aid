
const statusNode =
  document.getElementById("offline-status");

const bisaya =
  document.documentElement.lang === "ceb";

function showStatus(english, cebuano) {
  if (statusNode) {
    statusNode.textContent =
      bisaya ? cebuano : english;
  }
}

async function setupOffline() {
  if (!("serviceWorker" in navigator)) {
    showStatus(
      "Offline mode is not supported.",
      "Dili suportado ang offline mode."
    );
    return;
  }

  try {
    await navigator.serviceWorker.register("./sw.js");
    await navigator.serviceWorker.ready;

    function updateStatus() {
      showStatus(
        "✓ Ready for offline use",
        "✓ Andam gamiton offline"
      );
    }

    if (navigator.serviceWorker.controller) {
      updateStatus();
    } else {
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        updateStatus
      );
    }

  } catch (error) {
    console.error("Offline setup failed:", error);

    showStatus(
      "Offline setup failed. Check files.",
      "Napakyas ang offline setup."
    );
  }
}

setupOffline();

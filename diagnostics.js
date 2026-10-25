(() => {
  const STORAGE_KEY = "crispQuickRepliesDiagnostics";
  const MAX_EVENTS = 200;
  const ALLOWED_FIELDS = new Set([
    "errorName",
    "shortcutCount",
    "enabledCount",
  ]);
  let writeQueue = Promise.resolve();
  let reportedWriteFailure = false;

  function getSafeDetails(details) {
    const safeDetails = {};
    for (const [key, value] of Object.entries(details)) {
      if (!ALLOWED_FIELDS.has(key)) {
        continue;
      }

      if (key === "errorName" && typeof value === "string") {
        safeDetails[key] = value.slice(0, 80);
      } else if (
        (key === "shortcutCount" || key === "enabledCount") &&
        Number.isInteger(value) &&
        value >= 0
      ) {
        safeDetails[key] = value;
      }
    }
    return safeDetails;
  }

  function record(event, details = {}) {
    const safeEvent = /^[a-z][a-z0-9_]{0,63}$/.test(event)
      ? event
      : "unknown_event";
    const entry = {
      time: new Date().toISOString(),
      event: safeEvent,
      ...getSafeDetails(details),
    };

    writeQueue = writeQueue
      .then(async () => {
        const stored = await chrome.storage.local.get(STORAGE_KEY);
        const previous = Array.isArray(stored[STORAGE_KEY])
          ? stored[STORAGE_KEY]
          : [];
        await chrome.storage.local.set({
          [STORAGE_KEY]: [...previous, entry].slice(-MAX_EVENTS),
        });
      })
      .catch((error) => {
        if (!reportedWriteFailure) {
          reportedWriteFailure = true;
          console.error("Unable to save Crisp Quick Replies diagnostics.", error);
        }
      });

    return writeQueue;
  }

  async function exportDiagnostics() {
    await writeQueue;
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    const manifest = chrome.runtime.getManifest();
    const userAgent = navigator.userAgent;
    const chromeVersion = userAgent.match(/Chrome\/([\d.]+)/)?.[1] ?? "unknown";

    return {
      product: "Crisp Quick Replies",
      extensionVersion: manifest.version,
      browser: `Chrome ${chromeVersion}`,
      platform: navigator.userAgentData?.platform ?? navigator.platform,
      generatedAt: new Date().toISOString(),
      privacy: "No shortcut sequences, saved replies, or chat content are collected.",
      events: Array.isArray(stored[STORAGE_KEY])
        ? stored[STORAGE_KEY]
        : [],
    };
  }

  async function clearDiagnostics() {
    await writeQueue;
    await chrome.storage.local.remove(STORAGE_KEY);
    reportedWriteFailure = false;
  }

  window.CrispQuickRepliesDiagnostics = {
    record,
    export: exportDiagnostics,
    clear: clearDiagnostics,
  };
})();

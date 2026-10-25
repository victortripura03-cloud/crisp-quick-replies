const STORAGE_KEY = "crispQuickReplies";
const MIN_SEQUENCE_LENGTH = 3;

const form = document.querySelector("#shortcut-form");
const idInput = document.querySelector("#shortcut-id");
const sequenceDisplay = document.querySelector("#sequence-display");
const captureButton = document.querySelector("#capture-button");
const responseInput = document.querySelector("#response");
const saveButton = document.querySelector("#save-button");
const cancelButton = document.querySelector("#cancel-button");
const status = document.querySelector("#status");
const list = document.querySelector("#shortcut-list");
const emptyState = document.querySelector("#empty-state");
const downloadDiagnosticsButton = document.querySelector("#download-diagnostics");
const clearDiagnosticsButton = document.querySelector("#clear-diagnostics");

let shortcuts = [];
let capturedSequence = "";
let isCapturing = false;

function showStatus(message) {
  status.textContent = message;
}

function formatSequence(sequence) {
  return sequence.replaceAll(" ", "Space");
}

function renderSequence() {
  sequenceDisplay.textContent = capturedSequence
    ? formatSequence(capturedSequence)
    : "No keys recorded";
}

function renderShortcuts() {
  list.replaceChildren();
  emptyState.hidden = shortcuts.length > 0;

  for (const shortcut of shortcuts) {
    const item = document.createElement("li");
    item.className = `shortcut-item${shortcut.enabled ? "" : " disabled"}`;

    const header = document.createElement("div");
    header.className = "shortcut-item-header";

    const key = document.createElement("span");
    key.className = "shortcut-key";
    key.textContent = formatSequence(shortcut.sequence);

    const state = document.createElement("span");
    state.textContent = shortcut.enabled ? "Enabled" : "Disabled";
    header.append(key, state);

    const reply = document.createElement("p");
    reply.className = "shortcut-response";
    reply.textContent = shortcut.response;

    const actions = document.createElement("div");
    actions.className = "shortcut-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editShortcut(shortcut));

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = shortcut.enabled ? "Disable" : "Enable";
    toggleButton.addEventListener("click", () => toggleShortcut(shortcut.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteShortcut(shortcut.id));

    actions.append(editButton, toggleButton, deleteButton);
    item.append(header, reply, actions);
    list.append(item);
  }
}

async function saveShortcuts(nextShortcuts) {
  await chrome.storage.local.set({ [STORAGE_KEY]: nextShortcuts });
  shortcuts = nextShortcuts;
  renderShortcuts();
}

function stopCapturing() {
  isCapturing = false;
  captureButton.textContent = "Record keys";
}

function resetForm() {
  form.reset();
  idInput.value = "";
  capturedSequence = "";
  renderSequence();
  stopCapturing();
  saveButton.textContent = "Save shortcut";
  cancelButton.hidden = true;
}

function editShortcut(shortcut) {
  idInput.value = shortcut.id;
  capturedSequence = shortcut.sequence;
  responseInput.value = shortcut.response;
  renderSequence();
  saveButton.textContent = "Update shortcut";
  cancelButton.hidden = false;
  showStatus("");
  responseInput.focus();
}

async function toggleShortcut(id) {
  const nextShortcuts = shortcuts.map((shortcut) =>
    shortcut.id === id
      ? { ...shortcut, enabled: !shortcut.enabled }
      : shortcut
  );
  try {
    await saveShortcuts(nextShortcuts);
  } catch (error) {
    console.error("Unable to update Crisp shortcut.", error);
    window.CrispQuickRepliesDiagnostics.record("shortcut_update_failed", {
      errorName: error.name,
    });
    showStatus("Could not update the shortcut. Check Chrome extension storage.");
  }
}

async function deleteShortcut(id) {
  const nextShortcuts = shortcuts.filter((shortcut) => shortcut.id !== id);
  try {
    await saveShortcuts(nextShortcuts);
    if (idInput.value === id) {
      resetForm();
    }
  } catch (error) {
    console.error("Unable to delete Crisp shortcut.", error);
    window.CrispQuickRepliesDiagnostics.record("shortcut_delete_failed", {
      errorName: error.name,
    });
    showStatus("Could not delete the shortcut. Check Chrome extension storage.");
  }
}

captureButton.addEventListener("click", () => {
  capturedSequence = "";
  renderSequence();
  isCapturing = true;
  captureButton.textContent = "Recording... (Esc to stop)";
  showStatus("Press your shortcut keys in order.");
});

cancelButton.addEventListener("click", resetForm);

downloadDiagnosticsButton.addEventListener("click", async () => {
  try {
    const report = await window.CrispQuickRepliesDiagnostics.export();
    const file = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "crisp-quick-replies-diagnostics.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    showStatus("Diagnostics downloaded. Review the file before sharing it.");
  } catch (error) {
    console.error("Unable to export Crisp Quick Replies diagnostics.", error);
    window.CrispQuickRepliesDiagnostics.record("diagnostics_export_failed", {
      errorName: error.name,
    });
    showStatus("Could not download diagnostics. Check Chrome extension storage.");
  }
});

clearDiagnosticsButton.addEventListener("click", async () => {
  try {
    await window.CrispQuickRepliesDiagnostics.clear();
    showStatus("Diagnostics cleared.");
  } catch (error) {
    console.error("Unable to clear Crisp Quick Replies diagnostics.", error);
    window.CrispQuickRepliesDiagnostics.record("diagnostics_clear_failed", {
      errorName: error.name,
    });
    showStatus("Could not clear diagnostics. Check Chrome extension storage.");
  }
});

document.addEventListener(
  "keydown",
  (event) => {
    if (!isCapturing) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      stopCapturing();
      showStatus("Recording stopped.");
      return;
    }

    if (
      event.repeat ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.key.length !== 1
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    capturedSequence += event.key;
    renderSequence();
    showStatus("");
  },
  true
);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (capturedSequence.length < MIN_SEQUENCE_LENGTH) {
    showStatus("A shortcut must contain at least 3 key presses.");
    return;
  }

  const existing = shortcuts.find(
    (shortcut) =>
      shortcut.sequence === capturedSequence &&
      shortcut.id !== idInput.value
  );
  if (existing) {
    showStatus("That shortcut sequence is already assigned.");
    return;
  }

  const id = idInput.value || crypto.randomUUID();
  const updated = {
    id,
    sequence: capturedSequence,
    response: responseInput.value,
    enabled: shortcuts.find((shortcut) => shortcut.id === id)?.enabled ?? true,
  };
  const nextShortcuts = [
    ...shortcuts.filter((shortcut) => shortcut.id !== id),
    updated,
  ];

  try {
    await saveShortcuts(nextShortcuts);
    window.CrispQuickRepliesDiagnostics.record("shortcut_saved", {
      shortcutCount: nextShortcuts.length,
      enabledCount: nextShortcuts.filter((shortcut) => shortcut.enabled).length,
    });
    resetForm();
    showStatus("Shortcut saved.");
  } catch (error) {
    console.error("Unable to save Crisp shortcuts.", error);
    window.CrispQuickRepliesDiagnostics.record("shortcut_save_failed", {
      errorName: error.name,
    });
    showStatus("Could not save shortcuts. Check Chrome extension storage.");
  }
});

chrome.storage.local
  .get(STORAGE_KEY)
  .then((result) => {
    shortcuts = Array.isArray(result[STORAGE_KEY])
      ? result[STORAGE_KEY].filter(
          (entry) =>
            typeof entry.id === "string" &&
            typeof entry.sequence === "string" &&
            typeof entry.response === "string" &&
            typeof entry.enabled === "boolean"
        )
      : [];
    window.CrispQuickRepliesDiagnostics.record("options_shortcuts_loaded", {
      shortcutCount: shortcuts.length,
      enabledCount: shortcuts.filter((shortcut) => shortcut.enabled).length,
    });
    renderShortcuts();
  })
  .catch((error) => {
    console.error("Unable to load Crisp shortcuts.", error);
    window.CrispQuickRepliesDiagnostics.record("options_storage_read_failed", {
      errorName: error.name,
    });
    showStatus("Could not load saved shortcuts from Chrome storage.");
  });

window.CrispQuickRepliesDiagnostics.record("options_page_loaded");
window.addEventListener("error", (event) => {
  window.CrispQuickRepliesDiagnostics.record("options_script_error", {
    errorName: event.error?.name ?? "ErrorEvent",
  });
});
window.addEventListener("unhandledrejection", (event) => {
  window.CrispQuickRepliesDiagnostics.record(
    "options_unhandled_rejection",
    {
      errorName: event.reason instanceof Error ? event.reason.name : "Error",
    }
  );
});

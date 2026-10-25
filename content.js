const STORAGE_KEY = "crispQuickReplies";
const MAX_SEQUENCE_TIME_MS = 3000;
const states = new WeakMap();
let shortcuts = [];

function isEditable(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element instanceof HTMLTextAreaElement) {
    return !element.disabled && !element.readOnly;
  }

  if (element instanceof HTMLInputElement) {
    return (
      !element.disabled &&
      !element.readOnly &&
      ["text", "search", "url", "email", "tel"].includes(element.type)
    );
  }

  return element.isContentEditable;
}

function isCrispComposer(element) {
  if (!isEditable(element)) {
    return false;
  }

  if (element.isContentEditable || element.getAttribute("role") === "textbox") {
    return true;
  }

  const description = [
    element.getAttribute("aria-label"),
    element.getAttribute("placeholder"),
    element.getAttribute("data-placeholder"),
    element.getAttribute("data-testid"),
    element.className,
  ]
    .filter((value) => typeof value === "string")
    .join(" ");

  return /message|reply|composer/i.test(description);
}

function getComposer(element) {
  if (!(element instanceof HTMLElement)) {
    return null;
  }

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return isCrispComposer(element) ? element : null;
  }

  let current = element;
  let composer = null;
  while (current && current !== document.body) {
    if (current.isContentEditable || current.getAttribute("role") === "textbox") {
      composer = current;
    } else if (composer) {
      break;
    }
    current = current.parentElement;
  }

  return composer && isCrispComposer(composer) ? composer : null;
}

function replaceBeforeCaret(element, expectedPrefix, response) {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    const end = element.selectionStart;
    const start = end - expectedPrefix.length;
    if (
      end === null ||
      start < 0 ||
      element.value.slice(start, end) !== expectedPrefix
    ) {
      return false;
    }

    element.setRangeText(response, start, end, "end");
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertReplacementText",
        data: response,
      })
    );
    return true;
  }

  const selection = window.getSelection();
  if (!selection || !selection.isCollapsed || !element.contains(selection.anchorNode)) {
    return false;
  }

  const caretRange = document.createRange();
  caretRange.selectNodeContents(element);
  caretRange.setEnd(selection.anchorNode, selection.anchorOffset);
  const textBeforeCaret = caretRange.toString();
  const startOffset = textBeforeCaret.length - expectedPrefix.length;
  if (startOffset < 0 || !textBeforeCaret.endsWith(expectedPrefix)) {
    return false;
  }

  const textNodes = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT
  );
  let currentOffset = 0;
  let startNode = null;
  let startNodeOffset = 0;
  let endNode = null;
  let endNodeOffset = 0;

  while (textNodes.nextNode()) {
    const textNode = textNodes.currentNode;
    const textLength = textNode.textContent.length;
    const nextOffset = currentOffset + textLength;

    if (!startNode && startOffset >= currentOffset && startOffset < nextOffset) {
      startNode = textNode;
      startNodeOffset = startOffset - currentOffset;
    }
    if (
      textBeforeCaret.length > currentOffset &&
      textBeforeCaret.length <= nextOffset
    ) {
      endNode = textNode;
      endNodeOffset = textBeforeCaret.length - currentOffset;
      break;
    }

    currentOffset = nextOffset;
  }

  if (!startNode || !endNode) {
    return false;
  }

  const replacementRange = document.createRange();
  replacementRange.setStart(startNode, startNodeOffset);
  replacementRange.setEnd(endNode, endNodeOffset);
  replacementRange.deleteContents();

  const replacement = document.createTextNode(response);
  replacementRange.insertNode(replacement);
  selection.removeAllRanges();
  selection.setPosition(replacement, response.length);
  element.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      inputType: "insertReplacementText",
      data: response,
    })
  );
  return true;
}

function getState(element) {
  let state = states.get(element);
  if (!state) {
    state = { sequence: "", startedAt: 0 };
    states.set(element, state);
  }
  return state;
}

function onKeyDown(event) {
  if (
    event.defaultPrevented ||
    event.repeat ||
    event.isComposing ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    event.key.length !== 1
  ) {
    return;
  }

  const composer = getComposer(event.target);
  if (!composer) {
    return;
  }

  const now = Date.now();
  const state = getState(composer);
  if (!state.sequence || now - state.startedAt > MAX_SEQUENCE_TIME_MS) {
    state.sequence = "";
    state.startedAt = now;
  }
  state.sequence += event.key;

  const matching = shortcuts.find(
    (shortcut) =>
      shortcut.enabled &&
      shortcut.sequence.length >= 3 &&
      shortcut.sequence === state.sequence
  );
  if (matching) {
    const expectedPrefix = matching.sequence.slice(0, -event.key.length);
    if (replaceBeforeCaret(composer, expectedPrefix, matching.response)) {
      console.debug("[Crisp Quick Replies] Expanded a shortcut.");
      event.preventDefault();
    } else {
      console.error(
        "Crisp Quick Replies matched a shortcut but could not find its typed prefix at the caret."
      );
    }
    state.sequence = "";
    return;
  }

  const hasPrefix = shortcuts.some(
    (shortcut) =>
      shortcut.enabled &&
      shortcut.sequence.length >= 3 &&
      shortcut.sequence.startsWith(state.sequence)
  );
  if (!hasPrefix) {
    const lastCharacter = state.sequence.slice(-1);
    state.sequence = shortcuts.some(
      (shortcut) =>
        shortcut.enabled &&
        shortcut.sequence.length >= 3 &&
        shortcut.sequence.startsWith(lastCharacter)
    )
      ? lastCharacter
      : "";
    state.startedAt = now;
  }
}

console.info("[Crisp Quick Replies] Content script loaded.");
document.addEventListener("keydown", onKeyDown, true);
document.addEventListener(
  "focusout",
  (event) => {
    if (event.target instanceof HTMLElement) {
      const state = states.get(event.target);
      if (state) {
        state.sequence = "";
      }
    }
  },
  true
);

function loadShortcuts() {
  chrome.storage.local
    .get(STORAGE_KEY)
    .then((result) => {
      shortcuts = Array.isArray(result[STORAGE_KEY])
        ? result[STORAGE_KEY].filter(
            (entry) =>
              typeof entry.sequence === "string" &&
              typeof entry.response === "string" &&
              typeof entry.enabled === "boolean"
          )
        : [];
      console.info(
        `[Crisp Quick Replies] Loaded ${shortcuts.length} shortcut(s).`
      );
    })
    .catch((error) => {
      console.error("Unable to load Crisp Quick Replies shortcuts.", error);
    });
}

loadShortcuts();
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[STORAGE_KEY]) {
    loadShortcuts();
  }
});

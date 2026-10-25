# Crisp Quick Replies

A Chrome extension that expands custom key sequences into saved responses in the Crisp web inbox.

## Install in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this project folder.
4. Open the extension's **Details** page and select **Extension options** to add shortcuts.
5. Reload the Crisp tab after installing or updating the extension.

## Use

Create a saved response, choose **Record keys**, and press at least three keys in order. For example, press `;`, `w`, `1`, then Space to assign `;w1 ` to a reply. In Crisp, type the same sequence into the message composer within 3 seconds. The sequence is replaced by the saved response in the draft; it is never sent automatically. The extension listens for key presses in Crisp's contenteditable reply editor, including the final Space key.

The extension only runs on `https://app.crisp.chat/` and expands sequences in editable content fields on that site. After reloading the extension from `chrome://extensions`, reload the Crisp tab so Chrome injects the updated script. The Crisp web app may change its editor behavior or markup.

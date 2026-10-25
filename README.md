# Crisp Quick Replies

**Version 1.0.1** · Free extension for expanding custom keyboard shortcuts into saved replies in the Crisp web inbox.

## Download

[Download the latest source ZIP](https://github.com/victortripura03-cloud/crisp-quick-replies/archive/refs/heads/main.zip).

## What's new in 1.0.1

- New teal-and-blue chat and quick-reply logo in the browser toolbar and extension options.
- Troubleshooting support with a downloadable local diagnostics report.
- Installation guidance for Chrome and Brave on Windows 11.

## Install in Chrome or Brave

The extension is designed for Chromium-based browsers. Chrome and Brave both support loading it as an unpacked extension.

1. Download the ZIP above.
2. In File Explorer, right-click it and choose **Extract All**.
3. Move the extracted folder to a permanent location. Keep it there so the browser can continue loading the extension.
4. Open the extensions page:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
5. Enable **Developer mode**, then select **Load unpacked**.
6. Choose the extracted `crisp-quick-replies-main` folder—the folder that directly contains `manifest.json`. Do not select the ZIP or an inner folder.
7. Open the extension's **Details** page. If the browser shows **Site access**, allow access to `https://app.crisp.chat/`. The extension does not need access to all websites.
8. Open **Extension options** to create your shortcuts, then refresh the Crisp tab.

## Configure and use

Each installation starts with an empty shortcut list. Shortcuts and replies are saved locally in that browser profile; they are not included in the GitHub download or shared between users. Each person must configure their own shortcuts in **Extension options**.

Choose **Record keys** and press at least three keys in order. For example, press `;`, `w`, `1`, then Space to save the sequence `;w1 `, with Space as the final key. Create and enable the shortcut, then focus the Crisp reply composer and enter the sequence within 3 seconds.

The matching sequence is replaced with the saved response in the draft. The extension never sends a message automatically.

## Troubleshooting and support

- Confirm the extension is enabled on the browser's extensions page.
- Confirm **Load unpacked** was given the extracted project folder containing `manifest.json`.
- Keep the extracted folder in place; do not run the extension from the ZIP.
- In extension **Details → Site access**, allow access to `https://app.crisp.chat/` if the setting is shown.
- In **Extension options**, check that the shortcut is saved and enabled.
- Refresh Crisp, click inside the reply composer, then enter the keys in order and press the final Space within 3 seconds.
- If the shortcut still does not expand, open **Extension options → Troubleshooting → Download diagnostics** and share the report with the maintainer. Review it before sharing.

Diagnostics are stored only in the local browser profile and are never uploaded automatically. The report contains event times, extension/browser version, platform, event types, shortcut counts, and error names. It does not contain shortcut sequences, saved replies, customer data, or chat contents. Select **Clear diagnostics** to remove the local log.

## Coming soon

Planned improvements include broader browser compatibility testing and easier backup or transfer of shortcut settings. These features are not included in version 1.0.1 yet.

## Updating

Download and extract the latest ZIP, replace the files in the extension folder, then select **Reload** for Crisp Quick Replies on the browser's extensions page and refresh the Crisp tab.

## Logo

The toolbar and options-page icons are in `icons/`. The PNG sizes are referenced in `manifest.json`; `icons/icon.svg` is the editable vector source.

## License

MIT. The extension is free to download and use. Manual installation through **Load unpacked** requires Developer mode; the extension is not currently listed on the Chrome Web Store.

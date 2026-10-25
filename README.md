# Crisp Quick Replies

Version 1.0.1

A free Chrome extension that expands custom keyboard sequences into saved replies in the Crisp web inbox.

## Download

[Download the latest source ZIP](https://github.com/victortripura03-cloud/crisp-quick-replies/archive/refs/heads/main.zip).

## Install in Chrome on Windows 11

1. Download the ZIP above.
2. In File Explorer, right-click it and choose **Extract All**.
3. Move the extracted folder to a permanent location. Keep it there so Chrome can continue loading the extension.
4. Open `chrome://extensions` in Chrome and enable **Developer mode**.
5. Select **Load unpacked** and choose the extracted `crisp-quick-replies-main` folder—the folder that directly contains `manifest.json`. Do not select the ZIP or an inner folder.
6. Open the extension's **Details** page. If Chrome shows **Site access**, allow it on `https://app.crisp.chat/`. The extension does not need access to all websites.
7. Open **Details → Extension options** to create your shortcuts, then refresh the Crisp tab.

## Configure and use

Each installation starts with an empty shortcut list. Shortcuts and replies are saved locally in that user's Chrome profile; they are not included in the GitHub download or shared between users. Each person must configure their own shortcuts in **Extension options**.

Choose **Record keys** and press at least three keys in order. For example, press `;`, `w`, `1`, then Space to save the sequence `;w1 `, with Space as the final key. Create and enable the shortcut, then focus the Crisp reply composer and enter that sequence within 3 seconds.

The matching sequence is replaced with the saved response in the draft. The extension never sends a message automatically.

## Troubleshooting

- Confirm the extension is enabled at `chrome://extensions`.
- Confirm **Load unpacked** was given the extracted project folder containing `manifest.json`.
- Keep the extracted folder in place; do not run the extension from the ZIP.
- In **Details → Site access**, allow the extension on `https://app.crisp.chat/` if Chrome displays this setting.
- In **Extension options**, check that the shortcut is saved and enabled.
- Refresh the Crisp tab, click inside the reply composer, then enter the keys in order and press the final Space within 3 seconds.
- If it still does not expand, open DevTools on Crisp, select **Console**, and check for messages beginning with `[Crisp Quick Replies]`.
- Open **Extension options → Troubleshooting → Download diagnostics** and share the downloaded JSON file with the maintainer. Review it first; diagnostics contain event times, extension/browser version, platform, and error names, but not shortcut sequences, saved replies, or chat text. Logs are stored locally and are not sent automatically.

The extension runs on `https://app.crisp.chat/` and targets editable message areas. Crisp may change its editor behavior or markup.

## Updating

Download and extract the latest ZIP, replace the files in the extension folder, then click **Reload** for Crisp Quick Replies at `chrome://extensions` and refresh the Crisp tab.

Version 1.0.1 adds the toolbar/options logo and a local diagnostics export to help investigate installation or shortcut issues. It also provides clearer Windows 11 installation steps.

## Diagnostics and privacy

The extension records a rolling log of up to 200 diagnostic events in the local Chrome profile. It records timestamps, extension/browser version, platform, event types, shortcut counts, and error names. It does not record shortcut characters, response text, customer data, or chat contents, and never uploads logs.

To share a report, open **Extension options → Troubleshooting → Download diagnostics**. Review the downloaded JSON file before sharing it. Select **Clear diagnostics** to remove the local log.

## Logo

The Chrome toolbar and options-page icons are in `icons/`. The PNG sizes are referenced in `manifest.json`; `icons/icon.svg` is the editable vector source.

## License

MIT. The extension is free to download and use. Manual installation through **Load unpacked** requires Chrome Developer mode; the extension is not currently listed on the Chrome Web Store.

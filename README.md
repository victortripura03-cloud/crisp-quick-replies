
# Crisp Quick Replies

A lightweight Chrome extension that lets you create
custom keyboard shortcuts for saved replies in Crisp Chat.

## Download Extension

[![Download Extension](https://img.shields.io/badge/Download-Extension_ZIP-28a745?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/victortripura03-cloud/crisp-quick-replies/archive/refs/heads/main.zip)

**Free to download and use.**

Click the green button above to download the latest
version of Crisp Quick Replies.

## How to Install

### Step 1: Download

1. Click the Download Extension button above.
2. Download the ZIP file.
3. Extract the ZIP file.

### Step 2: Save the Extension

Move the extracted folder to a permanent location.

Recommended directory:

Documents/
  Chrome Extensions/
    crisp-quick-replies-main/

Keep all extension files inside this folder.

### Step 3: Install in Chrome

1. Open Google Chrome.
2. Enter `chrome://extensions` in the address bar.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked**.
5. Select the extracted `crisp-quick-replies-main` folder.
6. Make sure the folder contains `manifest.json`.

Your extension should now appear in Chrome!

### Step 4: Configure Quick Replies

1. Open `chrome://extensions`.
2. Find **Crisp Quick Replies**.
3. Click **Details**.
4. Select **Extension options**.
5. Add your saved responses and keyboard shortcuts.
6. Open or reload Crisp Chat.
   

## Required Permissions and Settings

To use Crisp Quick Replies, follow these steps:

1. Open Google Chrome and visit `chrome://extensions`.
2. Enable **Developer mode** (top-right corner).
3. Click **Load unpacked** and select the extracted extension folder containing `manifest.json`.
4. Find **Crisp Quick Replies** and click **Details**.
5. Under **Site access**, allow the extension to run on `https://app.crisp.chat/` if Chrome displays this option.
6. If Chrome offers **On specific sites**, select it and add `https://app.crisp.chat/*` if supported.
7. Open **Extension options** and configure your saved replies.
8. Reload your Crisp Chat tab.

### Permissions Explained

- **Crisp site access:** Allows the extension to detect keyboard shortcuts and insert saved replies into the Crisp message editor.
- **Extension storage:** Allows your saved replies and shortcuts to be stored in Chrome.
- **Developer mode:** Required for manually installing an unpacked extension. It is not a permission to access your personal files.

**Note:** You do not need to enable access to all websites. Only grant the permissions Chrome requests for this extension.


## How to Use

Create a saved response in the extension options.

Choose **Record keys** and press at least three keys
in sequence.

Example shortcut: `;w1 `

In the Crisp Chat message editor, type the same
sequence within 3 seconds.

The shortcut will automatically expand into your
saved response.

**Note:** The extension never sends messages
automatically. It only inserts text into your draft.

## Important Notes

- Works only in https://app.crisp.chat/ 
- Keep the extracted extension folder on your computer.
- Reload the Crisp tab after installing or updating.
- This is a manual Chrome extension installation.
- The extension is not currently available on the
  Chrome Web Store.

## Updating the Extension

1. Download the latest ZIP from this repository.
2. Extract it and replace the files in your existing
   extension folder.
3. Open `chrome://extensions`.
4. Click **Reload** on Crisp Quick Replies.
5. Reload your Crisp Chat tab.

## License

MIT License.

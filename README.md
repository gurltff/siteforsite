# siteforsite

The website for **siteforsite**, a tiny student-run studio that builds cute, working one-page websites for ₹150.

It's a plain static site (HTML + CSS + a little JavaScript), so there is no build step. Open `index.html` in a browser, or host the folder anywhere.

```
index.html               the page
assets/css/style.css     all styles (colours are at the top, in :root)
assets/js/config.js      ← the only file you normally need to edit
assets/js/main.js        pages, demo carousel, order builder
assets/img/demos/        screenshots of the live demo sites
assets/img/team/         founder photos
google-form/             script that builds the Google order form
```

## 1. How ordering works

Pay half to book, the rest after the preview:
1. The customer picks a site and extras in the order builder (on the **how to order** page) and sees the total, split into "pay now to book" and "after your preview".
2. They fill the **short Google Form** (opens pre-filled with their site and extras).
3. Back on the site they tap **send your bill on WhatsApp**: the message already lists their items, total, the half to pay now and the half after the preview.
4. You send them a **UPI request for half** from your PhonePe (Request money to their number), so nobody types an amount. Check the money arrived in your own PhonePe app; don't trust screenshots.
5. You build it and send a preview.
6. They pay the other half, you send the live link.

No payment QR is shown anywhere publicly.

### The short Google Form

`google-form/create-order-form.gs` builds it in your Google account and links it to a Google Sheet. It asks for: name, WhatsApp number, type of website, extras (optional), how many, what they want on the site, colours or vibe, and inspo links. The thank you message has a WhatsApp link. Until the form link is in `config.js`, the form buttons open WhatsApp instead.

**Make it (about 2 minutes):**
1. Open your Apps Script project (or [script.google.com](https://script.google.com) → **New project**), replace all the code with `create-order-form.gs`, press **Ctrl + S**.
2. Choose `createOrderForm` and click **Run** (allow the permissions if asked).
3. Send the two lines from the **Execution log** to Claude, or paste them into `assets/js/config.js`.
4. In the form editor add one **File upload** question at the end: "Upload pictures of the UI you love" (images, up to 5 files). Scripts can't add upload questions.
5. Delete the old order form (the one with the payment QR) in Google Forms.

If you change a price or option, change it in the script **and** in `FORM_LABELS` in `assets/js/main.js`.

## 2. Where it's live

- **https://siteforsite.onrender.com** (Render static site)
- **https://gurltff.github.io/siteforsite/** (GitHub Pages)

Both serve the `gh-pages` branch and update by themselves. To publish changes, push the updated files to that branch, e.g.:

```sh
git push origin HEAD:gh-pages
```

Both rebuild in about a minute. On Render the build command is a no-op `echo` and the publish directory is `./`. Netlify or Vercel work too: import the repo; there's no build command and the publish directory is the repo root (`netlify.toml` already says so).

## 3. Everyday edits

| I want to… | Edit |
|---|---|
| change the WhatsApp number or form link | `assets/js/config.js` |
| change prices | the price list in `index.html` (search for `little extras`) **and** `BASE` / `EXTRAS` in `assets/js/main.js` (the order builder) |
| add or remove a demo project | the `DEMOS` list at the top of `assets/js/main.js`, plus a 1120×700 screenshot in `assets/img/demos/`. If the demo is on a new website address, also add it to `frame-src` in the security line at the top of `index.html`, or "try it here" stays blank |
| change team info or photos | the `team` section in `index.html` and `assets/img/team/` |
| change colours | the variables at the top of `assets/css/style.css` |

### Demo card screenshots
Each demo has a `cover` image (the front page) and optionally:
- `alt`: a second screenshot that fades in on hover (good for sites with an intro screen), or
- `long`: a tall full-page screenshot (960px wide) that scrolls on hover.

Save screenshots as `.webp` to keep the page fast.

## Security
The site has no server, database, logins or customer data. Orders go only to the Google Form and its Sheet in your own Google account. To keep it that way:
- `index.html` has a Content Security Policy (the `Content-Security-Policy` meta tag at the top), so the page loads only our own files, Google Fonts and the demo sites. Injected scripts can't run.
- The "try it here" preview window is sandboxed, so a demo site can't redirect or take over the page.
- No customer data is ever put in this repo. Keep the response Sheet private, and keep "View results summary" off in the form's settings (Settings → Responses), so customers never see each other's answers.
- Charge from the items in a bill, not its "Total" line, because people can edit a WhatsApp message before sending it.
- Turn on two-step verification for the GitHub, Google and Render accounts. Taking over one of them is the only real way to change the site.

## Pages
The site is click-through: home (the poster and a menu), about us, what we make, sites we made, meet the team, the price list and how to order. Each page is a `<section class="page" data-page="…">` in `index.html`; links like `#about` or `#order` open them, and the arrows in the top bar step through them in order. The list of pages is `PAGES` in `assets/js/main.js`.

## Look and fonts
The site is styled like a y2k "we are hiring" poster: a browser bar on top, pink halftone paper, grey words in baby blue boxes and big pink rounded words with a grey 3D shadow. All of it lives in `assets/css/style.css` (colours are the variables at the top).

Fonts load from Google Fonts: **Arimo** (boxed words), **M PLUS Rounded 1c** (pink words) and **Poppins** (body and italic notes).

`preview.html` only forwards to the homepage, so old preview links keep working.

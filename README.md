# siteforsite

The website for **siteforsite**, a tiny student-run studio that builds cute, working one-page websites for ₹150.

It's a plain static site (HTML + CSS + a little JavaScript), so there is no build step. Open `index.html` in a browser, or host the folder anywhere.

```
index.html               the page
assets/css/style.css     all styles (colours are at the top, in :root)
assets/js/config.js      ← the only file you normally need to edit
assets/js/main.js        animations, demo cards, order builder
assets/img/demos/        screenshots of the live demo sites
assets/img/team/         founder photos
google-form/             script that builds the Google order form
```

## 1. The Google order form

`google-form/create-order-form.gs` builds the whole order form in your Google account and links it to a Google Sheet. Until the form link is in `config.js`, every "order form" button opens WhatsApp instead, so nothing is ever broken.

**What the form asks:** name, WhatsApp number, email and Instagram (optional); type of website (with prices); site name; features they hope for (tick boxes plus "Other"); exactly what they want; colours or vibe; links to UI inspo; extras yes or no (no extras skips straight to payment); extras with prices, how many, and their total; your payment QR; payment reference. After submitting they see a WhatsApp link to send you their payment screenshot.

**Make it (about 2 minutes):**
1. Go to [script.google.com](https://script.google.com) → **New project**. Delete the sample code, paste the whole `create-order-form.gs`, click **Save**.
2. Choose `createOrderForm` in the menu at the top and click **Run**. Allow the permissions (Advanced → "Go to … (unsafe)" → Allow; it's your own script).
3. Open the **Execution log**. It shows the share link, the edit link, the responses Sheet and two lines for the website.
4. Paste those two lines (`googleFormUrl` and `googleFormFields`) into `assets/js/config.js`, or send them to Claude.
5. Google doesn't let scripts add upload questions, so in the form editor add two **File upload** questions:
   - end of **Your website**: "Upload pictures of the UI you love" (images, up to 5 files)
   - end of **Payment**: "Upload your payment screenshot" (images, 1 file, required)
6. Payment QR: it lives at `assets/img/payment-qr.png` and the script adds it to the Payment section automatically.

**Good to know:**
- Google Forms can't add up a total by itself, so the form lists every price and asks for the total. When someone uses the order builder on the website and taps **fill the order form**, the form opens with their site type, extras and total already filled in.
- Google Forms can't jump straight to WhatsApp after submitting, so the thank you message shows a WhatsApp link to tap.
- File uploads need the customer to be signed in to a Google account; uploads land in your Google Drive.
- If you change a price or option, change it in the script **and** in `FORM_LABELS` in `assets/js/main.js`.

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
| add or remove a demo project | the `DEMOS` list at the top of `assets/js/main.js`, plus a 1120×700 screenshot in `assets/img/demos/` |
| change team info or photos | the `team` section in `index.html` and `assets/img/team/` |
| change colours | the variables at the top of `assets/css/style.css` |

### Demo card screenshots
Each demo has a `cover` image (the front page) and optionally:
- `alt`: a second screenshot that fades in on hover (good for sites with an intro screen), or
- `long`: a tall full-page screenshot (960px wide) that scrolls on hover.

Save screenshots as `.webp` to keep the page fast.

## Look and fonts
The site is styled like a y2k "we are hiring" poster: a browser bar on top, pink halftone paper, grey words in baby blue boxes and big pink rounded words with a grey 3D shadow. All of it lives in `assets/css/style.css` (colours are the variables at the top).

Fonts load from Google Fonts: **Arimo** (boxed words), **M PLUS Rounded 1c** (pink words) and **Poppins** (body and italic notes).

`preview.html` only forwards to the homepage, so old preview links keep working.

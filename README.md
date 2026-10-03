# siteforsite

The website for **siteforsite**, a tiny student-run studio that builds cute, working one-page websites for ₹150.

It's a plain static site (HTML + CSS + a little JavaScript), so there is no build step. Open `index.html` in a browser, or host the folder anywhere.

```
index.html               the page
assets/css/style.css     all styles (colours are at the top, in :root)
assets/js/config.js      ← the only file you normally need to edit
assets/js/main.js        animations, demo cards, order builder
assets/fonts/            "SFS Groovy", the hand-lettered heading font
assets/img/demos/        screenshots of the live demo sites
assets/img/team/         founder photos
```

## 1. Connect your Google Form

Until you add a form link, every "order form" button opens WhatsApp instead, so nothing is ever broken.

1. Go to [forms.google.com](https://forms.google.com) and create a blank form called **siteforsite order form**.
2. Suggested questions:
   - Your name *(short answer, required)*
   - WhatsApp number *(short answer, required)*
   - Which site do you want? *(multiple choice: Personal portfolio, Link-in-bio page, Digital resume / CV, Event or fest page, Society or club page, Small business page, Birthday / anniversary / proposal page, Wedding or party invite)*
   - Extras *(checkboxes: Extra page ₹99, Contact or registration form ₹99, Google Map ₹49, Photo gallery ₹49, Music ₹49, Urgent same-day delivery ₹100)*
   - What should the site say? Text, links, details *(paragraph)*
   - Colours, vibe, or reference sites you like *(paragraph)*
   - Upload your photos / logo / resume *(file upload; needs a Google sign-in, so you can skip this and ask for photos on WhatsApp instead)*
3. **Responses** tab → **Link to Sheets** → *Create a new spreadsheet*. Every order now lands in a Google Sheet automatically.
4. **Settings** → **Presentation** → **Confirmation message**, paste:
   > Thank you! ♡ Now text us on WhatsApp at **93551 43330** with what you ordered and a screenshot of your payment. We'll confirm your order and send your live link within 24–48 hours.
5. Click **Send** → the link icon → tick *Shorten URL* → **Copy**.
6. Paste it into `assets/js/config.js`:
   ```js
   googleFormUrl: "https://forms.gle/your-link-here",
   ```

## 2. Put it online (GitHub Pages)

1. Push this repo to GitHub (already done if you're reading this there).
2. Repo **Settings** → **Pages** → *Source: Deploy from a branch* → pick the branch and `/ (root)` → **Save**.
3. After a minute the site is live at `https://<your-username>.github.io/siteforsite/`.

Netlify or Vercel work too: drag the folder in or import the repo. There's no build command; the publish directory is the repo root.

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

## About the heading font
`SFS Groovy` was traced from the hand-lettering in the reference poster we were given. Letters that weren't in the poster (b, d, f, g, h, k, l, u, v, w, x, y, z) were rebuilt from the same hand-drawn strokes. Digits and most punctuation aren't included, so they fall back to the body font.

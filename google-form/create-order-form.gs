/**
 * siteforsite · order form builder
 *
 * Builds the whole siteforsite order form in YOUR Google account, links it to a
 * Google Sheet, and prints the lines to paste into assets/js/config.js.
 *
 * How to use (about 2 minutes):
 *   1. Go to https://script.google.com and click "New project".
 *   2. Delete the sample code, paste this whole file, click Save.
 *   3. Pick "createOrderForm" in the function menu at the top and click Run.
 *      Google asks for permission the first time: Review permissions, pick your
 *      account, Advanced, "Go to ... (unsafe)", Allow. (It's your own script.)
 *   4. Open "Execution log" at the bottom. It shows the form link, the edit link,
 *      the Sheet link and the config lines for the website.
 *   5. Google doesn't let scripts add file upload questions, so add these two by
 *      hand in the form editor (the log reminds you):
 *        a) end of the "Your website" section:
 *           File upload, "Upload pictures of the UI you love",
 *           images only, up to 5 files, not required.
 *        b) end of the "Payment" section:
 *           File upload, "Upload your payment screenshot",
 *           images only, 1 file, required.
 *
 * Keep the choice labels below in sync with FORM_LABELS in assets/js/main.js,
 * because the website pre-fills the form with them.
 */

// ---------------------------------------------------------------- settings
var WHATSAPP_NUMBER = '919355143330';
var WHATSAPP_DISPLAY = '93551 43330';
// Your payment QR. Put the picture on the website at this path (or change the
// link). If it can't be loaded, the form is still made and the log tells you
// how to add the QR by hand.
var QR_IMAGE_URL = 'https://gurltff.github.io/siteforsite/assets/img/payment-qr.png';
var BASE_PRICE = 150;

var SITE_TYPES = [
  'Personal portfolio (₹150)',
  'Link in bio page (₹150)',
  'Digital resume or CV (₹150)',
  'Event or fest page (₹150)',
  'Society or club page (₹150)',
  'Small business or home seller page (₹150)',
  'Birthday, anniversary or proposal page (₹150)',
  'Wedding or party invite (₹150)'
];
var EXTRAS = [
  'Extra change after the first round (₹50 each)',
  'Extra page (₹99 each)',
  'Contact or registration form (₹99)',
  'Google Map (₹49)',
  'Photo gallery (₹49)',
  'Music (₹49)',
  'Urgent delivery, the same day (₹100)'
];
var WANT_EXTRAS_NO = 'No extras, just the ₹150 site';
var WANT_EXTRAS_YES = 'Yes, I want some extras';
var FEATURES = [
  'My photo or photos of my products',
  'About me or about us section',
  'Instagram, WhatsApp and email buttons',
  'Resume or CV download button',
  'Project, product or menu cards with prices',
  'WhatsApp order button',
  'Countdown timer',
  'Event schedule or timeline',
  'Team members section',
  'Reviews or testimonials',
  'FAQ section',
  'Cute animations and hover effects',
  'My own colours and fonts'
];

// ---------------------------------------------------------------- build
function createOrderForm() {
  var form = FormApp.create('siteforsite · order form');
  form.setDescription(
    'Hi! ♡ Tell us about the website you want. It takes about 3 minutes.\n\n' +
    'Every site is ₹150 and extras are optional. At the end you pay with our QR, ' +
    'upload the payment screenshot, and then tap the WhatsApp link so we can confirm your order.'
  );
  form.setProgressBar(true);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);

  // ---- section 1: your details (the form's first page)
  form.addTextItem().setTitle('Your name').setRequired(true);
  form.addTextItem()
    .setTitle('Your WhatsApp number')
    .setHelpText('We send your order confirmation and live link here.')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Please type a phone number, like 98765 43210 or +91 98765 43210.')
      .requireTextMatchesPattern('^[+0-9 ()]{10,16}$')
      .build());
  form.addTextItem().setTitle('Your email (optional)');
  form.addTextItem().setTitle('Your Instagram handle (optional)');

  // ---- section 2: your website
  form.addPageBreakItem()
    .setTitle('Your website')
    .setHelpText('Tell us what you want. The more you share, the closer we get on the first try.');
  var typeItem = form.addMultipleChoiceItem();
  typeItem.setTitle('What type of website do you want?')
    .setChoiceValues(SITE_TYPES)
    .showOtherOption(true)
    .setRequired(true);
  form.addTextItem()
    .setTitle('What should the site be called?')
    .setHelpText('Your name, your brand, the event name, or who the surprise is for.');
  form.addCheckboxItem()
    .setTitle('Which features are you hoping to get?')
    .setHelpText('Tick everything you like. These are included in the ₹150. Paid extras come in the next step.')
    .setChoiceValues(FEATURES)
    .showOtherOption(true);
  form.addParagraphTextItem()
    .setTitle('Write down exactly what you want')
    .setHelpText('Text for the page, your links, dates, venue, prices, a message for someone special... anything we should put on it.')
    .setRequired(true);
  form.addTextItem()
    .setTitle('Colours or vibe you want')
    .setHelpText('For example: baby pink and cream, dark and minimal, cute y2k, aesthetic pastel.');
  form.addParagraphTextItem()
    .setTitle('Links to sites or Pinterest pins you love (optional)')
    .setHelpText('Paste links to any UI inspo. You can also upload pictures just below.');
  // (add the "Upload pictures of the UI you love" file upload question here by hand)

  // ---- section 3: extras yes or no
  var pbExtrasAsk = form.addPageBreakItem()
    .setTitle('Extras')
    .setHelpText(
      'Every site is ₹150. Optional extras:\n' +
      '• Extra change after the first round: ₹50 each\n' +
      '• Extra page: ₹99 each\n' +
      '• Contact or registration form: ₹99\n' +
      '• Google Map: ₹49\n' +
      '• Photo gallery: ₹49\n' +
      '• Music: ₹49\n' +
      '• Urgent delivery, the same day: ₹100'
    );
  var wantItem = form.addMultipleChoiceItem();
  wantItem.setTitle('Do you want any extras?').setRequired(true);

  // ---- section 4: pick extras and see the total
  var pbExtras = form.addPageBreakItem()
    .setTitle('Pick your extras')
    .setHelpText(
      'Tick your extras, then add them to ₹150 for your total.\n' +
      'Example: portfolio + photo gallery + music = 150 + 49 + 49 = ₹248.\n' +
      'If you came from the order builder on our website, this is already filled in for you.'
    );
  var extrasItem = form.addCheckboxItem();
  extrasItem.setTitle('Your extras').setChoiceValues(EXTRAS).setRequired(true);
  var countsItem = form.addTextItem()
    .setTitle('How many? (only for extra pages or change rounds)')
    .setHelpText('For example: Extra pages: 2');
  var totalItem = form.addTextItem()
    .setTitle('Your total (₹)')
    .setHelpText('₹150 + your extras. Type just the number, like 248.')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Please type just the number, like 248.')
      .requireNumber()
      .build());

  // ---- section 5: payment
  var pbPay = form.addPageBreakItem()
    .setTitle('Payment')
    .setHelpText(
      'Scan the QR to pay ₹150, or your total from the extras step.\n' +
      'Then upload a screenshot of the payment below. ' +
      'After you submit, tap the WhatsApp link so we can confirm your order.'
    );
  var qrAdded = false;
  try {
    var res = UrlFetchApp.fetch(QR_IMAGE_URL, { muteHttpExceptions: true });
    var type = String(res.getHeaders()['Content-Type'] || res.getHeaders()['content-type'] || '');
    if (res.getResponseCode() === 200 && type.indexOf('image') === 0) {
      form.addImageItem()
        .setTitle('Scan to pay')
        .setImage(res.getBlob())
        .setAlignment(FormApp.Alignment.CENTER);
      qrAdded = true;
    }
  } catch (e) { /* QR not online yet; added by hand later */ }
  form.addTextItem()
    .setTitle('Payment reference / UTR number (optional)')
    .setHelpText('You can find it in your UPI app under the payment.');
  // (add the "Upload your payment screenshot" file upload question here by hand)

  // ---- branching: "no extras" skips straight to payment
  wantItem.setChoices([
    wantItem.createChoice(WANT_EXTRAS_NO, pbPay),
    wantItem.createChoice(WANT_EXTRAS_YES, pbExtras)
  ]);

  // ---- after submit: WhatsApp link
  var waText = 'Hi siteforsite! ♡ I just filled the order form. Here is what I ordered and my payment screenshot:';
  form.setConfirmationMessage(
    'Thank you, your order is in! ♡\n\n' +
    'Last step: tap this link to message us on WhatsApp (' + WHATSAPP_DISPLAY + ') with what you ordered ' +
    'and your payment screenshot, and we will confirm your order:\n' +
    'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waText) + '\n\n' +
    'Your live link will be ready in 24 to 48 hours.'
  );

  // ---- responses go to a Google Sheet
  var sheet = SpreadsheetApp.create('siteforsite orders (responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  if (typeof form.setPublished === 'function') form.setPublished(true);
  form.setAcceptingResponses(true);

  // ---- pre-fill keys for the website's order builder
  var sample = form.createResponse()
    .withItemResponse(typeItem.createResponse(SITE_TYPES[0]))
    .withItemResponse(wantItem.createResponse(WANT_EXTRAS_YES))
    .withItemResponse(extrasItem.createResponse([EXTRAS[0]]))
    .withItemResponse(countsItem.createResponse('SFSCOUNTS'))
    .withItemResponse(totalItem.createResponse('424242'));
  var prefill = sample.toPrefilledUrl();
  var keyFor = function (needle) {
    var parts = prefill.split(/[?&]/);
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv.length === 2 && decodeURIComponent(kv[1].replace(/\+/g, ' ')) === needle) return kv[0];
    }
    return '';
  };
  var fields = {
    type: keyFor(SITE_TYPES[0]),
    wantExtras: keyFor(WANT_EXTRAS_YES),
    extras: keyFor(EXTRAS[0]),
    counts: keyFor('SFSCOUNTS'),
    total: keyFor('424242')
  };

  var viewUrl = form.getPublishedUrl();
  var shortUrl = viewUrl;
  try { shortUrl = form.shortenFormUrl(viewUrl); } catch (e) {}

  Logger.log('================ siteforsite order form is ready ================');
  Logger.log('Share link:  ' + shortUrl);
  Logger.log('Edit link:   ' + form.getEditUrl());
  Logger.log('Responses:   ' + sheet.getUrl());
  Logger.log('');
  Logger.log('Paste these two lines into assets/js/config.js (or send them to Claude):');
  Logger.log('  googleFormUrl: "' + viewUrl + '",');
  Logger.log('  googleFormFields: ' + JSON.stringify(fields) + ',');
  Logger.log('');
  Logger.log('Now open the edit link and add the two file upload questions:');
  Logger.log('  1) end of "Your website": "Upload pictures of the UI you love" (images, up to 5 files)');
  Logger.log('  2) end of "Payment": "Upload your payment screenshot" (images, 1 file, required)');
  if (!qrAdded) {
    Logger.log('');
    Logger.log('Your payment QR could not be loaded from ' + QR_IMAGE_URL + '.');
    Logger.log('Add it by hand: open the "Payment" section and click the image icon in the side toolbar.');
  }
}

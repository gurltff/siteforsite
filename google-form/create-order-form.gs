/**
 * siteforsite · short order form builder
 *
 * Builds the short siteforsite order form (no payment in it) in YOUR Google
 * account, links it to a Google Sheet, and prints the lines for the website.
 *
 * How payment works now: after the form, the customer says hi on WhatsApp and
 * you send them a UPI request for half their total to book. You send a
 * preview, and they pay the other half after they approve it.
 *
 * How to use (about 2 minutes):
 *   1. Open your Apps Script project (or script.google.com → New project).
 *   2. Replace all the code with this file and press Ctrl + S.
 *   3. Pick "createOrderForm" in the menu at the top and click Run.
 *      (If Google asks for permission again: Advanced → Go to … → Allow.)
 *   4. Open "Execution log" at the bottom and send the lines to Claude.
 *   5. Google doesn't let scripts add file upload questions, so add one by hand
 *      in the form editor: at the end, File upload,
 *      "Upload pictures of the UI you love", images only, up to 5 files.
 *   6. Delete the old order form (the one with the payment QR) in Google Forms.
 *
 * Keep the choice labels below in sync with FORM_LABELS in assets/js/main.js,
 * because the website pre-fills the form with them.
 */

// ---------------------------------------------------------------- settings
var WHATSAPP_NUMBER = '919355143330';
var WHATSAPP_DISPLAY = '93551 43330';

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

// ---------------------------------------------------------------- build
function createOrderForm() {
  var form = FormApp.create('siteforsite · short order form');
  form.setDescription(
    'Hi! ♡ Tell us about the website you want. It takes about 2 minutes.\n\n' +
    'How paying works: after you submit, tap the WhatsApp link and we will send you a UPI request ' +
    'for half your total to book. We build your site and send you a preview, and you pay the other ' +
    'half only after you love it. No QR codes, nothing to type.'
  );
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);
  form.setPublishingSummary(false); // customers never see each other's answers

  form.addTextItem().setTitle('Your name').setRequired(true);
  form.addTextItem()
    .setTitle('Your WhatsApp number')
    .setHelpText('We send your payment request, preview and live link here.')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Please type a phone number, like 98765 43210 or +91 98765 43210.')
      .requireTextMatchesPattern('^[+0-9 ()]{10,16}$')
      .build());

  var typeItem = form.addMultipleChoiceItem();
  typeItem.setTitle('What type of website do you want?')
    .setChoiceValues(SITE_TYPES)
    .showOtherOption(true)
    .setRequired(true);

  var extrasItem = form.addCheckboxItem();
  extrasItem.setTitle('Extras (optional)')
    .setHelpText('Only tick these if you want them. Every site is ₹150 without extras.')
    .setChoiceValues(EXTRAS);
  var countsItem = form.addTextItem()
    .setTitle('How many? (only for extra pages or change rounds)')
    .setHelpText('For example: Extra pages: 2');

  form.addParagraphTextItem()
    .setTitle('What do you want on your site?')
    .setHelpText('Text for the page, your links, dates, venue, prices, a message for someone special... anything we should put on it.')
    .setRequired(true);
  form.addTextItem()
    .setTitle('Colours or vibe you want (optional)')
    .setHelpText('For example: baby pink and cream, dark and minimal, cute y2k, aesthetic pastel.');
  form.addParagraphTextItem()
    .setTitle('Links to sites or Pinterest pins you love (optional)')
    .setHelpText('Paste links to any UI inspo. You can also upload pictures just below.');
  // (add the "Upload pictures of the UI you love" file upload question here by hand)

  var waText = 'Hi siteforsite! ♡ I just filled the order form.';
  form.setConfirmationMessage(
    'Thank you, we got your order! ♡\n\n' +
    'Last step: tap this link to say hi on WhatsApp (' + WHATSAPP_DISPLAY + '). ' +
    'We will reply with a UPI request for half your total to book your site:\n' +
    'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waText) + '\n\n' +
    'You pay the other half after you see your preview and love it.'
  );

  var sheet = SpreadsheetApp.create('siteforsite orders (short form)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  if (typeof form.setPublished === 'function') form.setPublished(true);
  form.setAcceptingResponses(true);

  // pre-fill keys for the website's order builder
  var sample = form.createResponse()
    .withItemResponse(typeItem.createResponse(SITE_TYPES[0]))
    .withItemResponse(extrasItem.createResponse([EXTRAS[0]]))
    .withItemResponse(countsItem.createResponse('SFSCOUNTS'));
  var prefill = sample.toPrefilledUrl();
  var keyFor = function (needle) {
    var parts = prefill.split(/[?&]/);
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv.length === 2 && decodeURIComponent(kv[1].replace(/\+/g, ' ')) === needle) return kv[0];
    }
    return '';
  };
  var fields = { type: keyFor(SITE_TYPES[0]), extras: keyFor(EXTRAS[0]), counts: keyFor('SFSCOUNTS') };

  var viewUrl = form.getPublishedUrl();
  var shortUrl = viewUrl;
  try { shortUrl = form.shortenFormUrl(viewUrl); } catch (e) {}

  Logger.log('============ siteforsite short order form is ready ============');
  Logger.log('Share link:  ' + shortUrl);
  Logger.log('Edit link:   ' + form.getEditUrl());
  Logger.log('Responses:   ' + sheet.getUrl());
  Logger.log('');
  Logger.log('Send these two lines to Claude (or paste them into assets/js/config.js):');
  Logger.log('  googleFormUrl: "' + viewUrl + '",');
  Logger.log('  googleFormFields: ' + JSON.stringify(fields) + ',');
  Logger.log('');
  Logger.log('Then open the edit link and add one File upload question at the end:');
  Logger.log('  "Upload pictures of the UI you love" (images only, up to 5 files)');
  Logger.log('And delete the old order form (the one with the payment QR) in Google Forms.');
}

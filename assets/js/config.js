/*
  siteforsite settings — edit these, save, and push. Nothing else needs to change.

  googleFormUrl   Paste your Google Form's share link here (the one that starts with
                  https://forms.gle/... or https://docs.google.com/forms/...).
                  While it is empty, every "order form" button opens WhatsApp instead,
                  so nothing on the site is ever broken.
  googleFormFields  The pre-fill keys the form script prints (google-form/create-order-form.gs).
                  With these, "fill the order form" in the order builder opens the form
                  with the chosen site, extras and total already filled in.
  whatsappNumber  Country code + number, digits only (used for wa.me links).
  displayNumber   How the number is written on the page.
*/
window.SFS_CONFIG = {
  googleFormUrl: "",
  googleFormFields: null,
  whatsappNumber: "919355143330",
  displayNumber: "93551 43330",
};

/* =========================================================
   הגדרות הקטלוג — Elafandy catalog settings
   Edit this file only. No other file needs to change.
   ========================================================= */
window.SITE = {
  nameHe:  'אלאפנדי בע״מ',
  nameEn:  'Elafandy',
  tagline: 'מחשבים ואלקטרוניקה',
  intro:   'מגוון ענק של מחשבים, מסכים, ציוד היקפי ורכיבי חומרה מהמותגים המובילים בעולם.',

  /* Contact — digits only, with country code (e.g. 972541234567) */
  whatsapp:     '97246110442',
  phone:        '97246110442',
  phoneDisplay: '0097246110442',  // how the number is shown on the page

  /* Second WhatsApp for orders (leave '' to hide the button) */
  whatsapp2:     '972525518000',
  whatsapp2Name: { he: 'ניזאר', ar: 'نزار', en: 'Nezar' },

  /* Optional (leave '' to hide) */
  email:   '',
  address: '',
  hours:   '',

  /* Prices:
     'public' – everyone sees prices
     'login'  – prices visible after login only (as in the previous site)
     'hidden' – no prices, "contact us" instead                           */
  /* Look of the site: 'royal' (wine & gold), 'tech' (white retailer), 'dark' (premium dark), 'clean' (minimal) */
  skin: 'tech',

  priceMode: 'login',
  vatNote:   'לא כולל מע״מ',
  footNote:  'המחירים אינם כוללים מע״מ ומלאי עשוי להשתנות.',

  /* Login users (customers) are managed in tools\users.txt — see README.
     Extra users can still be added here as SHA-256 of "username:password". */
  users: []
};

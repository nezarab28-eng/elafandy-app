/* =========================================================
   Languages: עברית (he) · العربية (ar) · English (en)
   Product names stay as in the price list. Everything else is translated here.
   To fix a translation: change the text below, save, run UPDATE_CATALOG.bat.
   ========================================================= */
(function () {
  'use strict';
  var LANGS = { he: { label: 'עברית', dir: 'rtl' }, ar: { label: 'العربية', dir: 'rtl' }, en: { label: 'English', dir: 'ltr' } };

  /* texts about the business (Hebrew comes from assets/config.js) */
  var SITE_TXT = {
    ar: {
      name: 'الأفندي م.ض.',
      tagline: 'حواسيب وإلكترونيات',
      intro: 'تشكيلة واسعة من الحواسيب والشاشات والملحقات وقطع الأجهزة من أبرز الماركات العالمية.',
      vatNote: 'غير شامل الضريبة',
      footNote: 'الأسعار لا تشمل ضريبة القيمة المضافة، والمخزون قابل للتغيير.'
    },
    en: {
      name: 'Elafandy Ltd.',
      tagline: 'Computers & Electronics',
      intro: "A wide range of computers, monitors, peripherals and components from the world's leading brands.",
      vatNote: 'excl. VAT',
      footNote: 'Prices exclude VAT. Stock may change.'
    }
  };

  /* [hebrew, arabic, english] */
  var T = {
    skip: ['דלג לתוכן', 'انتقل إلى المحتوى', 'Skip to content'],
    homeAria: ['דף הבית', 'الصفحة الرئيسية', 'Home page'],
    searchPh: ['חיפוש לפי שם מוצר, מותג, דגם או מק״ט', 'ابحث باسم المنتج أو الماركة أو الموديل أو رقم الصنف', 'Search by product, brand, model or SKU'],
    searchAria: ['חיפוש מוצרים', 'البحث عن منتجات', 'Search products'],
    clearSearch: ['ניקוי חיפוש', 'مسح البحث', 'Clear search'],
    cart: ['סל הזמנה', 'سلة الطلب', 'Order cart'],
    cartTitle: ['סל ההזמנה', 'سلة الطلب', 'Your order'],
    call: ['התקשרו', 'اتصلوا بنا', 'Call us'],
    whatsapp: ['וואטסאפ', 'واتساب', 'WhatsApp'],
    login: ['כניסה ללקוחות', 'دخول الزبائن', 'Customer login'],
    logout: ['התנתקות', 'تسجيل الخروج', 'Log out'],
    deptsAria: ['מחלקות', 'الأقسام', 'Departments'],
    language: ['שפה', 'اللغة', 'Language'],
    allProducts: ['כל המוצרים', 'جميع المنتجات', 'All products'],
    waHello: ['שלום, אשמח לקבל פרטים', 'مرحباً، أودّ الحصول على تفاصيل', 'Hello, I would like more details'],
    waProduct: ['שלום, אני מעוניין/ת במוצר: ', 'مرحباً، أنا مهتم بالمنتج: ', 'Hello, I am interested in: '],
    waOos: ['שלום, רציתי לבדוק מתי יחזור למלאי: ', 'مرحباً، متى سيتوفر هذا المنتج مجدداً: ', 'Hello, when will this be back in stock: '],
    waSearching: ['שלום, אני מחפש/ת: ', 'مرحباً، أبحث عن: ', 'Hello, I am looking for: '],
    sku: ['מק״ט', 'رقم الصنف', 'SKU'],
    oos: ['אזל מהמלאי', 'نفد من المخزون', 'Out of stock'],
    priceAsk: ['מחיר בפנייה', 'السعر عند الطلب', 'Price on request'],
    priceLocked: ['מחיר ללקוחות', 'السعر للزبائن', 'Customer price'],
    compatible: ['תואם', 'متوافق', 'Compatible'],
    waCheck: ['בדיקת זמינות בוואטסאפ', 'الاستفسار عن التوفر عبر واتساب', 'Ask about availability on WhatsApp'],
    addToCart: ['הוספה לסל', 'أضف إلى السلة', 'Add to cart'],
    breadcrumb: ['מיקום', 'المسار', 'Breadcrumb'],
    home: ['ראשי', 'الرئيسية', 'Home'],
    heroAll: ['לכל המוצרים', 'تصفّح كل المنتجات', 'Browse all products'],
    heroAsk: ['שאלו אותנו בוואטסאפ', 'اسألونا عبر واتساب', 'Ask us on WhatsApp'],
    statProducts: ['מוצרים בקטלוג', 'منتجاً في الكتالوج', 'products'],
    statCats: ['קטגוריות', 'فئة', 'categories'],
    statDepts: ['מחלקות', 'أقسام', 'departments'],
    kickerDepts: ['מחלקות', 'الأقسام', 'Departments'],
    deptsTitle: ['מה תרצו למצוא היום?', 'عمّ تبحثون اليوم؟', 'What are you looking for today?'],
    allN: ['כל {n} המוצרים', 'كل المنتجات ({n})', 'All {n} products'],
    deptMeta: ['{n} מוצרים · {c} קטגוריות', 'المنتجات: {n} · الفئات: {c}', '{n} products · {c} categories'],
    kickerToc: ['תוכן העניינים', 'الفهرس', 'Index'],
    tocTitle: ['כל הקטגוריות', 'جميع الفئات', 'All categories'],
    bandTitle: ['מצאתם מוצר? נשמח לעזור', 'وجدتم ما تبحثون عنه؟ يسعدنا مساعدتكم', 'Found something? We are happy to help'],
    bandText: ['שלחו לנו הודעה עם מק״ט המוצר ונחזור אליכם עם זמינות ומחיר.', 'أرسلوا لنا رسالة مع رقم الصنف وسنعود إليكم بالتوفر والسعر.', 'Send us the product SKU and we will get back to you with availability and price.'],
    searchResults: ['תוצאות חיפוש', 'نتائج البحث', 'Search results'],
    wholeDept: ['כל המחלקה', 'كل القسم', 'Entire department'],
    catsAria: ['קטגוריות', 'الفئات', 'Categories'],
    sort: ['מיון', 'ترتيب', 'Sort'],
    sortCat: ['לפי קטגוריה', 'حسب الفئة', 'By category'],
    sortPa: ['מחיר: מהנמוך לגבוה', 'السعر: من الأقل إلى الأعلى', 'Price: low to high'],
    sortPd: ['מחיר: מהגבוה לנמוך', 'السعر: من الأعلى إلى الأقل', 'Price: high to low'],
    sortNm: ['לפי שם', 'حسب الاسم', 'By name'],
    stockOnly: ['רק מוצרים במלאי', 'المتوفر فقط', 'In stock only'],
    all: ['הכל', 'الكل', 'All'],
    nProducts: ['{n} מוצרים', ['منتج واحد', 'منتجان', '{n} منتجات', '{n} منتجاً'], ['1 product', '{n} products']],
    searching: ['מחפש:', 'البحث عن:', 'Searching for:'],
    searchAll: ['חיפוש בכל הקטלוג', 'البحث في كل الكتالوج', 'Search the whole catalog'],
    noResults: ['לא נמצאו מוצרים', 'لم نجد منتجات مطابقة', 'No products found'],
    noResultsText: ['נסו מילה אחרת, מק״ט, או שלחו לנו הודעה ונבדוק עבורכם.', 'جرّبوا كلمة أخرى أو رقم الصنف، أو أرسلوا لنا رسالة ونبحث لكم.', 'Try another word or SKU, or message us and we will check for you.'],
    askUs: ['שאלו אותנו', 'اسألونا', 'Ask us'],
    showMore: ['הצגת מוצרים נוספים ({n})', 'عرض المزيد ({n})', 'Show more ({n})'],
    category: ['קטגוריה', 'الفئة', 'Category'],
    oosNote: ['שלחו לנו הודעה ונעדכן כשיחזור למלאי.', 'أرسلوا لنا رسالة وسنعلمكم عند توفره.', 'Message us and we will let you know when it is back.'],
    loginToSee: ['כניסה לצפייה במחיר', 'سجّلوا الدخول لرؤية السعر', 'Log in to see the price'],
    desc: ['תיאור', 'الوصف', 'Description'],
    specs: ['מפרט טכני', 'المواصفات التقنية', 'Specifications'],
    specNote: ['לפרטים נוספים ומפרט מלא על המוצר — פנו אלינו בוואטסאפ או בטלפון וציינו את המק״ט', 'لمزيد من التفاصيل والمواصفات الكاملة، تواصلوا معنا عبر واتساب أو الهاتف واذكروا رقم الصنف', 'For full details and specifications, contact us on WhatsApp or by phone and mention SKU'],
    qty: ['כמות', 'الكمية', 'Quantity'],
    qtyPlus: ['הוספת יחידה', 'زيادة الكمية', 'Increase'],
    qtyMinus: ['הפחתת יחידה', 'إنقاص الكمية', 'Decrease'],
    addToOrder: ['הוספה לסל ההזמנה', 'أضف إلى سلة الطلب', 'Add to order'],
    orderWa: ['הזמנה בוואטסאפ', 'اطلب عبر واتساب', 'Order on WhatsApp'],
    copyLink: ['העתקת קישור', 'نسخ الرابط', 'Copy link'],
    phoneLbl: ['טלפון:', 'هاتف:', 'Phone:'],
    sameCat: ['מאותה קטגוריה', 'من نفس الفئة', 'Same category'],
    moreProducts: ['מוצרים נוספים', 'منتجات أخرى', 'More products'],
    allOf: ['לכל {c}', 'كل {c}', 'All {c}'],
    notFound: ['המוצר לא נמצא', 'المنتج غير موجود', 'Product not found'],
    notFoundText: ['ייתכן שהמוצר הוסר מהקטלוג.', 'ربما أُزيل المنتج من الكتالوج.', 'It may have been removed from the catalog.'],
    catalogOf: ['קטלוג {name}', 'كتالوج {name}', '{name} catalog'],
    priceDate: ['מחירון מעודכן ל־{d}.', 'الأسعار محدّثة بتاريخ {d}.', 'Prices updated {d}.'],
    copied: ['הקישור הועתק', 'تم نسخ الرابط', 'Link copied'],
    loggedOut: ['התנתקת', 'تم تسجيل الخروج', 'Logged out'],
    loginOk: ['התחברת בהצלחה', 'تم تسجيل الدخول بنجاح', 'Logged in'],
    loginBad: ['שם משתמש או סיסמה שגויים', 'اسم المستخدم أو كلمة المرور غير صحيحة', 'Wrong username or password'],
    loginText: ['הזינו שם משתמש וסיסמה כדי לראות מחירים.', 'أدخلوا اسم المستخدم وكلمة المرور لرؤية الأسعار.', 'Enter your username and password to see prices.'],
    username: ['שם משתמש', 'اسم المستخدم', 'Username'],
    password: ['סיסמה', 'كلمة المرور', 'Password'],
    enter: ['כניסה', 'دخول', 'Log in'],
    close: ['סגירה', 'إغلاق', 'Close'],
    rights: ['כל הזכויות שמורות', 'جميع الحقوق محفوظة', 'All rights reserved'],
    disclaimer: ['תמונות להמחשה בלבד', 'الصور للتوضيح فقط', 'Images are for illustration only'],
    waFab: ['שליחת הודעה בוואטסאפ', 'راسلونا عبر واتساب', 'Message us on WhatsApp'],
    /* cart */
    cartEmpty: ['הסל ריק.', 'السلة فارغة.', 'Your cart is empty.'],
    cartEmptyHint: ['הוסיפו מוצרים בלחיצה על כפתור הסל בכרטיס המוצר.', 'أضيفوا منتجات بالضغط على زر السلة في بطاقة المنتج.', 'Add products with the cart button on each product.'],
    perUnit: ['ליח׳', 'للوحدة', 'each'],
    remove: ['הסרה מהסל', 'إزالة من السلة', 'Remove'],
    cartSum: ['{n} מוצרים · {u} יחידות', 'المنتجات: {n} · القطع: {u}', 'Items: {n} · Units: {u}'],
    bizDetails: ['פרטי העסק', 'بيانات المصلحة', 'Business details'],
    bizName: ['שם העסק *', 'اسم المصلحة *', 'Business name *'],
    bizPhone: ['טלפון *', 'الهاتف *', 'Phone *'],
    contact: ['איש קשר', 'اسم المسؤول', 'Contact person'],
    notes: ['הערות להזמנה', 'ملاحظات على الطلب', 'Order notes'],
    sendWa: ['שליחת ההזמנה בוואטסאפ', 'إرسال الطلب عبر واتساب', 'Send order on WhatsApp'],
    pdf: ['הזמנה כקובץ PDF', 'الطلب كملف PDF', 'Order as PDF'],
    waTo1: ['אלאפנדי', 'الأفندي', 'Elafandy'],
    archBtn: ['ההזמנות הקודמות שלי', 'طلبياتي السابقة', 'My previous orders'],
    archBack: ['חזרה לסל', 'العودة إلى السلة', 'Back to the cart'],
    archLoading: ['טוען…', 'جارٍ التحميل…', 'Loading…'],
    archEmpty: ['עדיין אין הזמנות שמורות. כל הזמנה שתשלחו תישמר כאן.', 'لا توجد طلبيات محفوظة بعد. كل طلبية ترسلونها ستُحفظ هنا.', 'No saved orders yet. Every order you send will be kept here.'],
    archFail: ['לא ניתן לטעון את ההזמנות כרגע. נסו שוב מאוחר יותר.', 'تعذّر تحميل الطلبيات الآن. حاولوا لاحقاً.', 'Could not load your orders right now. Please try again later.'],
    archRelogin: ['כדי לראות את ההזמנות הקודמות יש להתחבר פעם נוספת עם שם המשתמש והסיסמה.', 'لرؤية طلبياتكم السابقة يرجى تسجيل الدخول مرة أخرى باسم المستخدم وكلمة المرور.', 'To see your previous orders, please log in again with your username and password.'],
    archItems: ['מוצרים: {n}', 'عدد المنتجات: {n}', 'Items: {n}'],
    archReorder: ['הוספה לסל', 'إضافة إلى السلة', 'Add to cart'],
    archReadded: ['{n} מוצרים נוספו לסל', 'أُضيف إلى السلة: {n}', '{n} products added to the cart'],
    pdfDl: ['הורדה', 'تنزيل', 'Download'],
    pdfShare: ['שיתוף', 'مشاركة', 'Share'],
    pdfDownloaded: ['הקובץ ירד למכשיר. אפשר לשלוח אותו במייל, בוואטסאפ או בכל דרך אחרת.', 'تم تنزيل الملف إلى جهازك. يمكنكم إرساله بالإيميل أو واتساب أو بأي طريقة أخرى.', 'The file was downloaded. You can send it by email, WhatsApp or any other way.'],
    clearCart: ['ריקון הסל', 'إفراغ السلة', 'Empty cart'],
    clearSure: ['ללחוץ שוב לאישור ריקון הסל', 'اضغطوا مرة أخرى لتأكيد إفراغ السلة', 'Click again to confirm'],
    needBiz: ['נא למלא את שם העסק', 'يرجى كتابة اسم المصلحة', 'Please enter the business name'],
    needPhone: ['נא למלא מספר טלפון תקין', 'يرجى كتابة رقم هاتف صحيح', 'Please enter a valid phone number'],
    added: ['נוסף לסל · {u} יחידות בסל', 'أُضيف إلى السلة · عدد القطع في السلة: {u}', 'Added · {u} unit(s) in your cart'],
    sentWa: ['ההזמנה נפתחה בוואטסאפ – לחצו "שלח" שם. הסל רוקן.', 'فُتح الطلب في واتساب – اضغطوا «إرسال» هناك. تم إفراغ السلة.', 'Your order opened in WhatsApp – tap Send there. Cart emptied.'],
    sentShare: ['ההזמנה נשלחה. הסל רוקן.', 'تم إرسال الطلب وإفراغ السلة.', 'Order sent. Cart emptied.'],
    pdfSaved: ['הקובץ נשמר. צרפו אותו בשיחת הוואטסאפ שנפתחה. הסל רוקן.', 'تم حفظ الملف. أرفقوه في محادثة واتساب التي فُتحت. تم إفراغ السلة.', 'File saved. Attach it in the WhatsApp chat that opened. Cart emptied.'],
    pdfMaking: ['מכין קובץ…', 'جارٍ تجهيز الملف…', 'Preparing file…'],
    pdfFail: ['לא ניתן ליצור PDF כרגע. שלחו את ההזמנה בוואטסאפ', 'تعذّر إنشاء ملف PDF الآن. أرسلوا الطلب عبر واتساب', 'Could not create the PDF. Please send the order on WhatsApp'],
    /* order message & PDF */
    oNew: ['הזמנה חדשה', 'طلب جديد', 'New order'],
    oOrder: ['הזמנה', 'طلب', 'Order'],
    oNo: ['מס׳ הזמנה', 'رقم الطلب', 'Order no.'],
    oBiz: ['שם העסק', 'اسم المصلحة', 'Business'],
    oPhone: ['טלפון', 'الهاتف', 'Phone'],
    oContact: ['איש קשר', 'المسؤول', 'Contact'],
    oItems: ['מוצרים', 'المنتجات', 'Items'],
    oQty: ['כמות', 'الكمية', 'Qty'],
    oName: ['שם המוצר', 'اسم المنتج', 'Product'],
    oUnit: ['מחיר ליח׳', 'سعر الوحدة', 'Unit price'],
    oLine: ['סה״כ', 'المجموع', 'Total'],
    oTotal: ['סה״כ: {n} מוצרים, {u} יחידות', 'المجموع: المنتجات {n}، القطع {u}', 'Total: {n} item(s), {u} unit(s)'],
    oNotes: ['הערות', 'ملاحظات', 'Notes'],
    oCont: ['המשך', 'تتمة', 'continued'],
    oPage: ['עמוד {p} מתוך {n}', 'صفحة {p} من {n}', 'Page {p} of {n}'],
    pdfAttach: ['שלום, מצורפת הזמנה {no} מ{biz} (קובץ PDF).', 'مرحباً، مرفق الطلب {no} من {biz} (ملف PDF).', 'Hello, attached is order {no} from {biz} (PDF).'],
    shareText: ['הזמנה מ{biz}', 'طلب من {biz}', 'Order from {biz}']
  };

  /* department names by id: [arabic, english] */
  var GROUPS = {
    computers: ['الحواسيب', 'Computers'],
    displays: ['الشاشات وأجهزة العرض', 'Displays & Projectors'],
    components: ['قطع الحاسوب', 'PC Components'],
    storage: ['التخزين', 'Storage'],
    peripherals: ['الملحقات', 'Peripherals'],
    printing: ['الطابعات والأحبار', 'Printers & Ink'],
    network: ['الشبكات والمراقبة', 'Networking & Security'],
    power: ['الطاقة والتوصيلات', 'Power & Cables'],
    office: ['المكتب والبرمجيات', 'Office & Software'],
    more: ['منتجات أخرى', 'More products']
  };

  /* category names (Hebrew name from the price list): [arabic, english] */
  var CATS = {
    'מחשבים ניידים': ['حواسيب محمولة', 'Laptops'],
    'מחשבים שולחניים': ['حواسيب مكتبية', 'Desktop PCs'],
    'מחשבי All-in-One': ['حواسيب All-in-One', 'All-in-One PCs'],
    'טאבלטים': ['أجهزة لوحية', 'Tablets'],
    'מסכים': ['شاشات', 'Monitors'],
    'מסכים למחשבים ניידים': ['شاشات للحواسيب المحمولة', 'Laptop Screens'],
    'זרועות למסכים': ['حوامل شاشات', 'Monitor Arms'],
    'מקרנים': ['أجهزة عرض (بروجكتور)', 'Projectors'],
    'מסכי הקרנה': ['شاشات عرض', 'Projection Screens'],
    'פנלים למקרנים': ['لوحات توصيل للبروجكتور', 'Projector Wall Panels'],
    'מעבדים': ['معالجات', 'Processors'],
    'לוחות אם': ['لوحات أم', 'Motherboards'],
    'זכרונות': ['ذواكر RAM', 'Memory (RAM)'],
    'כרטיסי מסך': ['كروت شاشة', 'Graphics Cards'],
    'כרטיסי קול': ['كروت صوت', 'Sound Cards'],
    'כרטיסי יציאות': ['كروت منافذ إضافية', 'Expansion Cards'],
    'מארזים': ['صناديق حاسوب (كيس)', 'PC Cases'],
    'מאווררים וקירור': ['مراوح وتبريد', 'Fans & Cooling'],
    'דיסקים קשיחים': ['أقراص تخزين داخلية', 'Hard Drives & SSDs'],
    'דיסקים חיצוניים': ['أقراص خارجية', 'External Drives'],
    'דיסקים FLASH DRIVE': ['ذواكر فلاش USB', 'USB Flash Drives'],
    'כרטיסי זכרון למצלמות': ['بطاقات ذاكرة', 'Memory Cards'],
    'צורבים DVD': ['ناسخات DVD', 'DVD Writers'],
    'מקלדות': ['لوحات مفاتيح', 'Keyboards'],
    'עכברים': ['فأرات', 'Mice'],
    'אוזניות ומיקרופונים': ['سماعات رأس وميكروفونات', 'Headsets & Microphones'],
    'רמקולים': ['مكبرات صوت', 'Speakers'],
    'מצלמות אינטרנט': ['كاميرات ويب', 'Webcams'],
    'ידיות משחק': ['أذرع ألعاب', 'Game Controllers'],
    'כסאות': ['كراسي', 'Chairs'],
    'נרתיקים וציוד נלווה': ['حقائب وإكسسوارات', 'Bags & Accessories'],
    'מדפסות לייזר': ['طابعات ليزر', 'Laser Printers'],
    'מדפסות לייזר משולבות': ['طابعات ليزر متعددة الوظائف', 'Laser Multifunction Printers'],
    'מדפסות הזרקת דיו משולבות': ['طابعات حبر متعددة الوظائف', 'Inkjet Multifunction Printers'],
    'מדפסות מדבקות': ['طابعات ملصقات', 'Label Printers'],
    'טונרים מקוריים': ['تونر أصلي', 'Original Toners'],
    'טונרים תואמים': ['تونر متوافق', 'Compatible Toners'],
    'תופים מקוריים': ['وحدات درام أصلية', 'Original Drum Units'],
    'תופים תואמים': ['وحدات درام متوافقة', 'Compatible Drum Units'],
    'דיו מקורי': ['أحبار أصلية', 'Original Ink'],
    'דיו תחליפי': ['أحبار بديلة', 'Compatible Ink'],
    'דיו וטונרים': ['أحبار وتونر', 'Ink & Toner'],
    'דיו': ['أحبار', 'Ink'],
    'סורקים': ['ماسحات ضوئية', 'Scanners'],
    'נייר A4': ['ورق A4', 'A4 Paper'],
    'ציוד תקשורת': ['معدات شبكات', 'Networking Equipment'],
    'מצלמות רשת': ['كاميرات مراقبة', 'Security Cameras'],
    'מצלמות רשת EZVIZ': ['كاميرات EZVIZ', 'EZVIZ Cameras'],
    'מערכות אל-פסק UPS': ['مزودات طاقة احتياطية UPS', 'UPS Systems'],
    'מטענים לניידים': ['شواحن حواسيب محمولة', 'Laptop Chargers'],
    'מטענים וספקים': ['شواحن ومزودات طاقة', 'Chargers & Power Supplies'],
    'מטענים וסוללות': ['شواحن وبطاريات', 'Chargers & Batteries'],
    'כבלים ומתאמים': ['كوابل ومحولات', 'Cables & Adapters'],
    'ממירים': ['محوّلات إشارة', 'Signal Converters'],
    'מגברים ומפצלים': ['موزّعات ومقوّيات إشارة', 'Hubs & Splitters'],
    'מגרסות': ['آلات تمزيق الورق', 'Paper Shredders'],
    'מכשירי למינציה': ['آلات تغليف حراري', 'Laminators'],
    'תוכנות': ['برمجيات', 'Software']
  };

  var lang = 'he';
  try { lang = localStorage.getItem('elf_lang') || 'he'; } catch (e) {}
  if (!LANGS[lang]) lang = 'he';
  var idx = { he: 0, ar: 1, en: 2 }[lang];

  var root = document.documentElement;
  root.setAttribute('lang', lang);
  root.setAttribute('dir', LANGS[lang].dir);

  function t(key, vars) {
    var row = T[key], s = row ? (row[idx] || row[0]) : key;
    if (Array.isArray(s)) {               // number-dependent forms (Arabic: 1 / 2 / 3-10 / 11+)
      var n = vars ? parseInt(String(vars.n).replace(/\D/g, ''), 10) : 0, m = n % 100;
      s = s.length === 2 ? s[n === 1 ? 0 : 1] : s[n === 1 ? 0 : n === 2 ? 1 : (m >= 3 && m <= 10) ? 2 : 3];
    }
    if (vars) for (var k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }
  function tc(name) { var r = CATS[name]; return lang === 'he' || !r ? name : r[idx - 1]; }
  function tg(g) { var r = GROUPS[g.id]; return lang === 'he' || !r ? g.name : r[idx - 1]; }
  function site(key) {
    var S = window.SITE || {};
    var he = { name: S.nameHe, tagline: S.tagline, intro: S.intro, vatNote: S.vatNote, footNote: S.footNote }[key];
    if (lang === 'he') return he || '';
    var o = SITE_TXT[lang] || {};
    return o[key] || he || '';
  }
  /* every translation of a category, for search */
  function catWords(name) { var r = CATS[name]; return r ? r.join(' ') : ''; }

  function applyStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.querySelectorAll('[data-i18n-site]').forEach(function (el) { el.textContent = site(el.getAttribute('data-i18n-site')); });
    var sel = document.getElementById('langSel');
    if (sel) {
      sel.innerHTML = Object.keys(LANGS).map(function (k) { return '<option value="' + k + '"' + (k === lang ? ' selected' : '') + '>' + LANGS[k].label + '</option>'; }).join('');
      sel.setAttribute('aria-label', t('language'));
      sel.addEventListener('change', function () { setLang(this.value); });
    }
  }
  function setLang(l) {
    try { localStorage.setItem('elf_lang', l); } catch (e) {}
    location.reload();
  }

  window.I18N = { lang: lang, t: t, tc: tc, tg: tg, site: site, catWords: catWords, applyStatic: applyStatic, setLang: setLang, dir: LANGS[lang].dir };
})();

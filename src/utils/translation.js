// Simple translation utility for the entire website
const translations = {
  fa: {
    // Navigation
    home: 'خانه',
    articles: 'مقالات',
    news: 'اخبار',
    departments: 'دپارتمان‌ها',
    about: 'درباره ما',
    contact: 'تماس با ما',
    language: 'زبان',
    search: 'جستجو کنید',
    dashboard: 'داشبورد',
    profile: 'پروفایل',
    workspace: 'میزکار',
    login: 'ورود',
    logout: 'خروج',
    loading: 'در حال بارگذاری...',
    aboutUs: 'درباره ما',
    contactUs: 'تماس با ما',
    
    // Categories
    'اخبار': 'اخبار',
    'صنایع خلاق': 'صنایع خلاق',
    'بین الملل': 'بین الملل',
    'رسالت اجتماعی': 'رسالت اجتماعی',
    'مد و پوشاک': 'مد و پوشاک',
    'سلامت': 'سلامت',
    'صنایع غذایی': 'صنایع غذایی',
    
    // Common UI
    readMore: 'ادامه مطلب',
    search: 'جستجو',
    noResults: 'نتیجه‌ای یافت نشد',
    error: 'خطا در بارگذاری',
    retry: 'تلاش مجدد',
    save: 'ذخیره',
    cancel: 'لغو',
    delete: 'حذف',
    edit: 'ویرایش',
    add: 'افزودن',
    submit: 'ارسال',
    close: 'بستن',
    confirm: 'تایید',
    back: 'بازگشت',
    next: 'بعدی',
    previous: 'قبلی',
    
    // Languages
    persian: 'فارسی',
    english: 'English',
    arabic: 'العربية'
  },
  
  en: {
    // Navigation
    home: 'Home',
    articles: 'Articles',
    news: 'News',
    departments: 'Departments',
    about: 'About Us',
    contact: 'Contact Us',
    language: 'Language',
    search: 'Search...',
    dashboard: 'Dashboard',
    profile: 'Profile',
    workspace: 'Workspace',
    login: 'Login',
    logout: 'Logout',
    loading: 'Loading...',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    
    // Categories
    'اخبار': 'News',
    'صنایع خلاق': 'Creative Industries',
    'بین الملل': 'International',
    'رسالت اجتماعی': 'Social Responsibility',
    'مد و پوشاک': 'Fashion & Clothing',
    'سلامت': 'Health',
    'صنایع غذایی': 'Food Industry',
    
    // Common UI
    readMore: 'Read More',
    search: 'Search',
    noResults: 'No results found',
    error: 'Error loading',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    submit: 'Submit',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // Languages
    persian: 'Persian',
    english: 'English',
    arabic: 'Arabic'
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    articles: 'المقالات',
    news: 'الأخبار',
    departments: 'الأقسام',
    about: 'من نحن',
    contact: 'اتصل بنا',
    language: 'اللغة',
    search: 'ابحث...',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    workspace: 'مساحة العمل',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    loading: 'جاري التحميل...',
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
    
    // Categories
    'اخبار': 'الأخبار',
    'صنایع خلاق': 'الصناعات الإبداعية',
    'بین الملل': 'الدولية',
    'رسالت اجتماعی': 'المسؤولية الاجتماعية',
    'مد و پوشاک': 'الموضة والملابس',
    'سلامت': 'الصحة',
    'صنایع غذایی': 'الصناعات الغذائية',
    
    // Common UI
    readMore: 'اقرأ المزيد',
    search: 'بحث',
    noResults: 'لم يتم العثور على نتائج',
    error: 'خطأ في التحميل',
    retry: 'إعادة المحاولة',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    submit: 'إرسال',
    close: 'إغلاق',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    
    // Languages
    persian: 'الفارسية',
    english: 'الإنجليزية',
    arabic: 'العربية'
  }
};

let currentLanguage = 'fa';

// Initialize language from URL
const initLanguage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');
  if (lang && ['fa', 'en', 'ar'].includes(lang)) {
    currentLanguage = lang;
  }
};

// Get translation
export const t = (key) => {
  return translations[currentLanguage][key] || key;
};

// Change language
export const changeLanguage = (lang) => {
  if (['fa', 'en', 'ar'].includes(lang)) {
    currentLanguage = lang;
    // Update URL parameter
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
    // Reload page to apply translations
    window.location.reload();
  }
};

// Get current language
export const getCurrentLanguage = () => currentLanguage;

// Initialize on load
initLanguage();

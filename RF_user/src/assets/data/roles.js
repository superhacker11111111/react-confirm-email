export const UserRoles = {
  pro: 1,
  proPlus: 2,
  enterprise: 3,
  shopper: 4,
};

export const MemberRoles = [
  { label: 'Admin', code: 0 },
  { label: 'Professional', code: 1 },
  { label: 'ProfessionalPlus', code: 2 },
  { label: 'Diamond', code: 3 },
  { label: 'Shopper', code: 4 },
];

export const AdminRole = { code: 0, label: 'Admin' };
export const CompanyRole = { code: 1, label: 'Company' };
export const ShopperRole = { code: 2, label: 'Shopper' };

export const GeneralType = 0;
export const SocialType = 1;

export const Social = {
  google: 1,
  facebook: 2,
  twitter: 3,
};

export const Selectable = {
  Fence: 1,
  Category: 2,
  Detail: 3,
};

export const UserType = {
  Pro: 1,
  'Pro+': 2,
  Enterprise: 3,
  'Free Trial': 4,
  Basic: 5,
};

export const PAYMENT_TYPE = {
  MONTHLY: '0',
  YEARLY: '1',
};

export const INTEREST_LEVEL = {
  LOOKING: 'Ready to buy',
  BUY: 'Just looking',
};

export const FENCE_STATUS = {
  NOT_STARTED: '1',
  PENDING: '2',
  COMPLETE: '3',
  MODELING: '4',
};

export const SUBSCRIPTION_STATUS = {
  TRIAL: 'trialing',
  ACTIVE: 'active',
  PAUSE: 'paused',
  CANCELLED: 'canceled',
  NOSUBSCRIPTION: 'No Subscription',
};

export const EMAIL_TYPE = {
  SIGN_UP_VERIFY_EMAIL: 'signup_verify_email',
  SIGNUP_EMAIL: 'signup_email',
  UPGRADE_SUBSCRIPTION: 'upgrade_subscription',
  DOWNGRADE_SUBSCRIPTION: 'downgrade_subscription',
};

export const PRICE_VIEW_AVAILABLE = {
  AVAILABLE: '1',
  NOT_AVAILABLE: '0',
};

export const IMAGE_TYPES = [
  'image/bmp',
  'image/svg+xml',
  'image/heic',
  'image/tiff',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/x-icon',
  'image/png',
];

export const ALLOWED_SUBSCRIPTION_STATUS = ['active', 'trialing'];

export const S3_USER_AVATAR_FOLDER = 'users/';
export const S3_PRODUCT_IMAGE_FOLDER = 'products/';
export const S3_GALLERY_IMAGE_FOLDER = 'gallery/';
export const S3_CATEGORY_IMAGE_FOLDER = 'categories/';
export const S3_BLOG_FILE_FOLDER = 'blogs/';
export const S3_GALLERY_FOLDER = 'gallery/';
export const S3_FAQ_IMAGE_FOLDER = 'faq/';
export const S3_PRODUCT_DOC_FOLDER = 'products_pdf/';
export const S3_3D_FOLDER = 'models/';
export const S3_THUMBNAIL_FOLDER = 'thumbnails/';

export const DEFAULT_AVATAR = '/assets/icons/auth/ic_auth0.png';

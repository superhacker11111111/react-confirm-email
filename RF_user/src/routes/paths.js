// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}
function path2(sublink) {
  return `${sublink}`;
}

const ROOTS = '/';
const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  new: path2('/new'),
  login: path(ROOTS_AUTH, '/login'),
  setPassword: path(ROOTS_AUTH, '/setPassword'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
  resetPasswordVerify: path(ROOTS_AUTH, '/resetPasswordVerify'),
};

export const PATH_PAGE = {
  root: ROOTS,
  fenceDetail: {
    view: (id) => `/fenceDetail/${id}`,
  },
  fences: '/gallery-1',
  meeting: '/meeting',
  shopper: '/shopper',
  createAccount: '/createaccount',
  arpage: '/understandar',
  subscription: '/subscription',
  onboarding: '/onboarding',
  maintenance: '/maintenance',
  pricing: '/pricing',
  // pricing: { view: (id) => path2(`/pricing/${id}`) },
  checkout_v2: '/checkout_v2',
  payment: '/payment',
  newpayment: '/newpayment',
  trialpayment: '/trialpayment',
  about: '/about',
  getstarted: '/getstarted',
  contact: '/contact-us',
  faqs: '/faqs',
  blogfences: '/blogfences',
  edfence: '/realityfence-ed',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  services: '/marketing/services',
  paymentUpgrade: {
    view: (id) => path2(`/paymentupgrade/${id}`),
  },
  download: '/download',
  dpa: './dpa',
};
export const PATH_ONBOARDING = {
  onboarding: {
    addusers: path2('/addusers'),
    welcome: path2('/welcome'),
    requestFencesp: path2('/addfencesp'),
    requestFences: path2('/addfences'),
    requestFencesSwapper: path2('/requestfences'),
    categoryfences: path2('/categoryfences'),
    stylefences: path2('/stylefences'),
    selectfencesp: path2('/selectfencesp'),
    fenceRequest: path2('/fencerequest'),
    downloadApp: path2('/downloadApp'),
    tutorial: path2('/tutorial'),
    selectfencesconfirm: path2('/selectfencesconfirm'),
    planUpgradeCongratulationsPage: path2('/planUpgradeCongratulation'),
    fenceRequestCongratulation: path2('/fenceRequestCongratulation'),
    fenceSwapper: path2('/fenceswapper'),
    swapconfirm: path2('/swapconfirm'),
    view: (id) => path2(`/selectfences/${id}`),
    viewDetail: (id) => path2(`/detailfences/${id}`),
    userBilling: path2(`/billingPage`),
    userUpgradePricing: path2(`/userUpgradePricing`),
    userAlmostUpgrade: path2(`/userAlmostUpgrade`),
    almostcongratulation: path2('/almostcongratulation'),
  },
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_DASHBOARD, '/blank'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    fences: path(ROOTS_DASHBOARD, '/fences'),
    fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
    fileManagerRename: {
      view: (id) => path(ROOTS_DASHBOARD, `/files-manager/rename/${id}`),
    },
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    file: path(ROOTS_DASHBOARD, '/file'),
    contactus: path(ROOTS_DASHBOARD, '/contactus'),
    faqsupport: path(ROOTS_DASHBOARD, '/faqsupport'),
    edfences: path(ROOTS_DASHBOARD, '/edfences'),
    devices: path(ROOTS_DASHBOARD, '/device'),
    downloadfence: path(ROOTS_DASHBOARD, '/downloadfence'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/edit/${id}`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    updateplan: (id) => path(ROOTS_DASHBOARD, `/user/updateplan/${id}`),
    useralmost: (id) => path(ROOTS_DASHBOARD, `/user/useralmost/${id}`),
    switchbilling: (id) => path(ROOTS_DASHBOARD, `/user/switchbilling/${id}`),
    paymentmethod: (id) => path(ROOTS_DASHBOARD, `/user/paymentmethod/${id}`),
    updateInfoUser: (id) => path(ROOTS_DASHBOARD, `/user/info/${id}`),
    useraccountinfo: path(ROOTS_DASHBOARD, '/user/useraccountinfo'),
    usermanageinfo: (id) => path(ROOTS_DASHBOARD, `/user/usermanageinfo/${id}`),
    pausecongratulation: path(ROOTS_DASHBOARD, '/user/pausecongratulation'),
    resumecongratulation: path(ROOTS_DASHBOARD, '/user/resumecongratulation'),
    cancelcongratulation: path(ROOTS_DASHBOARD, '/user/cancelcongratulation'),
    plancongratulation: path(ROOTS_DASHBOARD, '/user/plancongratulation'),
    billingcongratulation: path(ROOTS_DASHBOARD, '/user/billingcongratulation'),
    paymentcongratulation: path(ROOTS_DASHBOARD, '/user/paymentcongratulation'),
    infocongratulation: path(ROOTS_DASHBOARD, '/user/infocongratulation'),
    userinfocongratulation: path(ROOTS_DASHBOARD, '/user/userinfocongratulation'),
    callForCancel: path(ROOTS_DASHBOARD, '/user/callForCancel'),
    callForSwitch: path(ROOTS_DASHBOARD, '/user/callForSwitch'),
    upgradingProTrial: (id) => path(ROOTS_DASHBOARD, `/user/upgradingprotrial/${id}`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
    history: path(ROOTS_DASHBOARD, '/invoice/billinghistory'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
    blogfences: '/blogfences',
    blogfence: path(ROOTS_DASHBOARD, '/blog/blogfence'),
    blogsDetail: {
      view: (id) => `/blogs/${id}`,
    },
    blogDetail: (id) => path(ROOTS_DASHBOARD, `/blog/${id}`),
  },
};

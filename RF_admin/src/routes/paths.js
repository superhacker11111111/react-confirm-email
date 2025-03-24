// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  setPassword: path(ROOTS_AUTH, '/setPassword'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  phoneVerify: path(ROOTS_AUTH, '/phoneVerify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  upgradeSuccess: `/upgradeSuccess`,
  billingSuccess: `/billingSuccess`,
  paymentSuccess: `/paymentSuccess`,
  upgradeAccountSuccess: '/upgradeAccountSuccess',
  upgradeUserInfoSuccess: '/upgradeUserInfoSuccess',
  upgradePlan: (id) => `/upgradePlan/${id}`,
  upgradeFromProTrial: (id) => `/upgradingfromprotrial/${id}`,
  almostDone: (id) => `/almostdone/${id}`,
  switchBilling: (id) => `/switchbilling/${id}`,
  paymentmethods: (id) => `/paymentmethods/${id}`,
  editAccount: (id) => `/account/${id}`,
  addCompanies: (id) => `/addComapnies/${id}`,
  changePassword: '/changePassword',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_DASHBOARD, '/blank'),
  addAdmin: path(ROOTS_DASHBOARD, '/addAdmin'),

  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    fences: path(ROOTS_DASHBOARD, '/fences'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    file: path(ROOTS_DASHBOARD, `/file`),
    billing: path(ROOTS_DASHBOARD, '/billing'),
    QA: {
      root: path(ROOTS_DASHBOARD, '/QA'),
      list: path(ROOTS_DASHBOARD, '/QA/list'),
      categorylist: path(ROOTS_DASHBOARD, '/QA/category'),
      newQA: path(ROOTS_DASHBOARD, '/QA/new'),
      newQACategory: path(ROOTS_DASHBOARD, '/QA/newcategory'),
      editQA: (id) => path(ROOTS_DASHBOARD, `/QA/edit/${id}`),
      editQACategory: (id) => path(ROOTS_DASHBOARD, `/QA/editcategory/${id}`),
    },
    subscription: {
      root: path(ROOTS_DASHBOARD, '/subscription'),
      list: path(ROOTS_DASHBOARD, '/subscription/list'),
      newsubscription: path(ROOTS_DASHBOARD, '/subscription/new'),
      editsubscription: (id) => path(ROOTS_DASHBOARD, `/subscription/edit/${id}`),
    },
    broadcast: {
      root: path(ROOTS_DASHBOARD, '/broadcast'),
    },
    ED: {
      root: path(ROOTS_DASHBOARD, '/ED'),
      list: path(ROOTS_DASHBOARD, '/ED/list'),
      draft: path(ROOTS_DASHBOARD, '/ED/draft'),
      newED: path(ROOTS_DASHBOARD, '/ED/new'),
      editED: (id) => path(ROOTS_DASHBOARD, `/ED/edit/${id}`),
    },
    blog: {
      root: path(ROOTS_DASHBOARD, '/blog'),
      list: path(ROOTS_DASHBOARD, '/blog/list'),
      draft: path(ROOTS_DASHBOARD, '/blog/draft'),
      newblog: path(ROOTS_DASHBOARD, '/blog/new'),
      editblog: (id) => path(ROOTS_DASHBOARD, `/blog/edit/${id}`),
    },
    assetRequest: {
      root: path(ROOTS_DASHBOARD, '/assetRequest'),
      list: path(ROOTS_DASHBOARD, '/assetRequest/list'),
      edit: (id) => path(ROOTS_DASHBOARD, `/assetRequest/edit/${id}`),
      view: (id) => path(ROOTS_DASHBOARD, `/assetRequest/view/${id}`),
    },
    user: {
      root: path(ROOTS_DASHBOARD, '/user'),
      list: path(ROOTS_DASHBOARD, '/user/list'),
      shopperlist: path(ROOTS_DASHBOARD, '/user/shopper'),
      newCompany: path(ROOTS_DASHBOARD, '/user/newcompany'),
      account: path(ROOTS_DASHBOARD, '/user/account'),
    },
    media: {
      root: path(ROOTS_DASHBOARD, '/media'),
      editVideo: path(ROOTS_DASHBOARD, '/media/video'),
      addgalleryImage: path(ROOTS_DASHBOARD, '/media/newimages'),
      editgalleryImage: path(ROOTS_DASHBOARD, '/media/gallery'),
    },

    affiliates: path(ROOTS_DASHBOARD, '/affiliates'),
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
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/edit/${id}`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/e-commerce/product/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/e-commerce/product/${id}/edit`),
    category: path(ROOTS_DASHBOARD, '/e-commerce/category'),
    cedit: (id) => path(ROOTS_DASHBOARD, `/e-commerce/category/${id}/edit`),
    newCategory: path(ROOTS_DASHBOARD, '/e-commerce/newcategory'),
    thumbnailList: (title) => path(ROOTS_DASHBOARD, `/e-commerce/thumbnail/${title}`),
    tag: path(ROOTS_DASHBOARD, '/e-commerce/tag'),
  },
  pricing: {
    root: path(ROOTS_DASHBOARD, '/pricing'),
    list: path(ROOTS_DASHBOARD, '/pricing/list'),
    new: path(ROOTS_DASHBOARD, '/pricing/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/pricing/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/pricing/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/pricing/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/pricing/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  service: {
    root: path(ROOTS_DASHBOARD, '/service'),
    list: path(ROOTS_DASHBOARD, '/service/list'),
    new: path(ROOTS_DASHBOARD, '/service/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/service/edit/${id}`),
  },

  // blog: {
  //   root: path(ROOTS_DASHBOARD, '/blog'),
  //   posts: path(ROOTS_DASHBOARD, '/blog/posts'),
  //   new: path(ROOTS_DASHBOARD, '/blog/new'),
  //   view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
  //   demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  // },
};

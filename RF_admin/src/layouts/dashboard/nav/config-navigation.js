// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  media: icon('ic_media'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  pricing: icon('ic_pricing'),
  service: icon('ic_service'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  fences: icon('ic_3dmodel'),
  dashboard: icon('ic_dashboard'),
  fence_ed: icon('ic_university'),
  qa: icon('ic_qa'),
  userAnalytic: icon('ic_user_analytic'),
  add_admin: icon('ic_add_admin'),
  notification: icon('ic_notification'),
  affiliates: icon('ic_person_fill_badge_plus'),
};

const navConfig = [
  {
    // subheader: 'general management',
    items: [{ title: `Add Administrator`, path: PATH_DASHBOARD.addAdmin, icon: ICONS.add_admin }],
  },
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general management',
    items: [
      {
        // USER
        title: 'users',
        path: PATH_DASHBOARD.general.user.list,
        icon: ICONS.user,
        // children: [
        //   // { title: 'profile', path: PATH_DASHBOARD.user.profile },
        //   { title: 'cards', path: PATH_DASHBOARD.user.cards },
        //   { title: 'list', path: PATH_DASHBOARD.user.list },
        //   { title: 'create', path: PATH_DASHBOARD.user.new },
        //   // { title: 'account', path: PATH_DASHBOARD.user.account },
        // ],
      },
      { title: `3D Models`, path: PATH_DASHBOARD.general.fences, icon: ICONS.fences },
      { title: 'Asset Request', path: PATH_DASHBOARD.general.assetRequest.root, icon: ICONS.mail },
      {
        title: 'fileManager',
        path: PATH_DASHBOARD.general.file,
        icon: ICONS.folder,
      },
      // BILLING
      {
        title: 'billing',
        path: PATH_DASHBOARD.general.billing,
        icon: ICONS.invoice,
      },
      // BLOG
      {
        title: 'blog',
        path: PATH_DASHBOARD.general.blog.root,
        icon: ICONS.blog,
      },
      {
        title: 'RealityFence ED',
        path: PATH_DASHBOARD.general.ED.root,
        icon: ICONS.fence_ed,
      },
      {
        title: 'Media Manager',
        path: PATH_DASHBOARD.general.media.root,
        icon: ICONS.media,
      },

      {
        title: 'Q & A',
        path: PATH_DASHBOARD.general.QA.root,
        icon: ICONS.qa,
      },
      {
        title: 'Subscription',
        path: PATH_DASHBOARD.general.subscription.root,
        icon: ICONS.banking,
      },
      {
        title: 'Broadcast System',
        path: PATH_DASHBOARD.general.broadcast.root,
        icon: ICONS.notification,
      },
      {
        title: 'Affiliates',
        path: PATH_DASHBOARD.general.affiliates,
        icon: ICONS.affiliates,
      },
    ],
  },
];

export default navConfig;

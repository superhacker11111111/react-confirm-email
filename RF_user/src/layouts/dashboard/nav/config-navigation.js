// routes
import { PATH_DASHBOARD, PATH_ONBOARDING } from '../../../routes/paths';
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
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  swapper: icon('ic_swapper'),
  support: icon('ic_support'),
  fence: icon('ic_fence'),
  group: icon('ic_group'),
  badge_checkmark: icon('ic_badge_checkmark'),
};

export const userConfig = [
  // ----------------------------------------------------------------------
  {
    items: [
      {
        title: 'Manage My Fences',
        path: PATH_ONBOARDING.onboarding.categoryfences,
        icon: ICONS.fence,
      },
      {
        title: 'Account',
        path: PATH_DASHBOARD.user.account,
        icon: ICONS.user,
      },
      {
        title: 'Billing History',
        path: PATH_DASHBOARD.invoice.history,
        icon: ICONS.invoice,
      },

      {
        title: 'Blog',
        path: PATH_DASHBOARD.blog.blogfence,
        icon: ICONS.blog,
      },
      {
        title: 'Support Center',
        path: PATH_DASHBOARD.general.faqsupport,
        icon: ICONS.support,
      },
      {
        title: 'Contact us',
        path: PATH_DASHBOARD.general.contactus,
        icon: ICONS.chat,
      },
      {
        title: 'Download the App',
        path: PATH_DASHBOARD.general.downloadfence,
        icon: ICONS.badge_checkmark,
      },
      {
        title: 'Recommended Devices',
        path: PATH_DASHBOARD.general.devices,
        icon: ICONS.group,
      },
    ],
  },
];

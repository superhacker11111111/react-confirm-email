// routes
import { PATH_AUTH, PATH_PAGE } from '../../../routes/paths';
// config
import { PATH_AFTER_LOGIN } from '../../../config-global';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="eva:home-fill" />,
    path: '/',
  },
  {
    title: 'Components',
    icon: <Iconify icon="ic:round-grain" />,
    path: PATH_PAGE.components,
  },
  {
    title: 'Documentation',
    icon: <Iconify icon="ic:round-grain" />,
    path: PATH_PAGE.components,
  },
];

export default navConfig;

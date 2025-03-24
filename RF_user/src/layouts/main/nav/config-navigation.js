// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export const pageLinks = [
  {
    items: [{ title: 'Pricing', path: PATH_PAGE.subscription }],
  },
  {
    items: [{ title: 'Our Story', path: PATH_PAGE.about }],
  },
  {
    items: [{ title: 'FAQs', path: PATH_PAGE.faqs }],
  },
  {
    items: [{ title: 'AR', path: PATH_PAGE.arpage }],
  },
  {
    items: [{ title: 'RealityFence ED', path: PATH_PAGE.edfence }],
  },
  {
    items: [{ title: 'Blog', path: PATH_PAGE.blogfences }],
  },
];

export const pageLink = [
  {
    items: [{ title: 'Contact Us', path: PATH_PAGE.contact }],
  },
  {
    items: [{ title: 'Book a Meeting', path: PATH_PAGE.meeting }],
  },
];

export const navConfig = [
  {
    title: 'About',
    icon: <Iconify icon="eva:home-fill" />,
    path: PATH_PAGE.about,
    children: pageLinks,
  },
  {
    title: 'Contact',
    icon: <Iconify icon="eva:home-fill" />,
    path: PATH_PAGE.contact,
    children: pageLink,
  },
  {
    title: 'Fences',
    icon: <Iconify icon="eva:home-fill" />,
    path: PATH_PAGE.fences,
  },
  {
    title: 'Shopper',
    icon: <Iconify icon="eva:home-fill" />,
    path: PATH_PAGE.shopper,
  },
];

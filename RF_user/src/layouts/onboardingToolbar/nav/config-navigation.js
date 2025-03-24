// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components

// ----------------------------------------------------------------------

export const userConfig = [
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Wood',
    items: [
      {
        title: 'Pine',
        path: PATH_DASHBOARD.invoice.root,
        children: [
          { title: 'Privacy', path: PATH_DASHBOARD.user.profile },
          { title: 'Semi-Privacy', path: PATH_DASHBOARD.user.cards },
          { title: 'Picket', path: PATH_DASHBOARD.user.list },
          { title: 'Rail', path: PATH_DASHBOARD.user.new },
        ],
      },
      {
        title: 'Cedar',
        path: PATH_DASHBOARD.invoice.root,
        children: [
          { title: 'Privacy', path: PATH_DASHBOARD.user.a },
          { title: 'Semi-Privacy', path: PATH_DASHBOARD.user.b },
          { title: 'Picket', path: PATH_DASHBOARD.user.c },
          { title: 'Rail', path: PATH_DASHBOARD.user.d },
        ],
      },
    ],
  },
  {
    subheader: 'Aluminum',
    items: [
      {
        title: 'Flat Top',
        path: PATH_DASHBOARD.invoice.root,
      },
      {
        title: 'Spear Top',
        path: PATH_DASHBOARD.invoice.root,
      },
    ],
  },
  {
    subheader: 'Vinyl',
    items: [
      {
        title: 'Privacy',
        path: PATH_DASHBOARD.invoice.root,
      },
      {
        title: 'Semi-Privacy',
        path: PATH_DASHBOARD.invoice.root,
      },
    ],
  },
  {
    subheader: 'Chain Link',
    items: [
      {
        title: 'Falvanized',
        path: PATH_DASHBOARD.invoice.root,
      },
      {
        title: 'Coated',
        path: PATH_DASHBOARD.invoice.root,
      },
    ],
  },
  {
    subheader: 'Wrought Iron',
    items: [
      {
        title: 'Traditional',
        path: PATH_DASHBOARD.invoice.root,
      },
      {
        title: 'Modern',
        path: PATH_DASHBOARD.invoice.root,
      },
    ],
  },
];

export const navConfig2 = [
  {
    title: 'Wood',
    children: [
      {
        title: 'Pine',
        children: [
          { title: 'Privacy' },
          { title: 'Semi-Privacy' },
          { title: 'Picket' },
          { title: 'Rail' },
        ],
      },
      {
        title: 'Cedar',
        children: [
          { title: 'Privacy' },
          { title: 'Semi-Privacy' },
          { title: 'Picket' },
          { title: 'Rail' },
        ],
      },
      {
        title: 'Redwood',
        children: [
          { title: 'Privacy' },
          { title: 'Semi-Privacy' },
          { title: 'Picket' },
          { title: 'Rail' },
        ],
      },
      {
        title: 'Douglas Fir',
        children: [
          { title: 'Privacy' },
          { title: 'Semi-Privacy' },
          { title: 'Picket' },
          { title: 'Rail' },
        ],
      },
    ],
  },
  {
    title: 'Aluminium',
    children: [
      { title: 'Flat Top' },
      { title: 'Spear Top' },
      { title: 'Circle Top' },
      { title: 'Arch Top' },
    ],
  },
  {
    title: 'Vinyl',
    children: [
      { title: 'Privacy' },
      { title: 'Semi-Privacy' },
      { title: 'Picket' },
      { title: 'Rail' },
    ],
  },
  {
    title: 'Chain Link',

    children: [
      { title: 'Galvanized' },
      { title: 'Coated' },
      { title: 'Mini-Mesh' },
      { title: 'Security' },
    ],
  },
  {
    title: 'Wrought Iron',
    children: [{ title: 'Traditional' }, { title: 'Modern' }],
  },
  {
    title: 'Concrete',
    children: [
      { title: 'Precast' },
      { title: 'Block' },
      { title: 'Decorative' },
      { title: 'Combination' },
    ],
  },
  {
    title: 'Stucco',
    children: [{ title: 'Solid Wall' }, { title: 'Decorative' }, { title: 'Combination' }],
  },
  {
    title: 'Brick',
    children: [{ title: 'Solid Wall' }, { title: 'Decorative' }, { title: 'Combination' }],
  },
  {
    title: 'Bamboo',
    children: [{ title: 'Rolled' }, { title: 'Split' }, { title: 'Picket' }],
  },
];

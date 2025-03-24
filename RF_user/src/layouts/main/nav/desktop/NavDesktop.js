import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
//
import NavList from './NavList';

// ----------------------------------------------------------------------

NavDesktop.propTypes = {
  data: PropTypes.array,
  isOffset: PropTypes.bool,
};

export default function NavDesktop({ isOffset, data }) {
  return (
    <Stack
      component="nav"
      flexDirection="row"
      alignItems="center"
      gap={{ md: 4, lg: 10, xl: 15 }}
      sx={{ height: 1 }}
    >
      {data.map((link) => (
        <NavList key={link.title} item={link} isOffset={isOffset} />
      ))}
    </Stack>
  );
}

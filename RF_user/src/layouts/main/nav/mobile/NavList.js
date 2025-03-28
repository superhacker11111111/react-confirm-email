import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Collapse, Stack } from '@mui/material';
// hooks
import useActiveLink from '../../../../hooks/useActiveLink';
// components
import { NavSectionVertical } from '../../../../components/nav-section';
//
import NavItem from './NavItem';

// ----------------------------------------------------------------------

NavList.propTypes = {
  item: PropTypes.object,
};

export default function NavList({ item }) {
  const { pathname } = useLocation();

  const { path, children } = item;

  const { isExternalLink } = useActiveLink(path);

  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack sx={{ px: 1 }}>
        <NavItem
          item={item}
          open={open}
          onClick={() => setOpen(!open)}
          active={pathname === path}
          isExternalLink={isExternalLink}
        />
      </Stack>

      {!!children && (
        <Collapse in={open} unmountOnExit>
          <NavSectionVertical
            data={children}
            // sx={{
            //   '& .MuiList-root:last-of-type .MuiListItemButton-root': {
            //     height: 160,
            //     backgroundSize: 'cover',
            //     backgroundPosition: 'center',
            //     bgcolor: 'background.neutral',
            //     backgroundRepeat: 'no-repeat',
            //     backgroundImage: 'url(/assets/illustrations/illustration_dashboard.png)',
            //     '& > *:not(.MuiTouchRipple-root)': { display: 'none' },
            //   },
            // }}
          />
        </Collapse>
      )}
    </>
  );
}

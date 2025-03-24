import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Stack, AppBar, Toolbar, IconButton, Slider, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
// utils
// hooks
import useResponsive from '../../../hooks/useResponsive';
import { Header1, Header2 } from './config-header';
// components
import Iconify from '../../../components/iconify';
import { UserType } from '../../../assets/data/roles';
// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { user } = useSelector((state) => state.auth);
  const [value, setValue] = useState(0);
  const isDesktop = useResponsive('up', 'lg');

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/selectfencesconfirm') {
      setValue(45);
    }
    if (location.pathname === '/selectfencesp') {
      setValue(5);
    }
    if (location.pathname === '/categoryfences') {
      setValue(33);
    }

    if (location.pathname === '/categoryfences') {
      setValue(33);
    }
    if (location.pathname === '/addfencesp') {
      setValue(50);
    }
    if (location.pathname === '/addfences') {
      setValue(68);
    }
    if (location.pathname === '/tutorial') {
      setValue(100);
    }
  }, [location.pathname]);
  let headConfig = [];
  headConfig =
    user && (user.userType === UserType.Pro || user.userType === UserType['Free Trial'])
      ? Header1
      : Header2;
  const renderContent = (
    <>
      {isDesktop && (
        <Stack flexDirection="column" width="100%">
          <Stack display="flex" flexDirection="row" justifyContent="space-between">
            {Header2.map((index) => (
              <Typography variant="h6" color="black" key={index}>
                <p>{index}</p>
              </Typography>
            ))}
          </Stack>
          <Slider
            disabled
            size="middle"
            style={{ color: '#1FA9FF' }}
            value={value}
            onChange={handleChange}
            aria-labelledby="continuous-slider"
          />
        </Stack>
      )}

      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
          <Iconify icon="eva:menu-2-fill" style={{ transform: 'rotate(90deg)' }} />
        </IconButton>
      )}
    </>
  );

  return (
    <AppBar
      sx={{
        mt: 1,
        boxShadow: 'none',
        // height: HEADER.H_MOBILE,
        bgcolor: 'white',
        // ...(isDesktop && {
        //   height: HEADER.H_DASHBOARD_DESKTOP,

        //   ...(isNavHorizontal && {
        //     width: 1,
        //     height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
        //     borderBottom: `dashed 1px ${theme.palette.divider}`,
        //   }),
        //   ...(isNavMini && {
        //     width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
        //   }),
        // }),
      }}
    >
      <Toolbar>{renderContent}</Toolbar>
    </AppBar>
  );
}

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
// @mui
import { Box, Stack } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// // components
import { useSettingsContext } from '../../components/settings';
// //
import Main from './Main';
import Header from './header';
import Toolbar from './toolbar';
import NavVertical from './nav/NavVertical';
import NavHorizontal from './nav/NavHorizontal';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const url = new URL(window.location.href);
  const path = url.pathname;
  const isNavHorizontal = themeLayout === 'horizontal';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Header onOpenNav={handleOpen} sx={{ width: '100%' }} />
      {/* <Toolbar sx={{ width: '100%' }} />
      <Box>
        <NavVertical openNav={open} onCloseNav={handleClose} />
        <Main>
          <Outlet />
        </Main>
      </Box> */}
    </>

    // <div className="flex flex-col">
    //   <div className="fixed z-20 ">
    //     <Header onOpenNav={handleOpen} sx={{ width: '100%' }} />
    //   </div>
    //   <div className="w-full fixed z-10">
    //     <Toolbar sx={{ width: '100%' }} pageType={path} />
    //   </div>
    //   <Box
    //     sx={{
    //       display: { lg: 'flex' },
    //       minHeight: { lg: 1 },
    //     }}
    //   >
    //     {path !== '/addfences' && (
    //       <NavVertical openNav={open} onCloseNav={handleClose} s_type={1} />
    //     )}
    //     <Main>
    //       <Outlet />
    //     </Main>
    //   </Box>
    // </div>
  );
}

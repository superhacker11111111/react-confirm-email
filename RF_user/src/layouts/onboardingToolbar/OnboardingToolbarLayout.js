import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { Stack, Box } from '@mui/material';
// hooks
//
import Main from './Main';
import Header from './header';
import Toolbar from './toolbar';
import SwapperToolBar from './toolbar/SwapperToolbar';
import NavVertical from './nav/NavVertical';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const url = new URL(window.location.href);
  const path = url.pathname;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack flexDirection="column">
      {localStorage.getItem('layout') !== 'swapper' ? (
        <div>
          <div className="fixed z-20 ">
            <Header onOpenNav={handleOpen} sx={{ width: '100%' }} />
          </div>
          <div className="fixed z-10 w-full">
            <Toolbar sx={{ width: '100%' }} pageType={path} />
          </div>
          <Box
            sx={{
              display: { lg: 'flex' },
              minHeight: { lg: 1 },
            }}
          >
            {path !== '/addfences' && (
              <NavVertical openNav={open} onCloseNav={handleClose} s_type={1} />
            )}
            <Main>
              <Outlet />
            </Main>
          </Box>
        </div>
      ) : (
        <div>
          <SwapperToolBar />
          <Box
            sx={{
              display: { lg: 'flex' },
              minHeight: { lg: 1 },
              // mr: '15px',
            }}
          >
            {path !== '/fenceswapper' && path !== '/requestfences' && (
              <NavVertical openNav={open} onCloseNav={handleClose} s_type={2} />
            )}
            <Main>
              <Outlet />
            </Main>
          </Box>
        </div>
      )}
    </Stack>
  );
}

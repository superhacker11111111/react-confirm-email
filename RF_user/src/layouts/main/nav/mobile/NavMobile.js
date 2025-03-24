import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { List, Drawer, IconButton, Button, Stack, Grid } from '@mui/material';
// config
import { NAV } from '../../../../config-global';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
//
import NavList from './NavList';
//
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
// ----------------------------------------------------------------------

NavMobile.propTypes = {
  data: PropTypes.array,
  isOffset: PropTypes.bool,
};

export default function NavMobile({ isOffset, data }) {
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          ml: 1,
          ...(isOffset && {
            color: 'text.primary',
          }),
        }}
      >
        <img src="/assets/nav_icon.svg" style={{ width: '30px' }} alt="Nav Icon" />
        {/* <Iconify icon="eva:menu-2-fill" /> */}
        {/* <Iconify icon="eva:menu-2-fill" style={{ transform: 'rotate(90deg)' }} /> */}
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            pb: 5,
            width: NAV.W_BASE,
          },
        }}
      >
        <Scrollbar>
          {/* <Logo sx={{ mx: 2.5, my: 3 }} /> */}
          <Stack justifyContent="center" sx={{ mb: '28px', px: '12px' }}>
            <Grid item sx={{ alignSelf: { xs: 'end', md: 'end' } }}>
              <IconButton color="inherit" edge="start" onClick={handleClose}>
                <Iconify icon="carbon:close-filled" style={{ color: '1FA9FF' }} />
              </IconButton>
            </Grid>
            <Stack
              display="flex"
              flexDirection="row"
              justifyContent="center"
              sx={{ mt: '4px', mb: '28px' }}
            >
              <Button
                variant="text"
                color="inherit"
                style={{
                  marginTop: '16px',
                  color: 'white',
                  backgroundColor: '#1FA9FF',
                  padding: '8px 16px',
                  fontSize: 12,
                  borderRadius: 999,
                }}
                href={PATH_PAGE.subscription}
              >
                Buy Now
              </Button>
              <Button
                variant="text"
                color="inherit"
                style={{
                  marginLeft: '16px',
                  marginTop: '16px',
                  color: 'white',
                  backgroundColor: '#1FA9FF',
                  padding: '8px 23px',
                  fontSize: 12,
                  borderRadius: 999,
                }}
                href={PATH_AUTH.loginUnprotected}
              >
                Login
              </Button>
            </Stack>

            <List component="nav" disablePadding>
              {data.map((link) => (
                <NavList key={link.title} item={link} />
              ))}
            </List>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

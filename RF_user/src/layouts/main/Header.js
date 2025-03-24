import PropTypes from 'prop-types';
import { useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, Stack } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import { bgBlur } from '../../utils/cssStyles';
// config
import { HEADER } from '../../config-global';
// routes
import { PATH_AUTH, PATH_PAGE } from '../../routes/paths';
// components
import Logo from '../../components/logo';
import { navConfig } from './nav/config-navigation';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import BlackHeader from './BlackHeader';
// ----------------------------------------------------------------------

export default function Header() {
  const carouselRef = useRef(null);
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <AppBar ref={carouselRef} color="transparent" sx={{ boxShadow: 0 }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_MAIN_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(isOffset && {
            ...bgBlur({ color: theme.palette.background.default }),
            height: {
              md: HEADER.H_MAIN_DESKTOP - 16,
            },
          }),
          ...bgBlur({ color: theme.palette.background.default }),
        }}
      >
        <Container
          sx={{ height: 1, display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}
          maxWidth="xl"
        >
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          {isDesktop && <NavDesktop isoffset={isOffset ? 'true' : undefined} data={navConfig} />}
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: 210,
            }}
          >
            {isDesktop && (
              <Button
                isoffset={isOffset ? 'true' : undefined}
                data={navConfig}
                variant="text"
                color="inherit"
                style={{
                  color: '#1FA9FF',
                  padding: '8px 16px',
                  fontSize: 18,
                  borderRadius: 999,
                }}
                href={PATH_AUTH.loginUnprotected}
              >
                Login
              </Button>
            )}
            <Box sx={{ flexGrow: 0.1 }} />

            {isDesktop && (
              <Button
                isoffset={isOffset ? 'true' : undefined}
                data={navConfig}
                variant="text"
                color="inherit"
                style={{
                  color: 'white',
                  backgroundColor: '#1FA9FF',
                  padding: '8px 16px',
                  fontSize: 18,
                  borderRadius: 999,
                }}
                href={PATH_PAGE.subscription}
              >
                Buy Now
              </Button>
            )}
            {!isDesktop && <NavMobile isoffset={isOffset ? 'true' : undefined} data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>
      <BlackHeader />
      {isOffset && <Shadow />}
    </AppBar>
  );
}

// ----------------------------------------------------------------------

Shadow.propTypes = {
  sx: PropTypes.object,
};

function Shadow({ sx, ...other }) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}

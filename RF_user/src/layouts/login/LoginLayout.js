import PropTypes from 'prop-types';
// @mui
import { Box, Grid, Link, Stack, useMediaQuery } from '@mui/material';
// components
import { Link as RouterLink } from 'react-router-dom';
// components
import Image from '../../components/image';
import NavMobile from '../main/nav/mobile/NavMobile';
import useOffSetTop from '../../hooks/useOffSetTop';
import { HEADER } from '../../config-global';
import { navConfig } from '../main/nav/config-navigation';

// ----------------------------------------------------------------------

LoginLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  illustration: PropTypes.string,
};

export default function LoginLayout({ children, illustration, title }) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isOffset = useOffSetTop(HEADER);
  return (
    // <Grid
    //   container
    //   direction="column"
    //   justifyContent="center"
    //   alignItems="center"
    //   alignSelf="center"
    //   height="100%"
    //   spacing={{ md: '80px' }}
    // >
    <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isMobile ? (
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            px: 3,
          }}
        >
          <Link component={RouterLink} to="/" color="inherit" label="go to hompage">
            <Image
              disabledEffect
              visibleByDefault
              alt="auth"
              src={illustration || '/assets/illustrations/illustration_dashboard.png'}
              sx={{ width: { lg: '300px', md: '250px', sm: '300px', xs: '140px' } }}
            />
          </Link>
          <NavMobile isOffset={isOffset ? 'true' : undefined} data={navConfig} />
        </Stack>
      ) : (
        <Stack>
          <Link component={RouterLink} to="/" color="inherit" label="go to hompage">
            <Image
              disabledEffect
              visibleByDefault
              alt="auth"
              src={illustration || '/assets/illustrations/illustration_dashboard.png'}
              sx={{ width: { lg: '300px', md: '250px', sm: '300px', xs: '200px' } }}
            />
          </Link>
        </Stack>
      )}
      <Box
        sx={{
          px: 7,
          boxShadow: { sm: 4, xs: 0 },
          borderRadius: { sm: 2, xs: 0 },
          width: { sm: '500px', xs: '100%' },
        }}
      >
        {children}
      </Box>
    </Stack>
    // </Grid>
  );
}

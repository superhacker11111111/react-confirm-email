import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Link, Grid } from '@mui/material';
// components
import Image from '../../components/image';
//
import { StyledRoot } from './styles';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

AuthLayout.propTypes = {
  children: PropTypes.node,
  illustration: PropTypes.string,
};

export default function AuthLayout({ children, illustration }) {
  return (
    <StyledRoot>
      <Grid container justifyContent="space-between">
        <Grid item xs={12} md={5.5} display="flex" alignItems="center">
          <Link component={RouterLink} to={PATH_DASHBOARD.user.list}>
            <Image
              disabledEffect
              visibleByDefault
              alt="auth"
              src={illustration || '/assets/illustrations/illustration_dashboard.png'}
              justifyContent="center"
              sx={{ width: '100%' }}
            />
          </Link>
        </Grid>
        <Grid xs={12} md={5.5} item display="flex" alignItems="center">
          <Stack sx={{ width: 1 }}> {children} </Stack>
        </Grid>
      </Grid>
    </StyledRoot>
  );
}

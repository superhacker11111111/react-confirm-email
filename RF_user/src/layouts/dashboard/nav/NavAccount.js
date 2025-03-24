import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';

import { DEFAULT_AVATAR } from '../../../assets/data/roles';
// auth
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const user = useSelector((state) => state.auth.user);
  let role;

  switch (user?.role) {
    case 1:
      role = 'Professional';
      break;
    case 2:
      role = 'Professional Plus';
      break;
    case 3:
      role = 'Diamond';
      break;
    case 4:
      role = 'Shoppers';
      break;
    default:
      break;
  }

  return (
    <Link component={RouterLink} to={PATH_DASHBOARD.user.account} underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar
          // src={user?.avatarUrl ? user?.avatarUrl : DEFAULT_AVATAR}
          alt={user?.fullName}
          name={user?.fullName}
        />
        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.company}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {user?.email}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography, MenuItem, Divider } from '@mui/material';
import { MemberRoles } from '../../../assets/data/roles';

// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import { CustomAvatar } from '../../../components/custom-avatar';

import { useSnackbar } from '../../../components/snackbar';

import MenuPopover from '../../../components/menu-popover';
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
  const { user, logout } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      logout(navigate);
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  // const role = user.role === 1 ? 'Admin' : 'User';
  return (
    <div>
      <StyledRoot onClick={handleOpenPopover}>
        <CustomAvatar
          src={user?.avatarUrl ? user.avatarUrl : ''}
          alt={user?.fullName}
          name={user?.fullName}
        />
        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.fullName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {MemberRoles.map((role) => (role.code === user?.role ? role.label : ''))}
          </Typography>
        </Box>
      </StyledRoot>
      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <MenuItem
          onClick={() => {
            navigate(PATH_PAGE.changePassword);
          }}
          sx={{ m: 1 }}
        >
          Change Password
        </MenuItem>
        <Divider sx={{ borderBottom: '1px dashed #ccc' }} />
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </div>
  );
}

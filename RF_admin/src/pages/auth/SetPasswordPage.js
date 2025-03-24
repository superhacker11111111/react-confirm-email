import { Helmet } from 'react-helmet-async';
import { Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import LoginLayout from '../../layouts/login';
// sections
import SetPasswordForm from '../../sections/auth/SetPasswordForm';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function SetPasswordPage() {
  const token = new URLSearchParams(useLocation().search).get('token');
  const { email } = jwtDecode(token);
  return (
    <>
      <Helmet>
        <title> SetPassword | RealityFence</title>
      </Helmet>
      <LoginLayout>
        <Stack sx={{ width: '100%' }}>
          <SetPasswordForm email={email} />
        </Stack>
      </LoginLayout>
    </>
  );
}

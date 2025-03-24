// import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Typography } from '@mui/material';
// sections
import AuthResetPasswordForm from '../../sections/auth/AuthResetPasswordForm';
import LoginLayout from '../../layouts/login/LoginLayout';
// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <LoginLayout>
      <Typography sx={{ textAlign: { sm: 'start' } }} variant="h3" mt={6} paragraph>
        Forgot Password?
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5, textAlign: { sm: 'start' } }}>
        Enter the email address you used when you joined and we’ll send you instructions to reset
        your password.
      </Typography>

      <AuthResetPasswordForm />

      {/* <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Return to sign in
      </Link> */}
    </LoginLayout>
  );
}

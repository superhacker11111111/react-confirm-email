import { Helmet } from 'react-helmet-async';
import { Typography, OutlinedInput, Button, Stack } from '@mui/material';
import LoginLayout from '../../layouts/login/LoginLayout';

export default function ForgotPasswordPage() {
  return (
    <LoginLayout>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>
      <Stack sx={{ width: '100%' }} spacing={3}>
        <Typography variant="h4">Forgot Password</Typography>

        <Typography sx={{ fontSize: '16px', pb: 3 }}>
          Enter the email address you used when you joined and we’ll send you instructions to reset
          your password.
        </Typography>

        <Stack>
          <Typography sx={{ fontWeight: '700' }}>Email Address</Typography>
          <OutlinedInput fullWidth placeholder="Enter your email" />
        </Stack>

        <Button variant="contained" size="large">
          Send
        </Button>
      </Stack>
    </LoginLayout>
  );
}

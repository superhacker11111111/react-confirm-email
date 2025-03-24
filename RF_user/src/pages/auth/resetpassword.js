import { Helmet } from 'react-helmet-async';
import { Typography, Button, Stack, TextField, OutlinedInput } from '@mui/material';
import LoginLayout from '../../layouts/login/LoginLayout';

export default function NewPage() {
  return (
    <LoginLayout>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>
      <Stack sx={{ width: '100%' }} spacing={3}>
        <Typography variant="h4">Reset Password</Typography>

        <Typography sx={{ fontSize: '16px', pb: 2 }}>
          Your new password must be different from previous used passwords
        </Typography>

        {/* <TextField name="email" label="New Password" />

        <TextField name="email" label="Confirm Password" /> */}
        <Stack>
          <Typography sx={{ fontWeight: '700' }}>New Password</Typography>
          <OutlinedInput fullWidth placeholder="Enter a New Password" />
        </Stack>

        <Stack>
          <Typography sx={{ fontWeight: '700' }}>Confirm Password</Typography>
          <OutlinedInput fullWidth placeholder="Confirm your Password" />
        </Stack>

        <Button variant="contained" size="large">
          {' '}
          Reset Password{' '}
        </Button>
      </Stack>
    </LoginLayout>
  );
}

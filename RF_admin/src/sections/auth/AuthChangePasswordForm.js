import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Alert, InputAdornment, IconButton, Card } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import AuthLayout from '../../layouts/auth';
// components
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthChangePasswordForm() {
  const navigate = useNavigate();
  const { user, changePassword } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };

  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string()
      .required('New Password is a required field')
      .min(12, 'Password must contain at least 12 characters.')
      .matches(/^(?=.*[a-z])/, 'Password must contain a mix of upper and lower case letters')
      .matches(/^(?=.*[A-Z])/, 'Password must contain a mix of upper and lower case letters')
      .matches(
        /^(?=.*[!@#%&^$])/,
        'Password must contain at least one special character(e.g.,!,@,#,$)'
      ),
    confirmPassword: Yup.string()
      .required('Confirm Your Password is a required field')
      .oneOf([Yup.ref('newPassword')], "Password's do not match"),
  });

  const methods = useForm({
    resolver: yupResolver(PasswordSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      const passwordData = {
        email: user?.email.toLowerCase(),
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
      };
      await changePassword(passwordData, navigate, SnackBar, reset);
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.data || error,
      });
    }
  };
  return (
    <AuthLayout>
      <Card
        sx={{
          p: 4,
          py: 8,
          boxShadow: 4,
        }}
      >
        <Stack spacing={2} sx={{ mb: 3, position: 'relative' }}>
          <Typography variant="h4">
            Change Password <br />
            Administrator
          </Typography>
          <Typography sx={{ fontSize: '16px', color: 'grey' }}>
            Your new password must be different from previous used passwords
          </Typography>
        </Stack>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 700 }}>Current Password</Typography>
              <RHFTextField
                name="currentPassword"
                placeholder="Enter a current password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 700 }}>New Password</Typography>
              <RHFTextField
                name="newPassword"
                placeholder="Enter a new password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 700 }}>Confirm Password</Typography>
              <RHFTextField
                name="confirmPassword"
                placeholder="Confirm your password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              bgcolor: '#1288E3',
              mt: '24px',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
              '&:hover': {
                bgcolor: 'success.main',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
              },
            }}
          >
            Reset Password
          </LoadingButton>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
}

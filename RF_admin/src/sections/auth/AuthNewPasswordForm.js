import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthNewPasswordForm() {
  const { resetPassword } = useAuthContext();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };

  const [showPassword, setShowPassword] = useState(false);

  const VerifyCodeSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string()
      .required('Password is a required field')
      .min(12, 'Password must contain at least 12 characters.')
      .matches(/^(?=.*[a-z])/, 'Password must contain a mix of upper and lower case letters')
      .matches(/^(?=.*[A-Z])/, 'Password must contain a mix of upper and lower case letters')
      .matches(
        /^(?=.*[!@#%&^$])/,
        'Password must contain at least one special character(e.g.,!,@,#,$)'
      ),
    confirmPassword: Yup.string()
      .required('Confirm Your Password is a required field')
      .oneOf([Yup.ref('password')], "Password's do not match"),
  });

  const defaultValues = {
    email: localStorage.getItem('current') || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const { handleSubmit, reset, setError } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const resetData = {
        email: data.email.toLowerCase(),
        newPassword: data.password,
      };
      await resetPassword(resetData, navigate, SnackBar, reset);
    } catch (error) {
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.data || error,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email" disabled InputLabelProps={{ shrink: true }} />

        <RHFTextField
          name="password"
          label="Password"
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

        <RHFTextField
          name="confirmPassword"
          label="Confirm New Password"
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

        <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ mt: 3 }}>
          Update Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

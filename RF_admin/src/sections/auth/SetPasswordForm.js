import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Typography, Button } from '@mui/material';
// auth
import { createPassword } from '../../redux/slices/admin';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';
import { PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

SetPasswordForm.propTypes = {
  email: PropTypes.string,
};

export default function SetPasswordForm({ email }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
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
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const SnackBar = (message, result) => {
    dispatch(enqueueSnackbar(message, { variant: result }));
  };

  const { handleSubmit, watch } = methods;
  const values = watch();
  const onSubmit = async () => {
    const passwordData = {
      email,
      password: values.password,
    };
    dispatch(createPassword(passwordData, SnackBar, navigate));
    navigate(PATH_AUTH.login);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Typography variant="h4">Create Password</Typography>
        <Typography variant="subtitle1" color="#68718B">
          Welcome to RealityFence!
        </Typography>
        <Typography variant="subtitle1" color="#68718B">
          {email}
        </Typography>
      </Stack>
      <Stack spacing={3} mt={3}>
        <RHFTextField
          placeholder="Enter a new password"
          fullWidth
          name="password"
          label="New Password"
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
          placeholder="Confirm your password"
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
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

      <Button
        fullWidth
        type="submit"
        size="large"
        variant="contained"
        sx={{
          mt: 3,
        }}
      >
        Create Password
      </Button>
    </FormProvider>
  );
}

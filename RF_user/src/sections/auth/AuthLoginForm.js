import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { login } from '../../redux/actions/authAction';
// routes
import { registerType } from '../../assets/data/registerType';
import { CompanyRole } from '../../assets/data/roles';
import { PATH_AUTH, PATH_PAGE } from '../../routes/paths';
// auth
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

AuthLoginForm.propTypes = {
  handleOpen: PropTypes.func,
};

export default function AuthLoginForm({ handleOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    const loginData = {
      email: data.email.toLowerCase(),
      password: data.password,
      role: CompanyRole.code,
      type: registerType.default,
    };
    sessionStorage.removeItem('email-recovery');

    localStorage.setItem('registerEmail', data.email);
    dispatch(login(loginData, navigate, SnackBar, reset));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

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
      </Stack>

      <Stack justifyContent="space-between" direction={{ xs: 'column', sm: 'row' }} sx={{ my: 2 }}>
        <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', sm: 'inherit' } }}>
          <Typography variant="body2">New user?</Typography>

          <Link
            component={RouterLink}
            onClick={handleOpen}
            to={PATH_PAGE.subscription}
            variant="subtitle2"
            style={{ color: '#1FA9FF' }}
          >
            Create an account
          </Link>
        </Stack>

        <Stack>
          <Link
            component={RouterLink}
            to={PATH_AUTH.resetPassword}
            variant="body2"
            color="inherit"
            underline="always"
            sx={{ display: 'flex', justifyContent: { xs: 'end', sm: 'start' } }}
          >
            Forgot password?
          </Link>
        </Stack>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          mt: 1,
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'white'),
          },
          color: 'white',
        }}
        style={{ background: '#1FA9FF' }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}

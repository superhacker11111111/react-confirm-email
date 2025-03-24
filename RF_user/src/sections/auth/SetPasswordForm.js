import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Stack, IconButton, InputAdornment, Typography, Checkbox, Link } from '@mui/material';
import { createPassword } from '../../redux/actions/authAction';
// auth
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';
import { CompanyRole } from '../../assets/data/roles';
import { HOST_API_KEY } from '../../config-global';
// ----------------------------------------------------------------------

SetPasswordForm.propTypes = {
  email: PropTypes.string,
};

export default function SetPasswordForm({ email }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [agreeToTerm, setAgreeToTerm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    enqueueSnackbar(message, { variant: result });
  };

  const { reset, handleSubmit, watch } = methods;
  const values = watch();
  const onSubmit = async () => {
    setIsLoading(true);
    const passwordData = {
      email,
      password: values.password,
      role: CompanyRole.code,
    };
    dispatch(createPassword(passwordData, navigate, SnackBar, reset));
    setIsLoading(true);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ my: 6 }}>
        <Stack sx={{ mb: 4 }}>
          <Typography sx={{ mb: 2, fontSize: '32px', fontWeight: 800 }}>Create Password</Typography>
          <Typography variant="subtitle1" color="#68718B">
            Welcome to RealityFence!
          </Typography>
          <Typography variant="subtitle1" color="#68718B">
            {email}
          </Typography>
        </Stack>
        <Stack spacing={3} my={3}>
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
        <Stack
          spacing={2.5}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Checkbox
            color="primary"
            checked={agreeToTerm}
            onChange={() => setAgreeToTerm((prev) => !prev)}
            sx={{
              fontSize: '40px',
              '&:hover': { opacity: 0.72 },
              '& svg': { width: 30, height: 30 },
            }}
          />
          <Typography sx={{ fontSize: '14px', marginTop: '0px !important' }}>
            I agree to the
          </Typography>
          &nbsp;
          <Link
            href={`${HOST_API_KEY}/static/LICENSING_AGREEMENT.pdf`}
            target="_blank"
            sx={{
              fontSize: '14px',
              marginTop: '0px !important',
              fontWeight: 700,
              paddingLeft: 0.1,
            }}
          >
            Terms and Conditions.
          </Link>
        </Stack>
        <LoadingButton
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          loading={isLoading}
          sx={{
            color: '#ffffff',
            backgroundColor: '#1FA9FF !important',
          }}
          disabled={!agreeToTerm}
        >
          Create Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

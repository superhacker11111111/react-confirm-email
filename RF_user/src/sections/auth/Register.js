// @mui
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Container,
  Typography,
  Button,
  TextField,
  Fab,
  IconButton,
  InputAdornment,
  Link,
  Divider,
  MenuItem,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PATH_AUTH } from '../../routes/paths';
// utils
import { bgGradient } from '../../utils/cssStyles';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import landerImage from '../../assets/illustrations/landeripad.png';
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField, RHFSelect } from '../../components/hook-form';
import Logo from '../../components/logo';
import { Block } from '../_examples/Block';
import { MemberRoles, CompanyRole, UserRoles } from '../../assets/data/roles';
import { registerType } from '../../assets/data/registerType';
import { register } from '../../redux/actions/authAction';

import { useSnackbar } from '../../components/snackbar';
// ----------------------------------------------------------------------

const INTEREST_OPTION = [
  { value: '1', label: 'I want a fence now' },
  { value: '2', label: 'I want a fence soon' },
  { value: '3', label: 'I am just looking' },
];
const style = {
  '& > *': { my: '8px !important' },
  bgcolor: '#FFF',
};
const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, 0.9),
    imgUrl: '/assets/background/overlay_1.jpg',
  }),
  overflow: 'hidden',
}));

// ----------------------------------------------------------------------

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required('FullName required'),
    phoneNumber: Yup.number().required('phoneNumber required'),
    zipCode: Yup.string().required('zipCode required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .required('Password is required')
      .oneOf([Yup.ref('password')], "Password's not match"),
  });
  const defaultValues = {
    fullName: '',
    phoneNumber: '',
    email: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
    interestLevel: '',
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setshowCPassword] = useState(false);
  const isMdUp = useResponsive('up', 'md');
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };
  const { enqueueSnackbar } = useSnackbar();
  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const [values, setValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });
  const onSubmit = async (data) => {
    const registerData = {
      email: data.email.toLowerCase(),
      password: data.password,
      full_name: data.fullName,
      zipCode: data.zipCode,
      phoneNumber: data.phoneNumber,
      interestLevel: data.interestLevel,
      type: registerType.default,
      role: CompanyRole.code,
      userType: UserRoles.shopper,
    };
    // sessionStorage.setItem('registerType', 'shopper');
    // sessionStorage.setItem('registerEmail', data.email);
    dispatch(register(registerData, navigate, SnackBar, reset));
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <StyledRoot>
        <Logo
          sx={{
            zIndex: 9,
            position: 'absolute',
            mt: { xs: 1.5, md: 5 },
            ml: { xs: 2, md: 5 },
          }}
        />
        <Container
          sx={{
            py: 15,
            display: { md: 'flex' },
            alignItems: { md: 'center' },
            height: { md: `100vh` },
            width: { md: `700px` },
          }}
        >
          <div className="w-full flex justify-center ">
            <Block title="Get Started" sx={style}>
              <Divider />
              <RHFTextField required fullWidth label="FullName" name="fullName" />
              <RHFTextField fullWidth name="email" label="Email address" />
              <RHFTextField required fullWidth label="Phone Number" name="phoneNumber" />
              <RHFTextField required fullWidth label="Zip Code" name="zipCode" />
              <RHFSelect
                fullWidth
                name="interestLevel"
                label="Interest Level"
                InputLabelProps={{ shrink: true }}
              >
                {INTEREST_OPTION.map((option) => (
                  <MenuItem key={option.value} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

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
                label="Confirm Password"
                type={showCPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setshowCPassword(!showCPassword)} edge="end">
                        <Iconify icon={showCPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography
                component="div"
                sx={{ color: 'text.secondary', mt: 3, typography: 'caption', textAlign: 'center' }}
              >
                {'I agree to '}
                <Link underline="always" color="text.primary">
                  Terms of Service
                </Link>
                {' and '}
                <Link underline="always" color="text.primary">
                  Privacy Policy
                </Link>
                .
              </Typography>
              <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting || isSubmitSuccessful}
                sx={{
                  bgcolor: '#1FA9FF',
                  color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                  '&:hover': {
                    bgcolor: '#1FA9FF',
                    color: (theme) =>
                      theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                  },
                }}
              >
                Create account
              </LoadingButton>
            </Block>
          </div>
        </Container>
      </StyledRoot>
    </FormProvider>
  );
}

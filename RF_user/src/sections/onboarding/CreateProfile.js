import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Typography, Link, Grid, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import setAuthToken from '../../utils/setAuthToken';

import { userAction } from '../../redux/actions/userAction';
// layouts
// components
// import Logo from '../../components/logo';
//
// routes
//
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
// ----------------------------------------------------------------------

export default function CreateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const RegisterSchema = Yup.object().shape({
    firstname: Yup.string().required('First name required'),
    lastname: Yup.string().required('Last name required'),
    phoneNumber: Yup.string().required('PhoneNumber required'),
    // email: Yup.string().required('Email is required'),
    zipCode: Yup.string().required('ZipCode is required'),
  });

  const defaultValues = {
    firstname: '',
    lastname: '',
    phoneNumber: '',
    // email: '',
    zipCode: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const values = watch();
  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };

  const createProfile = async (data) => {
    setAuthToken(localStorage.getItem('accessToken'));
    const updateData = {
      fullName: `${values.lastname} ${values.firstname}`,
      phoneNumber: values.phoneNumber,
      zipCode: values.zipCode,
    };
    dispatch(userAction.createProfile(updateData, SnackBar, navigate, reset));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(createProfile)}>
      <Grid
        // direction={{ xs: 'column', sm: 'column', md: 'row' }}
        // spacing={{ xs: 8, sm: 8, md: 16, lg: 20, xl: 20 }}
        sx={{
          width: { xs: '100%', md: '50%' },
          margin: 'auto',
          marginTop: 15,
        }}
        justifyContent="center"
        alignItems="center"
        // sx={{ margin: '15 20 0' }}
      >
        {/* <Stack minWidth={0}>
          <Payment stripePromise={stripePromise} />
        </Stack> */}
        <Grid
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: { xs: 'center' },
            // width: '600px',
            boxShadow: (theme) => theme.customShadows.z24,
          }}
        >
          {/* <div>
            <div className="text-center"> */}
          <Typography variant="h3" paragraph mb={5}>
            Let&apos;s Get Started
          </Typography>
          {/* </div>
          </div> */}
          <Stack spacing={4}>
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
            <RHFTextField name="firstname" label="First Name" variant="filled" />
            <RHFTextField name="lastname" label="Last Name" variant="filled" />
            <RHFTextField name="phoneNumber" label="Phone Number" variant="filled" />
            {/* <RHFTextField name="email" label="Email Address" variant="filled" /> */}
            <RHFTextField name="zipCode" label="Zip Code's Serviced" variant="filled" />
            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting || isSubmitSuccessful}
              sx={{
                mt: '20px',
                bgcolor: 'text.primary',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'common.blue'),
                '&:hover': {
                  bgcolor: 'text.primary',
                  color: (theme) =>
                    theme.palette.mode === 'light' ? 'common.white' : 'common.blue',
                },
              }}
            >
              Comfirm
            </LoadingButton>
          </Stack>

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
        </Grid>{' '}
      </Grid>{' '}
    </FormProvider>
  );
}

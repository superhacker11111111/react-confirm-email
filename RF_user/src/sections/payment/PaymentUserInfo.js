// import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { useMemo, useEffect } from 'react';
// @mui
import { Typography, Stack } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------
PaymentUserInfo.propTypes = {};

export default function PaymentUserInfo() {
  const NewPaymentUserSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    company: Yup.string().required('Company is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password should be of minimum 6 characters length'),
    confirmPassword: Yup.string()
      .required('ConfirmPassword is required')
      .oneOf([Yup.ref('password')], 'Password is not match'),
  });

  const defaultValues = useMemo(
    () => ({
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewPaymentUserSchema),
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const onSubmit = (data) => {
  //   handleEvent('userInfo', values);
  // };

  return (
    <FormProvider methods={methods}>
      <Typography variant="h6">Info</Typography>

      <Stack spacing={3} mt={5}>
        <RHFTextField fullWidth label="Company Name" name="company" />
        <RHFTextField fullWidth label="Email" name="email" />
        <RHFTextField fullWidth name="password" label="Create Password" />
        <RHFTextField fullWidth name="confirmPassword" label="Confirm Password" />
      </Stack>
    </FormProvider>
  );
}

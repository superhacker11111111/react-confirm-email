import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { UserRoles } from '../../assets/data/roles';
import { registerType } from '../../assets/data/registerType';
// import { register } from '../../redux/actions/authAction';
import { createProfile } from '../../redux/actions/authAction';

import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#FFFFFF',
  border: ' #FFFFFF',
  boxShadow: 10,
  p: 4,
};

export default function RegisterForm() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePath = () => {
    setOpen(false);
    navigate('/tutorial', {
      replace: true,
    });
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const RegisterSchema = Yup.object().shape({
    // companyName: Yup.string().required('First name required'),
    address: Yup.string().required('address required'),
    country: Yup.string().required('country is required'),
    zipCode: Yup.string().required('zipCode is required'),
  });

  const defaultValues = {
    companyName: '',
    address: '',
    country: '',
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
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };
  const onSubmit = async (data) => {
    const registerData = {
      companyName: data.companyName,
      address: data.address,
      country: data.country,
      zipCode: data.zipCode,
      type: registerType.default,
      role: UserRoles.professional,
    };
    dispatch(createProfile(registerData, navigate, SnackBar, reset));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Dialog open={open} onClose={handleClose}>
        <div className="text-center w-full h-96">
          <DialogTitle>Step One</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Tutorial: Setting Up 'Select MyFences' Step 1: Browse Fences: Upon entering the
              'Select MyFences' section, you'll find various categories of fences displayed. Browse
              through them to understand what options are available.`}
            </DialogContentText>
          </DialogContent>

          <div className="mt-20 flex w-full justify-center">
            <DialogActions>
              <Button
                style={{
                  color: 'white',
                  backgroundColor: '#1288e3',
                  padding: '8px 16px',
                  fontSize: 18,
                  width: '160px',
                  borderRadius: 10,
                }}
                onClick={handleClose}
              >
                Back
              </Button>
              <Button
                style={{
                  color: 'white',
                  backgroundColor: '#1288e3',
                  padding: '8px 16px',
                  fontSize: 18,
                  width: '160px',
                  borderRadius: 10,
                }}
                autoFocus
                onClick={handlePath}
              >
                Next
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
      <Stack spacing={2.5}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="companyName" label="Company Name" variant="filled" />
        <RHFTextField name="address" label="Address" variant="filled" />
        <RHFTextField name="country" label="Country" variant="filled" />
        <RHFTextField name="zipCode" label="Zip Code" variant="filled" />
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          onClick={handleOpen}
          variant="contained"
          loading={isSubmitting || isSubmitSuccessful}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

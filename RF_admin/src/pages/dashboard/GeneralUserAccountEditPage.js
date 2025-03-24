import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';

// @mui
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
// import { makeStyles } from '@mui/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { defaultCountries, parseCountry } from 'react-international-phone';

import FormProvider, { RHFTextField, RHFCountryDialcodeSelect } from '../../components/hook-form';
import { getUser, updateAccountInfo } from '../../redux/slices/user';
import { PATH_DASHBOARD } from '../../routes/paths';
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import { CompanyRole } from '../../assets/data/roles';

export default function GeneralUserAccountEditPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title> Update Account Info | RealityFence</title>
      </Helmet>
      <Container
        sx={{
          pt: 5,
          pb: 10,
          width: { sx: '100%', lg: '50%' },
          minHeight: 1,
        }}
      >
        <Typography variant="h3" textAlign="center">
          Update Account Information
        </Typography>
        <AccountEditForm user={user} />
      </Container>
    </>
  );
}

AccountEditForm.propTypes = {
  user: PropTypes.object,
};

function AccountEditForm({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const countriesData = defaultCountries.map((c) => parseCountry(c));

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const AccountSchema = Yup.object().shape({
    company: Yup.string().required('Company is required'),
    addressline1: Yup.string().required('Address Line 1 is required'),
    addressline2: Yup.string(),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('ZipCode is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    fullName: Yup.string().required('Full Name is a required field'),
    email: Yup.string().required('Email is a required field').email('This is not Email Address'),
    dialCode: Yup.string().required('Dial Code is a required field'),
    phoneNumber: Yup.string().required('Phone is a required field'),
    password: changePassword
      ? Yup.string()
          .required('Password is a required field')
          .min(12, 'Password must contain at least 12 characters.')
          .matches(/^(?=.*[a-z])/, 'Password must contain a mix of upper and lower case letters')
          .matches(/^(?=.*[A-Z])/, 'Password must contain a mix of upper and lower case letters')
          .matches(
            /^(?=.*[!@#%&^$])/,
            'Password must contain at least one special character(e.g.,!,@,#,$)'
          )
      : Yup.string(),
    confirmPassword: changePassword
      ? Yup.string()
          .required('Confirm Your Password is a required field')
          .oneOf([Yup.ref('password')], "Password's do not match")
      : Yup.string(),
  });

  const defaultAccountValues = useMemo(
    () => ({
      company: user?.company || '',
      addressline1: user?.address1 || '',
      addressline2: user?.address2 || '',
      city: user?.city || '',
      zipCode: user?.zipCode || '',
      country: user?.country || '',
      state: user?.state || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dialCode: user?.dialCode || 'us',
    }),
    [user]
  );

  const accountMethods = useForm({
    resolver: yupResolver(AccountSchema),
    defaultValues: defaultAccountValues,
  });

  const { handleSubmit, watch, setValue } = accountMethods;

  const values = watch();

  const makePhoneNumberWithFormat = async (oldNumber, iso2) => {
    const phoneformat = countriesData.filter((c) => c.iso2 === iso2);
    let currentNumber = oldNumber.replace(/[^a-zA-Z0-9]/g, '');
    if (phoneformat[0] && phoneformat[0].format && currentNumber) {
      let formatNumber = '';
      phoneformat[0].format.split('').forEach((item) => {
        if (currentNumber !== '') {
          if (item === '.') {
            formatNumber += currentNumber[0] || '';
            currentNumber = currentNumber.slice(1, currentNumber.length);
          } else {
            formatNumber += item;
          }
        }
      });
      setValue('phoneNumber', formatNumber);
    } else {
      setValue('phoneNumber', currentNumber);
    }
  };

  useEffect(() => {
    const autoComplete = new window.google.maps.places.Autocomplete(
      document.querySelector('[name="addressline1"]')
    );
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        console.log('this location not available');
      }
      if (place.geometry.viewport || place.geometry.location) {
        const addressComponents = place.address_components;
        // Initialize variables to store the extracted information
        let street_number = '';
        let address = '';
        let city = '';
        let state = '';
        let country = '';
        let zip = '';
        // Loop through all the address components
        for (let i = 0; i < addressComponents.length; i += 1) {
          const addressType = addressComponents[i].types[0];
          // Extract the street_number
          if (addressType === 'street_number') {
            street_number = addressComponents[i].long_name;
          }
          // Extract the address
          if (addressType === 'route') {
            address = addressComponents[i].long_name;
          }
          // Extract the city
          if (addressType === 'locality' || addressType === 'postal_town') {
            city = addressComponents[i].long_name;
          }
          // Extract the state
          if (addressType === 'administrative_area_level_1') {
            state = addressComponents[i].long_name;
          }
          // Extract the country
          if (addressType === 'country') {
            country = addressComponents[i].long_name;
          }
          // Extract the zip code
          if (addressType === 'postal_code') {
            zip = addressComponents[i].long_name;
          }
        }
        setValue('addressline1', `${street_number} ${address}`);
        setValue('city', city);
        setValue('state', state);
        setValue('country', country);
        setValue('zipCode', zip);
      }
    });
  }, [setValue]);

  const onSubmit = () => {
    const updateAccountData = {
      company: values.company,
      address1: values.addressline1,
      address2: values.addressline2,
      city: values.city,
      zipCode: values.zipCode,
      country: values.country,
      state: values.state,
      fullName: values.fullName,
      email: values.email.toLowerCase(),
      phoneNumber: values.phoneNumber,
      dialCode: values.dialCode,
      role: user ? user.role : CompanyRole.code,
    };
    if (changePassword) {
      updateAccountData.password = values.password;
    }
    dispatch(updateAccountInfo(user.id, updateAccountData, SnackBar, navigate));
  };

  return (
    <FormProvider methods={accountMethods} onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography variant="h6">Edit Account Info</Typography>
        <Typography variant="body2">Street Address</Typography>
        <Stack spacing={1} mt={2} mb={5}>
          <RHFTextField fullWidth label="Company" name="company" />
          <RHFTextField fullWidth label="Address Line 1" name="addressline1" />
          <RHFTextField fullWidth label="Address Line 2 (Optional)" name="addressline2" />
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
          >
            <RHFTextField label="City" name="city" />
            <RHFTextField label="Zip Code" name="zipCode" />
            <RHFTextField name="country" label="Country" />
            <RHFTextField name="state" label="State" />
          </Box>
        </Stack>
        <Typography variant="body2">Primary Contact</Typography>
        <Stack spacing={1} mt={2} mb={5}>
          <RHFTextField fullWidth label="Name" name="fullName" />
          <RHFTextField fullWidth label="Email" name="email" />
          <Stack flexDirection="row">
            <RHFCountryDialcodeSelect
              name="dialCode"
              onChange={(e) => {
                setValue('dialCode', e.target.value);
                makePhoneNumberWithFormat(values.phoneNumber, e.target.value);
              }}
            />
            <RHFTextField
              fullWidth
              label="Your Phone Number"
              name="phoneNumber"
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/[a-zA-Z]/g, '');
                setValue('phoneNumber', filteredValue);
                makePhoneNumberWithFormat(filteredValue, values.dialCode);
              }}
            />
          </Stack>
        </Stack>
        <Typography variant="body2">Password</Typography>
        <Button
          variant="outlined"
          sx={{ px: '40px', mt: '5px' }}
          onClick={() => setChangePassword(!changePassword)}
          color={changePassword ? 'error' : 'success'}
        >
          {changePassword ? 'Hide' : 'Change Password'}
        </Button>
        {changePassword && (
          <Stack spacing={1} mt={1}>
            <RHFTextField
              fullWidth
              label="Password"
              name="password"
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
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
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
        )}
      </Box>
      <Stack flexDirection="row" gap={20} justifyContent="center" mt={5}>
        <Button
          variant="contained"
          type="submit"
          sx={{
            '&:hover': {
              backgroundColor: '#c0deff',
              opacity: 0.8,
            },
            backgroundColor: '#c0deff',
            color: '#1288e3',
            fontWeight: '900',
            width: '150px',
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          sx={{
            '&:hover': {
              backgroundColor: '#c0deff',
              opacity: 0.8,
            },
            backgroundColor: '#c0deff',
            color: '#1288e3',
            fontWeight: '900',
            width: '150px',
          }}
          onClick={() => navigate(PATH_DASHBOARD.general.user.account)}
        >
          Cancel
        </Button>
      </Stack>
    </FormProvider>
  );
}

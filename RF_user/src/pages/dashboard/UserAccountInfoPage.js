import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';

import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { defaultCountries, parseCountry } from 'react-international-phone';

import { updateInfoUser } from '../../redux/slices/user';
import Iconify from '../../components/iconify';
import { useDispatch, useSelector } from '../../redux/store';

// import { updateInfoUser } from '../../redux/actions/authAction';
// sections
import FormProvider, { RHFTextField, RHFCountryDialcodeSelect } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';

UserAccountInfoPage.propTypes = {};

export default function UserAccountInfoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [editPassword, setEditPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const countriesData = defaultCountries.map((c) => parseCountry(c));

  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };
  const handleClickItem = () => {
    navigate(-1);
  };
  let AccountSchema = '';
  if (editPassword === true) {
    AccountSchema = Yup.object().shape({
      company: Yup.string().required('Company is required'),
      addressline1: Yup.string().required('Address Line 1 is required'),
      addressline2: Yup.string(),
      city: Yup.string().required('City is required'),
      zipCode: Yup.string().required('ZipCode is required'),
      country: Yup.string().required('Country is required'),
      state: Yup.string().required('State is required'),
      fullName: Yup.string().required('Full Name is a required field'),
      email: Yup.string().required('Email is a required field').email('This is not Email Address'),
      phoneNumber: Yup.string().required('Phone is a required field'),
      dialCode: Yup.string().required('Dial Code is a required field'),
      password: Yup.string()
        .min(12, 'Password must contain at least 12 characters.')
        .matches(/^(?=.*[a-z])/, 'Password must contain a mix of upper and lower case letters')
        .matches(/^(?=.*[A-Z])/, 'Password must contain a mix of upper and lower case letters')
        .matches(
          /^(?=.*[!@#%&^$])/,
          'Password must contain at least one special character(e.g.,!,@,#,$)'
        ),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Password's do not match"),
    });
  } else {
    AccountSchema = Yup.object().shape({
      company: Yup.string().required('Company is required'),
      addressline1: Yup.string().required('Address Line 1 is required'),
      addressline2: Yup.string(),
      city: Yup.string().required('City is required'),
      zipCode: Yup.string().required('ZipCode is required'),
      country: Yup.string().required('Country is required'),
      state: Yup.string().required('State is required'),
      fullName: Yup.string().required('Full Name is a required field'),
      email: Yup.string().required('Email is a required field').email('This is not Email Address'),
      phoneNumber: Yup.string().required('Phone is a required field'),
      dialCode: Yup.string().required('Dial Code is a required field'),
    });
  }

  const defaultAccountValues =
    editPassword === true
      ? {
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
          currentPassword: '',
          password: '',
          confirmPassword: '',
        }
      : {
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
        };

  const accountmethods = useForm({
    resolver: yupResolver(AccountSchema),
    defaultValues: defaultAccountValues,
  });

  const { watch, setValue } = accountmethods;

  const accountData = watch();

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

  const onSubmit = () => {
    setIsLoading(true);
    const updateData = editPassword
      ? {
          fullName: accountData.fullName,
          phoneNumber: accountData.phoneNumber,
          dialCode: accountData.dialCode,
          country: accountData.country,
          state: accountData.state,
          city: accountData.city,
          address1: accountData.addressline1,
          address2: accountData.addressline2,
          zipCode: accountData.zipCode,
          company: accountData.company,
          email: accountData.email.toLowerCase(),
          password: accountData.currentPassword,
          updatePassword: accountData.password,
        }
      : {
          fullName: accountData.fullName,
          phoneNumber: accountData.phoneNumber,
          dialCode: accountData.dialCode,
          country: accountData.country,
          state: accountData.state,
          city: accountData.city,
          address1: accountData.addressline1,
          address2: accountData.addressline2,
          zipCode: accountData.zipCode,
          company: accountData.company,
          email: accountData.email.toLowerCase(),
        };

    // sessionStorage.setItem('registerType', 'shopper');
    dispatch(updateInfoUser(user.id, updateData, SnackBar, navigate));
    setIsLoading(true);
  };

  return (
    <Container
      sx={{
        pt: 9,
        pb: 10,
        minHeight: 1,
      }}
    >
      <Typography fontSize="36px" fontWeight="700" align="center" paragraph>
        Update Account Information
      </Typography>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <FormProvider methods={accountmethods} onSubmit={accountmethods.handleSubmit(onSubmit)}>
          <Grid item sx={{ mt: 4, px: { xs: 3, md: 16 } }}>
            <Typography sx={{ fontSize: '22px', fontWeight: '600', mb: 2 }}>
              Edit Account Info
            </Typography>
            <Stack>
              <Box>
                <Typography
                  variant="overline"
                  sx={{ mb: 1, display: 'block', color: 'text.secondary' }}
                >
                  STREET ADDRESS
                </Typography>

                <Stack spacing={1} mt={2}>
                  <RHFTextField fullWidth label="Company Name" name="company" />
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
                    <RHFTextField label="Country" name="country" />
                    <RHFTextField label="State" name="state" />
                  </Box>
                </Stack>
                <Typography
                  variant="overline"
                  sx={{ mt: 6, mb: 1, display: 'block', color: 'text.secondary' }}
                >
                  PRIMARY CONTACT
                </Typography>

                <Stack spacing={1} mt={2}>
                  <RHFTextField fullWidth label="Full Name" name="fullName" />
                  <RHFTextField fullWidth label="Email" name="email" />
                  <Stack flexDirection="row">
                    <RHFCountryDialcodeSelect
                      name="dialCode"
                      onChange={(e) => {
                        setValue('dialCode', e.target.value);
                        makePhoneNumberWithFormat(accountData.phoneNumber, e.target.value);
                      }}
                    />
                    <RHFTextField
                      fullWidth
                      label="Your Phone Number"
                      name="phoneNumber"
                      onChange={(e) => {
                        const filteredValue = e.target.value.replace(/[a-zA-Z]/g, '');
                        setValue('phoneNumber', filteredValue);
                        makePhoneNumberWithFormat(filteredValue, accountData.dialCode);
                      }}
                    />
                  </Stack>
                </Stack>
                {editPassword ? (
                  <>
                    <Button
                      color="inherit"
                      variant="outlined"
                      style={{
                        fontSize: '15px',
                        color: '#fd074e',
                        borderColor: '#fd074e',
                        fontFamily: 'unset',
                        marginTop: '50px',
                      }}
                      onClick={() => setEditPassword(!editPassword)}
                    >
                      Hide
                    </Button>
                    <Box mt={6}>
                      <Typography
                        variant="overline"
                        sx={{ mb: 2, display: 'block', color: 'text.secondary' }}
                      >
                        UPDATE PASSWORD
                      </Typography>
                      <RHFTextField
                        fullWidth
                        name="currentPassword"
                        label="Current Password"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify
                                  icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <li style={{ fontSize: '14px', marginTop: '12px' }}>
                        Must be at least 12 characters long.
                      </li>
                      <li style={{ fontSize: '14px' }}>
                        Include a mix of uppercase and lowercase letters.
                      </li>
                      <li style={{ fontSize: '14px' }}>
                        Include at least one special character (e.g., !, @, #, $).
                      </li>
                    </Box>
                    <Stack spacing={1} mt={2}>
                      <RHFTextField
                        fullWidth
                        name="password"
                        label="Create Password"
                        type={updatePassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setUpdatePassword(!updatePassword)}
                                edge="end"
                              >
                                <Iconify
                                  icon={updatePassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <RHFTextField
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={confirmPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setConfirmPassword(!confirmPassword)}
                                edge="end"
                              >
                                <Iconify
                                  icon={confirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </>
                ) : (
                  <Button
                    color="inherit"
                    variant="outlined"
                    style={{
                      fontSize: '15px',
                      color: '#1FA9FF',
                      borderColor: '#C0DEFF',
                      fontFamily: 'unset',
                      marginTop: '50px',
                    }}
                    onClick={() => setEditPassword(!editPassword)}
                  >
                    Change Password
                  </Button>
                )}
              </Box>
            </Stack>
            <Grid item sx={{ py: 3, px: { md: 3 } }}>
              <div className="flex justify-between w-full">
                <Button
                  color="inherit"
                  variant="text"
                  style={{
                    backgroundColor: '#C0DEFF',
                    fontWeight: '900',
                    fontSize: '18px',
                    padding: '10px 65px',
                    color: '#1FA9FF',
                    borderRadius: '14px',
                    fontFamily: 'unset',
                  }}
                  onClick={handleClickItem}
                >
                  Cancel
                </Button>
                <LoadingButton
                  variant="text"
                  color="inherit"
                  type="submit"
                  loading={isLoading}
                  style={{
                    backgroundColor: '#C0DEFF',
                    padding: '10px 70px',
                    fontWeight: '900',
                    fontSize: '18px',
                    color: '#1FA9FF',
                    marginLeft: '5px',
                    borderRadius: '14px',
                    fontFamily: 'unset',
                  }}
                >
                  Save
                </LoadingButton>
              </div>
            </Grid>
          </Grid>
        </FormProvider>
      </Grid>
    </Container>
  );
}

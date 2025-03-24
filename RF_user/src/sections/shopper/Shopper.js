import * as Yup from 'yup';
import { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Typography,
  Grid,
  Box,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Checkbox,
  Link,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { defaultCountries, parseCountry } from 'react-international-phone';
import { register } from '../../redux/actions/authAction';
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFCountryDialcodeSelect,
} from '../../components/hook-form';
// import { confirmShopperSignupWebhook } from '../../hooks/zapierWebhooks';
import Iconify from '../../components/iconify';
import { GeneralType, INTEREST_LEVEL, ShopperRole, UserRoles } from '../../assets/data/roles';
import { useSnackbar } from '../../components/snackbar';
import { shopperEmailExistCheck } from '../../redux/slices/user';
import { EMAIL_VALIDATION_ERROR, EMAIL_REQUIRED } from '../../assets/data/message';
import { HOST_API_KEY } from '../../config-global';

export default function Shopper() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };
  const [agreeToTerm, setAgreeToTerm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [existError, setExistError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const countriesData = defaultCountries.map((c) => parseCountry(c));
  const isMobile = useMediaQuery('(max-width:600px)');

  const ShopperSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    addressline1: Yup.string().required('Address Line 1 is required'),
    addressline2: Yup.string(),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('ZipCode is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    email: Yup.string().required('Email is required').email('This is not Email Address'),
    dialCode: Yup.string().required('DialCode is a required field'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    interestLevel: Yup.string().required('Interest Level is required'),
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

  const defaultShopperValues = useMemo(
    () => ({
      fullName: '',
      addressline1: '',
      addressline2: '',
      city: '',
      dialCode: 'us',
      zipCode: '',
      country: '',
      state: '',
      email: '',
      phoneNumber: '',
      interestLevel: 'Ready to buy',
    }),
    []
  );

  // const accountMethods = useForm({
  //   resolver: yupResolver(ShopperSchema),
  //   defaultValues: defaultShopperValues,
  // });
  // const accountData = accountMethods.watch();

  const streetMethods = useForm({
    resolver: yupResolver(ShopperSchema),
    defaultValues: defaultShopperValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = streetMethods;

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

  const streetData = watch();

  const onExist = (event) => {
    const _email = event.target.value;
    setValue('email', event.target.value);

    if (!_email) setExistError(EMAIL_REQUIRED);
    else {
      clearErrors('email');
      if (!_email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
        setExistError(EMAIL_VALIDATION_ERROR);
      else dispatch(shopperEmailExistCheck(event.target.value, setExistError));
    }
  };

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
    setIsConfirmed(true);
    const registerData = {
      full_name: streetData.fullName,
      phoneNumber: streetData.phoneNumber,
      country: streetData.country,
      state: streetData.state,
      city: streetData.city,
      address1: streetData.addressline1,
      address2: streetData.addressline2,
      zipCode: streetData.zipCode,
      company: streetData.company,
      email: streetData.email.toLowerCase(),
      interestLevel: streetData.interestLevel,
      password: streetData.password,
      userType: UserRoles.shopper,
      role: ShopperRole.code,
      type: GeneralType,
    };
    // confirmShopperSignupWebhook(registerData);
    sessionStorage.setItem('registerType', 'shopper');
    dispatch(register(registerData, navigate, SnackBar, reset));
    setIsConfirmed(true);
  };

  return (
    <Stack sx={{ px: { md: 10, xs: 0.5 }, pt: { md: 3, xs: 0 }, pb: { md: 20, xs: 15 } }}>
      <Grid container direction="row" justifyContent="center" alignItems="start">
        <FormProvider methods={streetMethods} onSubmit={handleSubmit(onSubmit)}>
          {!isMobile ? (
            <>
              <Typography
                sx={{
                  fontSize: { md: '24px', sm: '20px', xs: '18px' },
                  fontWeight: '700',
                  mb: 4,
                }}
              >
                Register Your RealityFence Shopper Account
              </Typography>
              <Typography sx={{ fontSize: '15px', mb: 3, fontWeight: '500' }}>
                INFORMATION
              </Typography>
            </>
          ) : (
            ''
          )}
          {!isMobile ? (
            <Stack spacing={1} mt={2}>
              <RHFTextField fullWidth label="Name" name="fullName" />
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
              <Box
                gap={1}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={streetData.email}
                  onChange={onExist}
                  error={!!existError || !!errors?.email?.message}
                  helperText={existError}
                />
                <Stack flexDirection="row">
                  <RHFCountryDialcodeSelect
                    name="dialCode"
                    onChange={(e) => {
                      setValue('dialCode', e.target.value);
                      makePhoneNumberWithFormat(streetData.phoneNumber, e.target.value);
                    }}
                  />
                  <RHFTextField
                    fullWidth
                    label="Your Phone Number"
                    name="phoneNumber"
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(/[a-zA-Z]/g, '');
                      setValue('phoneNumber', filteredValue);
                      makePhoneNumberWithFormat(filteredValue, streetData.dialCode);
                    }}
                  />
                </Stack>
                <RHFSelect native label="Interest Level" name="interestLevel">
                  <option value={INTEREST_LEVEL.BUY} name={INTEREST_LEVEL.BUY}>
                    {INTEREST_LEVEL.BUY}
                  </option>
                  <option value={INTEREST_LEVEL.LOOKING} name={INTEREST_LEVEL.LOOKING}>
                    {INTEREST_LEVEL.LOOKING}
                  </option>
                </RHFSelect>
              </Box>
            </Stack>
          ) : (
            <Box sx={{ boxShadow: { xs: 0, sm: 15 }, px: { md: 5, xs: 0.5 }, py: 2 }}>
              <Grid
                container
                spacing={{ md: 4, xs: 2 }}
                sx={{ pb: { md: 4, xs: 2 }, pt: { md: 4, xs: 0 } }}
              >
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: '700', color: '#03133D' }}>Name</Typography>
                  <RHFTextField fullWidth name="fullName" placeholder="Enter your name" />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: '700', color: '#03133D' }}>
                    Address Line 1
                  </Typography>
                  <RHFTextField fullWidth name="addressline1" placeholder="Enter your address" />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: '700', color: '#03133D' }}>
                    Address Line 2 (Optional)
                  </Typography>

                  <RHFTextField fullWidth name="addressline2" placeholder="Enter your address" />
                </Grid>
                <Grid item xs={12}>
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
                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: '700', color: '#03133D' }}>City</Typography>
                      <RHFTextField name="city" placeholder="Enter your city" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: '700', color: '#03133D' }}>Zip Code</Typography>
                      <RHFTextField name="zipCode" placeholder="Enter your zip code" />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: '700', color: '#03133D' }}>Country</Typography>
                      <RHFTextField name="country" />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: '700', color: '#03133D' }}>State</Typography>
                      <RHFTextField name="state" />
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    gap={1}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(2, 1fr)',
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: '700', color: '#03133D' }}>Email</Typography>
                      <RHFTextField
                        fullWidth
                        name="email"
                        value={streetData.email}
                        onChange={onExist}
                        error={!!existError || !!errors?.email?.message}
                        helperText={existError}
                        placeholder="Enter your email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: '700', color: '#03133D' }}>Phone</Typography>
                      <Stack flexDirection="row">
                        <RHFCountryDialcodeSelect
                          name="dialCode"
                          onChange={(e) => {
                            setValue('dialCode', e.target.value);
                            makePhoneNumberWithFormat(streetData.phoneNumber, e.target.value);
                          }}
                        />
                        <RHFTextField
                          fullWidth
                          label="Your Phone Number"
                          name="phoneNumber"
                          onChange={(e) => {
                            const filteredValue = e.target.value.replace(/[a-zA-Z]/g, '');
                            setValue('phoneNumber', filteredValue);
                            makePhoneNumberWithFormat(filteredValue, streetData.dialCode);
                          }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontWeight: '700', color: '#03133D' }}>
                        Interest Level
                      </Typography>
                      <RHFSelect native name="interestLevel" placeholder="Interest Level">
                        <option value={INTEREST_LEVEL.BUY} name={INTEREST_LEVEL.BUY}>
                          {INTEREST_LEVEL.BUY}
                        </option>
                        <option value={INTEREST_LEVEL.LOOKING} name={INTEREST_LEVEL.LOOKING}>
                          {INTEREST_LEVEL.LOOKING}
                        </option>
                      </RHFSelect>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          <Box>
            {!isMobile ? (
              <Stack display="flex" sx={{ mt: 5 }}>
                <Typography sx={{ fontSize: { xs: '13px', md: '15px' }, fontWeight: '500' }}>
                  CREATE PASSWORD
                </Typography>
                <li style={{ fontSize: '14px' }}>Must be at least 12 characters long.</li>
                <li style={{ fontSize: '14px' }}>
                  Include a mix of uppercase and lowercase letters.
                </li>
                <li style={{ fontSize: '14px' }}>
                  Include at least one special character (e.g., !, @, #, $).
                </li>
              </Stack>
            ) : (
              <Stack display="flex">
                <Typography
                  sx={{
                    fontSize: { xs: '14.5px', md: '15px' },
                    fontWeight: '700',
                    alignSelf: 'center',
                    color: '#637381',
                    mb: 1,
                  }}
                >
                  CREATE PASSWORD
                </Typography>
                <li style={{ fontSize: '12px', color: '#000000' }}>
                  Must be at least 12 characters long.
                </li>
                <li style={{ fontSize: '12px', color: '#000000' }}>
                  Include a mix of uppercase and lowercase letters.
                </li>
                <li style={{ fontSize: '12px', color: '#000000' }}>
                  Include at least one special character (e.g., !, @, #, $).
                </li>
              </Stack>
            )}

            <Stack spacing={2} mt={{ md: 5, xs: 3 }} mb={3}>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: '700', color: '#03133D' }}>Password</Typography>
                <RHFTextField
                  fullWidth
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
                  placeholder="Password"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: '700', color: '#03133D' }}>
                  Confirm Password
                </Typography>
                <RHFTextField
                  fullWidth
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
                  placeholder="Confirm Password"
                />
              </Grid>
            </Stack>
          </Box>
          <Stack style={{ alignItems: 'center' }}>
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
              <Typography variant="body2" sx={{ marginTop: '0px !important', color: '#000000' }}>
                I agree to the
              </Typography>
              &nbsp;
              <Link
                variant="body2"
                href={`${HOST_API_KEY}/static/TERMS_AND_CONDITIONS.pdf`}
                target="_blank"
                sx={{ marginTop: '0px !important', fontWeight: 700, paddingLeft: 0.1 }}
              >
                Terms and Conditions.
              </Link>
            </Stack>
            <LoadingButton
              variant="contained"
              size="large"
              style={{ width: '80%', backgroundColor: '#1288e3' }}
              sx={{
                mt: 1,
                float: 'right',
                fontSize: '18px',
                letterSpacing: '1px',
                backgroundColor: 'rgb(31, 169, 255) !important',
              }}
              type="submit"
              disabled={!agreeToTerm || existError}
              loading={isConfirmed}
            >
              Register
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Grid>
    </Stack>
  );
}

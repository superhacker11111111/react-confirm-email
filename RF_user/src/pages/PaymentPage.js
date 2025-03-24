import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';

// @mui
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  Switch,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CardElement, Elements, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import csc from 'country-state-city';
import { useFormik } from 'formik';
import { registerType } from '../assets/data/registerType';
import { CompanyRole } from '../assets/data/roles';
import Label from '../components/label';
import Iconify from '../components/iconify';
// hooks
import useResponsive from '../hooks/useResponsive';
import axios from '../utils/axios';
import { getPrice } from '../redux/slices/price';
import { register } from '../redux/actions/authAction';
import FormProvider, { RHFTextField, RHFSelect } from '../components/hook-form';
import { STRIPE_PUBLISHABLE_KEY } from '../config-global';
import { useSnackbar } from '../components/snackbar';
// ----------------------------------------------------------------------

function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const elements = useElements();
  const id = sessionStorage.getItem('priceId');
  const price = useSelector((state) => state.price.price);
  const isDesktop = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };
  const [showPassword, setShowPassword] = useState(false);
  const [paymentType, setPaymentType] = useState(false);
  const [country_val, setCountryVal] = useState('');

  const NewPaymentSchema = Yup.object().shape({
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('ZipCode is required'),
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
      country: '',
      address: '',
      state: '',
      zipCode: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewPaymentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const result = watch();

  useEffect(() => {
    if (id) {
      dispatch(getPrice(id));
    } else {
      alert('Please choose Plan');
    }
  }, [dispatch, id]);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const upgradePlan = async () => {
    try {
      const paymentMethod = await axios.post('stripe/create-payment-method', {
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: result.company,
          address: {
            country: result.country,
            line1: result.address,
            postal_code: result.zipCode,
            state: result.state,
          },
          email: result.email.toLowerCase(),
        },
      });

      const customer = await axios.post('stripe/create-customer', {
        description: `New Customer with ${price.name}`,
        address: {
          country: result.country,
          line1: result.address,
          postal_code: result.zipCode,
          state: result.state,
        },
        email: result.email.toLowerCase(),
        name: result.company,
        payment_method: paymentMethod.data.id,
        invoice_settings: {
          default_payment_method: paymentMethod.data.id,
        },
      });

      const priceInformation = await axios.post('stripe/create-price', {
        unit_amount: !paymentType
          ? Math.round(Number(price?.price).toFixed(2) * 100)
          : Math.round(
              (((Number(price?.price) * (100 - Number(price?.discount))) / 100) * 12).toFixed(2) *
                100
            ),
        currency: 'usd',
        recurring: { interval: paymentType ? 'year' : 'month' },
        product_data: {
          name: `Payment a ${paymentType ? 'year' : 'month'} for ${price?.name}`,
        },
      });
      const subscription = await axios.post('stripe/create-subscription', {
        customer: customer.data.id,
        // description: `${price.name} Subscription for ${result.company}`,
        default_payment_method: paymentMethod.data.id,
        description: `${price?.name} Subscription for ${result.company}`,
        items: [
          {
            price: `${priceInformation.data.id}`,
            quantity: 1,
          },
        ],
        cancel_at_period_end: false,
        currency: 'usd',
        collection_method: 'charge_automatically',
        automatic_tax: {
          enabled: false,
        },
      });
      const registerData = {
        company: result.company,
        email: result.email.toLowerCase(),
        password: result.password,
        userType: price?.order,
        role: CompanyRole.code,
        type: registerType.default,
        stripe_subscription_id: subscription.data.id,
        subscription_status: 'active',
      };
      dispatch(register(registerData, navigate, SnackBar, reset));
    } catch (err) {
      console.log(err.message);
      SnackBar(err.message, 'error');
    }
  };

  const addressFromik = useFormik({
    initialValues: {
      country: 'United State',
      state: null,
      city: null,
    },
    onSubmit: (values) => console.log(JSON.stringify(values)),
  });
  const countries = csc.getAllCountries();
  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.id,
    ...country,
  }));

  const updatedStates = (countryId) =>
    csc
      .getStatesOfCountry(countryId)
      .map((state) => ({ label: state.name, value: state.id, ...state }));

  const { values } = addressFromik;

  const onChangeCountry = (event) => {
    event.preventDefault();
    setCountryVal(event.target.value);
  };
  useEffect(() => {}, [values]);

  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: { xs: 10, sm: 15 },
          pb: 10,
          minHeight: 1,
        }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(upgradePlan)}>
          <Typography variant="h3" align="center" paragraph>
            {`Let's finish powering you up!`}
          </Typography>

          <Typography align="center" sx={{ color: 'text.secondary', mb: 5 }}>
            Professional plan is right for you.
          </Typography>

          <Grid container spacing={isDesktop ? 3 : 5}>
            <Grid item xs={12} md={8}>
              <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                sx={{
                  p: { md: 5 },
                  borderRadius: 2,
                  border: (theme) => ({
                    md: `dashed 1px ${theme.palette.divider}`,
                  }),
                }}
              >
                <Box>
                  <Typography variant="h6">Info</Typography>

                  <Stack spacing={3} mt={5}>
                    <RHFTextField fullWidth label="Company Name" name="company" />
                    <RHFTextField fullWidth label="Email" name="email" />
                    <RHFTextField
                      fullWidth
                      name="password"
                      label="Create Password"
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
                </Box>
                <Box>
                  <Typography variant="h6">Billing Address</Typography>

                  <Stack spacing={3} mt={5}>
                    <RHFSelect
                      native
                      name="country"
                      label="Country"
                      placeholder="Country"
                      value={country_val}
                      onChange={onChangeCountry}
                    >
                      <option value="" />
                      {updatedCountries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.label}
                        </option>
                      ))}
                    </RHFSelect>

                    <RHFSelect native name="State" label="State" placeholder="State">
                      {updatedStates(country_val).map((state) => (
                        <option key={state.id} value={state.name}>
                          {state.label}
                        </option>
                      ))}
                    </RHFSelect>

                    <RHFTextField fullWidth label="ZipCode" name="zipCode" />
                    <RHFTextField fullWidth label="Address" name="address" />
                  </Stack>
                </Box>
                <Box>
                  <Typography mb={1} variant="h6">
                    Payment Info
                  </Typography>
                  <div
                    style={{
                      border: '1.2px solid',
                      padding: '1rem',
                      borderRadius: '10px',
                      borderColor: '#e5e7eb',
                    }}
                  >
                    <CardElement
                      options={{
                        style: {
                          base: {
                            border: '1px solid black',
                            color: '#32325d',
                            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                            fontSmoothing: 'antialiased',
                            fontSize: '16px',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#fa755a',
                            iconColor: '#fa755a',
                          },
                        },
                        hidePostalCode: true,
                      }}
                    />
                  </div>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: { xs: 2, sm: 5 },
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="h6" sx={{ mb: 5 }}>
                  Summary
                </Typography>

                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      sx={{ fontSize: '14px', alignSelf: 'center', color: 'text.secondary' }}
                    >
                      Subscription
                    </Typography>

                    <Label color="error">{price?.license || ''}</Label>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      sx={{ fontSize: '14px', alignSelf: 'center', color: 'text.secondary' }}
                    >
                      Billed Yearly
                    </Typography>
                    <Switch
                      checked={paymentType}
                      onChange={(e) => {
                        setPaymentType(e.target.checked);
                      }}
                    />
                    <Switch checked={paymentType} color="success" />
                  </Stack>

                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Typography variant="h5">$</Typography>

                    <Typography variant="h2">
                      {!paymentType
                        ? price?.price
                        : (Number(price?.price) * (100 - Number(price?.discount)) * 12) / 100}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{ mb: 1, alignSelf: 'center', color: 'text.secondary' }}
                    >
                      {paymentType ? '/yr' : '/mo'}
                    </Typography>
                  </Stack>
                  {paymentType ? (
                    <Stack direction="row" justifyContent="end">
                      <Label color="success">
                        Saving $
                        {price?.price
                          ? (Number(price?.price) * Number(price?.discount) * 12) / 100
                          : 0}{' '}
                        a year
                      </Label>
                    </Stack>
                  ) : (
                    ''
                  )}

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Total Billed</Typography>

                    <Typography variant="h6">
                      $
                      {!paymentType
                        ? price?.price
                        : (Number(price?.price) * (100 - Number(price?.discount)) * 12) / 100}
                      *
                    </Typography>
                  </Stack>

                  <Divider sx={{ borderStyle: 'dashed' }} />
                </Stack>

                <Typography
                  component="div"
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1 }}
                >
                  * Plus applicable taxes
                </Typography>

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 5, mb: 3 }}
                  loading={isSubmitting}
                >
                  Upgrade My Plan
                </LoadingButton>

                <Stack alignItems="center" spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="eva:shield-fill" sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle2">Secure credit card payment</Typography>
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', textAlign: 'center' }}
                  >
                    This is a secure 128-bit SSL encrypted payment
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}

export default function PaymentPage() {
  const [stripePromise, setStripePromise] = useState(null);
  // const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY));
    // axios.get('stripe/create-payment-intent').then((res) => {
    //   setClientSecret(res.data.clientSecret);
    // });
  }, []);

  return (
    <>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      )}
    </>
  );
}

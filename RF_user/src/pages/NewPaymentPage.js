import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
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
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Button,
  Radio,
  Paper,
  FormControl,
  Select,
  TextField,
  RadioGroup,
  Checkbox,
  Link,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import csc from 'country-state-city';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CompanyRole, EMAIL_TYPE, GeneralType, UserType } from '../assets/data/roles';
import Label from '../components/label';
import Iconify from '../components/iconify';
// hooks
import axios from '../utils/axios';
import { getSubscriptions } from '../redux/slices/subscription';
import { register } from '../redux/actions/authAction';
// sections
import FormProvider, { RHFTextField, RHFSelect, RHFPhoneNumber } from '../components/hook-form';
import { STRIPE_PUBLISHABLE_KEY, HOST_API_KEY } from '../config-global';
import { useSnackbar } from '../components/snackbar';
import { emailExistCheck } from '../redux/slices/user';
import { getAffiliates } from '../redux/slices/affiliate';
// ----------------------------------------------------------------------

function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptions } = useSelector((state) => state.subscription);
  const { affiliates } = useSelector((state) => state.affiliate);
  const subscriptionData = useSelector((state) => state.subscription.subscription);
  // const mainStripe = new Stripe(STRIPE_SECRET_KEY);
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };

  const [step, setStep] = useState(0);
  const [existError, setExistError] = useState('');
  const [paymentType, setPaymentType] = useState(true);
  const [priceId, setPriceId] = useState(sessionStorage.getItem('priceId'));
  const [price, setPrice] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState('card');
  const [cardholder, setCardholder] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [agreeToTerm, setAgreeToTerm] = useState(false);
  const [agreeToSms, setAgreeToSms] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [open, setOpen] = useState(false);
  // const getCountryName = (countryId) => {
  //   const countryInfo = csc.getAllCountries().filter((country) => country.id === countryId);
  //   return countryInfo[0].name;
  // };
  const getCountrySortName = (countryId) => {
    const countryInfo = csc.getAllCountries().filter((country) => country.id === countryId);
    return countryInfo[0].sortname;
  };

  const getStates = (countryId) => csc.getStatesOfCountry(countryId);

  const StreetAddressSchema = Yup.object().shape({
    company: Yup.string().required('Company is required'),
    addressline1: Yup.string().required('Address Line 1 is required'),
    addressline2: Yup.string(),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('ZipCode is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    billing_company:
      price && price.price !== '0' ? Yup.string().required('Company is required') : Yup.string(),
    billing_addressline1:
      price && price.price !== '0'
        ? Yup.string().required('Address Line 1 is required')
        : Yup.string(),
    billing_addressline2: Yup.string(),
    billing_city:
      price && price.price !== '0' ? Yup.string().required('City is required') : Yup.string(),
    billing_zipCode:
      price && price.price !== '0' ? Yup.string().required('ZipCode is required') : Yup.string(),
    billing_country:
      price && price.price !== '0' ? Yup.string().required('Country is required') : Yup.string(),
    billing_state:
      price && price.price !== '0' ? Yup.string().required('State is required') : Yup.string(),
  });

  const AccountSchema = Yup.object().shape({
    company: Yup.string().required('Company Name is a required field'),
    firstName: Yup.string().required('First Name is a required field'),
    lastName: Yup.string().required('Last Name is a required field'),
    email: Yup.string().required('Email is a required field').email('This is not Email Address'),
    phoneNumber: Yup.string().required('Phone is a required field'),
    referralName: Yup.string().required('Referral Name is a required field'),
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

  const defaultAddressValues = useMemo(
    () => ({
      company: '',
      addressline1: '',
      addressline2: '',
      city: '',
      zipCode: '',
      country: '231',
      state: 'Alabama',
      billing_company: '',
      billing_addressline1: '',
      billing_addressline2: '',
      billing_city: '',
      billing_zipCode: '',
      billing_country: '231',
      billing_state: 'Alabama',
    }),
    []
  );

  const defaultAccountValues = useMemo(
    () => ({
      company: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      referralName: '',
      confirmPassword: '',
      billing_company: '',
      billing_firstName: '',
      billing_lastName: '',
      billing_email: '',
      billing_phoneNumber: '',
      billing_password: '',
      billing_confirmPassword: '',
    }),
    []
  );

  const streetMethods = useForm({
    resolver: yupResolver(StreetAddressSchema),
    defaultValues: defaultAddressValues,
  });

  const accountMethods = useForm({
    resolver: yupResolver(AccountSchema),
    defaultValues: defaultAccountValues,
  });

  const streetData = streetMethods.watch();

  const accountData = accountMethods.watch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeBilling = (checked) => {
    if (checked) {
      streetMethods.setValue('billing_company', streetData.company);
      streetMethods.setValue('billing_addressline1', streetData.addressline1);
      streetMethods.setValue('billing_addressline2', streetData.addressline2);
      streetMethods.setValue('billing_city', streetData.city);
      streetMethods.setValue('billing_zipCode', streetData.zipCode);
      streetMethods.setValue('billing_country', streetData.country);
      streetMethods.setValue('billing_state', streetData.state);
    } else {
      streetMethods.setValue('billing_company', '');
      streetMethods.setValue('billing_addressline1', '');
      streetMethods.setValue('billing_addressline2', '');
      streetMethods.setValue('billing_city', '');
      streetMethods.setValue('billing_zipCode', '');
      streetMethods.setValue('billing_country', '');
      streetMethods.setValue('billing_state', '');
    }
  };

  useEffect(() => {
    dispatch(getSubscriptions());
    dispatch(getAffiliates());
  }, [dispatch]);

  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) {
      if (priceId) {
        let p = [];
        switch (priceId) {
          case 'Black Friday':
            p = subscriptions.filter((item) => item.name.indexOf('Black Friday') > -1);
            setPriceId(p[0].id);
            break;
          case 'Trial':
            p = subscriptions.filter((item) => item.name.indexOf('Trial') > -1);
            setPriceId(p[0].id);
            break;
          default:
            p = subscriptions.filter((item) => item.id === priceId);
            break;
        }
        setPrice(p[0]);
      } else {
        setPrice(subscriptions[0]);
      }
    }
  }, [subscriptions, priceId]);

  // useEffect(() => {
  //   if (affiliates && affiliates.length > 0) {
  //     accountMethods.setValue('referralName', affiliates[0].name);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [affiliates]);

  const onhandleNext = () => {
    if (existError === '') setStep(step + 1);
  };

  const onExist = (event) => {
    accountMethods.setValue('email', event.target.value);
    dispatch(emailExistCheck(event.target.value, setExistError));
  };

  const paymentData = async () => {
    if (method === 'paypal') {
      SnackBar('Paypal does not support yet', 'error');
      return;
    }
    if (!cardholder) {
      SnackBar('Card Holder Name is a required field', 'error');
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: cardholder,
        address: {
          country: getCountrySortName(streetData.billing_country),
          line1: streetData.billing_addressline1,
          line2: streetData.billing_addressline2,
          postal_code: streetData.billing_zipCode,
          state: streetData.state,
          city: streetData.city,
        },
        email: accountData.email.toLowerCase(),
      },
    });
    if (error) {
      SnackBar(error.message, 'error');
      return;
    }
    setPaymentId(paymentMethod.id);
    setStep(2);
  };

  const confirmPayment = async () => {
    try {
      setIsConfirmed(true);

      const customer = await axios.post('stripe/create-customer', {
        description: `New Customer with ${price.name}`,
        address: {
          country: streetData.country,
          line1: streetData.addressline1,
          line2: streetData.addressline2,
          city: streetData.city,
          postal_code: streetData.zipCode,
          state: streetData.state,
        },
        email: accountData.email.toLowerCase(),
        name: streetData.company,
      });

      const attachResult = await axios.post('stripe/attach-payment-method', {
        pId: paymentId,
        customerInfo: {
          customer: customer.data.id,
        },
      });

      if (attachResult.data.code === 500) {
        SnackBar(attachResult.data.message.raw.message, 'error');
        setIsConfirmed(false);
        setStep(1);
        return;
      }

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

      axios
        .post('stripe/create-subscription', {
          customer: customer.data.id,
          default_payment_method: paymentId,
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
        })
        .then((subscription) => {
          if (!subscription || (subscription && subscription.data.status !== 'active')) {
            setIsConfirmed(false);
            SnackBar('Your request is failed. Please check information and try again', 'error');
            setStep(1);
          } else {
            const registerData = {
              full_name: `${accountData.firstName} ${accountData.lastName}`,
              phoneNumber: accountData.phoneNumber,
              // country: getCountryName(streetData.country),
              country: streetData.country,
              state: streetData.state,
              city: streetData.city,
              address1: streetData.addressline1,
              address2: streetData.addressline2,
              zipCode: streetData.zipCode,
              company: accountData.company,
              email: accountData.email.toLowerCase(),
              password: accountData.password,
              userType: UserType[price?.name],
              plan: price?.id,
              role: CompanyRole.code,
              type: GeneralType,
              stripe_subscription_id: subscription.data.id,
              stripe_customer_id: customer.data.id,
              payType: paymentType,
              subscription_status: subscription.data.status,
              price_id: priceInformation.data.id,
              swapCount: 0,
              swapAddCount: subscriptionData?.swapCount,
              swapRemoveCount: subscriptionData?.swapCount,
              swapDate: moment().format('YYYY-MM-DD hh:mm:ss'),
              emailType: EMAIL_TYPE.SIGNUP_EMAIL,
              receive_sms: agreeToSms,
              referralName: accountData.referralName,
            };
            dispatch(register(registerData, navigate, SnackBar, setIsConfirmed));
          }
        })
        .catch((err) => {
          SnackBar('Your request is failed. Please check information and try again', 'error');
          setIsConfirmed(false);
        });
    } catch (err) {
      setIsConfirmed(false);
      SnackBar('Your request is failed. Please check information and try again', 'error');
    }
  };

  const confirmRegister = async () => {
    try {
      setIsConfirmed(true);
      const customer = await axios.post('stripe/create-customer', {
        description: `New Customer with ${price.name}`,
        address: {
          country: streetData.country,
          line1: streetData.addressline1,
          line2: streetData.addressline2,
          city: streetData.city,
          postal_code: streetData.zipCode,
          state: streetData.state,
        },
        email: accountData.email.toLowerCase(),
        name: streetData.company,
      });

      const registerData = {
        full_name: `${accountData.firstName} ${accountData.lastName}`,
        phoneNumber: accountData.phoneNumber,
        // country: getCountryName(streetData.country),
        country: streetData.country,
        state: streetData.state,
        city: streetData.city,
        address1: streetData.addressline1,
        address2: streetData.addressline2,
        zipCode: streetData.zipCode,
        company: accountData.company,
        email: accountData.email.toLowerCase(),
        password: accountData.password,
        userType: UserType[price?.name],
        plan: price?.id,
        role: CompanyRole.code,
        type: GeneralType,
        stripe_customer_id: customer.data.id,
        swapDate: moment().format('YYYY-MM-DD hh:mm:ss'),
        receive_sms: agreeToSms,
        referralName: accountData.referralName,
      };
      dispatch(register(registerData, navigate, SnackBar, setIsConfirmed));
      setIsConfirmed(false);
    } catch (err) {
      setIsConfirmed(false);
      SnackBar(err.message, 'error');
    }
  };

  // eslint-disable-next-line consistent-return
  const switchContent = () => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3} direction="row" justifyContent="center" alignItems="start">
            <Grid item xs={12} md={7.5}>
              <FormProvider
                methods={streetMethods}
                onSubmit={streetMethods.handleSubmit(onhandleNext)}
              >
                <Box>
                  <Typography variant="h6">Street Address</Typography>

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
                      <RHFSelect native name="country" label="Country">
                        {csc.getAllCountries().map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </RHFSelect>
                      <RHFSelect native name="state" label="State">
                        {getStates(streetData.country).map((state) => (
                          <option key={state.id} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </RHFSelect>
                    </Box>
                  </Stack>
                </Box>

                {price && price.price !== '0' && (
                  <Box mt={5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6">Billing Address</Typography>
                      <FormControlLabel
                        label="Same as Street Address"
                        labelPlacement="start"
                        control={
                          <Switch
                            onChange={(e) => onChangeBilling(e.target.checked)}
                            color="success"
                          />
                        }
                      />
                    </Stack>

                    <Stack spacing={1} mt={2}>
                      <RHFTextField fullWidth label="Company Name" name="billing_company" />
                      <RHFTextField fullWidth label="Address Line 1" name="billing_addressline1" />
                      <RHFTextField
                        fullWidth
                        label="Address Line 2 (Optional)"
                        name="billing_addressline2"
                      />
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
                        <RHFTextField label="City" name="billing_city" />
                        <RHFTextField label="Zip Code" name="billing_zipCode" />
                        <RHFSelect native name="billing_country" label="Country">
                          {csc.getAllCountries().map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFSelect native name="billing_state" label="State">
                          {getStates(streetData.billing_country).map((state) => (
                            <option key={state.id} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </RHFSelect>
                      </Box>
                    </Stack>
                  </Box>
                )}
                <Button
                  variant="text"
                  sx={{ mt: 3, float: 'right', fontSize: '18px', letterSpacing: '1px' }}
                  type="submit"
                >
                  Next
                </Button>
              </FormProvider>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Box
                sx={{
                  p: 5,
                  mt: 5,
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ mb: 5 }}>
                    Summary
                  </Typography>
                  {price && price.price === '0' && (
                    <Typography variant="caption" sx={{ mb: 5, fontSize: '15px' }}>
                      7 Day Free Trial
                    </Typography>
                  )}
                </Stack>

                <Stack spacing={1.5}>
                  {price && price.price !== '0' && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
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
                        color="success"
                      />
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                      sx={{ fontSize: '14px', alignSelf: 'center', color: 'text.secondary' }}
                    >
                      Subscription
                    </Typography>
                    <FormControl sx={{ m: 1 }} size="small">
                      <Select native value={priceId} onChange={(e) => setPriceId(e.target.value)}>
                        {subscriptions &&
                          subscriptions.length > 0 &&
                          subscriptions.map((p) => (
                            <option key={p.id} name={p.name} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Typography variant="h5">$</Typography>
                    {!paymentType ? (
                      <Typography variant="h2">{price?.price}</Typography>
                    ) : (
                      <Typography variant="h2">
                        {(
                          (Number(price?.price) *
                            (100 - Number(price?.discount ? price?.discount : 0))) /
                          100
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Typography>
                    )}

                    <Typography
                      component="span"
                      sx={{ mb: 1, alignSelf: 'center', color: 'text.secondary' }}
                    >
                      /mo
                    </Typography>
                  </Stack>
                  <Divider sx={{ borderStyle: 'dashed' }} />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Total Billed</Typography>

                    <Typography variant="h6">
                      $
                      {!paymentType
                        ? price?.price
                        : (
                            (Number(price?.price) *
                              (100 - Number(price?.discount ? price?.discount : 0)) *
                              12) /
                            100
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      *
                    </Typography>
                  </Stack>
                  {paymentType && price && price.price !== '0' ? (
                    <Stack direction="row" justifyContent="end">
                      <Typography
                        sx={{ fontSize: '15px', fontWeight: 600, color: '#36B37E', mr: 1 }}
                      >
                        Saving $
                        {price?.price
                          ? (
                              (Number(price?.price) *
                                Number(price?.discount ? price?.discount : 0) *
                                12) /
                              100
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : 0}
                      </Typography>
                    </Stack>
                  ) : (
                    ''
                  )}

                  <Divider sx={{ borderStyle: 'dashed' }} />
                </Stack>
                <Typography
                  component="div"
                  textAlign="start"
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1 }}
                >
                  * Plus applicable taxes
                </Typography>
                <Typography
                  component="div"
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1, textAlign: 'start' }}
                >
                  *Please note that any custom fence requests beyond our standard inventory is
                  subject to additional charges.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );
      case 1:
        return price && price.price !== '0' ? (
          <div>
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6.4}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: 2,
                  }}
                >
                  <Stack spacing={3} mt={2}>
                    <RadioGroup
                      value={method}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setMethod(e.target.value);
                      }}
                    >
                      {/* <Paper
                        variant="outlined"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          position: 'relative',
                          transition: (theme) => theme.transitions.create('all'),
                        }}
                      >
                        <Grid item xs={10} md={11}>
                          <Box>
                            <FormControlLabel
                              value="paypal"
                              control={
                                <Radio
                                  checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                                />
                              }
                              label={
                                <>
                                  <h6 style={{ fontWeight: '650' }}>Pay with PayPal</h6>
                                  <p style={{ fontSize: '10px' }}>
                                    You will be redirected to PayPal website to complete your
                                    purchase securely.
                                  </p>
                                </>
                              }
                              sx={{ py: 2, pl: 2.5, flexGrow: 1, mr: 0, fontWeight: 900 }}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          md={1}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'end',
                            marginRight: '20px',
                          }}
                        >
                          <Box
                            component="img"
                            key="paypal"
                            src="/assets/icons/payments/ic_paypal.svg"
                          />
                        </Grid>
                      </Paper> */}
                      <Paper
                        variant="outlined"
                        sx={{
                          transition: (theme) => theme.transitions.create('all'),
                        }}
                      >
                        <Stack direction="column">
                          <Stack
                            sx={{ py: 2, pl: 2.5, flexGrow: 1, mr: '20px', fontWeight: 900 }}
                            direction="row"
                          >
                            <Grid item xs={8} md={9}>
                              <FormControlLabel
                                value="card"
                                control={
                                  <Radio
                                    checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                                  />
                                }
                                label={<h6 style={{ fontWeight: '650' }}>Credit / Debit Card</h6>}
                              />
                            </Grid>
                            {/* <Grid
                              item
                              xs={4}
                              md={3}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'end',
                              }}
                              sx={{ py: 2, pl: 2.5, flexGrow: 1, fontWeight: 900 }}
                            >
                              <Stack
                                spacing={1}
                                md={2}
                                direction="row"
                                alignItems="center"
                                sx={{ position: 'absolute' }}
                              >
                                <Box
                                  component="img"
                                  key="master"
                                  src="/assets/icons/payments/ic_mastercard.svg"
                                />
                                <Box
                                  component="img"
                                  key="visa"
                                  src="/assets/icons/payments/ic_visa.svg"
                                />
                              </Stack>
                            </Grid> */}
                          </Stack>
                          <Stack
                            sx={{ py: 2, pl: 2.5, flexGrow: 1, mr: '20px', fontWeight: 900 }}
                            spacing={1}
                            direction="column"
                          >
                            <Stack>
                              <TextField
                                disabled={method === 'paypal'}
                                fullWidth
                                label="Card Holder"
                                name="Card Holder"
                                variant="filled"
                                placeholder="JOHN DOE"
                                onChange={(e) => setCardholder(e.target.value)}
                              />
                            </Stack>
                            <Stack>
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
                                    disabled: method === 'paypal',
                                  }}
                                />
                              </div>
                            </Stack>
                            <Box style={{ display: 'flex', marginTop: '10px', color: '#93989e' }}>
                              <Iconify icon="eva:lock-outline" />

                              <Typography style={{ fontSize: '14px', marginLeft: '10px' }}>
                                Your transaction is secured with SSL encryption
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </Paper>
                    </RadioGroup>
                  </Stack>
                </Box>
                <Button
                  variant="text"
                  sx={{ mt: 3, float: 'left', fontSize: '18px', letterSpacing: '1px' }}
                  // variant="contained"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
                <Button
                  variant="text"
                  sx={{ mt: 3, float: 'right', fontSize: '18px', letterSpacing: '1px' }}
                  onClick={paymentData}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          <FormProvider
            methods={accountMethods}
            onSubmit={accountMethods.handleSubmit(onhandleNext)}
          >
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6}>
                <Box>
                  <Box>
                    <Typography variant="h6">Primary contact</Typography>

                    <Stack spacing={1} mt={2}>
                      <RHFTextField fullWidth label="Company Name" name="company" />
                      <Box
                        gap={1}
                        display="grid"
                        gridTemplateColumns={{
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                        }}
                      >
                        <RHFTextField label="First Name" name="firstName" />
                        <RHFTextField label="Last Name" name="lastName" />
                      </Box>

                      <RHFTextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={accountData.email}
                        onChange={onExist}
                        error={Boolean(existError)}
                        helperText={existError}
                      />
                      <RHFPhoneNumber fullWidth label="Phone" name="phoneNumber" />
                      <Stack flexDirection="column" my={5}>
                        <Typography noWrap sx={{ fontSize: '16px', fontWeight: 600, mb: '6px' }}>
                          How did you hear about RealityFence?
                        </Typography>
                        <RHFSelect native name="referralName" label="Select an Option">
                          <option value="" selected hidden />
                          {affiliates &&
                            affiliates.length > 0 &&
                            affiliates.map((affiliate, index) => (
                              <option key={index} value={affiliate.name}>
                                {affiliate.name}
                              </option>
                            ))}
                        </RHFSelect>
                      </Stack>
                      <Box
                        spacing={1.5}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          border: 'groove',
                          margin: '2px',
                          mt: 3,
                        }}
                      >
                        <Stack
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            my: '6px',
                            mx: { sm: '12px', xs: '2px' },
                            alignSelf: 'flex-start',
                          }}
                        >
                          <Checkbox
                            color="primary"
                            checked={agreeToSms}
                            onChange={() => setAgreeToSms((prev) => !prev)}
                            sx={{
                              fontSize: '40px',
                              '&:hover': { opacity: 0.72 },
                              '& svg': { width: 15, height: 15 },
                            }}
                          />
                          <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>
                            Yes! I want to receive SMS updates for important information, tips, and
                            special offers.
                          </Typography>
                        </Stack>

                        <Typography
                          sx={{
                            fontSize: '11px',
                            ml: { lg: '44px', sm: '42px', xs: '32px' },
                            mr: { sm: '16px', xs: '10px' },
                            mb: '10px',
                          }}
                        >
                          By providing your phone number, you agree to receive promotional and
                          marketing messages, notifications, and customer service communications
                          from RealityFence. Message and data rates may apply. Consent is not a
                          condition of purchase. Message frequency varies. Text STOP to cancel. See
                          &nbsp;
                          <Link
                            target="_blank"
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              paddingLeft: 0.1,
                              color: '#1FA9FF',
                              cursor: 'context-menu',
                            }}
                            onClick={handleClickOpen}
                          >
                            Terms and Conditions.
                          </Link>
                        </Typography>
                      </Box>
                      <Dialog open={open} onClose={handleClose}>
                        <Grid item sx={{ alignSelf: { xs: 'start', md: 'start' }, ml: 2 }}>
                          <IconButton color="inherit" edge="start" onClick={handleClose}>
                            <Iconify icon="carbon:close-filled" style={{ color: '1FA9FF' }} />
                          </IconButton>
                        </Grid>
                        <DialogTitle
                          sx={{ pb: 2, pt: '0px !important', fontSize: '22.5px !important' }}
                        >
                          RealityFence SMS Terms and Conditions
                        </DialogTitle>
                        <DialogContent dividers>
                          <Typography sx={{ py: 1 }}>
                            1. Acceptance of Terms: By opting in to receive text messages from
                            RealityFence, you are agreeing to these Terms and Conditions and our
                            Privacy Policy.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            2. Description of Service: RealityFence offers a SMS messaging service,
                            which includes but is not limited to, delivery of information, tips,
                            notifications, and promotional offers related to RealityFence&apos;s
                            products and services.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            3. Opt-In: You consent to receive automated text messages from
                            RealityFence at the phone number you provided during the opt-in process.
                            Your consent is not a condition of any purchase.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            4. Message Frequency: The frequency of messages may vary. RealityFence
                            reserves the right to change message frequency at any time.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            5. Standard Message and Data Rates: Standard message and data rates may
                            apply to each text message sent or received in connection with
                            RealityFence texts, as provided in your mobile telephone service rate
                            plan.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            6. Opt-Out and Assistance: You can cancel the SMS service at any time by
                            texting &quot;STOP&quot; to the designated short code. After
                            unsubscribing, you will no longer receive SMS messages from
                            RealityFence.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            7. Privacy: RealityFence is committed to protecting your privacy. We
                            will only use the information you provide to transmit your text messages
                            and respond to you, when necessary. Your personal information will not
                            be shared or sold to third parties. For more information, please see our
                            Privacy Policy.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            8. Eligibility: You must be at least 18 years of age to participate in
                            RealityFence&apos;s SMS program.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            9. Warranty Disclaimer: RealityFence provides this service &quot;as
                            is&quot; and disclaims all warranties of any kind.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            10. Limitation of Liability: RealityFence will not be liable for any
                            delays or failures in your receipt of any SMS messages as delivery is
                            subject to effective transmission from your network operator.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            11. Changes to Terms and Conditions: RealityFence reserves the right to
                            change these terms or cancel the SMS service at any time. Please check
                            our website regularly for any updates.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            12. Governing Law: These terms are governed by the laws of the State of
                            Michigan without regard to its conflict of law provisions.
                          </Typography>
                          <Typography sx={{ py: 1 }}>
                            13. Contact Information: For any questions or concerns regarding these
                            Terms and Conditions, please contact us at 248-985-7575.
                          </Typography>
                        </DialogContent>
                      </Dialog>
                      {/* <RHFTextField fullWidth label="Phone" name="phoneNumber" /> */}
                    </Stack>
                    <Box mt={2}>
                      <Typography variant="h6">Create Password</Typography>
                      <li style={{ fontSize: '14px' }}>Must be at least 12 characters long.</li>
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
                      <RHFTextField
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
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
                    </Stack>
                  </Box>
                </Box>

                <Button
                  variant="text"
                  sx={{ mt: 3, float: 'left', fontSize: '18px', letterSpacing: '1px' }}
                  onClick={() => {
                    setStep(step - 1);
                    setCardholder('');
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="text"
                  sx={{ mt: 3, float: 'right', fontSize: '18px', letterSpacing: '1px' }}
                  type="submit"
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        );
      case 2:
        return price && price.price !== '0' ? (
          <FormProvider
            methods={accountMethods}
            onSubmit={accountMethods.handleSubmit(onhandleNext)}
          >
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6.4}>
                <Box>
                  <Box>
                    <Typography variant="h6">Primary contact</Typography>

                    <Stack spacing={1} mt={2}>
                      <RHFTextField fullWidth label="Company Name" name="company" />
                      <Box
                        gap={1}
                        display="grid"
                        gridTemplateColumns={{
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                        }}
                      >
                        <RHFTextField label="First Name" name="firstName" />
                        <RHFTextField label="Last Name" name="lastName" />
                      </Box>

                      <RHFTextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={streetData.email}
                        onChange={onExist}
                        error={Boolean(existError)}
                        helperText={existError}
                      />
                      <RHFPhoneNumber fullWidth label="Phone" name="phoneNumber" />
                      <Stack flexDirection="column" my={5}>
                        <Typography noWrap sx={{ fontSize: '16px', fontWeight: 600, mb: '4px' }}>
                          How did you hear about RealityFence?
                        </Typography>
                        <RHFSelect native name="referralName" label="Select an Option">
                          <option value="" selected hidden />
                          {affiliates &&
                            affiliates.length > 0 &&
                            affiliates.map((affiliate, index) => (
                              <option key={index} value={affiliate.name}>
                                {affiliate.name}
                              </option>
                            ))}
                        </RHFSelect>
                      </Stack>
                      {/* <RHFTextField fullWidth label="Phone" name="phoneNumber" /> */}
                    </Stack>

                    <Box
                      spacing={1.5}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: 'groove',
                        margin: '2px',
                        mt: 3,
                      }}
                    >
                      <Stack
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          my: '6px',
                          mx: { sm: '12px', xs: '2px' },
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Checkbox
                          color="primary"
                          checked={agreeToSms}
                          onChange={() => setAgreeToSms((prev) => !prev)}
                          sx={{
                            fontSize: '40px',
                            '&:hover': { opacity: 0.72 },
                            '& svg': { width: 15, height: 15 },
                          }}
                        />
                        <Typography sx={{ fontSize: '13px', fontWeight: 800 }}>
                          Yes! I want to receive SMS updates for important information, tips, and
                          special offers.
                        </Typography>
                      </Stack>

                      <Typography
                        sx={{
                          fontSize: '11px',
                          ml: { lg: '44px', sm: '42px', xs: '32px' },
                          mr: { sm: '16px', xs: '10px' },
                          mb: '10px',
                        }}
                      >
                        By providing your phone number, you agree to receive promotional and
                        marketing messages, notifications, and customer service communications from
                        RealityFence. Message and data rates may apply. Consent is not a condition
                        of purchase. Message frequency varies. Text STOP to cancel. See &nbsp;
                        <Link
                          target="_blank"
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            paddingLeft: 0.1,
                            color: '#1FA9FF',
                            cursor: 'context-menu',
                          }}
                          onClick={handleClickOpen}
                        >
                          Terms and Conditions.
                        </Link>
                      </Typography>
                    </Box>

                    <Dialog open={open} onClose={handleClose}>
                      <Grid item sx={{ alignSelf: { xs: 'start', md: 'start' }, ml: 2 }}>
                        <IconButton color="inherit" edge="start" onClick={handleClose}>
                          <Iconify icon="carbon:close-filled" style={{ color: '1FA9FF' }} />
                        </IconButton>
                      </Grid>
                      <DialogTitle
                        sx={{ pb: 2, pt: '0px !important', fontSize: '22.5px !important' }}
                      >
                        RealityFence SMS Terms and Conditions
                      </DialogTitle>
                      <DialogContent dividers>
                        <Typography sx={{ py: 1 }}>
                          1. Acceptance of Terms: By opting in to receive text messages from
                          RealityFence, you are agreeing to these Terms and Conditions and our
                          Privacy Policy.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          2. Description of Service: RealityFence offers a SMS messaging service,
                          which includes but is not limited to, delivery of information, tips,
                          notifications, and promotional offers related to RealityFence&apos;s
                          products and services.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          3. Opt-In: You consent to receive automated text messages from
                          RealityFence at the phone number you provided during the opt-in process.
                          Your consent is not a condition of any purchase.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          4. Message Frequency: The frequency of messages may vary. RealityFence
                          reserves the right to change message frequency at any time.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          5. Standard Message and Data Rates: Standard message and data rates may
                          apply to each text message sent or received in connection with
                          RealityFence texts, as provided in your mobile telephone service rate
                          plan.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          6. Opt-Out and Assistance: You can cancel the SMS service at any time by
                          texting &quot;STOP&quot; to the designated short code. After
                          unsubscribing, you will no longer receive SMS messages from RealityFence.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          7. Privacy: RealityFence is committed to protecting your privacy. We will
                          only use the information you provide to transmit your text messages and
                          respond to you, when necessary. Your personal information will not be
                          shared or sold to third parties. For more information, please see our
                          Privacy Policy.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          8. Eligibility: You must be at least 18 years of age to participate in
                          RealityFence&apos;s SMS program.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          9. Warranty Disclaimer: RealityFence provides this service &quot;as
                          is&quot; and disclaims all warranties of any kind.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          10. Limitation of Liability: RealityFence will not be liable for any
                          delays or failures in your receipt of any SMS messages as delivery is
                          subject to effective transmission from your network operator.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          11. Changes to Terms and Conditions: RealityFence reserves the right to
                          change these terms or cancel the SMS service at any time. Please check our
                          website regularly for any updates.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          12. Governing Law: These terms are governed by the laws of the State of
                          Michigan without regard to its conflict of law provisions.
                        </Typography>
                        <Typography sx={{ py: 1 }}>
                          13. Contact Information: For any questions or concerns regarding these
                          Terms and Conditions, please contact us at 248-985-7575.
                        </Typography>
                      </DialogContent>
                    </Dialog>

                    <Box mt={2}>
                      <Typography variant="h6">Create Password</Typography>
                      <li style={{ fontSize: '14px' }}>Must be at least 12 characters long.</li>
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
                      <RHFTextField
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
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
                    </Stack>
                  </Box>
                </Box>

                <Button
                  variant="text"
                  sx={{ mt: 3, float: 'left', fontSize: '18px', letterSpacing: '1px' }}
                  onClick={() => {
                    setStep(step - 1);
                    setCardholder('');
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="text"
                  sx={{ mt: 3, float: 'right', fontSize: '18px', letterSpacing: '1px' }}
                  type="submit"
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        ) : (
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item xs={8}>
              <Box
                sx={{
                  p: 5,
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ mb: 5 }}>
                    Summary
                  </Typography>
                  {price && price.price === '0' && (
                    <Typography variant="caption" sx={{ mb: 5, fontSize: '15px' }}>
                      7 Day Free Trial
                    </Typography>
                  )}
                </Stack>

                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      sx={{ fontSize: '14px', alignSelf: 'center', color: 'text.secondary' }}
                    >
                      Subscription
                    </Typography>

                    <Label color="error">{price?.name || ''}</Label>
                  </Stack>
                  {price && price.price !== '0' && (
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
                      {/* <Switch checked={paymentType} color="success" /> */}
                    </Stack>
                  )}

                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Typography variant="h5">$</Typography>

                    <Typography variant="h2">{price?.price}</Typography>

                    <Typography
                      component="span"
                      sx={{ mb: 1, alignSelf: 'center', color: 'text.secondary' }}
                    >
                      /mo
                    </Typography>
                  </Stack>
                  <Divider sx={{ borderStyle: 'dashed' }} />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Total Billed</Typography>

                    <Typography variant="h6">
                      $
                      {!paymentType
                        ? price?.price
                        : (
                            (Number(price?.price) *
                              (100 - Number(price?.discount ? price?.discount : 0)) *
                              12) /
                            100
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      *
                    </Typography>
                  </Stack>

                  <Divider sx={{ borderStyle: 'dashed' }} />
                </Stack>

                <Stack
                  spacing={2.5}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 3,
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
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1, mb: 3 }}
                  onClick={confirmRegister}
                  loading={isConfirmed}
                  style={{ backgroundColor: '#1FA9FF', color: 'white' }}
                  disabled={!agreeToTerm}
                >
                  Confirm Purchase
                </LoadingButton>
              </Box>

              <Button
                variant="text"
                sx={{ mt: 3, float: 'left', fontSize: '18px', letterSpacing: '1px' }}
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={11} sm={10} md={8}>
              <Box
                sx={{
                  p: 5,
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

                    <Label color="error">{price?.name || ''}</Label>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      sx={{ fontSize: '14px', color: 'text.secondary', alignSelf: 'center' }}
                    >
                      Billed Yearly
                    </Typography>
                    <Switch
                      checked={paymentType}
                      onChange={(e) => {
                        setPaymentType(e.target.checked);
                      }}
                    />
                    {/* <Switch checked={paymentType} color="success" /> */}
                  </Stack>

                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Typography variant="h5">$</Typography>

                    {!paymentType ? (
                      <Typography variant="h2">{price?.price}</Typography>
                    ) : (
                      <Typography variant="h2">
                        {(
                          (Number(price?.price) *
                            (100 - Number(price?.discount ? price?.discount : 0))) /
                          100
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Typography>
                    )}

                    <Typography
                      component="span"
                      sx={{ mb: 1, alignSelf: 'center', color: 'text.secondary' }}
                    >
                      /mo
                    </Typography>
                  </Stack>
                  <Divider sx={{ borderStyle: 'dashed' }} />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Total Billed</Typography>

                    <Typography variant="h6">
                      $
                      {!paymentType
                        ? price?.price
                        : (
                            (Number(price?.price) *
                              (100 - Number(price?.discount ? price?.discount : 0)) *
                              12) /
                            100
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      *
                    </Typography>
                  </Stack>
                  {paymentType ? (
                    <Stack direction="row" justifyContent="end">
                      <Typography
                        sx={{ fontSize: '15px', fontWeight: 600, color: '#36B37E', mr: 1 }}
                      >
                        Saving $
                        {price?.price
                          ? (
                              (Number(price?.price) *
                                Number(price?.discount ? price?.discount : 0) *
                                12) /
                              100
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : 0}
                      </Typography>
                    </Stack>
                  ) : (
                    ''
                  )}
                  <Divider sx={{ borderStyle: 'dashed' }} />
                </Stack>

                <Typography
                  component="div"
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1, textAlign: 'start' }}
                >
                  * Plus applicable taxes
                </Typography>
                <Typography
                  component="div"
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1, textAlign: 'start' }}
                >
                  *Please note that any custom fence requests beyond our standard inventory is
                  subject to additional charges.
                </Typography>

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
                    href={`${HOST_API_KEY}static/LICENSING_AGREEMENT.pdf`}
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
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1, mb: 3 }}
                  onClick={confirmPayment}
                  loading={isConfirmed}
                  style={{ backgroundColor: '#1FA9FF', color: 'white' }}
                  disabled={!agreeToTerm}
                >
                  Confirm Purchase
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

              <Button
                variant="text"
                sx={{ mt: 3, float: 'left', fontSize: '18px', letterSpacing: '1px' }}
                onClick={() => setStep(2)}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        );
      default:
        break;
    }
  };

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
        <Typography variant="h3" align="center" paragraph>
          {`Let's finish powering you up!`}
        </Typography>

        <Typography align="center" sx={{ color: 'text.secondary', mb: 5 }}>
          Welcome to RealityFence
        </Typography>
        {!isMobile ? (
          <Stepper activeStep={step} sx={{ mb: 5 }}>
            <Step key={0}>
              <StepLabel>Company Information</StepLabel>
            </Step>
            <Step key={1}>
              {price && price.price === '0' ? (
                <StepLabel>Create Account</StepLabel>
              ) : (
                <StepLabel>Payment Methods</StepLabel>
              )}
            </Step>
            <Step key={2}>
              {price && price.price === '0' ? (
                <StepLabel>Confirm Purchase</StepLabel>
              ) : (
                <StepLabel>Create Account</StepLabel>
              )}
            </Step>
            {price && price.price !== '0' && (
              <Step key={3}>
                <StepLabel>Confirm Purchase</StepLabel>
              </Step>
            )}
          </Stepper>
        ) : (
          <Stepper activeStep={step} sx={{ mb: 5 }} alternativeLabel>
            <Step key={0}>
              <StepLabel>Company Information</StepLabel>
            </Step>
            <Step key={1}>
              {price && price.price === '0' ? (
                <StepLabel>Create Account</StepLabel>
              ) : (
                <StepLabel>Payment Methods</StepLabel>
              )}
            </Step>
            <Step key={2}>
              {price && price.price === '0' ? (
                <StepLabel>Confirm Purchase</StepLabel>
              ) : (
                <StepLabel>Create Account</StepLabel>
              )}
            </Step>
            {price && price.price !== '0' && (
              <Step key={3}>
                <StepLabel>Confirm Purchase</StepLabel>
              </Step>
            )}
          </Stepper>
        )}

        {switchContent()}
      </Container>
    </>
  );
}

export default function NewPaymentPage() {
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

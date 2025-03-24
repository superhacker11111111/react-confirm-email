// This is used for v1.3.
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
  Stepper,
  Step,
  StepLabel,
  Button,
  FormControl,
  Select,
  useMediaQuery,
  Checkbox,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import csc from 'country-state-city';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CompanyRole, GeneralType, UserType } from '../assets/data/roles';
import Label from '../components/label';
import Iconify from '../components/iconify';
// hooks
import axios from '../utils/axios';
import { getSubscriptions } from '../redux/slices/subscription';
import { getAffiliates } from '../redux/slices/affiliate';
import { register } from '../redux/actions/authAction';
// sections
import FormProvider, { RHFTextField, RHFSelect, RHFPhoneNumber } from '../components/hook-form';
import { STRIPE_PUBLISHABLE_KEY, HOST_API_KEY } from '../config-global';
import { useSnackbar } from '../components/snackbar';
import { emailExistCheck } from '../redux/slices/user';
// ----------------------------------------------------------------------

function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptions } = useSelector((state) => state.subscription);
  const { affiliates } = useSelector((state) => state.affiliate);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };

  const [step, setStep] = useState(0);
  const [existError, setExistError] = useState('');
  const [paymentType, setPaymentType] = useState(true);
  const [priceId, setPriceId] = useState(sessionStorage.getItem('priceId'));
  const [price, setPrice] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [agreeToTerm, setAgreeToTerm] = useState(false);
  const [agreeToSms, setAgreeToSms] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const getStates = (countryId) => csc.getStatesOfCountry(countryId);

  const StreetAddressSchema = Yup.object().shape({
    company: Yup.string().required('Company is required'),
    addressline1: Yup.string().required('Address Line 1 is required'),
    addressline2: Yup.string(),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('ZipCode is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
  });

  const AccountSchema = Yup.object().shape({
    company: Yup.string().required('Company Name is a required field'),
    firstName: Yup.string().required('First Name is a required field'),
    referralName: Yup.string().required('Referral Name is a required field'),
    lastName: Yup.string().required('Last Name is a required field'),
    email: Yup.string().required('Email is a required field').email('This is not Email Address'),
    phoneNumber: Yup.string().required('Phone is a required field'),
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
      referralName: '',
      password: '',
      confirmPassword: '',
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

  useEffect(() => {
    dispatch(getSubscriptions());
    dispatch(getAffiliates());
  }, [dispatch]);

  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) {
      const p = subscriptions.filter((item) => item.name.indexOf('Trial') > -1);
      setPriceId(p[0].id);
      setPrice(p[0]);
    }
  }, [subscriptions, priceId]);

  const onhandleNext = () => {
    if (existError === '') setStep(step + 1);
  };

  const onExist = (event) => {
    accountMethods.setValue('email', event.target.value);
    dispatch(emailExistCheck(event.target.value, setExistError));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            <Grid item xs={12} md={8}>
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

                <Button
                  variant="text"
                  sx={{ mt: 3, float: 'right', fontSize: '18px', letterSpacing: '1px' }}
                  type="submit"
                >
                  Next
                </Button>
              </FormProvider>
            </Grid>
            <Grid item xs={12} md={4}>
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

                  <Typography variant="caption" sx={{ mb: 5, fontSize: '15px' }}>
                    7 Day Free Trial
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
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
                          subscriptions.map(
                            (p) =>
                              p.name.indexOf('Trial') > -1 && (
                                <option key={p.id} name={p.name} value={p.id}>
                                  {p.name}
                                </option>
                              )
                          )}
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

                  <Divider sx={{ borderStyle: 'dashed' }} />
                </Stack>
                <Typography
                  component="div"
                  textAlign="end"
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1 }}
                >
                  * Plus applicable taxes
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );
      case 1:
        return (
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
                        value={accountData.email}
                        onChange={onExist}
                        error={Boolean(existError)}
                        helperText={existError}
                      />
                      <RHFPhoneNumber fullWidth label="Phone" name="phoneNumber" />
                      {/* <RHFTextField fullWidth label="Phone" name="phoneNumber" /> */}
                    </Stack>
                    <Stack flexDirection="column" my={5}>
                      <Typography noWrap sx={{ fontSize: '16px', fontWeight: 600 }}>
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
                      <DialogContent dividers="paper">
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
        return (
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={8}>
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
                  <Typography variant="caption" sx={{ mb: 5, fontSize: '15px' }}>
                    7 Day Free Trial
                  </Typography>
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

                <>
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
                </>
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
              <StepLabel>Create Account</StepLabel>
            </Step>
            <Step key={2}>
              <StepLabel>Confirm Purchase</StepLabel>
            </Step>
          </Stepper>
        ) : (
          <Stepper activeStep={step} sx={{ mb: 5 }} alternativeLabel>
            <Step key={0}>
              <StepLabel>Company Information</StepLabel>
            </Step>
            <Step key={1}>
              <StepLabel>Create Account</StepLabel>
            </Step>
            <Step key={2}>
              <StepLabel>Confirm Purchase</StepLabel>
            </Step>
          </Stepper>
        )}

        {switchContent()}
      </Container>
    </>
  );
}

export default function TrialPaymentPage() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY));
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

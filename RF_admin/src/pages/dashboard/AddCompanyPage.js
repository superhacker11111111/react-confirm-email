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
  IconButton,
  Button,
  FormControl,
  Select,
  TextField,
  Checkbox,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import csc from 'country-state-city';
import { defaultCountries, parseCountry } from 'react-international-phone';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CompanyRole, GeneralType, UserType, EMAIL_TYPE } from '../../assets/data/roles';
import Iconify from '../../components/iconify';
// hooks
import axios from '../../utils/axios';
import { getSubscriptions } from '../../redux/slices/subscription';
import { addCompany, emailDuplicationCheck } from '../../redux/slices/user';
import { getAffiliates } from '../../redux/slices/affiliate';
// sections
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFCountryDialcodeSelect,
} from '../../components/hook-form';
import { STRIPE_PUBLISHABLE_KEY } from '../../config-global';
import { useSnackbar } from '../../components/snackbar';
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptions } = useSelector((state) => state.subscription);
  const { affiliates } = useSelector((state) => state.affiliate);

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const displayValue = (value) => {
    if (isFocused) {
      return value;
    }

    if (Number(value) % 1) {
      return Number(value).toFixed(2);
    }
    return value;
  };

  const countriesData = defaultCountries.map((c) => parseCountry(c));

  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };

  const getCountrySortName = (countryName) => {
    const countryInfo = csc.getAllCountries().filter((country) => country.name === countryName);
    return countryInfo[0].sortname;
  };

  const [step, setStep] = useState(0);
  const [existError, setExistError] = useState('');
  const [paymentType, setPaymentType] = useState(false);
  const [priceId, setPriceId] = useState('');
  const [priceInfo, setPriceInfo] = useState('0');
  const [price, setPrice] = useState({});
  const [cardholder, setCardholder] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [agreeToSms, setAgreeToSms] = useState(false);
  const [open, setOpen] = useState(false);

  const CompanyFullInfoSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    company: Yup.string().required('Company Name is a required field'),
    email: Yup.string().required('Email is a required field').email('This is not Email Address'),
    phoneNumber: Yup.string().required('Phone is a required field'),
    dialCode: Yup.string().required('DialCode is a required field'),
    addressline1: Yup.string().required('Address Line 1 is required'),
    addressline2: Yup.string(),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('ZipCode is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    referralName: Yup.string().required('Referral Name is a required field'),
  });

  const defaultCompanyFullInfoValues = useMemo(
    () => ({
      fullName: '',
      company: '',
      email: '',
      dialCode: 'us',
      phoneNumber: '',
      addressline1: '',
      addressline2: '',
      city: '',
      zipCode: '',
      country: '',
      state: '',
    }),
    []
  );

  const companyFullInfoMethods = useForm({
    resolver: yupResolver(CompanyFullInfoSchema),
    defaultValues: defaultCompanyFullInfoValues,
  });

  const { watch, setValue } = companyFullInfoMethods;

  const companyData = watch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  useEffect(() => {
    dispatch(getSubscriptions());
    dispatch(getAffiliates());
  }, [dispatch]);

  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) {
      setPriceId(subscriptions[0].id);
      setPriceInfo(subscriptions[0].price);
      setPrice(subscriptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions]);

  useEffect(() => {
    const p =
      subscriptions &&
      subscriptions.length > 0 &&
      subscriptions.filter((item) => item.id === priceId);

    if (p && p.length > 0) {
      setPriceInfo(
        !paymentType ? p[0].price : (Number(p[0].price) * (100 - Number(p[0].discount))) / 100
      );
      setPrice(p[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceId]);

  const onhandleNext = () => {
    if (existError === '') setStep(1);
  };

  const onhandleBack = () => {
    setStep(0);
  };

  const onExist = (event) => {
    companyFullInfoMethods.setValue('email', event.target.value);
    dispatch(emailDuplicationCheck(event.target.value, setExistError));
  };

  const onChangePaymentType = async (checked) => {
    setPaymentType(checked);
    if (priceInfo) {
      if (checked) {
        setPriceInfo(
          (Number(priceInfo) * (100 - Number(price?.discount ? price?.discount : 0))) / 100
        );
      } else {
        setPriceInfo(
          (Number(priceInfo) * 100) / (100 - Number(price?.discount ? price?.discount : 0))
        );
      }
    }
  };

  const confirmPayment = async () => {
    try {
      setIsConfirmed(true);
      if (!cardholder) {
        SnackBar('Card Holder Name is a required field', 'error');
        setIsConfirmed(false);
        return;
      }
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: cardholder,
          address: {
            country: getCountrySortName(companyData.country),
            line1: companyData.addressline1,
            line2: companyData.addressline2,
            postal_code: companyData.zipCode,
            state: companyData.state,
            city: companyData.city,
          },
          email: companyData.email.toLowerCase(),
        },
      });
      if (error) {
        SnackBar(error.message, 'error');
        return;
      }
      const data = {
        description: `New Customer with ${price.name}`,
        address: {
          country: getCountrySortName(companyData.country),
          line1: companyData.addressline1,
          line2: companyData.addressline2,
          city: companyData.city,
          postal_code: companyData.zipCode,
          state: companyData.state,
        },
        email: companyData.email.toLowerCase(),
        name: companyData.company,
        payment_method: paymentMethod.id,
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      };
      const customer = await axios.post('stripe/create-customer', data);
      if (!customer.data.id) {
        SnackBar(customer.data.message.raw.message, 'error');
        setIsConfirmed(false);
        return;
      }

      const priceInformation = await axios.post('stripe/create-price', {
        unit_amount: !paymentType
          ? Math.round(Number(priceInfo).toFixed(2) * 100)
          : Math.round((Number(priceInfo) * 12).toFixed(2) * 100),
        currency: 'usd',
        recurring: { interval: paymentType ? 'year' : 'month' },
        product_data: {
          name: `Payment a ${paymentType ? 'year' : 'month'} for ${price?.name}`,
        },
      });
      axios
        .post('stripe/create-subscription', {
          customer: customer.data.id,
          description: `${price?.name} Subscription for ${companyData.company}`,
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
          if (
            !subscription ||
            subscription.data.code === 500 ||
            (subscription && subscription.data.status !== 'active')
          ) {
            setIsConfirmed(false);
            SnackBar('Your request is failed. Please check information and try again', 'error');
          } else {
            const registerData = {
              full_name: companyData.fullName,
              dialCode: companyData.dialCode,
              phoneNumber: companyData.phoneNumber,
              country: companyData.country,
              state: companyData.state,
              city: companyData.city,
              address1: companyData.addressline1,
              address2: companyData.addressline2,
              zipCode: companyData.zipCode,
              company: companyData.company,
              email: companyData.email.toLowerCase(),
              userType: UserType[price?.name],
              plan: price?.id,
              role: CompanyRole.code,
              type: GeneralType,
              stripe_subscription_id: subscription.data.id,
              payType: paymentType,
              subscription_status: subscription.data.status,
              stripe_customer_id: customer.data.id,
              price_id: priceInformation.data.id,
              emailType: EMAIL_TYPE.SIGNUP_EMAIL,
              receive_sms: agreeToSms,
              referralName: companyData.referralName,
            };
            dispatch(addCompany(registerData, navigate, SnackBar, setIsConfirmed));
          }
        })
        .catch((err) => {
          console.log(err);
          SnackBar('Your request is failed. Please check information and try again', 'error');
          setIsConfirmed(false);
        });
    } catch (err) {
      console.log(err);
      setIsConfirmed(false);
      SnackBar(err.message, 'error');
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

  // eslint-disable-next-line consistent-return
  const switchContent = () => {
    switch (step) {
      case 0:
        return (
          <FormProvider
            methods={companyFullInfoMethods}
            onSubmit={companyFullInfoMethods.handleSubmit(onhandleNext)}
          >
            <Grid container spacing={3} direction="row" justifyContent="center" alignItems="start">
              <Grid item xs={12} md={7.5}>
                <Box>
                  <Typography variant="h6">Company Information</Typography>

                  <Stack spacing={1} mt={1}>
                    <RHFTextField fullWidth label="Your Name" name="fullName" />
                    <RHFTextField fullWidth label="Company Name" name="company" />
                    <RHFTextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      value={companyData.email}
                      onChange={onExist}
                      error={Boolean(existError)}
                      helperText={existError}
                    />
                    <Stack flexDirection="row">
                      <RHFCountryDialcodeSelect
                        name="dialCode"
                        onChange={(e) => {
                          setValue('dialCode', e.target.value);
                          makePhoneNumberWithFormat(companyData.phoneNumber, e.target.value);
                        }}
                      />
                      <RHFTextField
                        fullWidth
                        label="Your Phone Number"
                        name="phoneNumber"
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(/[a-zA-Z]/g, '');
                          setValue('phoneNumber', filteredValue);
                          makePhoneNumberWithFormat(filteredValue, companyData.dialCode);
                        }}
                      />
                    </Stack>
                  </Stack>
                </Box>
                <Box mt={3}>
                  <Typography variant="h6">Company Address</Typography>
                  <Stack spacing={1} mt={1}>
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
                </Box>
                <Typography variant="h6" noWrap sx={{ mb: 1, mt: 3 }}>
                  How did you hear about RealityFence?
                </Typography>
                <RHFSelect
                  native
                  defaultValue=""
                  name="referralName"
                  label="Select an Option"
                  sx={{
                    width: { xs: '100%', md: '60%' },
                  }}
                >
                  <option value="" hidden />
                  {affiliates &&
                    affiliates.length > 0 &&
                    affiliates.map((affiliate, index) => (
                      <option key={index} value={affiliate.name}>
                        {affiliate.name}
                      </option>
                    ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Box
                  sx={{
                    p: 5,
                    mt: 4,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6">Summary</Typography>
                    <Stack direction="row">
                      <Typography
                        sx={{ fontSize: '14px', alignSelf: 'center', color: 'text.secondary' }}
                      >
                        Billed Yearly
                      </Typography>
                      <Switch
                        checked={paymentType}
                        onChange={(e) => {
                          onChangePaymentType(e.target.checked);
                        }}
                        color="success"
                      />
                    </Stack>
                  </Stack>

                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{ alignSelf: 'center', color: 'text.secondary' }}
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
                      <TextField
                        name="price"
                        variant="outlined"
                        value={displayValue(priceInfo)}
                        onFocus={() => handleFocus()}
                        onBlur={() => handleBlur()}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: '42px',
                            fontWeight: 900,
                            p: 0,
                            pr: 1,
                            textAlign: 'right',
                          },
                        }}
                        onChange={(e) => setPriceInfo(e.target.value)}
                      />

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
                        {fCurrency(!paymentType ? priceInfo : Number(priceInfo) * 12)}
                      </Typography>
                    </Stack>
                    {paymentType ? (
                      <Stack direction="row" justifyContent="end">
                        <Typography
                          sx={{ fontSize: '15px', fontWeight: 600, color: '#36B37E', mr: 1 }}
                        >
                          Saving&nbsp;
                          {fCurrency((Number(price?.price) - Number(priceInfo)) * 12)}
                          &nbsp; a year
                        </Typography>
                      </Stack>
                    ) : (
                      ''
                    )}

                    <Divider sx={{ borderStyle: 'dashed' }} />
                  </Stack>
                  <Typography
                    component="div"
                    sx={{ color: 'text.secondary', fontSize: '10px', mt: 1, textAlign: 'center' }}
                  >
                    *Plus applicable taxes. Please note that any custom fence requests
                    <br /> beyond our standard inventory is subject to additional charges
                  </Typography>
                </Box>
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    my: '6px',
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
                      '& svg': { width: 18, height: 18 },
                    }}
                  />
                  <Typography sx={{ fontSize: '15px', fontWeight: 800 }}>
                    Yes! I want to receive SMS updates for important information, tips, and special
                    offers.
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    ml: { lg: '35px', sm: '35px', xs: '32px' },
                    mr: { sm: '16px', xs: '10px' },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '10px',
                      mb: 3,
                    }}
                  >
                    By providing your phone number, you agree to receive promotional and marketing
                    messages, notifications, and customer service communications from RealityFence.
                    Message and data rates may apply. Consent is not a condition of purchase.
                    Message frequency varies. Text STOP to cancel. See &nbsp;
                    <Link
                      target="_blank"
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        paddingLeft: 0.1,
                        color: '#637381',
                        cursor: 'context-menu',
                      }}
                      onClick={handleClickOpen}
                    >
                      Terms and Conditions.
                    </Link>
                  </Typography>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      fontSize: '20px',
                      backgroundColor: '#1FA9FF !important',
                      color: 'white',
                    }}
                  >
                    Next
                  </Button>
                </Stack>
              </Grid>
              <Dialog open={open} onClose={handleClose}>
                <Grid item sx={{ alignSelf: { xs: 'start', md: 'start' }, ml: 2 }}>
                  <IconButton color="inherit" edge="start" onClick={handleClose}>
                    <Iconify icon="carbon:close-filled" style={{ color: '1FA9FF' }} />
                  </IconButton>
                </Grid>
                <DialogTitle sx={{ pb: 2, pt: '0px !important', fontSize: '22.5px !important' }}>
                  RealityFence SMS Terms and Conditions
                </DialogTitle>
                <DialogContent dividers>
                  <Typography sx={{ py: 1 }}>
                    1. Acceptance of Terms: By opting in to receive text messages from RealityFence,
                    you are agreeing to these Terms and Conditions and our Privacy Policy.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    2. Description of Service: RealityFence offers a SMS messaging service, which
                    includes but is not limited to, delivery of information, tips, notifications,
                    and promotional offers related to RealityFence&apos;s products and services.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    3. Opt-In: You consent to receive automated text messages from RealityFence at
                    the phone number you provided during the opt-in process. Your consent is not a
                    condition of any purchase.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    4. Message Frequency: The frequency of messages may vary. RealityFence reserves
                    the right to change message frequency at any time.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    5. Standard Message and Data Rates: Standard message and data rates may apply to
                    each text message sent or received in connection with RealityFence texts, as
                    provided in your mobile telephone service rate plan.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    6. Opt-Out and Assistance: You can cancel the SMS service at any time by texting
                    &quot;STOP&quot; to the designated short code. After unsubscribing, you will no
                    longer receive SMS messages from RealityFence.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    7. Privacy: RealityFence is committed to protecting your privacy. We will only
                    use the information you provide to transmit your text messages and respond to
                    you, when necessary. Your personal information will not be shared or sold to
                    third parties. For more information, please see our Privacy Policy.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    8. Eligibility: You must be at least 18 years of age to participate in
                    RealityFence&apos;s SMS program.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    9. Warranty Disclaimer: RealityFence provides this service &quot;as is&quot; and
                    disclaims all warranties of any kind.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    10. Limitation of Liability: RealityFence will not be liable for any delays or
                    failures in your receipt of any SMS messages as delivery is subject to effective
                    transmission from your network operator.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    11. Changes to Terms and Conditions: RealityFence reserves the right to change
                    these terms or cancel the SMS service at any time. Please check our website
                    regularly for any updates.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    12. Governing Law: These terms are governed by the laws of the State of Michigan
                    without regard to its conflict of law provisions.
                  </Typography>
                  <Typography sx={{ py: 1 }}>
                    13. Contact Information: For any questions or concerns regarding these Terms and
                    Conditions, please contact us at 248-985-7575.
                  </Typography>
                </DialogContent>
              </Dialog>
            </Grid>
          </FormProvider>
        );
      case 1:
        return (
          <Grid container spacing={3} direction="row" justifyContent="center" alignItems="start">
            <Grid item xs={12} md={7.5}>
              <Typography variant="h6">Payment Information</Typography>
              <Box mt={2}>
                <Stack
                  sx={{
                    py: 4,
                    px: 3,
                    flexGrow: 1,
                    mr: '20px',
                    fontWeight: 900,
                    border: '2px solid #212B36',
                    borderRadius: '10px',
                  }}
                  spacing={1}
                  direction="column"
                >
                  <Typography variant="h6">Credit / Debit Card</Typography>
                  <Stack flexDirection="row" gap={0.5} alignItems="center">
                    <Box component="img" key="Visa" src="/assets/icons/payments/Visa.svg" />
                    <Box component="img" key="Master" src="/assets/icons/payments/Mastercard.svg" />
                    <Box component="img" key="AMEX" src="/assets/icons/payments/Amex.svg" />
                    <Box component="img" key="Discover" src="/assets/icons/payments/Discover.svg" />
                  </Stack>
                  <TextField
                    fullWidth
                    label="Card Holder"
                    name="Card Holder"
                    variant="filled"
                    placeholder="JOHN DOE"
                    onChange={(e) => setCardholder(e.target.value)}
                  />
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
                  <Box style={{ display: 'flex', marginTop: '10px', color: '#93989e' }}>
                    <Iconify icon="eva:lock-outline" />

                    <Typography style={{ fontSize: '14px', marginLeft: '10px' }}>
                      Your transaction is secured with SSL encryption
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Box
                sx={{
                  p: 5,
                  mt: 4,
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6">Summary</Typography>
                  <Stack direction="row">
                    <Typography
                      sx={{ fontSize: '14px', alignSelf: 'center', color: 'text.secondary' }}
                    >
                      Billed Yearly
                    </Typography>
                    <Switch
                      checked={paymentType}
                      onChange={(e) => {
                        onChangePaymentType(e.target.checked);
                      }}
                      color="success"
                    />
                  </Stack>
                </Stack>

                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ alignSelf: 'center', color: 'text.secondary' }}>
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
                    <TextField
                      name="price"
                      variant="outlined"
                      value={displayValue(priceInfo)}
                      onFocus={() => handleFocus()}
                      onBlur={() => handleBlur()}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: '42px',
                          fontWeight: 900,
                          p: 0,
                          pr: 1,
                          textAlign: 'right',
                        },
                      }}
                      onChange={(e) => setPriceInfo(e.target.value)}
                    />

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
                      {fCurrency(!paymentType ? priceInfo : Number(priceInfo) * 12)}
                    </Typography>
                  </Stack>
                  {paymentType ? (
                    <Stack direction="row" justifyContent="end">
                      <Typography
                        sx={{ fontSize: '15px', fontWeight: 600, color: '#36B37E', mr: 1 }}
                      >
                        Saving&nbsp;
                        {fCurrency((Number(price?.price) - Number(priceInfo)) * 12)}
                        &nbsp; a year
                      </Typography>
                    </Stack>
                  ) : (
                    ''
                  )}

                  <Divider sx={{ borderStyle: 'dashed' }} />
                </Stack>
                <Typography
                  component="div"
                  sx={{ color: 'text.secondary', fontSize: '10px', mt: 1, textAlign: 'center' }}
                >
                  *Plus applicable taxes. Please note that any custom fence requests
                  <br /> beyond our standard inventory is subject to additional charges
                </Typography>
              </Box>
              <Stack spacing={1} mt={2} px={3}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  fullWidth
                  loading={isConfirmed}
                  onClick={() => confirmPayment()}
                  sx={{
                    fontSize: '20px',
                    backgroundColor: '#1FA9FF !important',
                    color: 'white',
                  }}
                >
                  Pay Now
                </LoadingButton>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    fontSize: '20px',
                    backgroundColor: '#D4D4D4 !important',
                    color: 'white',
                  }}
                  onClick={() => onhandleBack()}
                >
                  Back
                </Button>
              </Stack>
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
        <title> Payment | RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: 5,
          pb: 10,
          minHeight: 1,
        }}
      >
        <Typography variant="h4" align="center" paragraph>
          Add New User
        </Typography>

        <Typography align="center" sx={{ color: 'text.secondary', mb: 5 }}>
          RealityFence
        </Typography>
        {switchContent()}
      </Container>
    </>
  );
}

export default function AddCompanyPage() {
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

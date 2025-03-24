import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { paramCase } from 'change-case';
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
  FormControlLabel,
  Button,
  Radio,
  Paper,
  FormControl,
  Select,
  TextField,
  RadioGroup,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import csc from 'country-state-city';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Label from '../components/label';
import Iconify from '../components/iconify';
// hooks
import axios from '../utils/axios';
import { getSubscriptions } from '../redux/slices/subscription';
import { register } from '../redux/actions/authAction';
import { setUpgradePaymentInfo } from '../redux/slices/user';
// sections
import FormProvider, { RHFTextField, RHFSelect } from '../components/hook-form';
import { STRIPE_PUBLISHABLE_KEY } from '../config-global';
import { useSnackbar } from '../components/snackbar';
import { fShortenNumber } from '../utils/formatNumber';
import { userAction } from '../redux/actions/userAction';
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptions } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const { updatePaymentInfo } = useSelector((state) => state.users);
  // const mainStripe = new Stripe(STRIPE_SECRET_KEY);
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };

  const [paymentType, setPaymentType] = useState(true);
  const [priceId, setPriceId] = useState(localStorage.getItem('priceId'));
  const [price, setPrice] = useState({});
  const [method, setMethod] = useState('card');
  const [cardholder, setCardholder] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useParams().id;

  const getCountrySortName = (countryId) => {
    const countryInfo = csc.getCountryById(countryId);
    return countryInfo.sortname;
  };

  const getStates = (countryId) => csc.getStatesOfCountry(countryId);

  const BillingAddressSchema = Yup.object().shape({
    billing_company: Yup.string().required('Company is required'),
    billing_addressline1: Yup.string().required('Address Line 1 is required'),
    billing_addressline2: Yup.string(),
    billing_city: Yup.string().required('City is required'),
    billing_zipCode: Yup.string().required('ZipCode is required'),
    billing_country: Yup.string().required('Country is required'),
    billing_state: Yup.string().required('State is required'),
  });

  const defaultAddressValues = useMemo(
    () => ({
      billing_company: (updatePaymentInfo && updatePaymentInfo.billing_company) || '',
      billing_addressline1: (updatePaymentInfo && updatePaymentInfo.billing_addressline1) || '',
      billing_addressline2: (updatePaymentInfo && updatePaymentInfo.billing_addressline2) || '',
      billing_city: (updatePaymentInfo && updatePaymentInfo.billing_city) || '',
      billing_zipCode: (updatePaymentInfo && updatePaymentInfo.billing_zipCode) || '',
      billing_country: (updatePaymentInfo && updatePaymentInfo.billing_country) || '231',
      billing_state: (updatePaymentInfo && updatePaymentInfo.billing_state) || 'Alabama',
    }),
    [updatePaymentInfo]
  );

  const billingMethods = useForm({
    resolver: yupResolver(BillingAddressSchema),
    defaultValues: defaultAddressValues,
  });

  const billingData = billingMethods.watch();

  useEffect(() => {
    dispatch(getSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    if (updatePaymentInfo.priceId) setPriceId(updatePaymentInfo.priceId);
    setPaymentType(updatePaymentInfo && updatePaymentInfo.paymentType);
    setCardholder(updatePaymentInfo && updatePaymentInfo.cardholderName);
  }, [updatePaymentInfo]);

  useEffect(() => {
    const p =
      subscriptions &&
      subscriptions.length > 0 &&
      subscriptions.filter((item) => item.id === priceId);
    setPrice(p[0]);
  }, [subscriptions, priceId]);

  const onHandleConfirm = async () => {
    setIsLoading(true);
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
          country: getCountrySortName(billingData.billing_country),
          line1: billingData.billing_addressline1,
          line2: billingData.billing_addressline2,
          postal_code: billingData.billing_zipCode,
          state: billingData.billing_state,
          city: billingData.billing_city,
        },
        email: user?.email.toLowerCase(),
      },
    });
    if (error) {
      SnackBar(error.message, 'error');
      return;
    }

    dispatch(
      setUpgradePaymentInfo({
        ...updatePaymentInfo,
        billing_company: billingData.billing_company,
        billing_addressline1: billingData.billing_addressline1,
        billing_addressline2: billingData.billing_addressline2,
        billing_city: billingData.billing_city,
        billing_zipCode: billingData.billing_zipCode,
        billing_country: billingData.billing_country,
        billing_state: billingData.billing_state,
        paymentType,
        priceId,
        cardholderName: cardholder,
        paymentMethod: paymentMethod.id,
      })
    );

    navigate(PATH_DASHBOARD.user.useralmost(paramCase(userId)));
    setIsLoading(false);
  };

  const onClickCancle = async () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pb: 10,
          minHeight: 1,
        }}
      >
        <Typography variant="h3" align="center" paragraph>
          {`Let's finish powering you up!`}
        </Typography>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="start">
          <Grid item xs={12} md={8}>
            <Stack flexDirection="row" alignItems="center">
              <Iconify
                icon="tabler:square-rounded-number-1-filled"
                color="#fa541c"
                sx={{ width: '24px', heigth: '24px' }}
              />{' '}
              <Typography variant="h6">Billing Information</Typography>
            </Stack>

            <FormProvider methods={billingMethods}>
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
                    {getStates(billingData.billing_country).map((state) => (
                      <option key={state.id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
              </Stack>
            </FormProvider>
            <Grid container direction="row" mt={5}>
              <Stack flexDirection="row" alignItems="center">
                <Iconify
                  icon="tabler:square-rounded-number-2-filled"
                  color="#fa541c"
                  sx={{ width: '24px', heigth: '24px' }}
                />{' '}
                <Typography variant="h6">Payment Methods</Typography>
              </Stack>
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: 2,
                  }}
                >
                  <Stack spacing={3} mt={2}>
                    <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
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
                                // sx={{ position: 'absolute' }}
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
                                variant="filled"
                                value={cardholder}
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
              </Grid>
            </Grid>
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
              </Stack>

              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Subscription
                  </Typography>
                  <FormControl sx={{ m: 1 }} size="small">
                    <Select native value={priceId} onChange={(e) => setPriceId(e.target.value)}>
                      {subscriptions &&
                        subscriptions.length > 0 &&
                        subscriptions.map(
                          (p) =>
                            p.id !== user?.plan && (
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

                  <Typography variant="h2">
                    {fShortenNumber(
                      !paymentType
                        ? price?.price
                        : ((100 - Number(price?.discount ? price?.discount : 0)) *
                            Number(price?.price)) /
                            100
                    )}
                  </Typography>

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
                    <Label color="success">
                      Saving $
                      {price?.price
                        ? (Number(price?.price) *
                            Number(price?.discount ? price?.discount : 0) *
                            12) /
                          100
                        : '0'}{' '}
                      A Year
                    </Label>
                  </Stack>
                ) : (
                  ''
                )}

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
        <Stack flexDirection="row" gap={30} sx={{ mt: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#1fa9ff !important', width: '180px', fontSize: '18px' }}
            onClick={onClickCancle}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            sx={{ backgroundColor: '#1fa9ff !important', width: '180px' }}
            loading={isLoading}
            onClick={() => {
              setIsLoading((prev) => !prev);
              onHandleConfirm();
            }}
          >
            Confirm Purchase
          </LoadingButton>
        </Stack>
      </Container>
    </>
  );
}

export default function UpgradingProTrial() {
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

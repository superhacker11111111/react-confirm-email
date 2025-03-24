import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

// @mui
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  TextField,
  MenuItem,
} from '@mui/material';
import csc from 'country-state-city';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Iconify from '../components/iconify';
// hooks
import axios from '../utils/axios';
import { getUser } from '../redux/slices/user';
// import { register } from '../redux/actions/authAction';
// sections
import FormProvider, { RHFTextField, RHFSelect } from '../components/hook-form';
import { STRIPE_PUBLISHABLE_KEY } from '../config-global';
// components
import { useSnackbar } from '../components/snackbar';
import MenuPopover from '../components/menu-popover';
import LoadingScreen from '../components/loading-screen';

import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------
PaymentForm.propTypes = {
  id: PropTypes.string,
};

function PaymentForm({ id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isloading } = useSelector((state) => state.user);
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };

  const [cardholder, setCardholder] = useState('');
  const [selectedPM, setSelectedPM] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [PM, setPM] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);

  const BillingAddressSchema = Yup.object().shape({
    billing_company: Yup.string().required('Company is required'),
    billing_addressline1: Yup.string().required('Address Line 1 is required'),
    billing_addressline2: Yup.string(),
    billing_city: Yup.string().required('City is required'),
    billing_zipCode: Yup.string().required('ZipCode is required'),
    billing_country: Yup.string().required('Country is required'),
    billing_state: Yup.string().required('State is required'),
  });

  const defaultBillingAddress = useMemo(
    () => ({
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

  const billingMethods = useForm({
    resolver: yupResolver(BillingAddressSchema),
    defaultValues: defaultBillingAddress,
  });

  const billingAddressValues = billingMethods.watch();

  const getStates = (countryId) => csc.getStatesOfCountry(countryId);

  const getCountrySortname = (countryId) => {
    const country = csc.getCountryById(countryId);
    return country.sortname;
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        if (user) {
          axios
            .post('stripe/get-paymentmethod-info', {
              stripe_customer_id: user?.stripe_customer_id,
              stripe_subscription_id: user?.stripe_subscription_id,
            })
            .then((res) => {
              const resultData = res.data;
              setSelectedPM(resultData.subscription_data.default_payment_method);
              setPM(resultData.price_data.data);
            })
            .catch((err) => {
              SnackBar('Server Error', 'error');
            });
        }
      } catch (error) {
        console.error('Error retrieving price:', error);
      }
    };

    fetchPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addPaymentMethod = async () => {
    try {
      const { token } = await stripe.createToken(elements.getElement(CardElement));
      if (token) {
        const body = {
          paymentMethodInfo: {
            type: 'card',
            card: { token: token.id },
            billing_details: {
              name: cardholder,
              address: {
                country: getCountrySortname(billingAddressValues.billing_country),
                line1: billingAddressValues.billing_addressline1,
                line2: billingAddressValues.billing_addressline2,
                postal_code: billingAddressValues.billing_zipCode,
                state: billingAddressValues.billing_state,
                city: billingAddressValues.billing_city,
              },
              email: user?.email.toLowerCase(),
            },
          },
          stripe_customer_id: user?.stripe_customer_id,
        };
        billingMethods.reset();
        axios
          .post('stripe/add-paymentmethod', body)
          .then((res) => {
            if (res.status === 200) {
              dispatch(getUser(id));
              SnackBar('Successfully Added!', 'success');
              setCardholder('');
              elements.getElement(CardElement).clear();
            } else {
              SnackBar(res.data.message, 'error');
              setCardholder('');
              elements.getElement(CardElement).clear();
            }
          })
          .catch((err) => {
            SnackBar(err, 'error');
          });
      }
    } catch (err) {
      SnackBar(err, 'error');
    }
  };

  // eslint-disable-next-line consistent-return

  return (
    <>
      <Helmet>
        <title> Payment | RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: 10,
          pb: 10,
          minHeight: 1,
        }}
      >
        {isloading ? (
          <LoadingScreen />
        ) : (
          <>
            <Typography variant="h3" align="center" paragraph>
              Payment Methods
            </Typography>
            <Stack>
              <Typography variant="h4" py={3}>
                Select Payment Method
              </Typography>
              {user && (
                <Box
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  }}
                  gap={2}
                >
                  {PM &&
                    PM.length > 0 &&
                    PM.map((item) => (
                      <Stack
                        flexDirection="column"
                        key={item.id}
                        boxShadow={4}
                        p={3}
                        gap={1.5}
                        borderRadius="10px"
                      >
                        <Stack
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box
                            component="img"
                            key="paypal"
                            src={`/assets/icons/payments/ic_${item.card.brand}.svg`}
                            width={40}
                          />
                          <Button
                            sx={{ minWidth: 0, p: 0 }}
                            onClick={(e) => {
                              handleOpenPopover(e);
                              setSelectedId(item.id);
                            }}
                          >
                            <Iconify icon="carbon:overflow-menu-vertical" />
                          </Button>
                        </Stack>
                        <Stack
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="body1" fontWeight={900}>
                            **** **** **** {item.card.last4}
                          </Typography>
                          {item.id === selectedPM && (
                            <Iconify
                              icon="carbon:checkmark-outline"
                              sx={{ color: 'red', width: 20, height: 20 }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    ))}
                </Box>
              )}
              <Button
                variant="contained"
                sx={{
                  my: 3,
                  color: '#1288E3',
                  background: '#c0deff',
                  fontWeight: '900',
                  fontSize: '18px',
                  width: '240px',
                  '&:hover': {
                    background: '#a0bcdb',
                  },
                }}
                onClick={async () => {
                  const data = {
                    subscription_id: user?.stripe_subscription_id,
                    data: {
                      default_payment_method: selectedId,
                    },
                  };
                  axios
                    .post('stripe/subscription/update', data)
                    .then((res) => {
                      if (res.status === 200) {
                        dispatch(getUser(id));
                        SnackBar('Successfully Saved!', 'success');
                      }
                    })
                    .catch((err) => {
                      SnackBar('Error', 'faild');
                    });
                }}
              >
                Save
              </Button>
              <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                sx={{ width: 200, p: 0 }}
              >
                <MenuItem
                  sx={{ m: 1 }}
                  onClick={() => {
                    setSelectedPM(selectedId);
                    handleClosePopover();
                  }}
                >
                  Select
                </MenuItem>
                <MenuItem
                  sx={{ m: 1 }}
                  onClick={async () => {
                    handleClosePopover();
                    axios
                      .post('stripe/detach-paymentmethod', { paymentId: selectedId })
                      .then(() => {
                        SnackBar('Successfully Deleted', 'success');
                        dispatch(getUser(id));
                      })
                      .catch(() => {
                        SnackBar('Error', 'faild');
                      });
                  }}
                >
                  Delete
                </MenuItem>
              </MenuPopover>
            </Stack>
            <FormProvider
              methods={billingMethods}
              onSubmit={billingMethods.handleSubmit(addPaymentMethod)}
            >
              <Stack width={{ xs: '100%', md: '60%' }}>
                <Typography variant="h4" mt={5} mb={3}>
                  Add Payment Method
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    py: 2,
                    px: 2.5,
                    flexGrow: 1,
                    fontWeight: 900,
                    transition: (theme) => theme.transitions.create('all'),
                  }}
                >
                  <h6 style={{ fontWeight: '650' }}>Billing Information</h6>
                  <Stack spacing={1} mt={1}>
                    <RHFTextField fullWidth label="Name" name="billing_company" />
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
                        {getStates(billingAddressValues.billing_country).map((state) => (
                          <option key={state.id} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </RHFSelect>
                    </Box>
                  </Stack>
                  <hr style={{ marginTop: '20px', marginBottom: '20px' }} />
                  <Stack direction="column">
                    <Stack direction="row">
                      <Grid item xs={8} md={9}>
                        <h6 style={{ fontWeight: '650' }}>Credit / Debit Card</h6>
                        <p style={{ fontSize: '10px' }}>
                          We support Mastercard, Visa, Discover and Stripe.
                        </p>
                      </Grid>
                      <Grid
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
                      </Grid>
                    </Stack>
                    <Stack
                      sx={{ flexGrow: 1, fontWeight: 900, mt: 2 }}
                      spacing={1}
                      direction="column"
                    >
                      <Stack>
                        <TextField
                          fullWidth
                          label="Card Holder"
                          value={cardholder}
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
              </Stack>
              <Stack flexDirection="column" width={{ xs: '100%', md: '60%' }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    mt: 3,
                    color: '#1288E3',
                    background: '#c0deff',
                    fontWeight: '900',
                    fontSize: '18px',
                    width: '240px',
                    '&:hover': {
                      background: '#a0bcdb',
                    },
                  }}
                >
                  Add Payment Method
                </Button>
                <Stack flexDirection="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    sx={{
                      justifySelf: 'flex-end',
                      mt: 3,
                      color: '#1288E3',
                      background: '#c0deff',
                      fontWeight: '900',
                      fontSize: '18px',
                      width: '240px',
                      '&:hover': {
                        background: '#a0bcdb',
                      },
                    }}
                    onClick={() => navigate(PATH_DASHBOARD.general.user.account)}
                  >
                    Exit
                  </Button>
                </Stack>
              </Stack>
            </FormProvider>
          </>
        )}
      </Container>
    </>
  );
}

export default function NewPaymentPage() {
  const [stripePromise, setStripePromise] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY));
  }, []);

  return (
    <>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <PaymentForm id={id} />
        </Elements>
      )}
    </>
  );
}

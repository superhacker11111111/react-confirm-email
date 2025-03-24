/* eslint-disable no-shadow */
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
// import Stripe from 'stripe';
import csc from 'country-state-city';
import * as Yup from 'yup';
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
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Iconify from '../../components/iconify';
import axios from '../../utils/axios';
import { STRIPE_PUBLISHABLE_KEY } from '../../config-global';
import { useSnackbar } from '../../components/snackbar';
import MenuPopover from '../../components/menu-popover';
import { getUser } from '../../redux/slices/user';
import { PATH_DASHBOARD } from '../../routes/paths';

import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------
PaymentForm.propTypes = {
  id: PropTypes.string,
};

function PaymentForm({ id }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useSelector((state) => state.users);
  const { enqueueSnackbar } = useSnackbar();
  const [cardholder, setCardholder] = useState('');
  const [PM, setPM] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [selectedPM, setSelectedPM] = useState('');
  const [openPopover, setOpenPopover] = useState(null);

  const getCountrySortName = (countryName) => {
    const countryInfo = csc.getAllCountries().filter((country) => country.name === countryName);
    return countryInfo[0].sortname;
  };

  const StreetAddressSchema = Yup.object().shape({
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
      billing_company: '',
      billing_addressline1: '',
      billing_addressline2: '',
      billing_city: '',
      billing_zipCode: '',
      billing_country: '',
      billing_state: '',
    }),
    []
  );

  const streetMethods = useForm({
    resolver: yupResolver(StreetAddressSchema),
    defaultValues: defaultAddressValues,
  });

  const { watch, setValue } = streetMethods;

  const streetData = watch();

  const handleClickItem = () => {
    navigate(PATH_DASHBOARD.user.account);
  };
  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    const autoComplete = new window.google.maps.places.Autocomplete(
      document.querySelector('[name="billing_addressline1"]')
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

        setValue('billing_addressline1', `${street_number} ${address}`);
        setValue('billing_city', city);
        setValue('billing_state', state);
        setValue('billing_country', country);
        setValue('billing_zipCode', zip);
      }
    });
  }, [setValue]);

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        if (user) {
          const priceData = await axios.post('stripe/customer-listpaymentmethod', {
            subscription_id: user?.stripe_customer_id,
          });

          const { data } = await axios.post('stripe/retrieve-customer', {
            customer_id: user.stripe_customer_id,
          });

          setSelectedPM(data.invoice_settings.default_payment_method);
          setSelectedId(data.invoice_settings.default_payment_method);
          setPM(priceData.data.data);
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
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: cardholder,
          address: {
            country: getCountrySortName(streetData?.billing_country),
            line1: streetData?.billing_addressline1,
            line2: streetData?.billing_addressline2,
            postal_code: streetData?.billing_zipCode,
            state: streetData?.billing_state,
            city: streetData?.billing_city,
          },
          email: user?.email.toLowerCase(),
        },
      });
      if (error) {
        SnackBar(error.message, 'error');
        return;
      }
      const attachResult = await axios.post('stripe/attach-payment-method', {
        pId: paymentMethod.id,
        customerInfo: {
          customer: user?.stripe_customer_id,
        },
      });

      if (attachResult.data.code === 500) {
        SnackBar(attachResult.data.message.raw.message, 'error');
        return;
      }

      dispatch(getUser(id));
      SnackBar('Successfully Added!', 'success');
      navigate(PATH_DASHBOARD.user.paymentcongratulation);
      setCardholder('');
    } catch (err) {
      SnackBar(err, 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: 9,
          pb: 10,
          minHeight: 1,
        }}
      >
        <Typography fontSize="36px" fontWeight="700" align="center" paragraph>
          Payment Methods
        </Typography>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8} sx={{ mt: 4 }}>
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
                      <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
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

                      <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
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
            <div
              className="flex justify-between w-full"
              style={{ marginTop: '36px', marginBottom: '42px', placeContent: 'end' }}
            >
              <Button
                variant="contained"
                sx={{
                  my: 3,
                  color: '#1288E3',
                  backgroundColor: '#C0DEFF !important',
                  fontWeight: '900',
                  fontSize: '18px',
                  width: '240px',
                }}
                onClick={async () => {
                  await axios.post('stripe/update-customer', {
                    customer_id: user?.stripe_customer_id,
                    customer_data: {
                      invoice_settings: {
                        default_payment_method: selectedId,
                      },
                    },
                  });

                  dispatch(getUser(id));
                  SnackBar('Successfully Saved!', 'success');
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
                    await axios.post('stripe/detach-paymentmethod', { paymentId: selectedId });
                    handleClosePopover();
                    dispatch(getUser(id));
                    SnackBar('Successfully Deleted', 'success');
                  }}
                >
                  Delete
                </MenuItem>
              </MenuPopover>
            </div>
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8}>
            <FormProvider
              methods={streetMethods}
              onSubmit={streetMethods.handleSubmit(addPaymentMethod)}
            >
              <Box>
                <Typography variant="h6">Billing Address</Typography>

                <Stack spacing={1} mt={2}>
                  <RHFTextField fullWidth label="Company Name" name="company" />
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
                    <RHFTextField label="Country" name="billing_country" />
                    <RHFTextField label="State" name="billing_state" />
                  </Box>
                </Stack>
              </Box>
              <Box>
                <Typography variant="h4" mt={5} mb={3}>
                  Add Payment Method
                </Typography>
                <Stack spacing={3} mt={2}>
                  <Paper
                    variant="outlined"
                    sx={{
                      transition: (theme) => theme.transitions.create('all'),
                    }}
                  >
                    <Stack direction="column">
                      <Stack
                        sx={{ py: 2, pl: 2.5, flexGrow: 1, mr: '20px', fontWeight: 900 }}
                        flexDirection="row"
                        justifyContent="space-between"
                      >
                        <Stack>
                          <h6 style={{ fontWeight: '650' }}>Credit / Debit Card</h6>
                        </Stack>

                        <Stack flexDirection="row" gap={0.5} alignItems="center">
                          <Box component="img" key="Visa" src="/assets/icons/payments/Visa.svg" />
                          <Box
                            component="img"
                            key="Master"
                            src="/assets/icons/payments/Mastercard.svg"
                          />
                          <Box component="img" key="AMEX" src="/assets/icons/payments/Amex.svg" />
                          <Box
                            component="img"
                            key="Discover"
                            src="/assets/icons/payments/Discover.svg"
                          />
                        </Stack>
                      </Stack>
                      <Stack
                        sx={{ py: 2, pl: 2.5, flexGrow: 1, mr: '20px', fontWeight: 900 }}
                        spacing={1}
                        direction="column"
                      >
                        <Stack>
                          <TextField
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
              </Box>
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  py: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                  placeContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    mr: { sm: 3 },
                    color: '#1288E3',
                    backgroundColor: '#C0DEFF !important',
                    fontWeight: '900',
                    fontSize: '18px',
                    width: '240px',
                  }}
                  onClick={addPaymentMethod}
                >
                  Add Payment Method
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    justifySelf: 'flex-end',
                    mt: 3,
                    color: '#1288E3',
                    backgroundColor: '#C0DEFF !important',
                    fontWeight: '900',
                    fontSize: '18px',
                    width: '240px',
                  }}
                  onClick={handleClickItem}
                >
                  Exit
                </Button>
              </Stack>
            </FormProvider>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default function UserPaymentMethodPage() {
  const [stripePromise, setStripePromise] = useState(null);
  const userId = useParams().id;

  useEffect(() => {
    setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY));
  }, []);

  return (
    <>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <PaymentForm id={userId} />
        </Elements>
      )}
    </>
  );
}

import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useStripe } from '@stripe/react-stripe-js';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import csc from 'country-state-city';

// eslint-disable-next-line import/no-extraneous-dependencies
// import Tap from '@tapfiliate/tapfiliate-js';

// @mui
import { Box, Container, Typography, Grid, Card, Stack, Button, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MotionViewport, varFade } from '../components/animate';
//
import { useDispatch, useSelector } from '../redux/store';
import { getSubscription } from '../redux/slices/subscription';
import { getUser, updateUser, deleteUsersByEmail, updatePlan } from '../redux/slices/user';
// utils

import { PATH_PAGE } from '../routes/paths';
import Iconify from '../components/iconify';
import { PAYMENT_TYPE, UserType, SUBSCRIPTION_STATUS } from '../assets/data/roles';
import { useSnackbar } from '../components/snackbar';
import LoadingScreen from '../components/loading-screen';
import axios from '../utils/axios';
import { fCurrency } from '../utils/formatNumber';
// import { TAPFILIATE_ACCOUNT_ID } from '../config-global';

// Tap.init(TAPFILIATE_ACCOUNT_ID);
// ----------------------------------------------------------------------

export default function AlmostDonePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const stripe = useStripe();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const userId = useParams().id;

  const { subscription, isloading } = useSelector((state) => state.subscription);
  const { user, updatePaymentInfo } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [remainCost, setRemainCost] = useState('0');
  const [gradeState, setGradeState] = useState(1);

  const getCountryName = (countryId) => {
    const countryInfo = csc.getCountryById(countryId);
    return countryInfo.name;
  };

  useEffect(() => {
    if (updatePaymentInfo) {
      dispatch(getSubscription(updatePaymentInfo?.priceId));
    }
    dispatch(getUser(userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePaymentInfo, userId]);

  useEffect(() => {
    const getRemainCost = async () => {
      if (user && user.stripe_subscription_id && subscription) {
        const syncTime = await axios.post('stripe/synctime');
        const subscriptionInfo = await axios.post('stripe/retrieve-subscription', {
          subscription_id: user?.stripe_subscription_id,
        });
        const currentDay = new Date(syncTime.data.date);
        const startDay = new Date(Number(subscriptionInfo.data.result.current_period_start) * 1000);
        const endDay = new Date(Number(subscriptionInfo.data.result.current_period_end) * 1000);
        const diffTime = Math.abs(endDay - currentDay);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const billingCycleDays = Math.ceil(Math.abs(endDay - startDay) / (1000 * 60 * 60 * 24));
        if (Number(localStorage.getItem('originPrice')) > Number(updatePaymentInfo?.customPrice)) {
          const prorated =
            ((Number(localStorage.getItem('originPrice')) -
              Number(updatePaymentInfo?.customPrice)) /
              billingCycleDays) *
            diffDays;

          setRemainCost(
            user?.paymentType === PAYMENT_TYPE.MONTHLY
              ? Number(prorated)
              : Number(prorated) * ((100 - Number(subscription?.discount)) / 100) * 12
          );
          setGradeState(2);
        } else {
          const prorated =
            ((Number(updatePaymentInfo?.customPrice) -
              Number(localStorage.getItem('originPrice'))) /
              billingCycleDays) *
            diffDays;

          setRemainCost(
            user?.paymentType === PAYMENT_TYPE.MONTHLY
              ? Number(prorated)
              : Number(prorated) * ((100 - Number(subscription?.discount)) / 100) * 12
          );
          setGradeState(1);
        }
      }
    };
    getRemainCost();
  }, [user, subscription, updatePaymentInfo?.customPrice]);

  // in case of Free Trial, create new subscription on stripe
  const upgradePlanFromproTrial = async () => {
    try {
      setIsLoading(true);

      const customer = await axios.post('stripe/create-customer', {
        description: `New Customer with ${subscription?.name}`,
        address: {
          country: getCountryName(user.country),
          line1: user.address1,
          line2: user.address2,
          city: user.city,
          postal_code: user.zipCode,
          state: user.state,
        },
        email: user.email.toLowerCase(),
        name: user.company,
        payment_method: updatePaymentInfo?.paymentMethod,
        invoice_settings: {
          default_payment_method: updatePaymentInfo?.paymentMethod,
        },
      });

      const attachResult = await axios.post('stripe/attach-payment-method', {
        pId: updatePaymentInfo?.paymentMethod,
        customerInfo: {
          customer: customer.data.id,
        },
      });

      if (attachResult.data.code === 500) {
        SnackBar(attachResult.data.message.raw.message, 'error');
        setIsLoading(false);
        return;
      }

      const priceInformation = await axios.post('stripe/create-price', {
        unit_amount: !updatePaymentInfo?.paymentType
          ? Math.round(Number(updatePaymentInfo?.customPrice).toFixed(2) * 100)
          : Math.round(
              (
                ((Number(updatePaymentInfo?.customPrice) * (100 - Number(subscription?.discount))) /
                  100) *
                12
              ).toFixed(2) * 100
            ),
        currency: 'usd',
        recurring: { interval: updatePaymentInfo?.paymentType ? 'year' : 'month' },
        product_data: {
          name: `Payment a ${updatePaymentInfo?.paymentType ? 'year' : 'month'} for ${
            subscription?.name
          }`,
        },
      });

      axios
        .post('stripe/create-subscription', {
          customer: customer.data.id,
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
        .then((subscriptionData) => {
          if (
            !subscriptionData ||
            (subscriptionData && subscriptionData.data.status !== 'active')
          ) {
            axios.post('stripe/detach-paymentmethod', {
              paymentId: updatePaymentInfo?.paymentMethod,
            });
            setIsLoading(false);
            SnackBar('Your request is failed. Please check information and try again', 'error');
          } else {
            let selected_fences = [];
            if (user.selectedFences && user.selectedFences.length > 0) {
              selected_fences = user.selectedFences.slice(0, subscription.totalFences);
            }
            dispatch(
              updatePlan(
                user?.id,
                {
                  userType: UserType[subscription.name],
                  plan: updatePaymentInfo?.priceId,
                  stripe_price_id: priceInformation.data.id,
                  stripe_subscription_id: subscriptionData.data.id,
                  stripe_customer_id: customer.data.id,
                  subscription_status: subscriptionData.data.status,
                  paymentType: updatePaymentInfo?.paymentType
                    ? PAYMENT_TYPE.YEARLY
                    : PAYMENT_TYPE.MONTHLY,
                  onboardingPass: false,
                  selectedFences: selected_fences,
                },
                navigate
              )
            );
            if (subscription.totalUsers < user.childs.length) {
              const removeCompany = [];
              for (let i = user.childs.length - subscription.totalUsers; i > 0; i -= 1) {
                removeCompany.push(user.childs[i]);
              }
              dispatch(deleteUsersByEmail(removeCompany));
            }
          }
        })
        .catch((err) => {
          console.log(err);
          SnackBar('Your request is failed. Please check information and try again', 'error');
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const upgradePlan = async () => {
    setIsLoading(true);
    if (user && user.stripe_customer_id) {
      const { data } = await axios.post('stripe/retrieve-customer', {
        customer_id: user.stripe_customer_id,
      });

      if (data && data.invoice_settings && data.invoice_settings.default_payment_method) {
        const subscriptionData = await axios.post('stripe/retrieve-subscription', {
          subscription_id: user?.stripe_subscription_id,
        });

        const priceInformation = await axios.post('stripe/create-price', {
          unit_amount:
            user?.paymentType === PAYMENT_TYPE.MONTHLY
              ? Math.round(Number(updatePaymentInfo?.customPrice).toFixed(2) * 100)
              : Math.round(
                  (
                    ((Number(updatePaymentInfo?.customPrice) *
                      (100 - Number(subscription?.discount))) /
                      100) *
                    12
                  ).toFixed(2) * 100
                ),
          currency: 'usd',
          recurring: { interval: user?.paymentType === PAYMENT_TYPE.YEARLY ? 'year' : 'month' },
          product_data: {
            name: `Payment a ${user?.paymentType === PAYMENT_TYPE.YEARLY ? 'year' : 'month'} for ${
              subscription?.name
            }`,
          },
        });

        const oldSubscriptionItems = subscriptionData?.data?.result?.items?.data;
        if (subscriptionData?.data?.result?.status === SUBSCRIPTION_STATUS.ACTIVE) {
          if (
            Number(localStorage.getItem('originPrice')) < Number(updatePaymentInfo?.customPrice)
          ) {
            const additionalCharge = await axios.post('stripe/additional-charge', {
              price: Number(remainCost).toFixed(2),
              customer: user.stripe_customer_id,
              description: `Upgrade to ${subscription?.name} Subscription`,
            });

            stripe
              .confirmCardPayment(additionalCharge.data.client_secret, {
                payment_method: data.invoice_settings.default_payment_method,
              })
              .then()
              .catch((err) => {
                setIsLoading(false);
                SnackBar('Please check your payment method', 'error');
              });
          } else {
            await axios.post('stripe/credit-balance', {
              stripe_customer_id: user.stripe_customer_id,
              cost: Number(remainCost).toFixed(2),
              description: `Credit for Downgrade to ${subscription?.name}`,
            });
          }
        }

        if (user && user.stripe_subscription_id) {
          const subscriptionUpdateData = {
            subscription_id: user?.stripe_subscription_id,
            data: {
              items: [
                { id: oldSubscriptionItems[0].id, deleted: true },
                {
                  price: priceInformation.data.id,
                },
              ],
              billing_cycle_anchor: 'unchanged',
              proration_behavior: 'none',
            },
          };

          axios
            .post('stripe/subscription/update', subscriptionUpdateData)
            .then((res) => {
              let updateData = {
                userType: UserType[subscription.name],
                plan: updatePaymentInfo?.priceId,
                stripe_price_id: priceInformation.data.id,
                onboardingPass: false,
              };

              if (
                Number(localStorage.getItem('originPrice')) > Number(updatePaymentInfo?.customPrice)
              ) {
                updateData = {
                  ...updateData,
                  remain: Number(remainCost).toFixed(2),
                  selectedFences: [],
                  requestFences: [],
                };
              }

              dispatch(updateUser(user?.id, updateData, SnackBar, navigate));

              // Tap.conversion(
              //   user.stripe_subscription_id,
              //   Number(priceInformation.data.unit_amount) / 100,
              //   { customer_id: user.stripe_customer_id }
              // );
              // Tap.lead(userId);

              if (subscription.totalUsers < user.childs.length) {
                const removeCompany = [];
                for (let i = user.childs.length - subscription.totalUsers; i > 0; i -= 1) {
                  removeCompany.push(user.childs[i]);
                }
                dispatch(deleteUsersByEmail(removeCompany));
              }

              navigate(PATH_PAGE.upgradeSuccess);
            })
            .catch((err) => {
              setIsLoading(false);
              enqueueSnackbar('Please try again', { variant: 'error' });
            });
        }
      } else {
        setIsLoading(false);
        SnackBar('Please check your payment method', 'error');
      }
    } else {
      setIsLoading(false);
      SnackBar('Please check your payment method', 'error');
    }
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title> Almost Done | RealityFence</title>
      </Helmet>

      {isloading ? (
        <LoadingScreen />
      ) : (
        <Container
          component={MotionViewport}
          sx={{
            pt: { xs: 4, md: 8 },
            pb: { xs: 5, md: 10 },
          }}
        >
          <Box
            sx={{
              mb: 5,
              textAlign: 'center',
            }}
          >
            <m.div variants={varFade().inDown}>
              <Typography variant="h2" sx={{ my: 3, textShadow: `0px 4px 3px rgba(0, 0, 0, 0.3)` }}>
                Almost Done!
              </Typography>
            </m.div>
          </Box>
          <Grid container spacing={8} mb={5}>
            <Grid item xs={12} md={4.5} sx={{ alignSelf: 'center' }}>
              <Card
                sx={{
                  p: 3,
                  pt: 8,
                  boxShadow: (theme) => theme.customShadows.z8,
                }}
              >
                <Stack spacing={5}>
                  <Stack direction={{ sm: 'row', sx: 'column' }} justifyContent="space-between">
                    <Typography
                      component="div"
                      sx={{
                        marginTop: '20px',
                        fontSize: { sm: '28px', lg: '25px', xl: '28px' },
                        fontWeight: '900',
                        fontFamily: 'Poppins',
                      }}
                    >
                      {subscription?.name}
                    </Typography>
                    <Stack direction="column" alignItems="flex-end" sx={{ marginTop: '2px' }}>
                      <Stack direction="row" justifyContent="center" spacing={0.5}>
                        <Typography
                          sx={{ fontSize: { sm: '26px', lg: '23px', xl: '28px' } }}
                          component="span"
                          fontWeight={900}
                        >
                          {localStorage.getItem('originTitle') === 'Free Trial'
                            ? fCurrency(
                                !updatePaymentInfo?.paymentType
                                  ? Number(updatePaymentInfo?.customPrice)
                                  : Number(updatePaymentInfo?.customPrice) *
                                      ((100 - Number(subscription?.discount)) / 100)
                              )
                            : fCurrency(
                                user?.paymentType === PAYMENT_TYPE.MONTHLY
                                  ? Number(updatePaymentInfo?.customPrice)
                                  : Number(updatePaymentInfo?.customPrice) *
                                      ((100 - Number(subscription?.discount)) / 100)
                              )}
                        </Typography>
                      </Stack>
                      <Typography fontSize={14} component="span" fontWeight={900}>
                        Per Month
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack spacing={2.5}>
                    <Stack spacing={1.5} direction="row" alignItems="center">
                      <Iconify
                        icon="carbon:checkmark-outline"
                        sx={{ color: '#2DBB5D', width: 20, height: 20 }}
                      />
                      <Typography variant="h6" fontWeight="700">
                        {subscription?.totalUsers === '1'
                          ? `${subscription?.totalUsers} User`
                          : `${subscription?.totalUsers} Users`}
                      </Typography>
                    </Stack>
                    <Stack spacing={1.5} direction="row" alignItems="center">
                      <Iconify
                        icon="carbon:checkmark-outline"
                        sx={{ color: '#2DBB5D', width: 20, height: 20 }}
                      />
                      <Typography variant="h6" fontWeight="700">
                        {subscription?.totalFences} Fences
                      </Typography>
                    </Stack>

                    <Stack spacing={1.5} direction="row" alignItems="center">
                      <Iconify
                        icon="carbon:checkmark-outline"
                        sx={{ color: '#2DBB5D', width: 20, height: 20 }}
                      />
                      <Typography variant="h6" fontWeight="700">
                        Premium Support
                      </Typography>
                    </Stack>
                    <Stack spacing={1.5} direction="row" alignItems="center">
                      <Iconify
                        icon="carbon:checkmark-outline"
                        sx={{ color: '#2DBB5D', width: 20, height: 20 }}
                      />
                      <Typography fontSize="16px" fontWeight="700">
                        One-Touch Sharing
                      </Typography>
                    </Stack>
                    <Stack spacing={1.5} direction="row" alignItems="center" mb={20}>
                      <Iconify
                        icon={
                          subscription?.requestAvailable
                            ? 'carbon:checkmark-outline'
                            : 'carbon:close-outline'
                        }
                        sx={{
                          color: subscription?.requestAvailable ? '#2DBB5D' : 'grey',
                          width: 20,
                          height: 20,
                        }}
                      />
                      <Typography variant="h6" fontWeight="700">
                        Request Custom Fences
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={7.5}>
              <Card
                sx={{
                  p: 5,
                  pt: 8,
                  boxShadow: (theme) => theme.customShadows.z8,
                }}
              >
                <Typography variant="h3" textAlign="center" mb={8}>
                  Summary of Charges
                </Typography>
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  px={{ xs: 1, md: 3, lg: 10 }}
                >
                  <Stack>
                    <Typography variant="subtitle1">Original Purchase</Typography>
                    <Typography variant="subtitle2" color="grey">
                      {localStorage.getItem('originTitle')} Subscription{' '}
                      {localStorage.getItem('originTitle') !== 'Free Trial' &&
                        `(Billed ${
                          user?.paymentType === PAYMENT_TYPE.YEARLY ? 'Annually' : 'Monthly'
                        })`}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle1">
                      {user?.userType === UserType['Free Trial']
                        ? fCurrency('0')
                        : fCurrency(
                            user?.paymentType === PAYMENT_TYPE.MONTHLY
                              ? Number(localStorage.getItem('originPrice'))
                              : Number(localStorage.getItem('originPrice')) *
                                  ((100 - Number(subscription?.discount)) / 100) *
                                  12
                          )}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider
                  sx={{
                    marginTop: '15px',
                    marginBottom: '15px',
                  }}
                />
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  px={{ xs: 1, md: 3, lg: 10 }}
                >
                  <Stack>
                    <Typography variant="subtitle1">New Purchase</Typography>
                    <Typography variant="subtitle2" color="grey">
                      {subscription?.name} Subscription{' '}
                      {localStorage.getItem('originTitle') === 'Free Trial'
                        ? `(Billed ${updatePaymentInfo?.paymentType ? 'Annually' : 'Monthly'})`
                        : `(Billed ${
                            user?.paymentType === PAYMENT_TYPE.YEARLY ? 'Annually' : 'Monthly'
                          })`}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle1">
                      {localStorage.getItem('originTitle') === 'Free Trial'
                        ? fCurrency(
                            !updatePaymentInfo?.paymentType
                              ? Number(updatePaymentInfo?.customPrice)
                              : Number(updatePaymentInfo?.customPrice) *
                                  ((100 - Number(subscription?.discount)) / 100) *
                                  12
                          )
                        : fCurrency(
                            user?.paymentType === PAYMENT_TYPE.MONTHLY
                              ? Number(updatePaymentInfo?.customPrice)
                              : Number(updatePaymentInfo?.customPrice) *
                                  ((100 - Number(subscription?.discount)) / 100) *
                                  12
                          )}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider
                  sx={{
                    marginTop: '15px',
                    marginBottom: '15px',
                  }}
                />
                <Stack
                  flexDirection="row"
                  pr={{ xs: 1, md: 3, lg: 10 }}
                  pl={{ xs: 2, md: 6, lg: 15 }}
                  justifyContent="space-between"
                  mb="15px"
                >
                  <Typography variant="body1">
                    {' '}
                    {gradeState === 1 ? 'Prorated Charges' : 'Prorated Credit'}
                  </Typography>
                  <Typography variant="body1" color={gradeState === 1 ? 'black' : '#36B37E'}>
                    {user?.userType === UserType['Free Trial'] &&
                      fCurrency(
                        !updatePaymentInfo?.paymentType
                          ? updatePaymentInfo?.customPrice
                          : Number(updatePaymentInfo?.customPrice) *
                              ((100 - Number(subscription?.discount)) / 100) *
                              12
                      )}
                    {user?.userType !== UserType['Free Trial'] &&
                      `${gradeState === 1 ? '' : '+'}${fCurrency(remainCost)}`}
                  </Typography>
                </Stack>
                <Stack
                  flexDirection="row"
                  pr={{ xs: 1, md: 3, lg: 10 }}
                  pl={{ xs: 2, md: 6, lg: 15 }}
                  justifyContent="space-between"
                  mb="45px"
                >
                  <Typography variant="h6">Pay Today:</Typography>
                  <Typography variant="h6">
                    {user?.userType === UserType['Free Trial'] &&
                      fCurrency(
                        !updatePaymentInfo?.paymentType
                          ? updatePaymentInfo?.customPrice
                          : Number(updatePaymentInfo?.customPrice) *
                              ((100 - Number(subscription?.discount)) / 100) *
                              12
                      )}
                    {user?.userType !== UserType['Free Trial'] &&
                      gradeState === 1 &&
                      fCurrency(remainCost)}
                    *
                  </Typography>
                </Stack>
                <Typography textAlign="center" variant="subtitle2" color="grey">
                  *Plus applicable taxes
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" gap={15}>
            <Button
              variant="contained"
              sx={{
                color: '#1288E3',
                background: '#c0deff',
                fontWeight: '900',
                fontSize: '18px',
                width: '240px',
                '&:hover': {
                  background: '#a0bcdb',
                },
              }}
              onClick={() => {
                navigate(
                  user?.userType === UserType['Free Trial']
                    ? PATH_PAGE.upgradeFromProTrial(paramCase(userId))
                    : PATH_PAGE.upgradePlan(paramCase(userId))
                );
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              sx={{
                color: '#1288E3',
                background: '#c0deff',
                fontWeight: '900',
                fontSize: '18px',
                width: '240px',
                '&:hover': {
                  background: '#a0bcdb',
                },
              }}
              loading={isLoading}
              onClick={() => {
                setIsLoading((prev) => !prev);
                if (user?.userType === UserType['Free Trial']) upgradePlanFromproTrial();
                else upgradePlan();
              }}
            >
              Confirm Purchase
            </LoadingButton>
          </Box>
        </Container>
      )}
    </>
  );
}

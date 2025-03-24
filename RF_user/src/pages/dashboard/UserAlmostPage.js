import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useStripe } from '@stripe/react-stripe-js';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import Tap from '@tapfiliate/tapfiliate-js';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Typography, Button, Grid, Stack, Divider, Card } from '@mui/material';
import csc from 'country-state-city';

import { fCurrency } from '../../utils/formatNumber';
import { useSnackbar } from '../../components/snackbar';
import { getSubscription } from '../../redux/slices/subscription';
import { SUBSCRIPTION_STATUS, UserType } from '../../assets/data/roles';
import { userAction } from '../../redux/actions/userAction';
import { setUpgradePaymentInfo, deleteUsersByEmail } from '../../redux/slices/user';
import { MotionViewport, varFade } from '../../components/animate';
import Iconify from '../../components/iconify';
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export default function UserAlmostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate(-1);
  };
  const stripe = useStripe();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const { subscription } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const { selected_list } = useSelector((state) => state.product);
  const { companies, updatePaymentInfo } = useSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(false);
  const [remainCost, setRemainCost] = useState('0');
  const [gradeState, setGradeState] = useState(1); // 1: upgrade. 2: downgrade
  const [paymentMethod, setPaymentMethod] = useState('');

  const originPrice =
    localStorage.getItem('originPrice') > 0 ? Number(localStorage.getItem('originPrice')) : 0;

  const getCountryName = (countryId) => {
    const countryInfo = csc.getCountryById(countryId);
    return countryInfo.name;
  };

  useEffect(() => {
    if (updatePaymentInfo?.priceId) {
      dispatch(getSubscription(updatePaymentInfo?.priceId));
    }
  }, [dispatch, updatePaymentInfo?.priceId]);

  useEffect(() => {
    const getRemainCost = async () => {
      if (user?.stripe_subscription_id && subscription) {
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
        if (Number(localStorage.getItem('originPrice')) > Number(subscription?.price)) {
          const prorated =
            ((Number(localStorage.getItem('originPrice')) - Number(subscription?.price)) /
              billingCycleDays) *
            diffDays;

          setRemainCost(
            !updatePaymentInfo?.paymentType
              ? Number(prorated)
              : Number(prorated) * ((100 - Number(subscription?.discount)) / 100) * 12
          );
          setGradeState(2);
        } else {
          const prorated =
            ((Number(subscription?.price) - Number(localStorage.getItem('originPrice'))) /
              billingCycleDays) *
            diffDays;

          setRemainCost(
            !updatePaymentInfo?.paymentType
              ? Number(prorated)
              : Number(prorated) * ((100 - Number(subscription?.discount)) / 100) * 12
          );
          setGradeState(1);
        }
      }
    };
    getRemainCost();
  }, [updatePaymentInfo?.paymentType, user?.stripe_subscription_id, subscription, originPrice]);

  useEffect(() => {
    if (user && user.stripe_customer_id) {
      const getPaymentMethod = async () => {
        const { data } = await axios.post('stripe/retrieve-customer', {
          customer_id: user.stripe_customer_id,
        });
        if (data) {
          setPaymentMethod(data.invoice_settings.default_payment_method);
        }
      };
      getPaymentMethod();
    }
  }, [user]);
  // in case of pro trial, create new subscription on stripe
  const upgradePlanFromproTrial = async () => {
    try {
      setIsLoading(true);

      const customer = await axios.post('stripe/create-customer', {
        description: `New Customer with ${subscription.name}`,
        address: {
          country: getCountryName(updatePaymentInfo.billing_country),
          line1: updatePaymentInfo.billing_addressline1,
          line2: updatePaymentInfo.billing_addressline2,
          city: updatePaymentInfo.billing_city,
          postal_code: updatePaymentInfo.billing_zipCode,
          state: updatePaymentInfo.billing_state,
        },
        email: user.email.toLowerCase(),
        name: updatePaymentInfo.billing_company,
        payment_method: updatePaymentInfo.paymentMethod,
        invoice_settings: {
          default_payment_method: updatePaymentInfo.paymentMethod,
        },
      });

      const priceInformation = await axios.post('stripe/create-price', {
        unit_amount: !updatePaymentInfo.paymentType
          ? Math.round(Number(subscription?.price).toFixed(2) * 100)
          : Math.round(
              (
                ((Number(subscription?.price) * (100 - Number(subscription?.discount))) / 100) *
                12
              ).toFixed(2) * 100
            ),
        currency: 'usd',
        recurring: { interval: updatePaymentInfo.paymentType ? 'year' : 'month' },
        product_data: {
          name: `Payment a ${updatePaymentInfo.paymentType ? 'year' : 'month'} for ${
            subscription?.name
          }`,
        },
      });

      axios
        .post('stripe/create-subscription', {
          customer: customer.data.id,
          default_payment_method: updatePaymentInfo.paymentMethod,
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
            setIsLoading(false);
            SnackBar('Your request is failed. Please check information and try again', 'error');
          } else {
            const selected_fences = selected_list.map((fence) => fence.id);
            selected_fences.splice(subscription.totalFences);
            dispatch(
              userAction.updatePlan(
                user?.id,
                {
                  userType: UserType[subscription.name],
                  plan: updatePaymentInfo.priceId,
                  stripe_price_id: priceInformation.data.id,
                  stripe_subscription_id: subscriptionData.data.id,
                  stripe_customer_id: customer.data.id,
                  subscription_status: subscriptionData.data.status,
                  paymentType: updatePaymentInfo.paymentType ? '1' : '0',
                  selectedFences: selected_fences,
                },
                navigate
              )
            );

            Tap.conversion(
              subscriptionData.data.id,
              !updatePaymentInfo.paymentType
                ? Number(subscription?.price) * 100
                : (Number(subscription?.price) * (100 - Number(subscription?.discount)) * 12) / 100,
              { customer_id: user?.id }
            );

            dispatch(
              setUpgradePaymentInfo({
                ...updatePaymentInfo,
                billing_company: '',
                billing_addressline1: '',
                billing_addressline2: '',
                billing_city: '',
                billing_zipCode: '',
                billing_country: '',
                billing_state: '',
                paymentType: '',
                priceId: '',
                cardholderName: '',
                paymentMethod: '',
              })
            );
            if (subscription.totalUsers < companies.length) {
              const removeCompany = [];
              for (let i = companies.length - subscription.totalUsers; i > 0; i -= 1) {
                removeCompany.push(companies[i].email);
              }
              dispatch(deleteUsersByEmail(removeCompany));
            }
          }
        })
        .catch((err) => {
          SnackBar('Your request is failed. Please check information and try again', 'error');
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  // incase of other plan, update table
  const upgradePlan = async () => {
    setIsLoading(true);
    if (paymentMethod) {
      const subscriptionInfo = await axios.post('stripe/retrieve-subscription', {
        subscription_id: user?.stripe_subscription_id,
      });

      if (subscriptionInfo?.data.result.status === SUBSCRIPTION_STATUS.ACTIVE) {
        if (originPrice < Number(subscription?.price)) {
          const additionalCharge = await axios.post('stripe/additional-charge', {
            price: Number(remainCost).toFixed(2),
            customer: user.stripe_customer_id,
            description: `Upgrade to ${subscription?.name} Subscription`,
          });

          stripe
            .confirmCardPayment(additionalCharge.data.client_secret, {
              payment_method: paymentMethod,
            })
            .then()
            .catch((err) => {
              SnackBar('Please check your payment method', 'error');
            });
        } else {
          await axios.post('stripe/credit-balance', {
            stripe_customer_id: user.stripe_customer_id,
            cost: Number(remainCost).toFixed(2),
          });
        }
      }

      const priceInformation = await axios.post('stripe/create-price', {
        unit_amount: !updatePaymentInfo?.paymentType
          ? Math.round(Number(subscription?.price).toFixed(2) * 100)
          : Math.round(
              (
                ((Number(subscription?.price) * (100 - Number(subscription?.discount))) / 100) *
                12
              ).toFixed(2) * 100
            ),
        currency: 'usd',
        recurring: {
          interval: updatePaymentInfo?.paymentType ? 'year' : 'month',
        },
        product_data: {
          name: `Payment a ${updatePaymentInfo?.paymentType ? 'year' : 'month'} for ${
            subscription?.name
          }`,
        },
      });
      await axios.post('stripe/synctime');

      const oldSubscriptionItems = subscriptionInfo?.data?.result?.items?.data;
      axios
        .post('stripe/subscription/update', {
          subscription_id: user?.stripe_subscription_id,
          data: {
            items: [
              {
                id: oldSubscriptionItems[0].id,
                deleted: true,
                quantity: 1,
              },
              {
                price: priceInformation.data.id,
                quantity: 1,
              },
            ],
            billing_cycle_anchor: 'unchanged',
            enable_incomplete_payments: false,
            proration_behavior: 'none',
          },
        })
        .then(() => {
          // empty selected_fences and request_fences in case of downgrade
          let updateData = {
            userType: UserType[subscription.name],
            plan: updatePaymentInfo.priceId,
            stripe_price_id: priceInformation.data.id,
          };

          // if it is downgrade empty selected_fences and request_fences
          if (originPrice > Number(subscription?.price)) {
            updateData = {
              ...updateData,
              remain: remainCost.toFixed(2),
              selectedFences: [],
              requestFences: [],
            };
          }

          // reduce child users

          dispatch(userAction.updatePlan(user?.id, updateData, navigate));

          if (subscription.totalUsers < companies.length) {
            const removeCompany = [];
            for (let i = companies.length - subscription.totalUsers; i > 0; i -= 1) {
              removeCompany.push(companies[i].email);
            }
            dispatch(deleteUsersByEmail(removeCompany));
          }
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Please try again', { variant: 'error' });
        });
    } else {
      SnackBar('Please check your payment method', 'error');
    }
    setIsLoading(true);
  };

  return (
    <>
      <Helmet>
        <title> Almost Done | RealityFence</title>
      </Helmet>

      <Container
        component={MotionViewport}
        sx={{
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
            <Typography sx={{ my: 3, fontSize: '48px', fontWeight: '800' }}>
              You&apos;re Almost Done!
            </Typography>
          </m.div>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4.5} sx={{ alignSelf: 'center' }}>
            <Card
              sx={{
                px: { md: 2, sm: 1 },
                pb: { md: 5, sm: 3 },
                pt: 4.5,
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <Stack spacing={3}>
                <Stack
                  direction={{ sm: 'row', sx: 'column' }}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    component="div"
                    sx={{
                      marginTop: '20px',
                      fontSize: { sm: '28px', lg: '25px', xl: '36px' },
                      fontWeight: '900',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {subscription?.name}
                  </Typography>

                  {subscription?.price === '0' ? (
                    <Typography fontSize="18px" fontWeight="700">
                      Free For 7 Day
                    </Typography>
                  ) : (
                    <Typography fontSize="18px" fontWeight="700">
                      <br />
                    </Typography>
                  )}

                  <Stack direction="column" alignItems="flex-end" sx={{ marginTop: '2px' }}>
                    <Stack direction="row" justifyContent="center" spacing={0.5}>
                      <Typography fontSize="30px" component="span" fontWeight={900}>
                        {fCurrency(
                          !updatePaymentInfo?.paymentType
                            ? Number(subscription?.price)
                            : Number(subscription?.price) *
                                ((100 - Number(subscription?.discount)) / 100)
                        )}
                      </Typography>
                    </Stack>
                    <Typography fontSize="14px" component="span" fontWeight={900}>
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
                      Up to {subscription?.totalFences} Fences*
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
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 'regular',
                textAlign: 'center',
                mt: 2,
              }}
            >
              *Please note that any custom fence requests beyond
              <br /> our standard inventory is subject to additional charges
            </Typography>
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
                    {localStorage.getItem('originTitle')} Subscription (Billed{' '}
                    {!updatePaymentInfo?.paymentType ? 'Monthly' : 'Annually'})
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">
                    {originPrice
                      ? fCurrency(
                          !updatePaymentInfo?.paymentType
                            ? originPrice
                            : originPrice * ((100 - Number(subscription?.discount)) / 100) * 12
                        )
                      : '$0'}
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
                    {subscription?.name} Subscription (Billed{' '}
                    {!updatePaymentInfo?.paymentType ? 'Monthly' : 'Annually'})
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">
                    {fCurrency(
                      !updatePaymentInfo?.paymentType
                        ? Number(subscription?.price)
                        : Number(subscription?.price) *
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
                <Typography variant="body1" sx={{ width: '100%', textAlign: 'right' }}>
                  {gradeState === 1 ? 'Prorated Charges:' : 'Prorated Credit:'}
                </Typography>
                {/* 36B37E */}
                <Typography
                  variant="body1"
                  sx={{
                    width: '100%',
                    textAlign: 'right',
                    color: gradeState === 1 ? 'black' : '#36B37E',
                  }}
                >
                  {gradeState === 1 ? '' : '+'}

                  {fCurrency(
                    !updatePaymentInfo?.paymentType
                      ? Number(originPrice ? remainCost : subscription?.price)
                      : Number(
                          originPrice
                            ? remainCost
                            : subscription.price *
                                ((100 - Number(subscription?.discount)) / 100) *
                                12
                        )
                  )}
                </Typography>
              </Stack>

              <Stack
                flexDirection="row"
                pr={{ xs: 1, md: 3, lg: 10 }}
                pl={{ xs: 2, md: 6, lg: 15 }}
                justifyContent="space-between"
                mb="45px"
              >
                <Typography variant="h6" sx={{ width: '100%', textAlign: 'right' }}>
                  Pay Today:
                </Typography>
                <Typography variant="h6" sx={{ width: '100%', textAlign: 'right' }}>
                  {gradeState === 1
                    ? fCurrency(
                        !updatePaymentInfo?.paymentType
                          ? Number(originPrice ? remainCost : subscription?.price)
                          : Number(
                              originPrice
                                ? remainCost
                                : subscription.price *
                                    ((100 - Number(subscription?.discount)) / 100) *
                                    12
                            )
                      )
                    : fCurrency('0')}
                  *
                </Typography>
              </Stack>

              <Typography
                textAlign="right"
                variant="subtitle2"
                color="grey"
                pr={{ xs: 1, md: 3, lg: 10 }}
              >
                *Plus applicable taxes
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" gap={15} mt={5}>
          <Button
            variant="contained"
            sx={{
              color: '#1288E3',
              fontWeight: '900',
              fontSize: '18px',
              width: '240px',
              '&:hover': {
                background: '#a0bcdb',
              },
            }}
            style={{ backgroundColor: '#C0DEFF' }}
            onClick={handleClickItem}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            sx={{
              color: '#1288E3',
              fontWeight: '900',
              fontSize: '18px',
              backgroundColor: '#C0DEFF !important',
              width: '240px',
              '&:hover': {
                background: '#a0bcdb',
              },
            }}
            disabled={!paymentMethod}
            loading={isLoading}
            onClick={() => {
              setIsLoading((prev) => !prev);
              if (user.userType === UserType['Free Trial']) upgradePlanFromproTrial();
              else upgradePlan();
            }}
          >
            Confirm Purchase
          </LoadingButton>
        </Box>
      </Container>
    </>
  );
}

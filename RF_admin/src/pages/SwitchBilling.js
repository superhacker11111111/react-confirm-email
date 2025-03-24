import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import numeral from 'numeral';

// @mui
import { Box, Container, Typography, Grid, Card, Stack, Button, Divider } from '@mui/material';

import moment from 'moment';
import { MotionViewport, varFade } from '../components/animate';
//
import { useDispatch, useSelector } from '../redux/store';
import { getSubscription } from '../redux/slices/subscription';
import { getUser, updateUser } from '../redux/slices/user';
// utils
import axios from '../utils/axios';
import { PATH_DASHBOARD, PATH_PAGE } from '../routes/paths';
import { PAYMENT_TYPE } from '../assets/data/roles';
import { useSnackbar } from '../components/snackbar';
// ----------------------------------------------------------------------

export default function AlmostDonePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const userId = useParams().id;
  const { subscription } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.user);

  const [effectiveDate, setEffectiveDate] = useState();

  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        dispatch(getSubscription(user.plan));
        axios
          .post('stripe/retrieve-subscription', { subscription_id: user?.stripe_subscription_id })
          .then((res) => {
            const currentSubscription = res.data;
            moment(currentSubscription.current_period_end * 1000).format('D MMM YYYY');
            setEffectiveDate();
          })
          .catch((err) => {
            SnackBar('Your request is failed', 'error');
          });
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleConfirmClick = async () => {
    const priceInformation = await axios.post('stripe/create-price', {
      unit_amount:
        user?.paymentType === PAYMENT_TYPE.MONTHLY
          ? Math.round(
              (
                ((Number(subscription?.price) * (100 - Number(subscription?.discount))) / 100) *
                12
              ).toFixed(2) * 100
            )
          : Math.round(Number(subscription?.price).toFixed(2) * 100),
      currency: 'usd',
      recurring: { interval: user?.paymentType === PAYMENT_TYPE.YEARLY ? 'month' : 'year' },
      product_data: {
        name: `Payment a ${user?.paymentType === PAYMENT_TYPE.YEARLY ? 'month' : 'year'} for ${
          subscription?.name
        }`,
      },
    });

    const currentSubscription = await axios.post('stripe/retrieve-subscription', {
      subscription_id: user?.stripe_subscription_id,
    });
    const syncTime = await axios.post('stripe/synctime');
    const currentDay = new Date(syncTime.data.date);
    const startDay = new Date(Number(currentSubscription.data.result.current_period_start) * 1000);
    const endDay = new Date(Number(currentSubscription.data.result.current_period_end) * 1000);
    const diffTime = Math.abs(endDay - currentDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const billingCycleDays = Math.ceil(Math.abs(endDay - startDay) / (1000 * 60 * 60 * 24));

    const prorated =
      (Number(currentSubscription.data.result.plan.amount_decimal) / 100 / billingCycleDays) *
      diffDays;

    await axios.post('stripe/credit-balance', {
      stripe_customer_id: user.stripe_customer_id,
      cost: Number(prorated).toFixed(2),
    });

    const oldSubscriptionItems = currentSubscription?.data?.result?.items?.data;
    axios
      .post('stripe/subscription/update', {
        subscription_id: user?.stripe_subscription_id,
        data: {
          items: [
            {
              id: oldSubscriptionItems[0].id,
              deleted: true,
            },
            {
              price: priceInformation.data.id,
            },
          ],
          proration_behavior: 'none',
        },
      })
      .then((subscriptionData) => {
        dispatch(
          updateUser(
            user?.id,
            {
              stripe_price_id: priceInformation.data.id,
              paymentType: priceInformation.data.recurring.interval === 'month' ? '0' : '1',
            },
            SnackBar,
            navigate
          )
        );
        navigate(PATH_PAGE.billingSuccess);
      })
      .catch((err) => {
        console.log(err);
        SnackBar('Your request is failed', 'error');
      });
  };

  return (
    <>
      <Helmet>
        <title> Almost Done | RealityFence</title>
      </Helmet>

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
              {user?.paymentType === PAYMENT_TYPE.MONTHLY
                ? 'Switch to Annual Billing'
                : 'Switch to Monthly Billing'}
            </Typography>
          </m.div>
        </Box>
        <Grid container spacing={8} mb={5} justifyContent="center">
          <Grid item xs={12} md={7}>
            {' '}
            <Card
              sx={{
                p: 5,
                pt: 8,
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <Typography variant="h3" textAlign="center">
                Summary of Charges
              </Typography>
              {user?.paymentType === PAYMENT_TYPE.YEARLY && (
                <Typography
                  variant="subtitle2"
                  px={{ xs: 3, md: 6, lg: 20 }}
                  color="grey"
                  textAlign="center"
                  mb={8}
                >
                  Changes will not take effect until the end of this year’s billing cycle.
                </Typography>
              )}

              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                px={{ xs: 1, md: 3, lg: 5 }}
              >
                <Stack>
                  <Typography variant="subtitle1">Original Purchase</Typography>
                  <Typography variant="subtitle2" color="grey">
                    {subscription?.name} Subscription - Billed &nbsp;
                    {user?.paymentType === PAYMENT_TYPE.MONTHLY ? 'Monthly' : 'Annually'}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">
                    {numeral(localStorage.getItem('originPrice')).format('$0,0.00')}/
                    {user?.paymentType === PAYMENT_TYPE.MONTHLY ? 'month' : 'year'}
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
                px={{ xs: 1, md: 3, lg: 5 }}
              >
                <Stack>
                  <Typography variant="subtitle1">New Purchase</Typography>
                  <Typography variant="subtitle2" color="grey">
                    {subscription?.name} Subscription - Billed &nbsp;
                    {user?.paymentType === PAYMENT_TYPE.MONTHLY ? 'Annually' : 'Monthly'}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">
                    {user?.paymentType === PAYMENT_TYPE.MONTHLY
                      ? numeral(
                          (Number(subscription?.price) *
                            (100 - Number(subscription?.discount)) *
                            12) /
                            100
                        ).format('$0,0.00')
                      : numeral(subscription?.price).format('$0,0.00')}
                    /{user?.paymentType === PAYMENT_TYPE.MONTHLY ? 'year' : 'month'}
                  </Typography>
                </Stack>
              </Stack>

              <Divider
                sx={{
                  marginTop: '15px',
                  marginBottom: '15px',
                }}
              />
              {user?.paymentType === PAYMENT_TYPE.MONTHLY && (
                <Stack
                  flexDirection="row"
                  pr={{ xs: 1, md: 3, lg: 10 }}
                  pl={{ xs: 2, md: 6, lg: 15 }}
                  justifyContent="space-between"
                  mb="15px"
                  color="red"
                >
                  <Typography variant="body1">They Save</Typography>
                  <Typography variant="body1">
                    {numeral(
                      (Number(subscription?.price) * Number(subscription?.discount) * 12) / 100
                    ).format('$0,0.00')}
                  </Typography>
                </Stack>
              )}

              <Stack
                flexDirection="row"
                pr={{ xs: 1, md: 3, lg: 10 }}
                pl={{ xs: 2, md: 6, lg: 15 }}
                justifyContent="space-between"
                mb="45px"
              >
                <Typography variant="h6">Total Charges</Typography>
                <Typography variant="h6">
                  {user?.paymentType === PAYMENT_TYPE.MONTHLY
                    ? numeral(
                        (Number(subscription?.price) *
                          (100 - Number(subscription?.discount)) *
                          12) /
                          100
                      ).format('$0,0.00')
                    : numeral(subscription?.price).format('$0,0.00')}
                </Typography>
              </Stack>
              <Stack textAlign="center">
                <Typography variant="subtitle1">Effective Date</Typography>
                <Typography variant="subtitle2">
                  {moment(effectiveDate).format('D MMM YYYY')}
                </Typography>
              </Stack>
              <Divider
                sx={{
                  marginRight: { xs: 2, md: 6, lg: 15 },
                  marginLeft: { xs: 2, md: 6, lg: 15 },
                  marginTop: '15px',
                  marginBottom: '15px',
                }}
              />
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
            onClick={() => navigate(PATH_DASHBOARD.general.user.account)}
          >
            Cancel
          </Button>
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
            onClick={handleConfirmClick}
          >
            Confirm Purchase
          </Button>
        </Box>
      </Container>
    </>
  );
}

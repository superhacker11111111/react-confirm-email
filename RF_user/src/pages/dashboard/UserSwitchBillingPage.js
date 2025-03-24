import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import numeral from 'numeral';
// @mui
import { Box, Container, Typography, Grid, Card, Stack, Button, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { MotionViewport, varFade } from '../../components/animate';
// import { getSubscription } from '../../redux/slices/subscription';
import axios from '../../utils/axios';
import { PATH_DASHBOARD } from '../../routes/paths';
import { PAYMENT_TYPE } from '../../assets/data/roles';
import { useSnackbar } from '../../components/snackbar';
import { userAction } from '../../redux/actions/userAction';

export default function UserSwitchBillingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const { subscription } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickItem = () => {
    navigate(-1);
  };

  const handleConfirmClick = async () => {
    setIsLoading(true);
    const priceInformation = await axios.post('stripe/create-price', {
      unit_amount: Math.round(
        (
          ((Number(subscription?.price) * (100 - Number(subscription?.discount))) / 100) *
          12
        ).toFixed(2) * 100
      ),
      currency: 'usd',
      recurring: { interval: 'year' },
      product_data: {
        name: `Payment a year for ${subscription?.name}`,
      },
    });

    const subscriptionData = await axios.post('stripe/retrieve-subscription', {
      subscription_id: user?.stripe_subscription_id,
    });

    console.log('subscriptionData :>> ', subscriptionData);
    const syncTime = await axios.post('stripe/synctime');
    const currentDay = new Date(syncTime.data.date);
    const startDay = new Date(Number(subscriptionData.data.result.current_period_start) * 1000);
    const endDay = new Date(Number(subscriptionData.data.result.current_period_end) * 1000);
    const diffTime = Math.abs(endDay - currentDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const billingCycleDays = Math.ceil(Math.abs(endDay - startDay) / (1000 * 60 * 60 * 24));

    const prorated =
      (Number(subscriptionData.data.result.plan.amount_decimal) / 100 / billingCycleDays) *
      diffDays;

    await axios.post('stripe/credit-balance', {
      stripe_customer_id: user.stripe_customer_id,
      cost: Number(prorated).toFixed(2),
    });

    const oldSubscriptionItems = subscriptionData?.data?.result?.items?.data;
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
      .then((res) => {
        const updateUserData = {
          stripe_subscription_id: res.data.id,
          stripe_price_id: priceInformation.data.id,
          paymentType: priceInformation.data.recurring.interval === 'month' ? '0' : '1',
          email: user?.email.toLowerCase(),
        };
        dispatch(userAction.updateUser(user?.id, updateUserData, SnackBar, navigate));
        navigate(PATH_DASHBOARD.user.billingcongratulation);
      })
      .catch((err) => {
        SnackBar('Your request is failed', 'error');
      });
    setIsLoading(false);
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
        {user?.paymentType === PAYMENT_TYPE.MONTHLY ? (
          <>
            <Box
              sx={{
                mb: 5,
                textAlign: 'center',
              }}
            >
              <m.div variants={varFade().inDown}>
                <Typography
                  sx={{ fontSize: { md: '48px', xs: '28px' }, fontWeight: 700, align: 'center' }}
                  paragraph
                >
                  Switch to Annual Billing
                </Typography>
              </m.div>
            </Box>
            <Stack sx={{ alignItems: 'center', spacing: 8, mb: 5, justifyContent: 'center' }}>
              <Card
                sx={{
                  p: 2,
                  pt: 5,
                  width: { sm: '554px' },
                  boxShadow: (theme) => theme.customShadows.z8,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: '40px', xs: '24px' },
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  Summary of Charges
                </Typography>
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  px={{ xs: 1, sm: 8 }}
                  pb={2}
                  pt={4}
                >
                  <Stack>
                    <Typography variant="subtitle1">Original Purchase</Typography>
                    <Typography variant="subtitle2" color="grey">
                      {subscription?.name} Subscription - Billed &nbsp; Monthly
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle1">
                      ${numeral(Number(subscription?.price) * 12).format('0.00')}
                    </Typography>
                    <Typography fontSize="9px" alignSelf="end">
                      Cost per year
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
                  px={{ xs: 1, sm: 8 }}
                >
                  <Stack>
                    <Typography variant="subtitle1">New Purchase</Typography>
                    <Typography variant="subtitle2" color="grey">
                      {subscription?.name} Subscription - Billed &nbsp; Annual
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle1">
                      {numeral(
                        (Number(subscription?.price) *
                          (100 - Number(subscription?.discount)) *
                          12) /
                          100
                      ).format('$0.00')}
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
                  pr={{ xs: 1, sm: 8 }}
                  pl={{ xs: '106px', sm: '220px' }}
                  justifyContent="space-between"
                  mb="15px"
                  color="#36B37E"
                >
                  <Typography variant="body1">You Save</Typography>
                  <Typography variant="body1">
                    {numeral(
                      (Number(subscription?.price) * Number(subscription?.discount) * 12) / 100
                    ).format('$0.00')}
                  </Typography>
                </Stack>
                <Stack
                  flexDirection="row"
                  pr={{ xs: 1, sm: 8 }}
                  pl={{ xs: '100px', sm: '210px' }}
                  justifyContent="space-between"
                  sx={{ my: '25px' }}
                >
                  <Typography variant="h6">Pay Now:</Typography>
                  <Typography variant="h6">
                    {numeral(
                      (Number(subscription?.price) * (100 - Number(subscription?.discount)) * 12) /
                        100
                    ).format('$0.00')}
                  </Typography>
                </Stack>
                <Stack textAlign="center">
                  <Typography variant="subtitle1">Effective Date</Typography>
                  <Typography variant="subtitle2">{moment().format('D MMM YYYY')}</Typography>
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
            </Stack>
          </>
        ) : (
          <>
            <Box
              sx={{
                mb: 5,
                textAlign: 'center',
              }}
            >
              <m.div variants={varFade().inDown}>
                <Typography
                  sx={{ fontSize: { md: '48px', xs: '28px' }, fontWeight: 700, align: 'center' }}
                  paragraph
                >
                  Switch to Monthly Billing
                </Typography>
              </m.div>
            </Box>
            <Stack sx={{ alignItems: 'center', spacing: 8, mb: 5, justifyContent: 'center' }}>
              <Card
                sx={{
                  p: 2,
                  pt: 5,
                  width: { sm: '554px' },
                  boxShadow: (theme) => theme.customShadows.z8,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: '40px', xs: '24px' },
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  Summary of Charges
                </Typography>
                <Typography sx={{ fontSize: '14px', textAlign: 'center' }}>
                  Changes will not take effect until the <br /> end of this year’s billing cycle.
                </Typography>
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  px={{ xs: 1, sm: 8 }}
                  pb={2}
                  pt={4}
                >
                  <Stack>
                    <Typography variant="subtitle1">Original Purchase</Typography>
                    <Typography variant="subtitle2" color="grey">
                      {subscription?.name} Subscription - Billed &nbsp;Monthly
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle1">
                      {numeral(
                        (Number(subscription?.price) *
                          (100 - Number(subscription?.discount)) *
                          12) /
                          100
                      ).format('$0.00')}
                      /
                    </Typography>
                    <Typography variant="subtitle1" alignSelf="center">
                      Year
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
                  px={{ xs: 1, sm: 8 }}
                >
                  <Stack>
                    <Typography variant="subtitle1">New Purchase</Typography>
                    <Typography variant="subtitle2" color="grey">
                      {subscription?.name} Subscription - Billed &nbsp;Monthly
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle1">
                      ${Number(subscription?.price)}/month
                    </Typography>
                    <Typography fontSize="12px" alignSelf="center">
                      {numeral(Number(subscription?.price) * 12).format('$0.00')}/Year
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
                  pr={{ xs: 1, sm: 8 }}
                  pl={{ xs: '60px', sm: 22 }}
                  justifyContent="space-between"
                  sx={{ my: '25px' }}
                >
                  <Typography variant="h6">Total Charges</Typography>
                  <Typography variant="h6">
                    {numeral(subscription?.price).format('$0.00')}
                  </Typography>
                </Stack>
                <Stack textAlign="center">
                  <Typography variant="subtitle1">Effective Date</Typography>
                  <Typography variant="subtitle2">{moment().format('D MMM YYYY')}</Typography>
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
            </Stack>
          </>
        )}

        <Grid container justifyContent="center">
          <Grid item xs={12} md={9}>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { sm: 'row', xs: 'column-reverse' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  color: '#1288E3',
                  backgroundColor: '#C0DEFF !important',
                  fontWeight: '900',
                  fontSize: '18px',
                  width: '240px',
                  '&:hover': {
                    background: '#a0bcdb',
                  },
                }}
                onClick={handleClickItem}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                loading={isLoading}
                sx={{
                  color: '#1288E3',
                  backgroundColor: '#C0DEFF !important',
                  fontWeight: '900',
                  fontSize: '18px',
                  width: '240px',
                  '&:hover': {
                    background: '#a0bcdb',
                  },
                }}
                onClick={() => {
                  handleConfirmClick();
                }}
              >
                Confirm Purchase
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

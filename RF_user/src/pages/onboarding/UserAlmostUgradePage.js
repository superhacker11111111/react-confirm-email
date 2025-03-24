import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Typography, Button, Grid, Stack, Divider, Card } from '@mui/material';
import { PATH_ONBOARDING } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
// import { setSwapAddAvailable, setSwapRemoveAvailable } from '../../redux/slices/product';
import { getOriginSubscription, getSubscription } from '../../redux/slices/subscription';
import { PAYMENT_TYPE, UserType } from '../../assets/data/roles';
import { userAction } from '../../redux/actions/userAction';
import { deleteUsersByEmail } from '../../redux/slices/user';
import axios from '../../utils/axios';
import { MotionViewport, varFade } from '../../components/animate';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function UserAlmostUgradePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClickItem = () => {
    navigate(-1);
  };
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { subscription, originSubscription, subscriptions } = useSelector(
    (state) => state.subscription
  );
  const { companies } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSubscription(localStorage.getItem('priceId')));
    if (user) {
      dispatch(userAction.getUser(user.id));
      dispatch(getOriginSubscription(user.plan));
    }
  }, [dispatch, user]);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    if (originSubscription?.price === '0') {
      navigate(PATH_ONBOARDING.onboarding.userBilling);
    } else {
      // create Price
      const priceInformation = await axios.post('stripe/create-price', {
        unit_amount:
          user?.paymentType === PAYMENT_TYPE.MONTHLY
            ? Math.round(Number(subscription?.price).toFixed(2) * 100)
            : Math.round(
                (
                  ((Number(subscription?.price) * (100 - Number(subscription?.discount))) / 100) *
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

      // load current subscription data
      const subscriptionData = await axios.post('stripe/retrieve-subscription', {
        subscription_id: user?.stripe_subscription_id,
      });

      if (user && user.stripe_subscription_id) {
        const data = {
          subscription_id: user?.stripe_subscription_id,
          data: {
            items: [
              {
                id: subscriptionData.data.result.items.data[0].id,
                price: priceInformation.data.id,
              },
            ],
          },
        };
        // update subscription with new data
        await axios
          .post('stripe/subscription/update', data)
          .then((res) => {
            // empty selected_fences and request_fences in case of downgrade
            let updateData = {
              userType: UserType[subscription.name],
              plan: subscription.id,
              stripe_price_id: priceInformation.data.id,
            };

            // check if it is upgrade or downgrade
            const old_plan = subscriptions.find((plan) => plan.id === user.plan);
            const new_plan = subscription;

            // if it is downgrade empty selected_fences and request_fences
            if (old_plan.price > new_plan.price)
              updateData = { ...updateData, selectedFences: [], requestFences: [] };

            // reduce child users

            dispatch(userAction.updatePlan(user?.id, updateData, navigate));

            if (subscription.totalUsers < companies.length) {
              const removeCompany = [];
              for (let i = companies.length - subscription.totalUsers; i > 0; i -= 1) {
                removeCompany.push(companies[i].email);
              }
              dispatch(deleteUsersByEmail(removeCompany));
            }

            // setSwapAddAvailable(Number(subscription.swapCount));
            // setSwapRemoveAvailable(Number(subscription.swapCount));
            navigate(PATH_ONBOARDING.onboarding.planUpgradeCongratulationsPage);
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar('Please try again', { variant: 'error' });
          });
      }
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
              {`You're Almost Done!`}
            </Typography>
          </m.div>
        </Box>

        <Grid container spacing={8} mb={5}>
          <Grid item xs={12} md={4.5} sx={{ alignSelf: 'center' }}>
            <Card
              sx={{
                p: 5,
                pt: 8,
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <Stack spacing={5}>
                <Stack
                  direction={{ sm: 'row', sx: 'column' }}
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Typography variant="h4" component="div" sx={{ marginTop: '20px' }}>
                    {subscription?.name}
                  </Typography>

                  {subscription?.price === '0' ? (
                    <Stack direction="column" spacing={0.5}>
                      <Typography fontSize="17px" component="span" fontWeight={900}>
                        Free
                      </Typography>
                      <Typography fontSize="17px" component="span" fontWeight={900}>
                        7 Day
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={0.5}>
                      <Typography fontSize="24px" component="span">
                        $
                      </Typography>
                      <Typography fontSize="32px" component="span" fontWeight={900}>
                        {subscription?.price}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                <Stack spacing={2.5}>
                  <Stack spacing={1.5} direction="row" alignItems="center">
                    <Iconify
                      icon="carbon:checkmark-outline"
                      sx={{ color: 'red', width: 20, height: 20 }}
                    />
                    <Typography variant="h6" fontWeight="700">
                      {subscription?.totalFences} Fences
                    </Typography>
                  </Stack>
                  <Stack spacing={1.5} direction="row" alignItems="center">
                    <Iconify
                      icon="carbon:checkmark-outline"
                      sx={{ color: 'red', width: 20, height: 20 }}
                    />
                    <Typography variant="h6" fontWeight="700">
                      {subscription?.totalUsers} Users
                    </Typography>
                  </Stack>
                  <Stack spacing={1.5} direction="row" alignItems="center">
                    <Iconify
                      icon="carbon:checkmark-outline"
                      sx={{ color: 'red', width: 20, height: 20 }}
                    />
                    <Typography variant="h6" fontWeight="700">
                      Premium Support
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
                        color: subscription?.requestAvailable ? 'red' : 'grey',
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
            {' '}
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
                    {originSubscription && originSubscription.name} Subscription
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">
                    ${originSubscription && originSubscription.price}
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
                    {subscription?.name} Subscription
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">${subscription?.price}</Typography>
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
                <Typography variant="body1">Additional Charges</Typography>
                <Typography variant="body1">
                  ${Number(subscription?.price) - Number(originSubscription?.price)}
                </Typography>
              </Stack>
              <Stack
                flexDirection="row"
                pr={{ xs: 1, md: 3, lg: 10 }}
                pl={{ xs: 2, md: 6, lg: 15 }}
                justifyContent="space-between"
                mb="45px"
              >
                <Typography variant="h6">Total Charges</Typography>
                <Typography variant="h6">${subscription?.price}</Typography>
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
              color: '#1FA9FF',
              fontWeight: '900',
              fontSize: '18px',
              width: '240px',
              '&:hover': {
                background: '#a0bcdb',
              },
            }}
            style={{ backgroundColor: '#c0deff' }}
            onClick={handleClickItem}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            sx={{
              color: '#1FA9FF',
              fontWeight: '900',
              fontSize: '18px',
              width: '240px',
              '&:hover': {
                background: '#a0bcdb',
              },
            }}
            loading={isLoading}
            style={{ backgroundColor: '#c0deff' }}
            onClick={handleConfirmClick}
          >
            Confirm Purchase
          </LoadingButton>
        </Box>
      </Container>
    </>
  );
}

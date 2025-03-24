/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import Stripe from 'stripe';
import { Container, Stack, Typography, Grid, Card, Button, Box } from '@mui/material';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';
// ---------------------------------------------------
import axios from '../../utils/axios';
import useLocales from '../../locales/useLocales';
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { userAction } from '../../redux/actions/userAction';
import { initialize } from '../../redux/actions/authAction';
import { getSubscription } from '../../redux/slices/subscription';
import { PATH_DASHBOARD } from '../../routes/paths';
import { STRIPE_SECRET_KEY } from '../../config-global';
import FormProvider from '../../components/hook-form';
import setUserToken from '../../utils/setUserToken';
import { ALLOWED_SUBSCRIPTION_STATUS, SUBSCRIPTION_STATUS } from '../../assets/data/roles';
import { confirmPauseCancelSubscriptionWebhook } from '../../hooks/zapierWebhooks';

// -----------------------------------------------------------

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();

  const { user } = useSelector((state) => state.auth);
  const { subscription } = useSelector((state) => state.subscription);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [isPausing, setIsPausing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // --------For Swapper-------------
  // useEffect(() => {
  //   dispatch(requestProductList(user?.id, user?.userType));
  //   dispatch(getSubscription(user?.plan));
  //   // dispatch(setCurrentSelectedFences([]));
  // }, [dispatch, user?.id, user?.userType, user?.plan]);

  // useEffect(() => {
  //   if (subscription !== null && subscription !== undefined) {
  //     dispatch(setSwapAvailable(subscription.swapCount));
  //   }
  // }, [dispatch, subscription]);

  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    // dispatch(initialize());
    // dispatch(getSubscription(user?.plan));
    // dispatch(getUser(user?.id));
    if (!hasFetched) {
      dispatch(initialize());
      if (user?.plan) {
        dispatch(getSubscription(user?.plan));
        setHasFetched(true);
      }
    }
  }, [dispatch, user?.plan, hasFetched]);
  // function related with Subscription
  const handlePauseSubscription = async () => {
    setIsPausing(true);
    const pauseData = {
      subscription_id: user?.stripe_subscription_id,
      data: {
        pause_collection: {
          behavior: 'void',
        },
      },
    };
    axios
      .post('stripe/subscription/update', pauseData)
      .then((res) => {
        axios
          .put(`/user/${user?.id}`, { subscription_status: SUBSCRIPTION_STATUS.PAUSE })
          .then((resp) => {
            // confirmPauseCancelSubscriptionWebhook(user);
            navigate(PATH_DASHBOARD.user?.pausecongratulation);
            setIsPausing(false);
          })
          .catch((err) => {
            SnackBar('Error', 'error');
          });
      })
      .catch((err) => {
        SnackBar('Error', 'error');
        setIsPausing(false);
      });
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      if (user) {
        // const subscription = await mainStripe.subscriptions.retrieve(user?.stripe_subscription_id);
        axios
          .post('stripe/cancel-subscription', { subscription_id: user?.stripe_subscription_id })
          .then((result) => {
            axios
              .put(`/user/${user?.id}`, {
                subscription_status: result.data.status,
              })
              .then((resp) => {
                // confirmPauseCancelSubscriptionWebhook(user);
                navigate(PATH_DASHBOARD.user?.cancelcongratulation);
                setIsCanceling(false);
              })
              .catch((err) => {
                SnackBar('Error', 'error');
                setIsCanceling(false);
              });
          })
          .catch((err) => {
            SnackBar('Error', 'error');
            setIsCanceling(false);
          });
      }
    } catch (err) {
      setIsCanceling(false);
      SnackBar(err.message, 'error');
    }
  };

  const handleResumeSubscription = () => {
    setIsPausing(true);
    const resumeData = {
      subscription_id: user?.stripe_subscription_id,
      data: {
        pause_collection: '',
      },
    };
    axios
      .post('stripe/subscription/update', resumeData)
      .then((res) => {
        axios
          .put(`/user/${user?.id}`, { subscription_status: SUBSCRIPTION_STATUS.ACTIVE })
          .then((resp) => {
            // confirmPauseCancelSubscriptionWebhook(user);
            setIsPausing(false);
            navigate(PATH_DASHBOARD.user?.resumecongratulation);
          })
          .catch((err) => {
            SnackBar('Error', 'error');
            setIsPausing(false);
          });
      })
      .catch((err) => {
        SnackBar('Error', 'error');
        setIsPausing(false);
      });
  };

  return (
    <>
      <Helmet>
        <title> RealityFence | User: Account </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography sx={{ fontSize: '24px', fontWeight: '600' }}>Account</Typography>
        <Typography sx={{ fontSize: '14px', mt: 2, mb: 4 }}>My Dashboard</Typography>
        <Stack display="flex" gap={3}>
          <YourPlan />
          <Billing />
          <PaymentMethod />
          {user?.isParent && <AccountInfo />}
          {user?.isParent && subscription?.totalUsers > 1 && <ManageUsers />}
          {/* {user?.isParent && <EmailNotification userid={user} />} */}
          {user?.userType !== 4 && user?.subscription_status !== SUBSCRIPTION_STATUS.CANCELLED && (
            <Subscription
              user={user}
              isPausing={isPausing}
              isCanceling={isCanceling}
              handlePauseSubscription={handlePauseSubscription}
              handleResumeSubscription={handleResumeSubscription}
              handleCancelSubscription={handleCancelSubscription}
            />
          )}
        </Stack>
      </Container>
    </>
  );
}

function YourPlan() {
  const navigate = useNavigate();
  const { subscription } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={9}>
        <Card sx={{ p: 3 }}>
          <Typography variant="overline" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
            Your Plan
          </Typography>

          <Stack sx={{ displa: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {subscription?.name}
            </Typography>
            <Box
              sx={{
                position: { sm: 'absolute' },
                top: { sm: 24 },
                right: { sm: 24 },
              }}
            >
              {user && (
                <Button
                  size="small"
                  variant="outlined"
                  disabled={isLoading}
                  onClick={() => {
                    setIsLoading((prev) => !prev);
                    localStorage.setItem('originTitle', subscription?.name);
                    localStorage.setItem('originPrice', subscription?.price);
                    navigate(PATH_DASHBOARD.user?.updateplan(paramCase(user?.id)));
                  }}
                >
                  Upgrade plan
                </Button>
              )}
            </Box>
          </Stack>

          {user && (
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                gap: { md: '40px', xs: '10px' },
                mt: 1,
              }}
            >
              <span>{subscription?.totalFences} Fences</span>
              <span>{subscription?.totalUsers} Users</span>
              <span>
                Custom Fence Request: {subscription?.requestAvailable ? 'Included' : 'Not Included'}
              </span>
            </Stack>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

function Billing() {
  const [price, setPrice] = useState(null);
  const navigate = useNavigate();
  const { subscription } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    if (!hasFetched) {
      const fetchPrice = async () => {
        try {
          if (user?.stripe_price_id) {
            const priceData = await axios.post('stripe/retrieve-subscription', {
              subscription_id: user?.stripe_subscription_id,
            });
            console.log('priceData.data :>> ', priceData.data);
            setPrice(priceData.data);
          }
        } catch (error) {
          console.error('Error retrieving price:', error);
        }
      };

      fetchPrice();
      setHasFetched(true);
    }
  }, [user, hasFetched]);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={9}>
        <Card sx={{ p: 3 }}>
          <Stack sx={{ displa: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              variant="overline"
              sx={{ mb: 1, display: 'block', color: 'text.secondary' }}
            >
              BILLING
            </Typography>
            <Box
              sx={{
                position: { sm: 'absolute' },
                top: { sm: 24 },
                right: { sm: 24 },
              }}
            >
              {user &&
                ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) > -1 &&
                user?.paymentType === '0' && (
                  <Button
                    size="small"
                    variant="outlined"
                    // disabled={
                    //   !(subscription && subscription?.price !== 0) ||
                    //   !()
                    // }
                    onClick={() => {
                      if (user?.paymentType === '0') {
                        localStorage.setItem('companyId', user?.id);
                        localStorage.setItem('originPrice', price.unit_amount / 100);
                        navigate(PATH_DASHBOARD.user?.switchbilling(paramCase(user?.id)));
                      } else {
                        navigate(PATH_DASHBOARD.user?.callForSwitch);
                      }
                    }}
                  >
                    Switch to Annual Billing
                  </Button>
                )}
            </Box>
          </Stack>

          {user && (
            <Stack flexDirection="column">
              {user.subscription_status === SUBSCRIPTION_STATUS.TRIAL && (
                <Typography variant="h5" color="black">
                  Billing will begin on&nbsp;
                  {moment(new Date(price && price.result && price.result.trial_end * 1000)).format(
                    'MM/DD/YYYY'
                  )}
                </Typography>
              )}
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  mt: 1,
                }}
              >
                <Stack>
                  <Typography variant="subtitle2">Selected</Typography>
                  <Typography sx={{ fontSize: '24px', fontWeight: '600' }}>
                    {!user?.stripe_subscription_id
                      ? 'Free Trial'
                      : user?.stripe_subscription_id && user?.paymentType === '0'
                      ? 'Monthly'
                      : 'Annual'}
                  </Typography>
                </Stack>
                <Stack>
                  {user?.stripe_subscription_id &&
                    ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) < 0 && (
                      <Typography
                        sx={{ fontSize: '24px', fontWeight: '600', textTransform: 'capitalize' }}
                      >
                        {user.subscription_status}
                      </Typography>
                    )}
                  {ALLOWED_SUBSCRIPTION_STATUS.indexOf(user?.subscription_status) > -1 &&
                    (user?.paymentType === '0' ? (
                      <Stack>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: 'red',
                            textAlign: 'end',
                            mt: '-12px',
                            mb: 2,
                          }}
                        >
                          Save 10%
                        </Typography>
                        <Typography sx={{ fontSize: '24px', fontWeight: '600' }}>
                          $
                          {subscription && subscription?.price
                            ? `${subscription?.price}/month`
                            : '0'}
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack sx={{ mt: 3 }}>
                        <Typography sx={{ fontSize: '24px', fontWeight: '600' }}>
                          $
                          {subscription?.price
                            ? (Number(subscription?.price) * 0.9).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : 0}
                          /month
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            mt: -1,
                            fontWeight: 600,
                            color: '#36B37E',
                            alignSelf: 'end',
                          }}
                        >
                          Saving $
                          {subscription?.price
                            ? (Number(subscription?.price) * 0.1 * 12).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : 0}
                        </Typography>
                      </Stack>
                    ))}
                </Stack>
              </Stack>
            </Stack>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

function PaymentMethod() {
  const navigate = useNavigate();
  const [PM, setPM] = useState(null);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchPrice = async () => {
      const stripe = new Stripe(STRIPE_SECRET_KEY);

      try {
        if (user?.stripe_customer_id) {
          const priceData = await stripe.customers.listPaymentMethods(user?.stripe_customer_id, {
            type: 'card',
          });
          setPM(priceData.data);
        }
      } catch (error) {
        console.error('Error retrieving price:', error);
      }
    };
    if (user) {
      fetchPrice();
    }
  }, [user]);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={9}>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
            <Typography
              variant="overline"
              sx={{
                flexGrow: 1,
                color: 'text.secondary',
              }}
            >
              Payment Method
            </Typography>

            {user?.plan && user?.plan.charAt(0) !== '3' ? ( // in case of NOT Pro Trial
              <Button
                variant="outlined"
                onClick={() => {
                  navigate(PATH_DASHBOARD.user?.paymentmethod(paramCase(user?.id)));
                }}
              >
                Update Info
              </Button>
            ) : (
              // in case of Pro Trial
              <Button
                variant="outlined"
                onClick={() => {
                  navigate(PATH_DASHBOARD.user?.upgradingProTrial(paramCase(user?.id)));
                }}
              >
                Update Info
              </Button>
            )}
          </Stack>

          {user && (
            <Box
              display="grid"
              gridTemplateColumns={{ sm: 'repeat(2, 1fr)', xs: 'repeat(1, 1fr)' }}
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
                    <Box
                      component="img"
                      key="paypal"
                      src={`/assets/icons/payments/ic_${item.card.brand}.svg`}
                      width={40}
                    />
                    <Typography variant="body1" fontWeight={900}>
                      **** **** **** {item.card.last4}
                    </Typography>
                  </Stack>
                ))}
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

AccountInfo.propTypes = {
  // user: PropTypes.object,
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

function AccountInfo({ isEdit = false, currentUser }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.auth);
  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed().required('Avatar is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    about: Yup.string().required('About is required'),
  });

  const defaultValues = {
    displayName: user?.fullName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || null,
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || '',
    address: user?.address1 || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    about: user?.about || '',
    isPublic: user?.isPublic || false,
    password: user?.password || '',
  };
  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const { reset, watch, handleSubmit } = methods;
  const values = watch();

  const onSubmit = async (userData) => {
    try {
      const avatar = userData.avatarUrl;
      if (avatar.path) {
        const folder = 'users/';
        const data = {
          key: folder + Date.now().toString() + avatar.path,
          values,
        };
        const preSignedURL = await axios.post('/auth/presignedUrl', data);
        userData.avatarUrl = await { url: preSignedURL.data, avatarFileName: data.key };
        userData.status = true;
        const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
        await fetch(preSignedURL.data, {
          method: 'PUT',
          headers: myHeaders,
          body: avatar,
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
      }
      setUserToken(localStorage.getItem('token'));
      if (isEdit) {
        dispatch(userAction.updateUser(currentUser?._id, userData, navigate));
        enqueueSnackbar(`${translate('messages.UserUpdateSuccess')}`, { variant: 'success' });
      } else {
        dispatch(userAction.createUser(userData, navigate));
        enqueueSnackbar(`${translate('messages.UserCreateSuccess')}`, { variant: 'success' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={9}>
          <Card sx={{ p: 3 }}>
            <Stack sx={{ displa: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography
                variant="overline"
                sx={{
                  mb: 1,
                  display: 'block',
                  color: 'text.secondary',
                }}
              >
                ACCOUNT INFO
              </Typography>

              <Box
                sx={{
                  position: { sm: 'absolute' },
                  top: { sm: 24 },
                  right: { sm: 24 },
                }}
              >
                <Button size="small" variant="outlined" href={PATH_DASHBOARD.user?.useraccountinfo}>
                  Update Info
                </Button>
              </Box>
            </Stack>

            <Stack
              gap={1}
              sx={{
                width: '80%',
                displah: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                justifyContent: 'space-between',
                mt: { md: 5, xs: 3 },
              }}
            >
              <Stack>
                <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>Fence Company</Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  {user && user?.company} <br /> {user && user?.city}
                </Typography>
              </Stack>
              <Stack>
                <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>
                  {user && user?.fullName}
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  {user && user?.email}
                  <br /> {user && user?.phoneNumber}
                </Typography>
              </Stack>
              <Stack>
                <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>Password</Typography>
                <Typography type="password">
                  {user && user?.password ? '•••••••••••••' : null}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

function ManageUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { subscription } = useSelector((state) => state.subscription);
  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    // dispatch(getUser(user?.id));
    if (!hasFetched) {
      dispatch(getSubscription(user?.plan));
      setHasFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.plan, hasFetched]);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={9}>
        <Card sx={{ p: 3 }}>
          <Stack flexDirection="row" justifyContent="space-between" alignItems="start">
            <Stack>
              <Typography variant="subtitle2" sx={{ color: '#637381' }}>
                {`MANAGE USERS (${
                  user && user.childs && user.childs.length > 0 ? user.childs.length + 1 : 1
                }/${subscription?.totalUsers ? subscription?.totalUsers : '0'})`}
              </Typography>
            </Stack>
            {user && (
              <Button
                variant="outlined"
                onClick={() => {
                  navigate(PATH_DASHBOARD.user?.usermanageinfo(paramCase(user?.id)));
                }}
              >
                Edit Users
              </Button>
            )}
          </Stack>

          <Stack flexDirection="column" gap={1}>
            {user &&
              user?.childs &&
              user?.childs.length > 0 &&
              user?.childs.map((items, index) => (
                <Grid
                  item
                  xs={12}
                  md={8}
                  key={index} // Provide a unique key prop
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Typography>{items}</Typography>
                  <Typography>{items.device}</Typography>
                </Grid>
              ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}

// EmailNotification.propTypes = {
//   userid: PropTypes.object,
// };

// function EmailNotification({ userid }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const [notificationValue, setNotificationValue] = useState({});
//   const { enqueueSnackbar } = useSnackbar();

//   const SnackBar = (msg, result) => {
//     enqueueSnackbar(msg, { variant: result });
//   };

//   const notificationSetting = JSON.parse(localStorage.getItem('notificationSetting'));
//   const [hasFetched, setHasFetched] = useState(false);

//   useEffect(() => {
//     if (!hasFetched) {
//       const getUsers = async () => {
//         const response = await axios.get(`/user/${userid.id}`);
//         if (response.data && response.data.data && response.data.data.notificationSetting) {
//           setNotificationValue(response.data.data.notificationSetting);
//         }
//       };

//       getUsers();
//       setHasFetched(true);
//     }
//   }, [userid.id, hasFetched]);

//   // useEffect(() => {
//   //   dispatch(getUser(userid.id));
//   // }, [dispatch, userid?.id]);

//   const notificationMethods = useForm({
//     defaultValues: {
//       billingInformation: notificationSetting?.billingInfo || '',
//       newsAndAnouncements: notificationSetting?.news || '',
//       productUpdates: notificationSetting?.productUpdate || '',
//       newBlogPost: notificationSetting?.blogPost || '',
//       fenceRequestUpdates: notificationSetting?.fenceRequest || '',
//       accountActivity: notificationSetting?.accountActivity || '',
//     },
//   });

//   const { watch, handleSubmit } = notificationMethods;
//   const notificationData = watch();

//   const onSubmit = () => {
//     const updateData = {
//       billingInfo:
//         notificationData.billingInformation === null ? false : notificationData.billingInformation,
//       accountActivity:
//         notificationData.accountActivity === null ? false : notificationData.accountActivity,
//       news:
//         notificationData.newsAndAnouncements === null
//           ? false
//           : notificationData.newsAndAnouncements,
//       productUpdate:
//         notificationData.productUpdates === null ? false : notificationData.productUpdates,
//       blogPost: notificationData.newBlogPost === null ? false : notificationData.newBlogPost,
//       fenceRequest:
//         notificationData.fenceRequestUpdates === null
//           ? false
//           : notificationData.fenceRequestUpdates,
//     };
//     dispatch(updateUser(user?.id, { notificationSetting: updateData }, SnackBar, navigate));
//   };

//   return (
//     user?.notificationSetting && (
//       <FormProvider methods={notificationMethods} onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={5}>
//           <Grid item xs={12} md={9}>
//             <Card sx={{ p: 3 }}>
//               <Stack flexDirection="row" justifyContent="space-between" alignItems="start">
//                 <Typography variant="subtitle2" sx={{ color: '#637381' }}>
//                   EMAIL NOTIFICATION SETTINGS
//                 </Typography>
//                 {user && (
//                   <Button variant="outlined" type="submit">
//                     Update Info
//                   </Button>
//                 )}
//               </Stack>
//               <Stack flexDirection="column" alignItems="start" gap={3}>
//                 <Stack flexDirection="column">
//                   <RHFSwitch
//                     name="billingInformation"
//                     label="Billing Information"
//                     labelPlacement="start"
//                     sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
//                   />
//                   <RHFSwitch
//                     name="accountActivity"
//                     label="Account Activity"
//                     labelPlacement="start"
//                     sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
//                   />
//                   <RHFSwitch
//                     name="newsAndAnouncements"
//                     label="News and Annoucements"
//                     labelPlacement="start"
//                     sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
//                   />
//                   <RHFSwitch
//                     name="productUpdates"
//                     label="Product Updates"
//                     labelPlacement="start"
//                     sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
//                   />
//                   <RHFSwitch
//                     name="newBlogPost"
//                     label="New Blog Post"
//                     labelPlacement="start"
//                     sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
//                   />
//                   <RHFSwitch
//                     name="fenceRequestUpdates"
//                     label="Fence Request Updates"
//                     labelPlacement="start"
//                     sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
//                   />
//                 </Stack>
//               </Stack>
//             </Card>
//           </Grid>
//         </Grid>
//       </FormProvider>
//     )
//   );
// }

Subscription.propTypes = {
  user: PropTypes.object,
  isPausing: PropTypes.bool,
  isCanceling: PropTypes.bool,
  handlePauseSubscription: PropTypes.func,
  handleResumeSubscription: PropTypes.func,
};

function Subscription({
  user,
  handlePauseSubscription,
  handleResumeSubscription,
  isPausing,
  isCanceling,
}) {
  const navigate = useNavigate();
  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={4.5}>
        <Card sx={{ p: 2 }}>
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
              {user &&
                ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) > -1 &&
                'Pause'}
              {user && user?.subscription_status === SUBSCRIPTION_STATUS.PAUSE && 'Resume'}
              &nbsp; subscription
            </Typography>
            {user && (
              <LoadingButton
                variant="outlined"
                loading={isPausing}
                style={{
                  backgroundColor: '#C0DEFF',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: '#1FA9FF',
                  borderRadius: '14px',
                  fontFamily: 'Poppins',
                }}
                onClick={() => {
                  if (user && user?.subscription_status === SUBSCRIPTION_STATUS.PAUSE) {
                    handleResumeSubscription();
                  } else {
                    handlePauseSubscription();
                  }
                }}
              >
                {user &&
                  ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) > -1 &&
                  'Pause'}
                {user && user?.subscription_status === SUBSCRIPTION_STATUS.PAUSE && 'Resume'}
              </LoadingButton>
            )}
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={4.5}>
        <Card sx={{ p: 2 }}>
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
              Cancel subscription
            </Typography>
            {user && (
              <LoadingButton
                loading={isCanceling}
                variant="outlined"
                style={{
                  backgroundColor: '#C0DEFF',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: '#1FA9FF',
                  borderRadius: '14px',
                  fontFamily: 'Poppins',
                }}
                onClick={() => {
                  navigate(PATH_DASHBOARD.user?.callForCancel);
                }}
              >
                Cancel
              </LoadingButton>
            )}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}

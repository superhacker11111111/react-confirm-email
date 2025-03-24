import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { paramCase } from 'change-case';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
// @mui
import {
  Container,
  Button,
  Grid,
  Typography,
  Card,
  Switch,
  FormControlLabel,
  Stack,
  Autocomplete,
  Box,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Stripe from 'stripe';
import moment from 'moment';
import Scrollbar from '../../components/scrollbar';
// redux
import { getAllCompanies, getUser, updateUser } from '../../redux/slices/user';
import { getAssetRequest } from '../../redux/slices/product';
// components
import { useSettingsContext } from '../../components/settings';
import AssetRequestAnalytic from '../../sections/@dashboard/general/assetRequest/AssetRequestAnalytic';
import {
  CompanyRole,
  SUBSCRIPTION_STATUS,
  ALLOWED_SUBSCRIPTION_STATUS,
} from '../../assets/data/roles';
import { getSubscription } from '../../redux/slices/subscription';
import { STRIPE_SECRET_KEY } from '../../config-global';
import { PATH_PAGE, PATH_DASHBOARD } from '../../routes/paths';
import axios from '../../utils/axios';
import { useSnackbar } from '../../components/snackbar';
import LoadingScreen from '../../components/loading-screen';

GeneralUserAccountPage.propTypes = {
  id: PropTypes.string,
};

export default function GeneralUserAccountPage() {
  const { themeStretch } = useSettingsContext();
  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId'));
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [isPausing, setIsPausing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const { companies, user, isloading } = useSelector((state) => state.user);
  const { subscription } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (user && user.plan) dispatch(getSubscription(user?.plan));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const params = queryString.stringify({ role: CompanyRole.code });
    dispatch(getAllCompanies(params));
    dispatch(getUser(companyId));
  }, [dispatch, companyId]);

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
        dispatch(
          updateUser(
            user?.id,
            {
              subscription_status: SUBSCRIPTION_STATUS.PAUSE,
            },
            SnackBar
          )
        );
        setIsPausing(false);
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
            dispatch(
              updateUser(
                user?.id,
                {
                  subscription_status: result.data.status,
                },
                SnackBar
              )
            );
            setIsCanceling(false);
            SnackBar('Successfully Cancelled', 'success');
          })
          .catch((err) => {
            setIsCanceling(false);
            SnackBar(err.message, 'error');
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
        dispatch(
          updateUser(
            user?.id,
            {
              subscription_status: SUBSCRIPTION_STATUS.ACTIVE,
            },
            SnackBar
          )
        );
        setIsPausing(false);
      })
      .catch((err) => {
        setIsPausing(false);
        SnackBar('Error', 'error');
      });
  };

  const onHandleStatusChange = () => {
    dispatch(updateUser(localStorage.getItem('companyId'), { status: !user?.status }, SnackBar));
  };

  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit User | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {isloading ? (
          <Stack direction="row" justifyContent="center" alignItems="center">
            {/* <CircularProgress color="success" size={50} sx={{ marginTop: '50px' }} /> */}
            <LoadingScreen />
          </Stack>
        ) : (
          <>
            <Stack justifyContent="space-between" flexDirection="row">
              <Typography variant="h5">Fence Company</Typography>
              <Button variant="contained" onClick={() => setOpen(true)}>
                {user?.status ? 'Deavtivate User' : 'Activate User'}
              </Button>
            </Stack>
            <Autocomplete
              sx={{ width: 300, boxShadow: 4, borderRadius: '10px', mb: 3 }}
              options={companies && companies.length > 0 ? companies : []}
              autoHighlight
              getOptionLabel={(option) => option.company}
              value={
                (companies &&
                  companies.length > 0 &&
                  companies.find((company) => company.id === companyId)) ||
                null
              }
              onChange={(e) => {
                setCompanyId(e.target.id);
                localStorage.setItem('companyId', e.target.id);
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props} id={option.id} key={option.id}>
                  {option.company}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label="Start typing..." />}
            />
            <Stack flexDirection="column" gap={3}>
              <FenceModels user={user} />
              <YourPlan user={user} />
              <Billing user={user} />
              {subscription?.price !== '0' && <PaymentMethod user={user} />}
              <AccountInfo user={user} />
              {subscription?.price !== '0' && <ManageUsers user={user} />}
              {/* <NotificationSetting user={user} /> */}
              {subscription?.price !== '0' &&
                user?.subscription_status !== SUBSCRIPTION_STATUS.CANCELLED && (
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
          </>
        )}
      </Container>

      <Dialog open={open}>
        <DialogTitle variant="h5" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
          Are you sure you want to {user?.status ? 'Deactivate User' : 'Activate User'}?
        </DialogTitle>
        <Stack justifySelf="center">
          <Button
            variant="contained"
            sx={{
              mb: 2,
              mx: 12,
              fontSize: '16px',
              fontWeight: 900,
              borderRadius: 1.5,
            }}
            onClick={() => {
              onHandleStatusChange();
              setOpen(false);
            }}
          >
            {user?.status ? 'Deactivate User' : 'Activate User'}
          </Button>
          <Button
            variant="contained"
            sx={{
              mb: 10,
              mx: 12,
              fontSize: '16px',
              fontWeight: 900,
              borderRadius: 1.5,
            }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}

FenceModels.propTypes = {
  user: PropTypes.object,
};

function FenceModels({ user }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assetRequestCount } = useSelector((state) => state.product);
  useEffect(() => {
    if (user) dispatch(getAssetRequest(user?.id));
  }, [dispatch, user]);
  const getPercentByCount = (count) => (Number(count) / Number(assetRequestCount.totalCount)) * 100;
  return (
    <Card sx={{ p: 3 }}>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="start">
        <Typography variant="subtitle2" sx={{ color: '#637381' }}>
          MANAGE 3D MODELS
        </Typography>
        {user && (
          <Button
            variant="outlined"
            onClick={() => {
              navigate(PATH_DASHBOARD.general.file);
            }}
          >
            File Manager
          </Button>
        )}
      </Stack>
      <Stack>
        <Scrollbar>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <AssetRequestAnalytic
              title="Total Assets"
              total={user && user.selectedFences.length}
              percent={getPercentByCount(user && user.selectedFences.length)}
              icon="eva:checkmark-circle-2-fill"
              color={theme.palette.success.main}
            />

            <AssetRequestAnalytic
              title="Pending"
              total={assetRequestCount.pending}
              percent={getPercentByCount(assetRequestCount.pending)}
              icon="eva:clock-fill"
              color={theme.palette.warning.main}
            />

            <AssetRequestAnalytic
              title="Not Started"
              total={assetRequestCount.notStarted}
              percent={getPercentByCount(assetRequestCount.notStarted)}
              icon="eva:bell-fill"
              color={theme.palette.error.main}
            />
          </Stack>
        </Scrollbar>
      </Stack>
    </Card>
  );
}

YourPlan.propTypes = {
  user: PropTypes.object,
};
function YourPlan({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscription } = useSelector((state) => state.subscription);
  useEffect(() => {
    if (user && user.plan) dispatch(getSubscription(user?.plan));
  }, [dispatch, user]);
  return (
    <Card sx={{ p: 3 }}>
      <Stack
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="start"
      >
        <Stack
          flexDirection={{ xs: 'row', sm: 'column' }}
          alignItems="center"
          gap={{ xs: 5, sm: 0 }}
        >
          <Typography variant="subtitle2" sx={{ color: '#637381', alignSelf: 'start' }}>
            YOUR PLAN
          </Typography>

          <Typography variant="h4">{subscription?.name}</Typography>
        </Stack>
        {user && (
          <Button
            variant="outlined"
            onClick={() => {
              localStorage.setItem('companyId', user.id);
              localStorage.setItem('originTitle', subscription.name);
              localStorage.setItem('originPrice', subscription.price);
              navigate(PATH_PAGE.upgradePlan(paramCase(user.id)));
            }}
          >
            Upgrade Plan
          </Button>
        )}
      </Stack>
      {user && (
        <Stack flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 1, sm: 8 }}>
          <Typography variant="subtitle1">{subscription?.totalFences} Fences</Typography>
          <Typography variant="subtitle1">{subscription?.totalUsers} Users</Typography>
          <Typography variant="subtitle1">
            Custom Fence Request:{' '}
            {subscription && (subscription?.requestAvailable ? 'Included' : 'Not Included')}
          </Typography>
        </Stack>
      )}
    </Card>
  );
}

Billing.propTypes = {
  user: PropTypes.object,
};

function Billing({ user }) {
  const [price, setPrice] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subscription } = useSelector((state) => state.subscription);
  useEffect(() => {
    if (user && user.plan) dispatch(getSubscription(user?.plan));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const fetchPrice = async () => {
      if (user?.stripe_price_id) {
        axios
          .post('stripe/retrieve-price', { price_id: user.stripe_price_id })
          .then((priceData) => {
            setPrice(priceData.data.result);
          })
          .catch((err) => console.error('Error retrieving price:', err));
      }
    };
    fetchPrice();
  }, [user]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="start"
      >
        <Typography variant="subtitle2" sx={{ color: '#637381' }}>
          BILLING
        </Typography>
        {user && subscription?.price !== '0' && (
          <Button
            variant="outlined"
            onClick={() => {
              localStorage.setItem('companyId', user.id);
              localStorage.setItem('originPrice', price.unit_amount / 100);
              navigate(PATH_PAGE.switchBilling(paramCase(user.id)));
            }}
          >
            {user?.paymentType === '0' ? 'Switch to Annual Billing' : 'Switch to Monthly Billing'}
          </Button>
        )}
      </Stack>
      {user && (
        <Stack gap={2} flexDirection="column">
          {user.subscription_status === 'trialing' && (
            <Typography variant="h6" color="black">
              Billing will begin on&nbsp;
              {moment(new Date(price && price.result && price.result.trial_end * 1000)).format(
                'MM/DD/YYYY'
              )}
            </Typography>
          )}

          <Stack>
            <Typography variant="subtitle2">Selected</Typography>
            {subscription?.price === '0' ? (
              <Typography variant="h4">{subscription?.name}</Typography>
            ) : (
              <Typography variant="h6">
                {user?.paymentType === '0' ? 'Monthly' : 'Annual'}
              </Typography>
            )}
          </Stack>
          <Stack>
            {price && subscription?.price !== '0' && (
              <Typography variant="h6">
                ${price.unit_amount / 100}/{price.recurring.interval}
              </Typography>
            )}
          </Stack>
        </Stack>
      )}
    </Card>
  );
}

PaymentMethod.propTypes = {
  user: PropTypes.object,
};

function PaymentMethod({ user }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [PM, setPM] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const stripe = new Stripe(STRIPE_SECRET_KEY);

      try {
        if (user && user.stripe_customer_id) {
          const priceData = await stripe.customers.listPaymentMethods(user?.stripe_customer_id, {
            type: 'card',
          });
          setPM(priceData.data);
        } else {
          setPM([]);
        }
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };

    fetchPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="start" mb={3}>
        <Typography variant="subtitle2" sx={{ color: '#637381' }}>
          PAYMENT METHOD
        </Typography>
        {user && (
          <Button
            variant="outlined"
            onClick={() => {
              navigate(PATH_PAGE.paymentmethods(paramCase(user.id)));
            }}
          >
            Update Info
          </Button>
        )}
      </Stack>
      {user && (
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
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
                  key={item.card.brand}
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
  );
}

AccountInfo.propTypes = {
  user: PropTypes.object,
};

function AccountInfo({ user }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ p: 3 }}>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="start">
        <Stack>
          <Typography variant="subtitle2" sx={{ color: '#637381' }}>
            ACCOUNT INFO
          </Typography>
        </Stack>
        {user && (
          <Button
            variant="outlined"
            onClick={() => navigate(PATH_PAGE.editAccount(paramCase(user.id)))}
          >
            Update Info
          </Button>
        )}
      </Stack>
      {user && (
        <Stack flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 5, sm: 15 }}>
          <Stack flexDirection="column">
            <Typography variant="body1" fontWeight={900}>
              {user?.company}
            </Typography>
            <Typography variant="body1">{user?.address1}</Typography>
            <Typography variant="body1">{`${user?.city}, ${user?.state} ${user?.zipCode}`}</Typography>
          </Stack>
          <Stack flexDirection="column">
            <Typography variant="body1" fontWeight={900}>
              {user?.fullName}
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
            <Typography variant="body1">{user?.phoneNumber}</Typography>
          </Stack>
        </Stack>
      )}
    </Card>
  );
}

ManageUsers.propTypes = {
  user: PropTypes.object,
};

function ManageUsers({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subscription } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (user?.plan) dispatch(getSubscription(user?.plan));
  }, [dispatch, user]);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={8}>
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
                onClick={() => navigate(PATH_PAGE.addCompanies(paramCase(user.id)))}
              >
                Edit Users
              </Button>
            )}
          </Stack>
          <Stack flexDirection="column" gap={1}>
            {user &&
              user.childs &&
              user.childs.length > 0 &&
              user.childs.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={8}
                  key={index}
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Typography>{item}</Typography>
                  {/* <Typography>{item.device}</Typography> */}
                </Grid>
              ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}

NotificationSetting.propTypes = {
  user: PropTypes.object,
};

function NotificationSetting({ user }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack flexDirection="column" alignItems="start" gap={3}>
        <Typography variant="subtitle2" sx={{ color: '#637381' }}>
          EMAIL NOTIFICATION SETTINGS
        </Typography>

        <Stack flexDirection="column">
          <FormControlLabel
            control={
              <Switch
                size="medium"
                name="billingInformation"
                color="success"
                checked
                // checked={state.disabledZoom}
                // onChange={handleChange}
              />
            }
            label="Billing Information"
          />
          <FormControlLabel
            control={
              <Switch
                size="medium"
                name="accountActivity"
                color="success"
                checked
                // checked={state.disabledZoom}
                // onChange={handleChange}
              />
            }
            label="Account Activity"
          />
          <FormControlLabel
            control={
              <Switch
                size="medium"
                name="newsAndAnouncements"
                color="success"
                checked
                // checked={state.disabledZoom}
                // onChange={handleChange}
              />
            }
            label="News and Annoucements"
          />
          <FormControlLabel
            control={
              <Switch
                size="medium"
                name="productUpdates"
                color="success"
                checked
                // checked={state.disabledZoom}
                // onChange={handleChange}
              />
            }
            label="Product Updates"
          />
          <FormControlLabel
            control={
              <Switch
                size="medium"
                name="newBlogPost"
                color="success"
                checked
                // checked={state.disabledZoom}
                // onChange={handleChange}
              />
            }
            label="New Blog Post"
          />
          <FormControlLabel
            control={
              <Switch
                size="medium"
                name="fenceRequestUpdates"
                color="success"
                checked
                // checked={state.disabledZoom}
                // onChange={handleChange}
              />
            }
            label="Fence Request Updates"
          />
        </Stack>
      </Stack>
    </Card>
  );
}

Subscription.propTypes = {
  user: PropTypes.object,
  isPausing: PropTypes.bool,
  isCanceling: PropTypes.bool,
  handlePauseSubscription: PropTypes.func,
  handleResumeSubscription: PropTypes.func,
  handleCancelSubscription: PropTypes.func,
};

function Subscription({
  user,
  handlePauseSubscription,
  handleResumeSubscription,
  handleCancelSubscription,
  isPausing,
  isCanceling,
}) {
  const [open, setOpen] = useState(false);
  return (
    <Stack flexDirection="row" gap={5}>
      <Card sx={{ p: 2 }}>
        <Stack flexDirection="row" alignItems="center" gap={10}>
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
            {user && ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) > -1 && 'Pause'}
            {user && user.subscription_status === SUBSCRIPTION_STATUS.PAUSE && 'Resume'}
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
                if (user && user.subscription_status === SUBSCRIPTION_STATUS.PAUSE) {
                  handleResumeSubscription();
                } else {
                  handlePauseSubscription();
                }
              }}
            >
              {user &&
                ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) > -1 &&
                'Pause'}
              {user && user.subscription_status === SUBSCRIPTION_STATUS.PAUSE && 'Resume'}
            </LoadingButton>
          )}
        </Stack>
      </Card>
      <Card sx={{ p: 2 }}>
        <Stack flexDirection="row" alignItems="center" gap={10}>
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
            cancel subscription
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
                setOpen(true);
              }}
            >
              Cancel
            </LoadingButton>
          )}
        </Stack>
      </Card>
      <Dialog open={open}>
        <DialogTitle variant="h5" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
          Are you sure you want to Cancel Subscription?
        </DialogTitle>
        <Stack justifySelf="center">
          <Button
            variant="contained"
            sx={{
              mb: 2,
              mx: 12,
              fontSize: '16px',
              fontWeight: 900,
              borderRadius: 1.5,
            }}
            onClick={() => {
              handleCancelSubscription();
              setOpen(false);
            }}
          >
            Cancel Subscription
          </Button>
          <Button
            variant="contained"
            sx={{
              mb: 10,
              mx: 12,
              fontSize: '16px',
              fontWeight: 900,
              borderRadius: 1.5,
            }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </Stack>
      </Dialog>
    </Stack>
  );
}

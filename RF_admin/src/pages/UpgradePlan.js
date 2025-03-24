import { paramCase } from 'change-case';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';

// @mui
import { Box, Container, Typography, Card, Stack, Button, Divider } from '@mui/material';
import { MotionViewport, varFade } from '../components/animate';
//
import { useDispatch, useSelector } from '../redux/store';
import { getSubscriptions, getSubscription } from '../redux/slices/subscription';
import { getUser, setUpgradePaymentInfo } from '../redux/slices/user';
// utils

import { PATH_DASHBOARD, PATH_PAGE } from '../routes/paths';
import Iconify from '../components/iconify';
// ----------------------------------------------------------------------

PlanCard.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string,
    popular: PropTypes.bool,
    requestAvailable: PropTypes.bool,
    price: PropTypes.string,
    totalFences: PropTypes.string,
    totalUsers: PropTypes.string,
    id: PropTypes.string,
  }),
  onButtonClick: PropTypes.func,
  buttonColor: PropTypes.shape({
    backColor: PropTypes.string,
    fontColor: PropTypes.string,
    buttonBorder: PropTypes.string,
  }),
};

export function PlanCard({ plan, onButtonClick, buttonColor }) {
  if (!plan) return null;
  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;
  const { backColor, fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onButtonClick(id, price);
  };

  return (
    <Card
      sx={{
        p: 5,
        pt: 8,
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={5}>
        <Stack direction={{ sm: 'row', sx: 'column' }} justifyContent="space-between">
          <Typography
            variant="h4"
            component="div"
            fontWeight={900}
            sx={{
              marginTop: '20px',
              fontSize: { sm: '28px', lg: '25px', xl: '36px' },
              fontFamily: 'Poppins',
            }}
          >
            {name}
          </Typography>
          {price === '0' ? (
            <Typography fontSize="18px" fontWeight="700">
              Free For 30 Days
            </Typography>
          ) : (
            <Typography fontSize="18px" fontWeight="700">
              <br />
            </Typography>
          )}

          {popular ? (
            <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-2.5 py-1 rounded-[10px] absolute top-5 left-5">
              POPULAR
            </span>
          ) : (
            ''
          )}
          <Stack direction="column" alignItems="flex-end" sx={{ marginTop: '2px' }}>
            <Stack direction="row" justifyContent="center" spacing={0.5}>
              <Typography fontSize="26px" component="span" fontWeight={600}>
                $
              </Typography>
              <Typography fontSize="30px" component="span" fontWeight={900}>
                {price}
              </Typography>
            </Stack>
            <Typography fontSize="14px" component="span" fontWeight={900}>
              Per Month
            </Typography>
          </Stack>
          {/* <Stack direction="row" spacing={0.5} sx={{ marginTop: '20px' }}>
            <Typography variant="h4" component="span">
              $
            </Typography>
            <Typography variant="h3" component="span" fontWeight={900}>
              {price}
            </Typography>
          </Stack> */}
        </Stack>

        <Stack spacing={2.5}>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="26px" fontWeight="900">
              {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`}
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="16px" fontWeight="700">
              {totalFences} Fences
            </Typography>
          </Stack>

          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="16px" fontWeight="700">
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
              icon={requestAvailable ? 'carbon:checkmark-outline' : 'carbon:close-outline'}
              sx={{ color: requestAvailable ? '#2DBB5D' : '#FF0606', width: 20, height: 20 }}
            />
            <Typography
              fontSize="16px"
              fontWeight="700"
              color={requestAvailable ? 'black' : 'grey'}
            >
              Request Custom Fences
            </Typography>
          </Stack>
          <Button
            size="large"
            fullWidth
            disabled={name === localStorage.getItem('originTitle')}
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              marginTop: '40px',
              backgroundColor: name === localStorage.getItem('originTitle') ? 'grey' : '#1FA9FF',
              color: fontColor,
              border: name === localStorage.getItem('originTitle') ? 'grey' : `#1FA9FF 1px solid`,
            }}
          >
            Choose Package
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

export default function UpgradePlanPage() {
  const dispatch = useDispatch();
  const userId = useParams().id;

  const colors = { backColor: '#1288E3', fontColor: '#FFFFFF', buttonBorder: '#1288E3' };

  const { subscriptions, subscription } = useSelector((state) => state.subscription);
  const { updatePaymentInfo, user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUser(userId));
    dispatch(getSubscriptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(getSubscription(user?.plan));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const navigate = useNavigate();

  const handleSubmit = (id, price) => {
    dispatch(setUpgradePaymentInfo({ ...updatePaymentInfo, priceId: id, customPrice: price }));
    if (subscription && subscription.price === '0') {
      navigate(PATH_PAGE.upgradeFromProTrial(paramCase(userId)));
    } else {
      navigate(PATH_PAGE.almostDone(paramCase(userId)));
    }
  };

  return (
    <>
      <Helmet>
        <title> Upgrade Plan | RealityFence</title>
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
              Choose Plan
            </Typography>
          </m.div>
        </Box>

        <Box
          gap={5}
          display="grid"
          gridTemplateColumns={{ lg: 'repeat(3, 1fr)', md: 'repeat(1, 1fr)' }}
          sx={{ my: 5 }}
        >
          {subscriptions &&
            subscriptions.length > 0 &&
            subscriptions.map(
              (price, index) =>
                price.price !== '0' && (
                  <PlanCard
                    key={index}
                    plan={price}
                    buttonColor={colors}
                    onButtonClick={handleSubmit}
                  />
                )
            )}
        </Box>
        <Box display="flex" justifyContent="end">
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
        </Box>
      </Container>
    </>
  );
}

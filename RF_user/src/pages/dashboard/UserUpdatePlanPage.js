import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { paramCase } from 'change-case';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import { Box, Container, Typography, Card, Stack, Button, useMediaQuery } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
//
import { useDispatch, useSelector } from '../../redux/store';
import { setUpgradePaymentInfo } from '../../redux/slices/user';
import { getSubscriptions, getSubscription } from '../../redux/slices/subscription';
import { PAYMENT_TYPE } from '../../assets/data/roles';

// utils

import { PATH_DASHBOARD } from '../../routes/paths';
import Iconify from '../../components/iconify';
// ----------------------------------------------------------------------

PlanCard.propTypes = {
  type: PropTypes.number,
  isDisabled: PropTypes.bool,
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

PlanCardMobile.propTypes = {
  type: PropTypes.number,
  isDisabled: PropTypes.bool,
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

export default function UserUpdatePlanPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useParams().id;
  const isMobile = useMediaQuery('(max-width:650px)');
  const colors = { backColor: '#1FA9FF', fontColor: '#FFFFFF', buttonBorder: '#1FA9FF' };

  const { user } = useSelector((state) => state.auth);
  const { subscription, subscriptions } = useSelector((state) => state.subscription);
  const { updatePaymentInfo } = useSelector((state) => state.users);

  useEffect(() => {
    if (user) {
      // dispatch(getUser(user?.id));
      dispatch(getSubscription(user?.plan));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    dispatch(getSubscriptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = (id) => {
    dispatch(
      setUpgradePaymentInfo({
        ...updatePaymentInfo,
        paymentType: user.paymentType === PAYMENT_TYPE.YEARLY,
        priceId: id,
      })
    );
    if (subscription && subscription.price === '0') {
      navigate(PATH_DASHBOARD.user.upgradingProTrial(paramCase(userId)));
    } else {
      navigate(PATH_DASHBOARD.user.useralmost(paramCase(userId)));
    }
  };

  const handleClickCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>

      <Container
        component={MotionViewport}
        id="pricing-home"
        sx={{
          pb: { xs: 5, md: 10 },
          px: { xs: 2.5, sm: 4, md: 10, lg: 12.5 },
        }}
      >
        <Box
          sx={{
            mt: { md: 5, xs: 2 },
            mb: 1,
            textAlign: 'center',
          }}
        >
          <m.div variants={varFade().inDown}>
            <Typography
              sx={{ my: 3, fontSize: { md: '40px', sm: '32px', xs: '28px' }, fontWeight: '700' }}
            >
              Choose a Plan
            </Typography>
          </m.div>
        </Box>
        {!isMobile ? (
          <>
            <Box
              gap={{ md: 6, sm: 5 }}
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              sx={{ my: { md: 8, sm: 6, xs: 4 } }}
            >
              {subscriptions &&
                subscriptions.length > 0 &&
                subscriptions.map(
                  (price, index) =>
                    price?.price !== '0' && (
                      <PlanCard
                        key={index}
                        plan={price}
                        buttonColor={colors}
                        isDisabled={price?.name === subscription?.name}
                        onButtonClick={handleSubmit}
                      />
                    )
                )}
            </Box>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 'regular',
                textAlign: 'center',
                mb: 4,
              }}
            >
              *Please note that any custom fence requests
              <br /> beyond our standard inventory is subject to
              <br /> additional charges
            </Typography>
            <div className="flex justify-end w-full">
              <Button
                variant="text"
                color="inherit"
                style={{
                  backgroundColor: '#C0DEFF',
                  padding: '10px 142px',
                  fontSize: '20px',
                  color: '#1FA9FF',
                  borderRadius: '14px',
                  fontFamily: 'unset',
                  height: '50px',
                }}
                onClick={handleClickCancel}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <Box
              gap={{ md: 6, sm: 4, xs: 3 }}
              display="grid"
              gridTemplateColumns="repeat(1, 1fr)"
              sx={{ my: 5 }}
            >
              {subscriptions &&
                subscriptions.length > 0 &&
                subscriptions.map(
                  (price, index) =>
                    price?.price !== '0' && (
                      <PlanCardMobile
                        key={index}
                        plan={price}
                        buttonColor={colors}
                        isDisabled={price?.name === subscription?.name}
                        onButtonClick={handleSubmit}
                      />
                    )
                )}
            </Box>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 'regular',
                textAlign: 'center',
                mb: 4,
              }}
            >
              *Please note that any custom fence requests
              <br /> beyond our standard inventory is subject to
              <br /> additional charges
            </Typography>
            <div className="flex justify-center w-full">
              <Button
                variant="text"
                color="inherit"
                style={{
                  backgroundColor: '#C0DEFF',
                  padding: '10px 110px',
                  fontSize: '18px',
                  color: '#1FA9FF',
                  borderRadius: '14px',
                  fontFamily: 'unset',
                  height: '50px',
                }}
                onClick={handleClickCancel}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export function PlanCard({ plan, isDisabled = false, onButtonClick, buttonColor, type }) {
  if (!plan) return null;
  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;

  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onButtonClick(id);
  };

  return (
    <Card
      sx={{
        pb: 3,
        px: { md: 5, sm: 2, xs: 5 },
        pt: popular ? 8 : 4.5,
        height: popular ? '112%' : '100%',
        alignSelf: popular ? 'center' : 'flex-start',
        boxShadow: `0px 8px 12px rgba(0, 0, 0, 0.3)`,
        // boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={5}>
        <Stack
          direction={{ sm: 'row', sx: 'column' }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            <Typography
              component="div"
              sx={{
                marginTop: '20px',
                fontSize: { sm: '28px', lg: '25px', xl: '36px' },
                fontWeight: '900',
                fontFamily: 'Poppins',
              }}
            >
              {name}
            </Typography>
            {price === '0' ? (
              <Typography fontSize="18px" fontWeight="700">
                Free For 7 Day
              </Typography>
            ) : (
              <Typography fontSize="18px" fontWeight="700">
                <br />
              </Typography>
            )}
          </Stack>

          {popular ? (
            <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-2.5 py-1 rounded-[10px] absolute top-8 left-5">
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
            <Typography
              sx={{ fontSize: { xs: '14px', sm: '16px' } }}
              component="span"
              fontWeight={900}
            >
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
              Up to {totalFences} Fences*
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
            disabled={isDisabled}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              marginTop: '30px',
              backgroundColor: isDisabled ? 'grey' : '#1FA9FF',
              color: fontColor,
              border: isDisabled ? 'grey 1px solid' : `${buttonBorder} 1px solid`,
            }}
          >
            Choose Subscription
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function PlanCardMobile({ plan, isDisabled = false, onButtonClick, buttonColor, type }) {
  if (!plan) return null;
  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;

  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onButtonClick(id);
  };

  return (
    <Card
      sx={{
        p: 2,
        pt: 4,
        pb: popular ? 3 : 2,
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography
              variant="h4"
              component="div"
              sx={{
                marginTop: '20px',
                fontSize: { xs: '26px', sm: '28px' },
                fontFamily: 'Poppins',
              }}
            >
              {name}
            </Typography>
            {price === '0' ? (
              <Typography fontSize="18px" fontWeight="700">
                Free For 7 Day
              </Typography>
            ) : (
              <Typography fontSize="18px" fontWeight="700">
                <br />
              </Typography>
            )}
          </Stack>

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
            <Typography
              sx={{ fontSize: { xs: '14px', sm: '16px' } }}
              component="span"
              fontWeight={900}
            >
              Per Month
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontWeight="900" fontSize="20px">
              {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`}
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }} fontWeight="700">
              Up to {totalFences} Fences*
            </Typography>
          </Stack>

          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }} fontWeight="700">
              Premium Support
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }} fontWeight="700">
              One-Touch Sharing
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center" mb={20}>
            <Iconify
              icon={requestAvailable ? 'carbon:checkmark-outline' : 'carbon:close-outline'}
              sx={{ color: requestAvailable ? '#2DBB5D' : '#FF0606', width: 20, height: 20 }}
            />
            <Typography
              sx={{ fontSize: { xs: '14px', sm: '16px' } }}
              fontWeight="700"
              color={requestAvailable ? 'black' : 'grey'}
            >
              Request Custom Fences
            </Typography>
          </Stack>

          <Button
            size="large"
            disabled={isDisabled}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              marginTop: '30px',
              backgroundColor: isDisabled ? 'grey' : '#1FA9FF',
              color: fontColor,
              border: isDisabled ? 'grey 1px solid' : `${buttonBorder} 1px solid`,
            }}
          >
            Choose Subscription
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

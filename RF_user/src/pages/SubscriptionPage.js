import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';

// @mui
import { Box, Container, Typography, Card, Stack, Button, useMediaQuery } from '@mui/material';
import { MotionViewport, varFade } from '../components/animate';
import { useDispatch, useSelector } from '../redux/store';
import { getSubscriptions } from '../redux/slices/subscription';
// utils
import { PATH_PAGE } from '../routes/paths';
import Iconify from '../components/iconify';
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
  onSubscriptionClick: PropTypes.func,

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
  onSubscriptionClick: PropTypes.func,
  buttonColor: PropTypes.shape({
    backColor: PropTypes.string,
    fontColor: PropTypes.string,
    buttonBorder: PropTypes.string,
  }),
};

export default function SubScriptPage() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:750px)');
  sessionStorage.removeItem('priceId');
  const colors = { backColor: '#1FA9FF', fontColor: '#FFFFFF', buttonBorder: '#1288E3' };
  const { subscriptions } = useSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(getSubscriptions());
  }, [dispatch]);

  const onSubscriptionClick = (id) => {
    sessionStorage.setItem('priceId', id);
    window.location.href = PATH_PAGE.checkout_v2;
  };

  return (
    <>
      <Helmet>
        <title> Pricing | RealityFence</title>
      </Helmet>
      <Container
        component={MotionViewport}
        id="pricing-home"
        maxWidth="xl"
        sx={{
          pt: { xs: 3, sm: 4, md: 7 },
          pb: { xs: 5, md: 10 },
          px: { lg: 10, md: 8, sm: 4, xs: 2 },
        }}
      >
        {!isMobile ? (
          <>
            <Box
              sx={{
                mb: 7,
                textAlign: 'center',
              }}
            >
              <m.div variants={varFade().inDown}>
                <Typography
                  sx={{ fontSize: { lg: '48px', md: '36px', xs: '30px' }, fontWeight: '800' }}
                >
                  Our Subscriptions
                </Typography>
              </m.div>
            </Box>

            <Box
              gap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
            >
              {subscriptions &&
                subscriptions.length > 0 &&
                subscriptions.map((price, index) => (
                  <PlanCard
                    key={index}
                    plan={price}
                    buttonColor={colors}
                    onSubscriptionClick={onSubscriptionClick}
                  />
                ))}
            </Box>

            {/* 
            //For Free Trial Incude case
            <Grid
              container
              gap={{ lg: 6, md: 5, sm: 3 }}
              sx={{ justifyContent: 'center', alignItems: 'center', mt: 5 }}
              columns={{ md: 12 }}
              flexDirection={{ xs: 'column', sm: 'row' }}
            >
              {subscriptions &&
                subscriptions.length > 0 &&
                subscriptions.map((price, index) => (
                  <Grid item xs={2} sm={3.5} md={3.5} key={index}>
                    <PlanCard
                      key={index}
                      plan={price}
                      buttonColor={colors}
                      onSubscriptionClick={onSubscriptionClick}
                    />
                  </Grid>
                ))}
            </Grid> */}
            <Stack sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: { md: '80%', xs: '100%' },
                  alignSelf: 'center',
                  px: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 'regular',
                    textAlign: 'center',
                    mt: 4,
                    fontFamily: 'Public Sans',
                  }}
                >
                  *Please note that any custom fence requests beyond our standard inventory is
                  subject to additional charges
                </Typography>
                {/* <Typography
                  sx={{ fontSize: '26px', fontWeight: '800', pt: 4, textAlign: 'center' }}
                >
                  In the market to buy a fence?
                </Typography>
                <Stack sx={{ px: 6.5 }}>
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      color: 'white',
                      backgroundColor: '#1FA9FF',
                      fontSize: '15px',
                      height: '48px',
                    }}
                    sx={{ my: 3, mb: 16, mx: 3 }}
                    href={PATH_PAGE.shopper}
                  >
                    RealityFence Shopper
                  </Button>
                </Stack> */}
              </Box>
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
                  sx={{ fontSize: { lg: '48px', md: '36px', xs: '36px' }, fontWeight: '800' }}
                >
                  Our Subscriptions
                </Typography>
              </m.div>
            </Box>

            <Stack spacing={2}>
              {subscriptions &&
                subscriptions.length > 0 &&
                subscriptions.map((price, index) => (
                  <PlanCardMobile
                    key={index}
                    plan={price}
                    buttonColor={colors}
                    onSubscriptionClick={onSubscriptionClick}
                  />
                ))}
            </Stack>
            <Stack sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: { md: '56%', xs: '100%' },
                  alignSelf: 'center',
                  px: { md: 8, xs: 1 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 'regular',
                    textAlign: 'center',
                    mt: 4,
                  }}
                >
                  *Please note that any custom fence requests
                  <br /> beyond our standard inventory is subject to
                  <br /> additional charges
                </Typography>
                {/* <Typography
                  sx={{ fontSize: '24px', fontWeight: '800', pt: 4, textAlign: 'center' }}
                >
                  In the market to buy a fence?
                </Typography>
                <Button
                  variant="text"
                  color="inherit"
                  style={{
                    width: '90%',
                    color: 'white',
                    backgroundColor: '#1FA9FF',
                    fontSize: '15px',
                    height: '48px',
                  }}
                  sx={{ my: 3, mb: 6 }}
                  href={PATH_PAGE.shopper}
                >
                  RealityFence Shopper
                </Button> */}
              </Box>
            </Stack>
          </>
        )}
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

export function PlanCard({ plan, isDisabled = false, onSubscriptionClick, buttonColor, type }) {
  if (!plan) return null;
  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;
  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onSubscriptionClick(id);
  };

  return (
    <Card
      sx={{
        px: { md: 2, sm: 1 },
        pt: popular ? 8 : 4.5,
        pb: popular ? { md: 9, sm: 6 } : { md: 5, sm: 3 },
        boxShadow: `0px 8px 12px rgba(0, 0, 0, 0.3)`,
        height: popular ? '112%' : '100%',
        alignSelf: popular ? 'center' : 'flex-start',
      }}
    >
      <Stack spacing={3}>
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
              marginTop: '40px',
              backgroundColor: '#1FA9FF',
              color: fontColor,
              border: `${buttonBorder} 1px solid`,
            }}
          >
            Choose Subscription
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

// ------------------------------------------------------------------------

export function PlanCardMobile({
  plan,
  isDisabled = false,
  onSubscriptionClick,
  buttonColor,
  type,
}) {
  if (!plan) return null;

  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;
  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onSubscriptionClick(id);
  };

  return (
    <Card
      sx={{
        p: 3,
        pt: 4,
        pb: popular ? 3 : 2,
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={3}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography
              component="div"
              sx={{ marginTop: '20px', fontSize: '32px', fontFamily: 'Poppins', fontWeight: 900 }}
            >
              {name}
            </Typography>
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
              <Typography fontSize="22px" component="span">
                $
              </Typography>
              <Typography fontSize="24px" component="span" fontWeight={900}>
                {price}
              </Typography>
            </Stack>
            <Typography fontSize="16px" component="span" fontWeight={900}>
              Per Month
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: 'green', width: 20, height: 20 }}
            />
            <Typography fontSize="24px" fontWeight="900">
              {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`}
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: 'green', width: 20, height: 20 }}
            />
            <Typography fontSize="24px" fontWeight="900">
              Up to {totalFences} Fences*
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: 'green', width: 20, height: 20 }}
            />
            <Typography fontSize="24px" fontWeight="900">
              Premium Support
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: 'green', width: 20, height: 20 }}
            />
            <Typography fontSize="24px" fontWeight="900">
              One-Touch Sharing
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center" mb={20}>
            <Iconify
              icon={requestAvailable ? 'carbon:checkmark-outline' : 'carbon:close-outline'}
              sx={{ color: requestAvailable ? 'green' : 'red', width: 20, height: 20 }}
            />
            <Typography
              fontSize="24px"
              fontWeight={900}
              color={requestAvailable ? '#212B36' : 'grey'}
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
              marginTop: '20px',
              backgroundColor: '#1FA9FF',
              color: fontColor,
              border: `${buttonBorder} 1px solid`,
            }}
          >
            <Typography sx={{ lineHeight: 2, fontSize: '14px' }}>Choose Subscription</Typography>
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

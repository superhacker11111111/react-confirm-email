import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';

// @mui
import { Box, Container, Typography, Card, Stack, Button, Grid } from '@mui/material';
import { MotionViewport, varFade } from '../components/animate';
//
import { useDispatch, useSelector } from '../redux/store';
import { getSubscriptions } from '../redux/slices/subscription';
// utils

import { PATH_PAGE } from '../routes/paths';
import contactsalesimg from '../assets/contactsales.png';
import Iconify from '../components/iconify';
// ----------------------------------------------------------------------

PlanCard.propTypes = {
  onSubscriptionClick: PropTypes.func,
  plan: PropTypes.shape({
    name: PropTypes.string,
    popular: PropTypes.bool,
    requestAvailable: PropTypes.bool,
    price: PropTypes.string,
    totalFences: PropTypes.string,
    totalUsers: PropTypes.string,
    id: PropTypes.string,
  }),

  buttonColor: PropTypes.shape({
    backColor: PropTypes.string,
    fontColor: PropTypes.string,
    buttonBorder: PropTypes.string,
  }),
};

export default function StartedPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  sessionStorage.removeItem('priceId');
  const colors = { backColor: '#1FA9FF', fontColor: '#FFFFFF', buttonBorder: '#1288E3' };
  const { subscriptions } = useSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(getSubscriptions());
  }, [dispatch]);

  const onSubscriptionClick = (id) => {
    navigate(PATH_PAGE.trialpayment);
  };

  return (
    <>
      <Helmet>
        <title> Get Started | RealityFence</title>
      </Helmet>
      <Container
        component={MotionViewport}
        id="pricing-home"
        maxWidth="xl"
        sx={{
          pt: { xs: 3, sm: 4, md: 7 },
          pb: { xs: 5, md: 10 },
          px: { lg: 10, md: 8, xs: 2 },
        }}
      >
        <>
          <Box
            sx={{
              mb: 7,
              textAlign: 'center',
            }}
          >
            <m.div variants={varFade().inDown}>
              <Typography
                sx={{
                  fontSize: { lg: '60px', md: '48px', sm: '36px', xs: '32px' },
                  fontWeight: '800',
                }}
              >
                Get Started
              </Typography>
              <Typography sx={{ fontSize: { sm: '22px', xs: '18px' }, fontWeight: '800' }}>
                No credit card. No commitment.
              </Typography>
            </m.div>
          </Box>

          <Grid
            container
            gap={3}
            sx={{ justifyContent: 'center', alignItems: 'center' }}
            gridTemplateColumns="repeat(2, 1fr)"
          >
            {subscriptions &&
              subscriptions.length > 0 &&
              subscriptions.map(
                (price, index) =>
                  price.name.indexOf('Trial') > -1 && (
                    <Grid item key={index}>
                      <PlanCard
                        key={index}
                        plan={price}
                        buttonColor={colors}
                        onSubscriptionClick={onSubscriptionClick}
                      />
                    </Grid>
                  )
              )}
            <Grid item>
              <ContactSales />
            </Grid>
          </Grid>

          <Stack sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: { md: '56%', xs: '100%' },
                alignSelf: 'center',
                // borderRadius: '38px',
                // boxShadow: `0px 4px 3px rgba(0, 0, 0, 0.3)`,
                px: { md: 8, xs: 1 },
              }}
            >
              <Typography sx={{ fontSize: '24px', fontWeight: '800', pt: 6, textAlign: 'center' }}>
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
              </Stack>
            </Box>
          </Stack>
        </>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

export function PlanCard({ plan, buttonColor, onSubscriptionClick }) {
  if (!plan) return null;
  const { name, totalFences, totalUsers, requestAvailable } = plan;
  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onSubscriptionClick();
  };

  return (
    <Card
      sx={{
        px: { md: 5, xs: 3 },
        pt: { md: 4, xs: 3 },
        pb: { md: 5, xs: 3 },
        boxShadow: `0px 8px 12px rgba(0, 0, 0, 0.3)`,
        height: '100%',
        minWidth: '350px',
        alignSelf: 'flex-start',
      }}
    >
      <Stack spacing={3}>
        <Stack direction={{ sm: 'row', sx: 'column' }} justifyContent="center" alignItems="center">
          <Stack>
            <Typography
              component="div"
              sx={{
                marginTop: '20px',
                fontSize: { xs: '28px', lg: '32px' },
                fontWeight: '900',
                fontFamily: 'Poppins',
                textAlign: 'center',
              }}
            >
              {name}
            </Typography>

            <Typography fontSize="18px" fontWeight="700" textAlign="center">
              Free For 7 Day
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
              {totalFences} Fences
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="16px" fontWeight="700">
              {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`}
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
            Start Free Trial
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

// ------------------------------------------------------------------------

export function ContactSales() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(PATH_PAGE.meeting);
  };
  return (
    <Card
      sx={{
        px: { md: 5, xs: 3 },
        pt: { md: 4, xs: 3 },
        pb: { md: 5, xs: 3 },
        boxShadow: `0px 8px 12px rgba(0, 0, 0, 0.3)`,
        minWidth: '350px',
      }}
    >
      <Stack spacing={3}>
        <Typography
          component="div"
          sx={{
            fontSize: { xs: '28px', lg: '32px' },
            textAlign: 'center',
            fontWeight: '900',
            fontFamily: 'Poppins',
          }}
        >
          Already have <br />
          an account?
        </Typography>
        <img src={contactsalesimg} alt="contact" style={{ height: '218px', alignSelf: 'center' }} />
        <Button
          size="large"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleClick}
          style={{
            marginTop: '40px',
            backgroundColor: '#1FA9FF',
            color: '#FFFFFF',
            border: `#1288E3 1px solid`,
          }}
        >
          Contact Sales
        </Button>
      </Stack>
    </Card>
  );
}

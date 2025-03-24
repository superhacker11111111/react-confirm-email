// This is PricingHome in v 1.3
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';

// @mui
import { Box, Container, Typography } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
//
import { useDispatch, useSelector } from '../../redux/store';
import { getSubscriptions } from '../../redux/slices/subscription';
// utils
import { PATH_PAGE } from '../../routes/paths';
//
import NewPlanCard from './NewPlanCard';

// ----------------------------------------------------------------------

export default function PricingHome2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptions } = useSelector((state) => state.subscription);

  const colors = { backColor: '#1FA9FF', fontColor: '#FFFFFF', buttonBorder: '#1FA9FF' };

  useEffect(() => {
    dispatch(getSubscriptions());
  }, [dispatch]);

  const onSubscriptionClick = (id) => {
    sessionStorage.setItem('priceId', id);
    navigate(PATH_PAGE.checkout_v2);
  };

  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>

      <Box sx={{ backgroundColor: '#1FA9FF' }}>
        <Container
          maxWidth="xl"
          component={MotionViewport}
          id="pricing-home"
          sx={{
            pt: { xs: 4, md: 8 },
            pb: { xs: 5, md: 10 },
            px: { lg: 12, md: 8, sm: 3, xs: 2 },
          }}
        >
          <m.div variants={varFade().inUp}>
            <Box
              sx={{
                mb: 5,
                textAlign: 'center',
              }}
            >
              <m.div variants={varFade().inDown}>
                <Typography
                  sx={{
                    color: '#ffffff',
                    fontSize: { lg: '60px', md: '48px', sm: '36px', xs: '32px' },
                    fontWeight: 900,
                  }}
                >
                  Our Subscriptions
                </Typography>
                <Typography
                  sx={{
                    color: '#ffffff',
                    fontSize: { sm: '22px', xs: '18px' },
                    fontWeight: 300,
                  }}
                >
                  Scalable options as your business grows
                </Typography>
              </m.div>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
              }}
            >
              {subscriptions &&
                subscriptions.length > 0 &&
                subscriptions.map(
                  (price, index) =>
                    price.name.indexOf('Trial') < 0 && (
                      <NewPlanCard
                        key={index}
                        plan={price}
                        buttonColor={colors}
                        onSubscriptionClick={onSubscriptionClick}
                      />
                    )
                )}
            </Box>
            <Typography
              sx={{
                mt: 5,
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 300,
                textAlign: 'center',
              }}
            >
              *Please note that any custom fence requests beyond our standard inventory is subject
              to additional charges
            </Typography>
          </m.div>
        </Container>
      </Box>
    </>
  );
}

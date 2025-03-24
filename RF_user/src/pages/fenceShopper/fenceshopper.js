import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Box, Typography, useMediaQuery, Stack } from '@mui/material';
// sections
import { Shopper } from '../../sections/shopper';

// ----------------------------------------------------------------------

export default function ContactPage() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>

      <Box sx={{ textAlign: 'center', mt: { md: 6, sm: 3, xs: 1 }, borderRadius: 3 }}>
        <Container>
          <Typography
            sx={{ fontSize: { lg: '48px', md: '40px', sm: '32px', xs: '24px' }, fontWeight: '800' }}
          >
            RealityFence Shopper
          </Typography>
          {!isMobile ? (
            <Typography
              sx={{
                fontSize: { lg: '20px', md: '16px', sm: '16px', xs: '13px', color: '#637381' },
              }}
            >
              In the market to buy a fence? We want to help. Unleash the
              <br />
              full potential of RealityFence, available for free for 7 days.
            </Typography>
          ) : (
            <Stack sx={{ px: { xs: 2.5, sm: 5 } }}>
              <Typography
                sx={{
                  fontSize: { lg: '20px', md: '16px', sm: '16px', xs: '13px', color: '#637381' },
                }}
              >
                In the market to buy a fence? We want to help.
                <br />
                Unleash the full potential of RealityFence,
                <br />
                available for free for 7 days.
              </Typography>
            </Stack>
          )}
        </Container>
      </Box>

      <Container sx={{ mt: { md: 2, xs: 0 } }}>
        <Box sx={{ px: { lg: 15, xs: 1 } }}>
          <Shopper />
        </Box>
      </Container>
    </>
  );
}

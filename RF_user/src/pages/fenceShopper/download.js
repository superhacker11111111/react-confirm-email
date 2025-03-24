import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Box, Typography } from '@mui/material';
// sections
import { ScanQR } from '../../sections/shopper';

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title> Download | RealityFence</title>
      </Helmet>

      <Box sx={{ textAlign: 'start', mt: 10, borderRadius: 3 }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: { lg: '48px', xs: '42px' }, fontWeight: 800 }}>
            Download RealityFence!
          </Typography>
          <Typography sx={{ fontSize: '16px', px: 34 }}>
            Welcome to RealityFence! We&apos;re thrilled to partner with you over the next 7 days to
            discover your perfect fence. Let the adventure begin!
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mt: 5, mb: 20 }}>
        <Box sx={{ px: { lg: 33 } }} borderRadius="5">
          <ScanQR />
        </Box>
      </Container>
    </>
  );
}

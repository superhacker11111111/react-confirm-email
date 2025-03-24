import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Box, Typography } from '@mui/material';
// sections
import { ContactCard } from '../sections/contact';

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title> RealityFence | Contact us</title>
      </Helmet>

      <Box sx={{ textAlign: 'center', mt: { md: 6, sm: 4, xs: 1 } }}>
        <Container>
          <Typography sx={{ fontSize: { lg: '48px', md: '36px', xs: '24px' }, fontWeight: '800' }}>
            Contact Us
          </Typography>
          <Typography
            sx={{ fontSize: { lg: '20px', md: '16px', xs: '12px' }, pb: { md: 2, xs: 0 } }}
          >
            What can we help you with?
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mt: { md: 2, xs: 0 } }}>
        <Box sx={{ px: { lg: 15, xs: 1 } }}>
          <ContactCard />
        </Box>
      </Container>
    </>
  );
}

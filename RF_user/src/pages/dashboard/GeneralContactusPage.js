import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Box, Typography } from '@mui/material';
// sections
import { ContactCard } from '../../sections/contact';

export default function GeneralContactusPage() {
  return (
    <>
      <Helmet>
        <title> RealityFence | Contact us </title>
      </Helmet>

      <Box>
        <Container sx={{ px: { lg: 8 } }}>
          <Typography
            sx={{
              fontSize: { lg: '32px', md: '28px', xs: '24px' },
              fontWeight: '700',
            }}
          >
            Contact Us
          </Typography>
          <Typography sx={{ fontSize: '20px', pb: 2 }}> What can we help you with? </Typography>
        </Container>
        <Container sx={{ mt: 2, mb: 20 }}>
          <Box sx={{ px: { lg: 6 } }}>
            <ContactCard />
          </Box>
        </Container>
      </Box>
    </>
  );
}

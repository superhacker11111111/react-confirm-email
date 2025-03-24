import { Helmet } from 'react-helmet-async';
import { Typography, Container, Stack, Button, Grid, useMediaQuery } from '@mui/material';
import { PATH_PAGE } from '../routes/paths';
import SellFenceImage from '../assets/illustrations/SellFenceImage.png';
import BuyFenceImage from '../assets/illustrations/BuyFenceImage.png';

export default function CreateAccount() {
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <>
      <Helmet>
        <title> Create account | RealityFence</title>
      </Helmet>

      <Stack
        sx={{
          textAlign: 'center',
          marginBottom: '60px',
          pt: { lg: 5, xs: 0 },
          pb: { lg: '190px' },
        }}
      >
        <Container
          sx={{ pl: { lg: 28, md: 20, sm: 8, xs: 3 }, pr: { lg: 18, md: 20, sm: 8, xs: 3 } }}
        >
          <Typography
            sx={{
              fontSize: { lg: '42px', md: '32px', sm: '28px', xs: '24px' },
              fontWeight: '800',
              pb: 5,
            }}
          >
            Create An Account
          </Typography>
          {!isMobile ? (
            <Grid
              container
              justifyContent="space-between"
              sx={{ mb: 8 }}
              flexDirection={{ xs: 'row-reverse', sm: 'row' }}
            >
              <Grid item xs={5.3} sx={{ alignSelf: 'center' }} textAlign="-webkit-center">
                <img
                  src={SellFenceImage}
                  alt="Sell Fences"
                  style={{ display: 'flex', paddingBottom: '24px' }}
                />
              </Grid>
              <Grid
                item
                xs={6.2}
                sx={{
                  borderRadius: '38px',
                  alignItems: 'start',
                  textAlign: 'start',
                  justifyContent: 'space-between',
                  pl: { lg: 7, md: 3, xs: 1 },
                  pr: 1,
                  pb: { lg: 3 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { lg: '42px', md: '36px', sm: '28px', xs: '24px' },
                    fontWeight: '900',
                    mb: { md: 2 },
                    color: 'black',
                    fontFamily: 'Poppins',
                  }}
                >
                  Sell fences?
                </Typography>
                <Typography
                  sx={{ fontSize: { lg: '26px', md: '22px', sm: '19px', xs: '14px' }, mb: 2 }}
                >
                  Transform your customer&apos;s space with the perfect fence. RealityFence allows
                  you to showcase your entire catalog, on site, all in real time.
                </Typography>
                <Button
                  variant="contained"
                  color="inherit"
                  size="large"
                  style={{ backgroundColor: '#1FA9FF' }}
                  sx={{
                    padding: '12px 20px',
                    width: { lg: '220px', md: '180px', sm: '142px', xs: '130px' },
                  }}
                  href={PATH_PAGE.subscription}
                >
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontSize: { lg: '20px', md: '18px', sm: '15px', xs: '12px' },
                      lineHeight: 1,
                      my: { md: 1.25, sm: 1, xs: 0.7 },
                      mx: 1,
                    }}
                  >
                    Get Started
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Stack sx={{ mb: 8 }}>
              <Grid
                container
                justifyContent="space-between"
                flexDirection={{ xs: 'row-reverse', sm: 'row' }}
              >
                <Grid item xs={5.3} sx={{ alignSelf: 'center' }} textAlign="-webkit-center">
                  <img
                    src={SellFenceImage}
                    alt="Sell Fences"
                    style={{ display: 'flex', paddingBottom: '24px' }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6.2}
                  sx={{
                    borderRadius: '38px',
                    alignItems: 'start',
                    textAlign: 'start',
                    justifyContent: 'space-between',
                    pl: { lg: 7, md: 3, xs: 1 },
                    pr: 1,
                    pb: { lg: 3 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { lg: '42px', md: '36px', sm: '30px', xs: '24px' },
                      fontWeight: '900',
                      mb: { md: 2 },
                      color: 'black',
                      fontFamily: 'Poppins',
                    }}
                  >
                    Sell fences?
                  </Typography>
                  <Typography
                    sx={{ fontSize: { lg: '26px', md: '22px', sm: '19px', xs: '14px' }, mb: 2 }}
                  >
                    Transform your customer&apos;s space with the perfect fence. RealityFence allows
                    you to showcase your entire catalog, on site, all in real time.
                  </Typography>
                </Grid>
              </Grid>
              <Stack sx={{ alignItems: 'center' }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="large"
                  style={{ backgroundColor: '#1FA9FF' }}
                  sx={{
                    padding: '12px 20px',
                    width: { lg: '220px', md: '180px', sm: '142px', xs: '130px' },
                  }}
                  href={PATH_PAGE.subscription}
                >
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontSize: { lg: '20px', md: '18px', sm: '15px', xs: '12px' },
                      lineHeight: 1,
                      my: { sm: 1, xs: 0.7 },
                      mx: 1,
                    }}
                  >
                    Get Started
                  </Typography>
                </Button>
              </Stack>
            </Stack>
          )}

          {!isMobile ? (
            <Grid container justifyContent="space-between">
              <Grid
                item
                xs={6.2}
                sx={{
                  borderRadius: '38px',
                  alignItems: 'start',
                  textAlign: 'start',
                  justifyContent: 'space-between',
                  pr: { lg: '30px', md: 3, xs: 1 },
                  pl: { lg: '30px', xs: 1 },
                  pb: { lg: 3 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { lg: '42px', md: '36px', sm: '30px', xs: '24px' },
                    fontWeight: '900',
                    mb: { md: 2 },
                    color: 'black',
                    fontFamily: 'Poppins',
                    marginRight: { xs: '-48px' },
                  }}
                >
                  Buying a fence?
                </Typography>
                <Typography
                  sx={{ fontSize: { lg: '26px', md: '22px', sm: '19px', xs: '14px' }, mb: 2 }}
                >
                  See your dream fence come to life on your property with RealityFence. Virtually
                  try various styles and materials to make your decision easier.
                </Typography>
                <Button
                  variant="contained"
                  color="inherit"
                  size="large"
                  style={{ backgroundColor: '#1FA9FF' }}
                  sx={{
                    padding: '12px 30px',
                    width: { lg: '220px', md: '180px', sm: '142px', xs: '130px' },
                  }}
                  href={PATH_PAGE.shopper}
                >
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontSize: { lg: '20px', md: '18px', sm: '15px', xs: '12px' },
                      lineHeight: 1,
                      textAlign: 'center',
                    }}
                  >
                    RealityFence Shopper
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={5.3} sx={{ alignSelf: 'center' }} textAlign="-webkit-center">
                <img
                  src={BuyFenceImage}
                  alt="Sell Fences"
                  style={{ display: 'flex', marginTop: { lg: '-52px' } }}
                />
              </Grid>
            </Grid>
          ) : (
            <Stack>
              <Grid container justifyContent="space-between">
                <Grid
                  item
                  xs={6.2}
                  sx={{
                    borderRadius: '38px',
                    alignItems: 'start',
                    textAlign: 'start',
                    justifyContent: 'space-between',
                    pr: { lg: '30px', md: 3, xs: 1 },
                    pl: { lg: '30px', xs: 1 },
                    pb: { lg: 3 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { lg: '42px', md: '36px', sm: '28px', xs: '24px' },
                      fontWeight: '900',
                      mb: { md: 2 },
                      color: 'black',
                      fontFamily: 'Poppins',
                      marginRight: { xs: '-48px' },
                    }}
                  >
                    Buying a fence?
                  </Typography>
                  <Typography
                    sx={{ fontSize: { lg: '26px', md: '22px', sm: '19px', xs: '14px' }, mb: 2 }}
                  >
                    See your dream fence come to life on your property with RealityFence. Virtually
                    try various styles and materials to make your decision easier.
                  </Typography>
                </Grid>
                <Grid item xs={5.3} sx={{ alignSelf: 'center' }} textAlign="-webkit-center">
                  <img
                    src={BuyFenceImage}
                    alt="Sell Fences"
                    style={{ display: 'flex', marginTop: { lg: '-52px' } }}
                  />
                </Grid>
              </Grid>
              <Stack sx={{ alignItems: 'center' }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="large"
                  style={{ backgroundColor: '#1FA9FF' }}
                  sx={{
                    padding: '12px 30px',
                    width: { lg: '220px', md: '180px', sm: '142px', xs: '130px' },
                  }}
                  href={PATH_PAGE.subscription}
                >
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontSize: { lg: '20px', md: '18px', sm: '15px', xs: '12px' },
                      lineHeight: 1,
                      textAlign: 'center',
                    }}
                  >
                    RealityFence Shopper
                  </Typography>
                </Button>
              </Stack>
            </Stack>
          )}
        </Container>
      </Stack>
    </>
  );
}

import { useNavigate } from 'react-router';
import { Typography, Container, Button, Stack, Grid } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
import { PATH_PAGE } from '../../routes/paths';
import SellFenceImage from '../../assets/illustrations/SellFenceImage.png';
import BuyFenceImage from '../../assets/illustrations/BuyFenceImage.png';

export default function PlanMore() {
  const navigate = useNavigate();

  const handleTrial = () => {
    navigate(PATH_PAGE.trialpayment);
  };

  return (
    <Stack
      sx={{
        textAlign: 'center',
        marginBottom: '60px',
        pt: { lg: 5, xs: 0 },
        pb: { lg: '80px', md: '60px' },
      }}
    >
      <Container component={MotionViewport} sx={{ px: { lg: 28, md: 20, sm: 8, xs: 3 } }}>
        <Grid
          container
          justifyContent="space-between"
          sx={{ mb: 8 }}
          flexDirection={{ xs: 'row-reverse', sm: 'row' }}
        >
          <Grid item xs={5} sx={{ alignSelf: 'center' }} textAlign="-webkit-center">
            <img
              src={SellFenceImage}
              alt="Sell Fences"
              style={{ display: 'flex', paddingBottom: '24px' }}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: '38px',
              alignItems: 'start',
              textAlign: 'start',
              justifyContent: 'space-between',
              pl: { md: 3, xs: 1 },
              pr: 1,
              pb: { lg: 3 },
            }}
          >
            <Typography
              sx={{
                fontSize: { lg: '40px', md: '36px', sm: '28px', xs: '24px' },
                fontWeight: '900',
                mb: { md: 2 },
                color: 'black',
                fontFamily: 'Poppins',
                marginRight: { xs: '-50px' },
              }}
            >
              Sell Fences?
            </Typography>
            <Typography
              sx={{ fontSize: { lg: '24px', md: '22px', sm: '19px', xs: '14px' }, mb: 2 }}
            >
              Transform your customer&apos;s space with the perfect fence. RealityFence allows you
              to showcase your entire catalog, on site, all in real time.
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
              onClick={handleTrial}
            >
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontSize: { lg: '20px', md: '18px', sm: '15px', xs: '12px' },
                  lineHeight: 1,
                  my: { md: 1.25, sm: 1, xs: 0.7 },
                }}
              >
                Start Free Trial
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: '38px',
              alignItems: 'start',
              textAlign: 'start',
              justifyContent: 'space-between',
              pl: { md: 3, xs: 1 },
              pr: 1,
              pb: { lg: 3 },
            }}
          >
            <Typography
              sx={{
                fontSize: { lg: '40px', md: '36px', sm: '28px', xs: '24px' },
                fontWeight: '900',
                mb: { md: 2 },
                color: 'black',
                fontFamily: 'Poppins',
                marginRight: { xs: '-50px' },
              }}
            >
              Buying a fence?
            </Typography>
            <Typography
              sx={{ fontSize: { lg: '24px', md: '22px', sm: '19px', xs: '14px' }, mb: 2 }}
            >
              See your dream fence come to life on your property with RealityFence. Virtually try
              various styles and materials to make your decision easier.
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
          <Grid item xs={5} sx={{ alignSelf: 'center' }} textAlign="-webkit-center">
            <img
              src={BuyFenceImage}
              alt="Sell Fences"
              style={{ display: 'flex', marginTop: { lg: '-52px' } }}
            />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}

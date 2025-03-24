// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Container,
  Typography,
  Button,
  Fab,
  Unstable_Grid2 as Grid,
} from '@mui/material';
// utils
import { bgGradient } from '../../utils/cssStyles';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import landerImage from '../../assets/illustrations/landeripad.png';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, 0.9),
    imgUrl: '/assets/background/overlay_1.jpg',
  }),
  overflow: 'hidden',
}));

// ----------------------------------------------------------------------

export default function MarketingLandingHero() {
  const isMdUp = useResponsive('up', 'md');

  return (
    <StyledRoot>
      <Container
        sx={{
          py: 15,
          display: { md: 'flex' },
          alignItems: { md: 'center' },
          height: { md: `100vh` },
        }}
      >
        <Grid container columnSpacing={{ xs: 0, md: 10 }}>
          <Grid
            xs={12}
            md={8}
            lg={8}
            sx={{
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography variant="h1" sx={{ my: 3 }} style={{ display: 'inline-block' }}>
              See the
            </Typography>
            &nbsp;&nbsp;
            <Typography
              variant="h1"
              sx={{ my: 3 }}
              style={{ color: '#1288E3', display: 'inline-block', textIndent: '6px' }}
            >
              Dream
            </Typography>
            <Typography variant="h1">with RealityFence</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Whether you are looking to buy a fence, or a seasoned proffesional looking to engage
              with cutomers, this is for you.
            </Typography>
            <Stack
              spacing={3}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'center', md: 'unset' }}
              justifyContent={{ xs: 'center', md: 'unset' }}
              sx={{ mt: 5 }}
            >
              <Button
                variant="contained"
                color="inherit"
                size="large"
                style={{ backgroundColor: '#212B36' }}
              >
                <Typography sx={{ color: '#FFFFFF' }}>Ready Start</Typography>
              </Button>

              <Stack direction="row" alignItems="center" sx={{ typography: 'h6' }}>
                <Fab
                  size="medium"
                  sx={{ mr: 1, backgroundColor: '#00B8D9' }}
                  style={{ backgroundColor: '#00B8D9' }}
                >
                  <Iconify
                    width={24}
                    icon="carbon:play"
                    style={{ color: 'white', backgroundColor: '#00B8D9' }}
                  />
                </Fab>
                Watch Video
              </Stack>
            </Stack>
            <Box sx={{ my: 5 }}>
              {' '}
              <hr style={{ borderTop: '1px dotted #ccc' }} />
            </Box>
            <Typography
              sx={{ my: 1 }}
              style={{ fontSize: '40px', fontWeight: 'bold', display: 'inline-block' }}
            >
              The ultimate
            </Typography>
            &nbsp;&nbsp;
            <Typography
              style={{
                fontSize: '40px',
                color: '#1288E3',
                display: 'inline-block',
                fontWeight: 'bold',
                textIndent: '6px',
              }}
            >
              visualization
            </Typography>
            <Typography
              style={{
                fontSize: '40px',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                display: 'inline-block',
              }}
            >
              and connection tool.
            </Typography>
          </Grid>

          {isMdUp && (
            <Grid xs={12} md={4} lg={4} style={{ justifyContent: 'flex-end', display: 'flex' }}>
              <img src={landerImage} alt="marketing market" />
            </Grid>
          )}
        </Grid>
      </Container>
    </StyledRoot>
  );
}

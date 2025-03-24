import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { YouTubeLite } from 'react-youtube-lite';
// @mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Container,
  Typography,
  Button,
  Fab,
  Unstable_Grid2 as Grid,
  Dialog,
  IconButton,
  useMediaQuery,
} from '@mui/material';
// utils
import { bgGradient } from '../../utils/cssStyles';
// hooks
// components
import landerImage1 from '../../assets/illustrations/HomePageImage1.png';
import landerImage2 from '../../assets/illustrations/HomePageImage2.png';
import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';
import { PATH_PAGE } from '../../routes/paths';
import { getVideos } from '../../redux/slices/media';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    // color: alpha(theme.palette.background.default, 0.9),
    imgUrl: '/assets/background/overlay_1.jpg',
  }),
  overflow: 'hidden',
}));

// ----------------------------------------------------------------------

export default function MarketingLandingHero() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { video } = useSelector((state) => state.media);
  const videoUrl = video && video.marketingURL;
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  return (
    <StyledRoot>
      <Container
        component={MotionViewport}
        sx={{
          pt: { xs: 3, sm: 5 },
          height: { md: 'auto' },
        }}
      >
        <Stack
          sx={{
            mt: { xs: 3, sm: 6 },
          }}
        >
          <Stack sx={{ textAlign: 'center', mt: 8 }}>
            <Typography
              sx={{
                fontSize: { lg: '74px', md: '64px', sm: '50px', xs: '40px' },
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              On the Spot
            </Typography>
            <Typography
              sx={{
                fontSize: { lg: '64px', md: '56px', sm: '42px', xs: '36px' },
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              Fence Sales
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: { lg: '28px', md: '24', sm: '22px', xs: '20px' },
              color: '#637381',
              mx: { xs: 4, sm: 10, lg: 37 },
              textAlign: 'center',
              mt: { xs: 3 },
            }}
          >
            Visualize finished fence products anytime, anywhere, using Augmented Reality (AR) for
            streamlined sales cycles
          </Typography>
          <Stack
            spacing={{ md: 3, sm: 2, xs: 1 }}
            direction={{ xs: 'column-reverse', sm: 'row' }}
            sx={{ my: { xs: 4, md: 5 }, mx: { xs: 10, lg: 17.5 }, justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              color="inherit"
              size="medium"
              style={{ backgroundColor: '#1FA9FF' }}
              href={PATH_PAGE.subscription}
            >
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '12px', lg: '14px' },
                  mx: 1,
                  lineHeight: 2,
                }}
              >
                Get Started
              </Typography>
            </Button>
            {!isMobile ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ typography: 'h6', color: '#000000' }}
              >
                <Fab
                  size="medium"
                  sx={{ mr: 1, backgroundColor: '#1FA9FF' }}
                  style={{ backgroundColor: '#1FA9FF' }}
                  onClick={handleClickOpen}
                >
                  <Iconify
                    width={24}
                    icon="carbon:play"
                    style={{ color: '#ffffff', backgroundColor: '#1FA9FF' }}
                  />
                </Fab>
                Watch Video
              </Stack>
            ) : (
              <Button
                variant="contained"
                color="inherit"
                size="medium"
                style={{ backgroundColor: '#1FA9FF' }}
                onClick={handleClickOpen}
              >
                <Typography sx={{ color: '#FFFFFF', fontSize: '12px', mx: 1, lineHeight: 2 }}>
                  Watch Video
                </Typography>
              </Button>
            )}

            <Dialog open={open} maxWidth="lg" fullWidth>
              <Stack sx={{ px: { lg: 4, xs: 1, md: 2 }, pt: 2, pb: 4 }}>
                <Grid item sx={{ alignSelf: { xs: 'end', md: 'end' } }}>
                  <IconButton color="inherit" edge="start" onClick={handleClose}>
                    <Iconify icon="carbon:close-filled" style={{ color: '1FA9FF' }} />
                  </IconButton>
                </Grid>
                <YouTubeLite url={videoUrl} style={{ width: '100%', height: '100%' }} />
              </Stack>
            </Dialog>
          </Stack>
        </Stack>
        <Stack sx={{ justifyContent: 'center', display: 'flex', mt: { sm: 2, xs: 0 } }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={landerImage1}
              alt="marketing market"
              style={{ zIndex: 100, maxWidth: '85%' }}
            />
          </div>
        </Stack>
      </Container>
      <Stack
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: { md: '-170px', xs: '-24px' },
        }}
      >
        <img src={landerImage2} alt="marketing market2" style={{ width: '100vw' }} />
      </Stack>
    </StyledRoot>
  );
}

/* eslint-disable no-nested-ternary */
import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { YouTubeLite } from 'react-youtube-lite';
// @mui
import {
  Stack,
  Container,
  Typography,
  Button,
  Fab,
  Grid,
  Dialog,
  IconButton,
  useMediaQuery,
} from '@mui/material';
// utils
// hooks
// components
import fenceHero from '../../assets/illustrations/fence_hero.gif';
import fenceHero2 from '../../assets/illustrations/fencehero2.png';
import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';
import { PATH_PAGE } from '../../routes/paths';
import { getVideos } from '../../redux/slices/media';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function MarketingLandingHero() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { video } = useSelector((state) => state.media);
  const videoUrl = video && video.marketingURL;
  const isMobile = useMediaQuery('(max-width:599px)');
  const isPhone1 = useMediaQuery('(max-width:1000px)');
  const isPhone2 = useMediaQuery('(max-width:750px)');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTrial = () => {
    navigate(PATH_PAGE.trialpayment);
  };

  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  return (
    <Container
      component={MotionViewport}
      sx={{
        pt: { xs: 8, sm: 10 },
        pb: { xs: 3, sm: 5 },
        pl: { xs: 3, sm: 8, md: 19.5, lg: 23 },
        pr: { xs: 3, sm: 15, md: 23.5, lg: 28 },
        height: { md: 'auto' },
      }}
    >
      <Grid container justifyContent={{ xs: 'center', sm: 'space-between' }}>
        <Grid
          item
          xs={12}
          sm={7}
          md={7}
          flexDirection="column"
          justifyContent="center"
          sx={{
            mt: { xs: 3, sm: 4, md: 6 },
            mx: { xs: 1, sm: 0 },
            alignItems: 'flex-start',
          }}
        >
          {!isPhone1 ? (
            <Stack sx={{ mt: { lg: 14, md: 12, sm: 9, xs: 6 } }}>
              <Typography
                sx={{
                  fontSize: { lg: '46px', md: '38px' },
                  textAlign: { xs: 'center', sm: 'left' }, // Centered on xs screens, left-aligned on sm and larger
                  fontWeight: 900,
                  lineHeight: 1.2,
                  fontFamily: 'Poppins',
                }}
              >
                Experience fences <br /> before they&apos;re built
              </Typography>
              <Typography
                sx={{
                  fontSize: { lg: '25px', md: '21px' },
                  fontFamily: 'Public Sans',
                  textAlign: { xs: 'center', sm: 'left' }, // Centered on xs screens, left-aligned on sm and larger
                  color: '#637381',
                  my: { lg: '20px', xs: '10px' },
                }}
              >
                Demonstrate your entire fence catalog using Augmented Reality (AR)
              </Typography>
            </Stack>
          ) : !isPhone2 ? (
            <Stack sx={{ mt: { md: 12, sm: 9, xs: 6 } }}>
              <Typography
                sx={{
                  fontSize: { lg: '46px', md: '31px', sm: '32px', xs: '30px' },
                  textAlign: { xs: 'center', sm: 'left' }, // Centered on xs screens, left-aligned on sm and larger
                  fontWeight: 900,
                  lineHeight: 1.2,
                  fontFamily: 'Poppins',
                }}
              >
                Experience fences <br /> before they&apos;re built
              </Typography>
              <Typography
                sx={{
                  fontSize: { lg: '26px', md: '17px', sm: '18px', xs: '16px' },
                  fontFamily: 'Public Sans',
                  textAlign: { xs: 'center', sm: 'left' }, // Centered on xs screens, left-aligned on sm and larger
                  color: '#637381',
                  my: { lg: '20px', xs: '10px' },
                }}
              >
                Demonstrate your entire fence catalog using Augmented Reality (AR)
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ mt: { sm: 9, xs: 6 } }}>
              <Typography
                sx={{
                  fontSize: { sm: '24px', xs: '30px' },
                  textAlign: { xs: 'center', sm: 'left' }, // Centered on xs screens, left-aligned on sm and larger
                  fontWeight: 900,
                  lineHeight: 1.2,
                  fontFamily: 'Poppins',
                }}
              >
                Experience fences <br /> before they&apos;re built
              </Typography>
              <Typography
                sx={{
                  fontSize: { sm: '13px', xs: '16px' },
                  fontFamily: 'Public Sans',
                  textAlign: { xs: 'center', sm: 'left' }, // Centered on xs screens, left-aligned on sm and larger
                  color: '#637381',
                  my: { lg: '20px', xs: '10px' },
                }}
              >
                Demonstrate your entire fence catalog using Augmented Reality (AR)
              </Typography>
            </Stack>
          )}

          <Stack
            spacing={{ md: 4, xs: 2 }}
            direction={{ xs: 'column-reverse', sm: 'row' }}
            sx={{ mt: { md: '32px', sm: '12px', xs: '4px' }, mb: { lg: '16px', sm: 0 } }}
          >
            {!isMobile ? (
              <div className="w-full flex">
                <Button
                  variant="contained"
                  color="inherit"
                  style={{ backgroundColor: '#1FA9FF' }}
                  onClick={handleTrial}
                >
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontSize: { xs: '15px', sm: '13px', md: '16px', lg: '18px' },
                      fontWeight: 700,
                      mx: { lg: 1, xs: 0 },
                      lineHeight: 1,
                    }}
                  >
                    Start Free Trial
                  </Typography>
                </Button>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ typography: 'h6', color: '#000000', mx: { md: '30px', sm: '12px' } }}
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
                  <Typography
                    sx={{
                      fontSize: { xs: '15px', sm: '14px', md: '16px', lg: '18px' },
                      fontWeight: 700,
                    }}
                  >
                    Watch Video
                  </Typography>
                </Stack>
              </div>
            ) : (
              <Stack flexDirection="column" gap={2} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  fullWidth
                  style={{ backgroundColor: '#1FA9FF', width: '220px' }}
                  onClick={handleTrial}
                >
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontSize: { xs: '15px', sm: '14px', md: '16px', lg: '18px' },
                      mx: { lg: 1, xs: 0 },
                      lineHeight: 2,
                    }}
                  >
                    Start Free Trial
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  style={{ backgroundColor: '#1FA9FF', width: '220px' }}
                  onClick={handleClickOpen}
                >
                  <Typography sx={{ color: '#FFFFFF', fontSize: '15px', mx: 1, lineHeight: 2 }}>
                    Watch Video
                  </Typography>
                </Button>
              </Stack>
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
        </Grid>
        <Grid
          item
          xs={7}
          sm={4}
          md={4}
          sx={{
            mt: { xs: 3, sm: 10, md: 15 },
            mr: { xs: 7, sm: 0 },
            position: 'relative',
            justifyContent: 'center',
          }}
        >
          <img
            src={fenceHero}
            alt="marketing market"
            style={{
              zIndex: 1,
            }}
          />
          <img
            src={fenceHero2}
            alt="marketing market"
            style={{
              zIndex: 2,
              position: 'absolute',
              bottom: -10,
              right: -56,
              width: '55%',
              height: '68%',
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

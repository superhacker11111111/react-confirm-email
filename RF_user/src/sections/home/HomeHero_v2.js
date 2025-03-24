/* eslint-disable no-nested-ternary */
import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
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
import fenceHero from '../../assets/illustrations/v2/HomeHero.gif';

import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';

import { getVideos } from '../../redux/slices/media';
import { PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function MarketingLandingHero() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');

  const { video } = useSelector((state) => state.media);
  const videoUrl = video && video.marketingURL;

  const [videoOpen, setVideoOpen] = useState(false);

  const handleVideoClickOpen = () => {
    setVideoOpen(true);
  };

  const handleVideoClose = () => {
    setVideoOpen(false);
  };

  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  return (
    <Container
      component={MotionViewport}
      sx={{
        pt: { xs: 10, md: 16 },
        height: { md: 'auto' },
        justifyContent: 'center',
        alignItems: 'center',
        mb: 10,
      }}
      maxWidth="lg"
    >
      <m.div variants={varFade().inUp}>
        <Stack
          sx={{ mt: { sm: 9, xs: 6 } }}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            sx={{
              fontSize: { xs: '48px', md: '64px', lg: '88px' },
              textAlign: 'center', // Centered on xs screens, left-aligned on sm and larger
              fontWeight: 600,
              lineHeight: { xs: '55px', sm: 1.2 },
              fontFamily: 'Poppins',
            }}
          >
            {!isMobile ? (
              <>
                {' '}
                Experience fences
                <br /> before they&apos;re built
              </>
            ) : (
              <>
                Experience
                <br /> fences before
                <br /> they&apos;re built
              </>
            )}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: '24px', sm: '23px', md: '32px', lg: '42px' },
              fontFamily: 'Public Sans',
              textAlign: 'center', // Centered on xs screens, left-aligned on sm and larger
              my: { xs: '24px', sm: '40px' },
              lineHeight: { xs: '30px', sm: 1.2 },
            }}
          >
            {!isMobile ? (
              <>
                Demonstrate your entire fence catalog
                <br /> using Augmented Reality (AR)
              </>
            ) : (
              <>
                Demonstrate your entire
                <br /> fence catalog using
                <br /> Augmented Reality (AR)
              </>
            )}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#1FA9FF !important',
              width: 'fit-content',
              minWidth: 150,
              minHeight: 50,
              px: 10,
            }}
            href={PATH_PAGE.subscription}
          >
            <Typography
              sx={{
                color: '#FFFFFF',
                fontSize: '28px',
                fontWeight: 'bold',
                fontFamily: 'Public Sans',
              }}
            >
              Buy Now
            </Typography>
          </Button>

          <Stack
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 2,
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={handleVideoClickOpen}
          >
            <Fab size="large" style={{ backgroundColor: '#1FA9FF' }}>
              <Iconify
                width={36}
                icon="carbon:play"
                style={{ color: '#ffffff', backgroundColor: '#1FA9FF' }}
              />
            </Fab>
            <Typography
              sx={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1FA9FF',
              }}
            >
              Watch Video
            </Typography>
          </Stack>
          <img
            src={fenceHero}
            alt="marketing market"
            style={{
              zIndex: 1,
              width: isMobile ? '90%' : '60%',
              marginTop: 30,
              marginBottom: 30,
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: '28px', sm: '26px', md: '40px', lg: '48px' },
              paddingX: { xs: '18px', sm: '48px', md: '80px', lg: '120px' },
              fontFamily: 'Poppins',
              textAlign: 'center', // Centered on xs screens, left-aligned on sm and larger
              fontWeight: 600,
            }}
          >
            {!isMobile ? (
              <>
                Our customers have seen a{' '}
                <span style={{ color: '#1FA9FF' }}>
                  10% <br />
                  increase in sales
                </span>{' '}
                within 1 month
              </>
            ) : (
              <>
                Our customers have
                <br /> seen a&nbsp;
                <span style={{ color: '#1FA9FF' }}>
                  10% increase in
                  <br /> sales&nbsp;
                </span>
                within 1 month
              </>
            )}
          </Typography>
        </Stack>
      </m.div>
      <m.div variants={varFade().inUp}>
        <Dialog open={videoOpen} maxWidth="lg" fullWidth onClose={handleVideoClose}>
          <Stack sx={{ px: { lg: 4, xs: 1, md: 2 }, pt: 2, pb: 4 }}>
            <Grid item sx={{ alignSelf: { xs: 'end', md: 'end' } }}>
              <IconButton color="inherit" edge="start" onClick={handleVideoClose}>
                <Iconify icon="carbon:close-filled" style={{ color: '1FA9FF' }} />
              </IconButton>
            </Grid>
            <YouTubeLite url={videoUrl} style={{ width: '100%', height: '100%' }} />
          </Stack>
        </Dialog>
      </m.div>
    </Container>
  );
}

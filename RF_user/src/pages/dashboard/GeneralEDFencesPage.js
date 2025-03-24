/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unstable-nested-components */
import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import {
  Box,
  Card,
  Stack,
  Container,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import { YouTubeLite } from 'react-youtube-lite';
import { useDispatch, useSelector } from 'react-redux';
import { getEDs } from '../../redux/slices/ed';
import useResponsive from '../../hooks/useResponsive';

export default function GeneralEDFencesPage() {
  const dispatch = useDispatch();
  const isDesktop = useResponsive('up', 'sm');
  const { EDs, isloading } = useSelector((state) => state.ed);
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    dispatch(getEDs());
  }, [dispatch]);

  const Loading = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mb: 30, mt: isMobile ? 20 : 25 }}>
      <CircularProgress color="primary" />
    </Stack>
  );

  const ContentPanel = () => (
    <Card sx={{ p: 3 }}>
      {EDs &&
        EDs.length > 0 &&
        EDs.map((ed) => (
          <Stack key={ed.id} flexDirection="row" py={4} gap={1}>
            <Box width={{ sm: '480px', md: '640px' }}>
              <YouTubeLite url={ed.url} style={{ width: '100%', height: '100%' }} />
              <Typography sx={{ fontSize: isDesktop ? '24px' : '20px', color: '#006FBA' }}>
                {ed.title}
              </Typography>
              <Typography sx={{ fontSize: isDesktop ? '16px' : '14px' }}>
                <div dangerouslySetInnerHTML={{ __html: ed.caption }} />
              </Typography>
            </Box>
          </Stack>
        ))}
    </Card>
  );

  const NotFound = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mb: 30, mt: 25 }}>
      <Typography fontSize={16} align="center">
        Not Found
      </Typography>
    </Stack>
  );

  return (
    <>
      <Helmet>
        <title> RealityFence | Blog </title>
      </Helmet>
      <Container sx={{ mt: 2, mb: 20 }}>
        <Stack sx={{ px: { lg: 6 } }}>
          <Typography sx={{ fontSize: { lg: '32px', md: '28px', xs: '24px' }, fontWeight: '700' }}>
            RealityFence ED
          </Typography>
          <Typography sx={{ fontSize: '20px', pb: 2, color: '#637381' }}>
            Learn how to unleash the full potential of RealityFence to take your business to new
            heights.
          </Typography>

          <Stack>
            {isloading ? <Loading /> : EDs && EDs.length ? <ContentPanel /> : <NotFound />}
          </Stack>

          <Stack width="100%" sx={{ alignItems: 'center', mb: 16 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ width: '146px', mt: 5, backgroundColor: '#1FA9FF !important' }}
            >
              Load More
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

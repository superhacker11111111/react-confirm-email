/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
// @mui
import { Box, Card, Stack, Container, Typography, Button, CircularProgress } from '@mui/material';
import { YouTubeLite } from 'react-youtube-lite';
import { useDispatch, useSelector } from 'react-redux';
import { getEDs } from '../../redux/slices/ed';
import useResponsive from '../../hooks/useResponsive';

export default function EDFencePage() {
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const isDesktop = useResponsive('up', 'sm');
  const { EDs, isloading } = useSelector((state) => state.ed);
  useEffect(() => {
    dispatch(getEDs());
  }, [dispatch]);

  const Loading = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mt: 20, mb: 30 }}>
      <CircularProgress color="primary" />
    </Stack>
  );

  const ContentPanel = () => (
    <Stack>
      <Card sx={{ p: 3 }}>
        {EDs?.map((ed) => (
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
  );

  const NotFound = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mb: 30, mt: 25 }}>
      <Typography fontSize={16} align="center">
        Not Found
      </Typography>
    </Stack>
  );

  return (
    <Container>
      <Stack
        sx={{
          pt: { lg: 8, md: 6, sm: 4, xs: 1 },
          pb: { xs: 15, md: 10, lg: 10 },
          px: { lg: 16, xs: 1 },
          display: { md: 'flex' },
          height: { md: 'auto' },
        }}
      >
        <Typography
          sx={{
            fontSize: { lg: '48px', md: '36px', xs: '24px' },
            textAlign: { xs: 'center', md: 'start' },
            fontWeight: '800',
          }}
        >
          RealityFence ED
        </Typography>
        <Typography
          sx={{
            fontSize: { md: '20px', xs: '13px' },
            textAlign: { xs: 'center', md: 'start' },
            color: '#637381',
          }}
        >
          Learn how to unleash the full potential of RealityFence to take your business to new
          heights.
        </Typography>

        {isloading ? <Loading /> : EDs && EDs.length ? <ContentPanel /> : <NotFound />}
      </Stack>
    </Container>
  );
}

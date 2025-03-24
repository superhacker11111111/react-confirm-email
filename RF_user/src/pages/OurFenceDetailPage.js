/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { Container, Typography, Grid, Button, Box, Stack, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getFenceByid } from '../redux/slices/fence';

export default function OurFencesDetailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileId = sessionStorage.getItem('fileId');
  const { fenceDetail, isloading } = useSelector((state) => state.fence);
  const fence = [];
  fence[0] = fenceDetail;
  useEffect(() => {
    dispatch(getFenceByid(fileId));
  }, [dispatch, fileId]);

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Container sx={{ pt: { lg: 8, xs: 6 }, height: { md: 'auto' } }}>
      <Grid container sx={{ px: { lg: 14, sx: 2 } }} justifyContent="space-between">
        <Typography sx={{ fontSize: { lg: '48px', md: '36px', xs: '24px' }, fontWeight: '800' }}>
          Our Fences
        </Typography>

        {isloading ? (
          <Stack width="100%" sx={{ alignItems: 'center', mb: 30, mt: 25 }}>
            <CircularProgress color="primary" />
          </Stack>
        ) : fence && fence.length ? (
          <Box
            sx={{
              marginBottom: '10px',
              pt: 4,
              pb: 8,
              width: '100%',
            }}
          >
            <Grid container spacing="23px" justifyContent="space-between">
              <Grid item md={5}>
                <Box sx={{ boxShadow: '0px 6px 9px #a6a6a6', borderRadius: 4.5 }}>
                  <img src={fence[0]?.filesImage?.[0]?.preview} alt="favour" />
                </Box>
              </Grid>
              <Grid item md={6}>
                <Stack gap={1}>
                  <Typography
                    sx={{
                      fontSize: { lg: '40px', md: '32px', xs: '20px', mt: 2 },
                      fontWeight: 700,
                    }}
                  >
                    {fence[0]?.name}
                  </Typography>
                  {/* <Typography
                    sx={{ fontSize: { lg: '24px', md: '20px', xs: '14px' }, fontWeight: 600 }}
                  >
                    Category: {fence[0]?.category}
                  </Typography> */}
                  <Typography
                    sx={{ fontSize: { lg: '24px', md: '20px', xs: '14px' }, fontWeight: 600 }}
                  >
                    {fence[0]?.sub_category || ''}
                  </Typography>
                  <Typography
                    sx={{ fontSize: { lg: '24px', md: '20px', xs: '14px' }, fontWeight: 600 }}
                  >
                    Style: {fence[0]?.style}
                  </Typography>
                  {fence[0]?.color ? (
                    <Typography
                      sx={{ fontSize: { lg: '24px', md: '20px', xs: '14px' }, fontWeight: 600 }}
                    >
                      Color: {fence[0]?.color}
                    </Typography>
                  ) : null}

                  <Typography
                    sx={{ fontSize: { lg: '24px', md: '20px', xs: '14px' }, fontWeight: 600 }}
                  >
                    Size: {fence[0]?.size}
                  </Typography>
                  <Typography
                    sx={{ fontSize: { lg: '24px', md: '20px', xs: '14px' }, fontWeight: 600 }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: fence[0]?.description }} />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Stack width="100%" sx={{ alignItems: 'center', mb: 40, mt: 20 }}>
            <Typography fontSize={16} align="center">
              Not Found
            </Typography>
          </Stack>
        )}

        <Stack width="100%" sx={{ alignItems: 'center', mb: 16 }}>
          <Button
            variant="contained"
            size="large"
            style={{ width: '140px' }}
            sx={{ width: '146px', mt: 6, backgroundColor: '#1FA9FF !important' }}
            onClick={handleClick}
          >
            Back
          </Button>
        </Stack>
      </Grid>
    </Container>
  );
}

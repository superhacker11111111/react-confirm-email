/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Stack,
  CircularProgress,
  // useMediaQuery,
  Button,
} from '@mui/material';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { getAllImages } from '../../redux/slices/media';
import Image from '../../components/image';

export default function Gallery() {
  const dispatch = useDispatch();
  const { gallery, isloading } = useSelector((state) => state.media);
  // const isMobile = useMediaQuery('(max-width: 600px)');
  const [load, setLoad] = useState(20);

  const handleLoadMore = () => {
    setLoad(load + 20);
  };

  useEffect(() => {
    const params = {
      pageNumber: 1,
      limit: load,
    };
    const searchParams = queryString.stringify(params);
    dispatch(getAllImages(searchParams));
  }, [dispatch, load]);

  return (
    <>
      {isloading ? (
        <Stack width="100%" sx={{ alignItems: 'center', mb: 40, mt: 20 }}>
          <CircularProgress color="primary" />
        </Stack>
      ) : gallery && gallery.images && gallery.images.length > 0 ? (
        <Grid container spacing={{ xs: 1, md: 2 }}>
          {gallery &&
            gallery.images &&
            gallery.images.length > 0 &&
            gallery.images.map((image, index) => (
              <Grid item xs={4} sm={4} md={4} key={index}>
                <Box>
                  <Image src={image.url.preview} alt="blog" width="100%" ratio="4/3" />
                </Box>
              </Grid>
            ))}
          <Stack width="100%" sx={{ alignItems: 'center', mb: 20 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                width: '146px',
                mt: 6,
                backgroundColor: '#1FA9FF !important',
              }}
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          </Stack>
        </Grid>
      ) : (
        <Stack width="100%" sx={{ alignItems: 'center', mb: 40, mt: 20 }}>
          <Typography fontSize={16} align="center">
            Not Found
          </Typography>
        </Stack>
      )}
    </>
  );
}

/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import { Box, Stack, Grid, Container, Typography, Button, CircularProgress } from '@mui/material';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { paramCase } from 'change-case';
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { getBlogs } from '../../redux/slices/blog';
import { PATH_DASHBOARD } from '../../routes/paths';
import Image from '../../components/image';

export default function BlogFencePage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDesktop = useResponsive('up', 'sm');
  const { blogs, isloading } = useSelector((state) => state.blog);
  const [load, setLoad] = useState(6);

  const toggleReadMore = (id) => {
    navigate(PATH_DASHBOARD.blog.blogDetail(paramCase(id)));
  };

  const handleLoadMore = () => {
    setLoad(load + 6);
  };

  useEffect(() => {
    const params = {
      pageNumber: 1,
      limit: load,
    };
    const searchParams = queryString.stringify(params);
    dispatch(getBlogs(searchParams));
  }, [dispatch, load]);

  const Loading = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mb: { md: 35, xs: 20 }, mt: 25 }}>
      <CircularProgress color="primary" />
    </Stack>
  );

  const ContentPanel = () => (
    <>
      <Stack
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
        }}
        gap={2}
      >
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => (
            <Box
              gap={1}
              key={blog.id}
              display="flex"
              flexDirection="column"
              borderRadius="10%"
              justifyContent="space-between"
            >
              <Box onClick={() => toggleReadMore(blog.id)}>
                <Image
                  src={blog.files.length > 0 && blog.files[0].preview}
                  alt="blog"
                  width="100%"
                  ratio="4/3"
                />
                <Typography
                  className="cursor-pointer"
                  sx={{
                    fontSize: isDesktop ? '24px' : '18px',
                    fontWeight: '700',
                    color: '#006FBA',
                  }}
                >
                  {blog.title}
                </Typography>
                <Typography
                  sx={{ fontSize: isDesktop ? '16px' : '14px' }}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <span
                    id={`blog-fences-${blog.id}`}
                    className="blog-fences"
                    dangerouslySetInnerHTML={{ __html: blog.text }}
                  />
                </Typography>
              </Box>
            </Box>
          ))}
      </Stack>
      <Stack sx={{ alignItems: 'center' }}>
        <Button
          variant="contained"
          size="large"
          sx={{ width: '146px', mt: 5, backgroundColor: 'rgb(31, 169, 255) !important' }}
          onClick={handleLoadMore}
        >
          Load More
        </Button>
      </Stack>
    </>
  );

  const NotFound = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mb: { md: 35, xs: 20 }, mt: 30 }}>
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
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container sx={{ pb: 2 }}>
          <Grid item md={6} xs={12}>
            <Typography sx={{ fontSize: '24px', fontWeight: '600' }}>Blog</Typography>
            <Typography sx={{ fontSize: '14px', mt: 2, mb: 4 }}>My Dashboard</Typography>
          </Grid>
        </Grid>
        {isloading ? <Loading /> : blogs && blogs.length > 0 ? <ContentPanel /> : <NotFound />}
      </Container>
    </>
  );
}

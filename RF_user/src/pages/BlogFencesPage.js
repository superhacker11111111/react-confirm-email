/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Grid,
  Container,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { paramCase } from 'change-case';
import { useSettingsContext } from '../components/settings';
import useResponsive from '../hooks/useResponsive';
import { getBlogs } from '../redux/slices/blog';
import { PATH_DASHBOARD } from '../routes/paths';
import Image from '../components/image';
// ----------------------------------------------------------------------

export default function BlogFencesPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const isDesktop = useResponsive('up', 'sm');
  const { blogs, isloading } = useSelector((state) => state.blog);
  const [load, setLoad] = useState(6);

  const toggleReadMore = (id) => {
    const url = `${PATH_DASHBOARD.blog.blogsDetail.view(paramCase(id))}`;
    window.location.href = url; // Change the page URL
  };

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

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

  return (
    <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: { xs: 0, sm: 4, md: 6, lg: 8 } }}>
      <Typography
        sx={{
          fontSize: { md: '28px', xs: '24px' },
          fontWeight: '700',
          textAlign: { xs: 'center', sm: 'start' },
          mb: 3,
        }}
      >
        RealityFence Blog
      </Typography>
      <Stack display="flex" gap="20px">
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, mb: 10 }}>
              {isloading ? (
                <Stack
                  width="100%"
                  sx={{ alignItems: 'center', mb: { md: 40, xs: 20 }, mt: { md: 30, xs: 20 } }}
                >
                  <CircularProgress color="primary" />
                </Stack>
              ) : blogs && blogs.length > 0 ? (
                <Stack sx={{ p: 3 }}>
                  <Box
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
                          key={blog.id}
                          display="flex"
                          flexDirection="column"
                          gap={1}
                          borderRadius="10%"
                          justifyContent="space-between"
                        >
                          <Box onClick={() => toggleReadMore(blog.id)}>
                            <Image
                              src={blog.files.length > 0 && blog.files[0].preview}
                              alt="blog"
                              style={{ cursor: 'pointer' }}
                              width="100%"
                              ratio="16/9"
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
                            <Box />
                            <div
                              id={`blog-fences-${blog.id}`}
                              className="blog-fences"
                              dangerouslySetInnerHTML={{ __html: blog.text }}
                            />
                          </Box>
                        </Box>
                      ))}
                  </Box>
                  <Stack width="100%" sx={{ alignItems: 'center', mb: 16 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        width: '146px',
                        mt: 5,
                        backgroundColor: 'rgb(31, 169, 255) !important',
                      }}
                      onClick={handleLoadMore}
                    >
                      Load More
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack width="100%" sx={{ alignItems: 'center', mb: 40, mt: 20 }}>
                  <Typography fontSize={16} align="center">
                    Not Found
                  </Typography>
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}

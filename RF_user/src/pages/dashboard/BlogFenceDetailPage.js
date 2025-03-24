/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import { Stack, CircularProgress, Container, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { useSettingsContext } from '../../components/settings';
// import useResponsive from '../../hooks/useResponsive';
import { getBlog } from '../../redux/slices/blog';
import { PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function BlogFenceDetailPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const isDesktop = useResponsive('up', 'sm');
  const blogid = useParams().id;
  const { blog, isloading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getBlog(blogid));
  }, [dispatch, blogid]);
  const historyback = () => {
    navigate(PATH_DASHBOARD.blog.blogfence);
  };
  return (
    <>
      <Helmet>
        <title> RealityFence | Blog </title>
      </Helmet>
      <Container
        sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '100px' }}
        maxWidth={themeStretch ? false : 'lg'}
      >
        {isloading ? (
          <Stack width="100%" sx={{ alignItems: 'center', mb: { md: 40, xs: 20 }, mt: 40 }}>
            <CircularProgress color="primary" />
          </Stack>
        ) : blog ? (
          <div style={{ width: '80%' }}>
            <Stack
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'inherit',
                marginBottom: '20px',
              }}
            >
              <Typography sx={{ fontSize: { md: '28px', xs: '24px' }, fontWeight: '700' }}>
                RealityFence Blog
              </Typography>
              <Button
                onClick={() => historyback()}
                variant="contained"
                size="large"
                sx={{ backgroundColor: 'rgb(31, 169, 255) !important' }}
              >
                Back
              </Button>
            </Stack>
            <Typography
              sx={{ fontSize: { md: '24px', xs: '18px' }, fontWeight: '600', mb: '10px' }}
            >
              {blog?.title}
            </Typography>
            <div>
              <img
                className="float-right md:pl-[50px] md:pb-[30px] mb-[10px] w-[500px]"
                src={blog && blog.files[0].preview}
                alt="blog_image"
              />
              <div dangerouslySetInnerHTML={{ __html: blog && blog.text }} />
            </div>
          </div>
        ) : (
          <Stack width="100%" sx={{ alignItems: 'center', mb: { md: 40, xs: 20 }, mt: 40 }}>
            <Typography fontSize={16} align="center">
              Not Found
            </Typography>
          </Stack>
        )}
      </Container>
    </>
  );
}

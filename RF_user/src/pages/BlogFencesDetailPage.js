import React, { useEffect } from 'react';
import { Stack, useMediaQuery, Container, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { useSettingsContext } from '../components/settings';
import { getBlog } from '../redux/slices/blog';
import { PATH_DASHBOARD } from '../routes/paths';
// ----------------------------------------------------------------------

export default function BlogFencesDetailPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogid = useParams().id;
  const { blog } = useSelector((state) => state.blog);
  useEffect(() => {
    dispatch(getBlog(blogid));
  }, [dispatch, blogid]);
  const historyback = () => {
    navigate(PATH_DASHBOARD.blog.blogfences);
  };
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Container
      sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '100px', mt: '20px' }}
      maxWidth={themeStretch ? false : 'lg'}
    >
      <div style={{ width: '80%' }}>
        {!isMobile ? (
          <Stack
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'inherit',
              marginBottom: '20px',
            }}
          >
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
            <Button
              onClick={() => historyback()}
              sx={{ background: '#1FA9FF' }}
              variant="contained"
              size="large"
            >
              Back
            </Button>
          </Stack>
        ) : (
          <Stack
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'inherit',
              marginBottom: '20px',
            }}
          >
            <Typography
              sx={{
                fontSize: { md: '28px', xs: '24px' },
                fontWeight: '700',
                textAlign: { xs: 'center', sm: 'start' },
              }}
            >
              RealityFence Blog
            </Typography>
          </Stack>
        )}

        {/* </div> */}
        <Typography sx={{ fontSize: { md: '24px', xs: '18px' }, fontWeight: '600', mb: '10px' }}>
          {blog && blog.title}{' '}
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
    </Container>
  );
}

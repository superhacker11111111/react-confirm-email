/* eslint-disable react/no-danger */
import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Container,
  Button,
  Typography,
  Card,
  // Checkbox,
  Dialog,
  DialogTitle,
  Stack,
  Box,
  // FormControlLabel,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { deleteBlog, getBlogs } from '../../redux/slices/blog';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';
import Image from '../../components/image';

// ----------------------------------------------------------------------

export default function GeneralEDManagePage() {
  const { themeStretch } = useSettingsContext();
  const isDesktop = useResponsive('up', 'sm');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const { blogs } = useSelector((state) => state.blog);

  const onHandleDelete = (id) => {
    dispatch(deleteBlog(id, SnackBar));
  };

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Ecommerce: Blog | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack flexDirection={isDesktop ? 'row' : 'column'} justifyContent="space-between" mb={1}>
          <Typography variant="h4">Manage Blog Posts</Typography>
          <Stack flexDirection="row" gap={1}>
            <Button
              variant="outlined"
              onClick={() => {
                navigate(PATH_DASHBOARD.general.blog.draft);
              }}
            >
              Drafts
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigate(PATH_DASHBOARD.general.blog.newblog);
              }}
            >
              New Blog Post
            </Button>
          </Stack>
        </Stack>
        <Card sx={{ p: 3 }}>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
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
                  <Box>
                    <Image
                      src={blog.files.length > 0 && blog.files[0].preview}
                      alt="blog"
                      width="100%"
                      ratio="4/3"
                    />
                    <Typography
                      sx={{
                        fontSize: isDesktop ? '18px' : '14px',
                        fontWeight: '700',
                        color: '#006FBA',
                      }}
                    >
                      {blog.title}
                    </Typography>
                    <Typography
                      sx={{ fontSize: isDesktop ? '14px' : '12px' }}
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: blog.text }} />
                    </Typography>
                  </Box>
                  <Stack
                    gap={1}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    bottom={0}
                  >
                    <Stack flexDirection="row" gap={1}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          navigate(PATH_DASHBOARD.general.blog.editblog(paramCase(blog.id)))
                        }
                        sx={{ height: 'fit-content', py: 0 }}
                      >
                        Edit Post
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ height: 'fit-content', py: 0 }}
                        onClick={() => {
                          setDeleteId(blog.id);
                          setOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                    {/* <FormControlLabel control={<Checkbox size="small" />} label="Featured" /> */}
                  </Stack>
                </Box>
              ))}
          </Box>
        </Card>
        <Dialog open={open}>
          <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
            Are you sure you want to delete?
          </DialogTitle>
          <Stack justifySelf="center">
            <Button
              variant="contained"
              sx={{
                mb: 2,
                mx: 12,
                fontSize: '18px',
                fontWeight: 900,
                borderRadius: 1.5,
              }}
              onClick={() => {
                onHandleDelete(deleteId);
                setOpen(false);
              }}
            >
              Delete Post
            </Button>
            <Button
              variant="contained"
              sx={{
                mb: 10,
                mx: 12,
                fontSize: '18px',
                fontWeight: 900,
                borderRadius: 1.5,
              }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Dialog>
      </Container>
    </>
  );
}

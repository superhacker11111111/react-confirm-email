import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getBlog } from '../../redux/slices/blog';
import { useSettingsContext } from '../../components/settings';
// sections
import BlogNewEditForm from '../../sections/@dashboard/general/blog/BlogNewEditForm';

// ----------------------------------------------------------------------

export default function GeneralBlogEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { id } = useParams();

  const { blog } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getBlog(id));
  }, [dispatch, id]);
  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Post | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={1}>
          Edit Blog Post
        </Typography>
        <BlogNewEditForm isEdit blog={blog} />
      </Container>
    </>
  );
}

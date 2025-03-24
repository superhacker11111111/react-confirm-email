import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import BlogNewEditForm from '../../sections/@dashboard/general/blog/BlogNewEditForm';

// ----------------------------------------------------------------------

export default function GeneralBlogCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Ecommerce: Create a new Blog | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={1}>
          New Blog Post
        </Typography>
        <BlogNewEditForm />
      </Container>
    </>
  );
}

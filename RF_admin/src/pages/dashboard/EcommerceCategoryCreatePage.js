import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import CategoryNewEditForm from '../../sections/@dashboard/e-commerce/CategoryNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceCategoryCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Ecommerce: Create a new category | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={2}>
          Create a new Category
        </Typography>
        <CategoryNewEditForm />
      </Container>
    </>
  );
}

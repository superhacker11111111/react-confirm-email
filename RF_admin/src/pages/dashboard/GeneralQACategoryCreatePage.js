import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import CategoryNewEditForm from '../../sections/@dashboard/general/QA/CategoryNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceCategoryCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Ecommerce: Add Category | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4">Add Category</Typography>
        <CategoryNewEditForm />
      </Container>
    </>
  );
}

import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import TagNewEditForm from '../../sections/@dashboard/e-commerce/TagNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceTagPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Service: Tagging Preferences | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="Tagging Preferences" links={[{ name: '' }]} />
        <TagNewEditForm />
      </Container>
    </>
  );
}

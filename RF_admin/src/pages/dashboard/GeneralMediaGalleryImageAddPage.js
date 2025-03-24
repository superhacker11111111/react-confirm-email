import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import MarketingGalleryImageAddForm from '../../sections/@dashboard/general/media/GalleryImageNewForm';

export default function GeneralMediaGalleryImageAddPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Media: Add Gallery Images | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="Add Gallery Images" links={[{ name: '' }]} />
        <MarketingGalleryImageAddForm />
      </Container>
    </>
  );
}

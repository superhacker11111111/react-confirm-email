import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import EDNewEditForm from '../../sections/@dashboard/general/ED/EDNewEditForm';

// ----------------------------------------------------------------------

export default function GeneralEDCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Ecommerce: Create a new RealityFence ED | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={1}>
          New Post
        </Typography>
        <EDNewEditForm />
      </Container>
    </>
  );
}

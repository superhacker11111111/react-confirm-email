import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import QANewEditForm from '../../sections/@dashboard/general/QA/QANewEditForm';

// ----------------------------------------------------------------------

export default function GeneralSubscriptionCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Ecommerce: Create a new QA | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={1}>
          New Q&A
        </Typography>

        <QANewEditForm />
      </Container>
    </>
  );
}

import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import SubscriptionNewEditForm from '../../sections/@dashboard/general/Subscription/SubscriptionNewEditForm';

// ----------------------------------------------------------------------

export default function GeneralSubscriptionCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Ecommerce: Create a new Subscription | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={1}>
          New Subscription
        </Typography>

        <SubscriptionNewEditForm />
      </Container>
    </>
  );
}

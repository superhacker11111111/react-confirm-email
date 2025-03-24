import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import PricingNewEditForm from '../../sections/@dashboard/pricing/form';

// ----------------------------------------------------------------------

export default function PricingCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Pricings: Create a new Pricing | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Pricing"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Pricings',
              href: PATH_DASHBOARD.pricing.list,
            },
            {
              name: 'New Pricing',
            },
          ]}
        />

        <PricingNewEditForm />
      </Container>
    </>
  );
}

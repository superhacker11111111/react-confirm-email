import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import ServiceNewEditForm from '../../sections/@dashboard/service/ServiceNewEditForm';

// ----------------------------------------------------------------------

export default function ServiceCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Service: Create a new service | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new service"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Service',
              href: PATH_DASHBOARD.service.list,
            },
            { name: 'New service' },
          ]}
        />
        <ServiceNewEditForm />
      </Container>
    </>
  );
}

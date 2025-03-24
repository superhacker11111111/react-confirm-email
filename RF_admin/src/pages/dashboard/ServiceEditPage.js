import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { useDispatch, useSelector } from '../../redux/store';
import { getService } from '../../redux/slices/service';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import ServiceNewEditForm from '../../sections/@dashboard/service/ServiceNewEditForm';

// ----------------------------------------------------------------------

export default function ServiceEditPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const { id } = useParams();
  const service = useSelector((state) => state.service.service);

  useEffect(() => {
    dispatch(getService(id));
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title> Service: Edit service | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit service"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Service',
              href: PATH_DASHBOARD.service.list,
            },
            {
              name: service?.full_name || '',
            },
          ]}
        />

        <ServiceNewEditForm isEdit currentService={service} />
      </Container>
    </>
  );
}

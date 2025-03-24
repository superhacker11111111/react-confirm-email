import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
//
import { getPrice } from '../../redux/slices/price';
import { useDispatch, useSelector } from '../../redux/store';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import PriceNewEditForm from '../../sections/@dashboard/pricing/form/index';

// ----------------------------------------------------------------------

export default function PriceEditPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getPrice(id));
  }, [dispatch, id]);
  const currentPrice = useSelector((state) => state.price.price);

  return (
    <>
      <Helmet>
        <title> Price: Edit | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Price"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Prices',
              href: PATH_DASHBOARD.pricing.list,
            },
            // { name: `${currentPrice?.currentPrice}` },
          ]}
        />

        <PriceNewEditForm isEdit currentPrice={currentPrice} />
      </Container>
    </>
  );
}

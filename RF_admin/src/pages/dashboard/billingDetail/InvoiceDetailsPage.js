import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';

// components
import { useSettingsContext } from '../../../components/settings';
// sections
import InvoiceDetails from '.';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const [billingData, setBillingData] = useState();

  const { id } = useParams();
  useEffect(() => {
    axios
      .post('/payment/billing/detail', { id })
      .then((res) => {
        setBillingData(res.data.data);
      })
      .catch((err) => {});
  }, [id]);

  return (
    <>
      <Helmet>
        <title> Invoice: View | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <InvoiceDetails invoice={billingData} />
      </Container>
    </>
  );
}

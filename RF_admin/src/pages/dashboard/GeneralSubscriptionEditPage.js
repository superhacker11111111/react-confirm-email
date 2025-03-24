import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getSubscription } from '../../redux/slices/subscription';
import { useSettingsContext } from '../../components/settings';
// sections
import SubscriptionNewEditForm from '../../sections/@dashboard/general/Subscription/SubscriptionNewEditForm';

// ----------------------------------------------------------------------

export default function GeneralQAEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { id } = useParams();

  const { subscription } = useSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(getSubscription(id));
  }, [dispatch, id]);
  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Subscription | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={1}>
          Edit Subscription
        </Typography>
        <SubscriptionNewEditForm isEdit subscription={subscription} />
      </Container>
    </>
  );
}

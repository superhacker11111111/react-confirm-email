import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

// @mui
import { Container, Typography, Button, Stack } from '@mui/material';

import { useSnackbar } from '../../components/snackbar';

import axios from '../../utils/axios';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function CallForCancelPage() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const { user } = useSelector((state) => state.auth);

  const handleClickItem = () => {
    navigate(-1);
  };

  const handleClickCancel = async () => {
    try {
      if (user) {
        // const subscription = await mainStripe.subscriptions.retrieve(user?.stripe_subscription_id);
        axios
          .post('stripe/cancel-subscription', { subscription_id: user?.stripe_subscription_id })
          .then(async (result) => {
            const res = await axios.put(`/user/${user?.id}`, {
              subscription_status: result.data.status,
            });
            if (res.data.code === 200) navigate(PATH_DASHBOARD.user.cancelcongratulation);
            else {
              SnackBar("User's Subscription Status Update Failed", 'error');
            }
          })
          .catch((err) => {
            SnackBar(err.message, 'error');
          });
      }
    } catch (err) {
      SnackBar(err.message, 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title> CongratulationsPage | RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: 30,
          minHeight: 1,
        }}
      >
        <Typography
          fontSize="48px"
          align="center"
          fontFamily="Barlow"
          fontWeight={700}
          lineHeight="48px"
          textAlign="center"
        >
          We hate to see you go. Are you
          <br />
          sure you want to cancel?
        </Typography>
        <Typography fontSize="20px" align="center" fontFamily="Barlow" fontWeight={700} my={2}>
          You can always pause your billing instead
        </Typography>

        <Stack flexDirection="column" alignItems="center" gap={1}>
          <Button
            variant="contained"
            sx={{
              fontSize: '15px',
              fontWeight: 700,
              lineHeight: '26px',
              fontFamily: 'Public Sans',
              color: '#ffffff',
              backgroundColor: '#1FA9FF !important',
              p: '11px, 22px, 11px, 22px',
              width: '258px',
            }}
            style={{ backgroundColor: '#1FA9FF' }}
            onClick={handleClickItem}
          >
            No, I don’t want to cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              fontSize: '15px',
              fontWeight: 700,
              lineHeight: '26px',
              fontFamily: 'Public Sans',
              color: '#ffffff',
              backgroundColor: '#1FA9FF !important',
              p: '11px, 22px, 11px, 22px',
              width: '258px',
            }}
            style={{ backgroundColor: '#1FA9FF' }}
            onClick={handleClickCancel}
          >
            Yes, cancel my subscription
          </Button>
        </Stack>
      </Container>
    </>
  );
}

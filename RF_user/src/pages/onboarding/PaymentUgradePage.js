import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

// @mui
import { Box, Container, Typography, Button, Grid } from '@mui/material';

import Stripe from 'stripe';
//
import { useDispatch, useSelector } from '../../redux/store';
import { getPrice, getCurrentPrice } from '../../redux/slices/price';
import { userAction } from '../../redux/actions/userAction';
import { PATH_ONBOARDING } from '../../routes/paths';
//
// sections
import axios from '../../utils/axios';
import { PlanCard } from '../../sections/pricinghome';
import { Summary } from '../../sections/onboarding/fencerequest/index';
import { STRIPE_SECRET_KEY } from '../../config-global';

import { useSnackbar } from '../../components/snackbar';
// ----------------------------------------------------------------------

export default function PaymentUgradePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const mainStripe = new Stripe(STRIPE_SECRET_KEY);

  const cardId = useParams().id;
  const colors = { backColor: '#1FA9FF', fontColor: '#FFFFFF', buttonBorder: '#1FA9FF' };

  const { user } = useSelector((state) => state.auth);
  const prices = useSelector((state) => state.price.price);
  const { origin } = useSelector((state) => state.price);
  const [subInfo, setSubInfo] = useState({
    subOrigneTitle: '',
    orginePrice: '',
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getPrice(cardId));
  }, [dispatch, cardId]);

  useEffect(() => {
    dispatch(getCurrentPrice(user?.userType));
  }, [dispatch, user]);

  useEffect(() => {
    setSubInfo({
      subOrigneTitle: origin?.license,
      orginePrice: origin?.price,
    });
  }, [origin]);

  const subUpgradeInfo = {
    subUpgradeTitle: prices === null ? '' : prices[0].license,
    subUpgradePrice: prices === null ? '' : prices[0].price,
  };

  const handleClickItem = () => {
    navigate(-1);
  };
  const handleClickConfirm = async () => {
    let item = {};
    if (prices[0].stripe_price_month_id) {
      item = {
        price: prices[0].stripe_price_month_id,
      };
    } else {
      item = {
        price_data: {
          currency: 'usd',
          unit_amount: Number(prices[0].price) * 100,
        },
      };
    }
    await axios
      .post('stripe/subscription/update', {
        subscription_id: user?.stripe_subscription_id,
        data: {
          items: [item],
        },
      })
      .then((subscription) => {
        dispatch(
          userAction.updateUser(
            user.id,
            { email: user.email.toLowerCase(), userType: prices[0].id },
            navigate
          )
        );
        navigate(PATH_ONBOARDING.onboarding.planUpgradeCongratulationsPage);
      })
      .catch((err) => {
        enqueueSnackbar('Please try again', { variant: 'error' });
      });
  };

  return (
    <>
      <Helmet>
        <title> PaymentUgradePage | RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: 9,
          pb: 10,
          minHeight: 1,
        }}
      >
        <Typography variant="h3" align="center" paragraph>
          You’re Almost Done!
        </Typography>

        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{ md: 'repeat(2, 1fr)', xs: 'repeat(1, 1fr)' }}
          sx={{ my: 5 }}
        >
          {prices?.map((price, index) => (
            <PlanCard key={price.itemId} plan={price} buttonColor={colors} type={4} />
          ))}
          <Summary type={4} subInfo={subInfo} subUpgradeInfo={subUpgradeInfo} />
        </Box>

        <Grid container>
          <Grid item xs={12} md={12} lg={12} xl={12} sx={{ p: 3 }}>
            <div className="w-full flex justify-between">
              <Button
                color="inherit"
                variant="text"
                style={{
                  backgroundColor: '#C0DEFF',
                  fontSize: '15px',
                  padding: '10px 50px',
                  color: '#1FA9FF',
                  borderRadius: '14px',
                  fontFamily: 'unset',
                }}
                onClick={handleClickItem}
              >
                Cancel
              </Button>
              <Button
                variant="text"
                color="inherit"
                style={{
                  backgroundColor: '#C0DEFF',
                  padding: '10px 50px',
                  fontSize: '15px',
                  color: '#1FA9FF',
                  marginLeft: '5px',
                  borderRadius: '14px',
                  fontFamily: 'unset',
                }}
                onClick={handleClickConfirm}
              >
                Confirm Purchase
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

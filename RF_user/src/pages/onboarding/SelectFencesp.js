import { useState, useEffect } from 'react';
import { styled, Stack, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import Tap from '@tapfiliate/tapfiliate-js';
// import axios from '../../utils/axios';
// state initialize
import { PATH_ONBOARDING } from '../../routes/paths';
import { requestProductList } from '../../redux/slices/product';
// import { UserType } from '../../assets/data/roles';
// import { TAPFILIATE_ACCOUNT_ID } from '../../config-global';

// Tap.init(TAPFILIATE_ACCOUNT_ID, { integration: 'npm-module' }, (result) => {
//   console.log('result :>> ', result);
// });

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function SelectFencesp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const onConfirm = async () => {
    if (user) {
      dispatch(requestProductList(user.id));
    }
    localStorage.setItem('layout', 'onboarding');
    localStorage.removeItem('pageType');
    navigate(PATH_ONBOARDING.onboarding.categoryfences);
  };
  const [type, setType] = useState([]);
  const isMobile = useMediaQuery('(max-width:800px)');
  useEffect(() => {
    //   async function addConversion() {
    //     if (user) {
    //       console.log('TAPFILIATE_ACCOUNT_ID :>> ', TAPFILIATE_ACCOUNT_ID);
    //       if (user.userType === UserType['Free Trial']) {
    //         Tap.trial(user.id);
    //       } else {
    //         const priceInformation = await axios.post('stripe/retrieve-price', {
    //           price_id: user.stripe_price_id,
    //         });
    //         Tap.conversion(user.fullName, Number(priceInformation.data.unit_amount) / 100, {
    //           customer_id: user?.email.toLowerCase(),
    //         });
    //         Tap.lead(user.id);
    //       }
    //     }
    //   }
    //   addConversion();

    switch (user?.userType) {
      case 1:
        setType(1);
        break;
      case 2:
        setType(1);
        break;
      case 3:
        setType(1);
        break;
      case 5:
        setType(1);
        break;
      default:
        setType(0);
        break;
    }
  }, [user]);

  return (
    <Stack
      spacing={1}
      alignItems="center"
      sx={{
        mx: { xs: 2, sm: 4, lg: 3, xl: 6 },
        pt: 3,
        pb: 8,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
    >
      <Stack
        sx={{
          fontFamily: 'Poppins',
          fontSize: { xs: '26px', sm: '40px', md: '48px', lg: '42px', xl: '56px' },
          fontWeight: 900,
          color: '#58b1f2',
          textAlign: 'center',
        }}
      >
        <span>Welcome to RealityFence!</span>
      </Stack>
      {type !== 1 ? (
        <Grid
          container
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            pb: 3,
            px: 2,
            minHeight: { xs: '330px', sm: '450px', lg: '450px' },
          }}
        >
          <Grid
            item
            xs={12}
            sx={{ mt: 4, mb: 4, width: { lg: '40%', md: '50%', sm: '70%', xs: '80%' } }}
          >
            <Img alt="complex" src="/favicon/smartmockups_lmexx8m8.png" />
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: { xl: '48px', lg: '36px', md: '36px', sm: '24px', xs: '18px' },
                fontWeight: 800,
                color: 'black',
              }}
            >
              It&apos;s time to select your fences!
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          display="flex"
          flexDirection={!isMobile ? 'row-reverse' : 'column'}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            pb: 1,
            px: { xl: 30, lg: 20, md: 10, sm: 10, xs: 5 },
            minHeight: { xs: '330px', sm: '350px' },
          }}
        >
          <Grid
            item
            md={4.5}
            xs={12}
            sx={{ mt: 4, mb: 4, width: { lg: '40%', md: '50%', sm: '70%', xs: '80%' } }}
          >
            <Img alt="complex" src="/favicon/smartmockups_lmexx8m8.png" />
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack>
              <Typography
                sx={{
                  fontSize: { xl: '30px', lg: '26px', md: '22px', sm: '26px', xs: '20px' },
                  fontWeight: 900,
                  color: 'black',
                  lineHeight: 1,
                  mb: 3,
                }}
              >
                It&apos;s time to select your fences!
              </Typography>

              <Typography
                sx={{
                  fontSize: { xl: '24px', lg: '19px', md: '16px', sm: '20px', xs: '16px' },
                  fontWeight: 700,
                  color: 'black',
                  mb: 2,
                }}
              >
                How it works:
              </Typography>
              <Typography
                sx={{
                  fontSize: { xl: '20px', lg: '15px', md: '15px', sm: '16px', xs: '12px' },
                  fontWeight: 500,
                  color: 'black',
                  mb: 2,
                }}
              >
                We have an extensive library of 3D fence models. All you have to do is add them to
                Your Fences, and they will be available for you to use.
              </Typography>
              <Typography
                sx={{
                  fontSize: { xl: '24px', lg: '19px', md: '16px', sm: '20px', xs: '16px' },
                  fontWeight: 700,
                  color: 'black',
                  mb: 2,
                }}
              >
                “What if I can&apos;t find a fence that we install?”
              </Typography>
              <Typography
                sx={{
                  fontSize: { xl: '20px', lg: '15px', md: '15px', sm: '16px', xs: '12px' },
                  fontWeight: 500,
                  color: 'black',
                  mb: 2,
                }}
              >
                We specialize in custom. If there are any fences that you install that we don&apos;t
                have in our Fence Selector, you can request them for a low one time fee.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      )}

      <Button
        variant="contained"
        sx={{
          mb: 3,
          fontSize: '18px',
          letterSpacing: '1px',
          fontFamily: 'Poppins',
          fontWeight: 600,
          py: 1,
          width: { xs: '180px', lg: '240px' },
        }}
        style={{ backgroundColor: '#1FA9FF' }}
        onClick={() => onConfirm()}
      >
        Continue
      </Button>
    </Stack>
  );
}

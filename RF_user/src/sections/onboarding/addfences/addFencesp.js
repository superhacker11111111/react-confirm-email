import { useState } from 'react';
import { Stack, Button, Grid, useMediaQuery, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATH_ONBOARDING } from '../../../routes/paths';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function AddFence() {
  const navigate = useNavigate();
  const [activeP, setActiveP] = useState(0);
  const isMobile = useMediaQuery('(max-width:800px)');

  const onFinish = () => {
    localStorage.setItem('pageType', 'addFence');
    navigate(PATH_ONBOARDING.onboarding.requestFences);
  };
  const onSelectFences = () => {
    navigate(PATH_ONBOARDING.onboarding.categoryfences);
  };

  return (
    <Stack
      spacing={4}
      alignItems="center"
      sx={{
        mr: { xs: 2, sm: 4, md: 6 },
        ml: { xs: 2, sm: 4, md: 6 },
        pt: 4,
        pb: 3,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
    >
      <Grid
        container
        display="flex"
        flexDirection={!isMobile ? 'row-reverse' : 'column'}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          pb: 3,
          pr: { sm: 4, xs: 2 },
          pl: { lg: 8, md: 6, sm: 4, xs: 2 },
          minHeight: { xs: '330px', sm: '610px', lg: '610px' },
        }}
      >
        <Grid
          item
          md={6}
          xs={12}
          sx={{ mt: 4, mb: 4, width: { lg: '40%', md: '50%', sm: '70%', xs: '80%' } }}
        >
          <Img alt="complex" src="/favicon/smartmockups_lnndrm69.png" />
        </Grid>
        <Grid item md={5} xs={12}>
          <Stack>
            <Typography
              sx={{
                fontSize: { lg: '36px', md: '30px', sm: '24px', xs: '18px' },
                fontWeight: 900,
                color: 'black',
                lineHeight: 1.3,
                mb: 3,
              }}
            >
              Don&apos;t see the fence you need? <br />
              Request it!
            </Typography>
            <Typography
              sx={{
                fontSize: { lg: '32px', md: '28px', sm: '24px', xs: '21px' },
                fontWeight: 800,
                color: 'black',
                mb: 2,
              }}
            >
              How it works:
            </Typography>
            <Typography
              sx={{
                fontSize: { lg: '24px', md: '21px', sm: '18px', xs: '16px' },
                fontWeight: 500,
                color: 'black',
                mb: 2,
              }}
            >
              We can create a custom 3D model of any fence that you install. All you have to do is
              fill out the information on the following screen.
            </Typography>
            <Typography
              sx={{
                fontSize: { lg: '32px', md: '28px', sm: '24px', xs: '21px' },
                fontWeight: 800,
                color: 'black',
                mb: 2,
              }}
            >
              One time fee:
            </Typography>
            <Typography
              sx={{
                fontSize: { lg: '24px', md: '21px', sm: '18px', xs: '16px' },
                fontWeight: 500,
                color: 'black',
                mb: 2,
              }}
            >
              Every 3D model is different, but each model usually costs around $30. Request as many
              as you need, and we will send you a quote!
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Grid
        item
        container
        display="flex"
        direction={{ xs: 'column-reverse', sm: 'row' }}
        justifyContent="space-between"
        width={{ lg: '50%', md: '60%', xs: '80%' }}
        alignItems="center"
        sm={10}
        xs={8}
        lg={6}
        xl={5}
      >
        <Button
          variant="contained"
          sx={{
            mb: 3,
            fontSize: '15px',
            letterSpacing: '1px',
            width: { xs: '200px', sm: '220px', lg: '220px' },
            fontWeight: '900',
            fontFamily: 'Poppins',
          }}
          style={{ backgroundColor: '#1FA9FF' }}
          onClick={() => onSelectFences()}
        >
          Back to Selector
        </Button>

        <Button
          variant="contained"
          sx={{
            mb: 3,
            fontSize: '15px',
            letterSpacing: '1px',
            width: { xs: '200px', xl: '220px', lg: '220px' },
            fontWeight: '900',
            fontFamily: 'Poppins',
          }}
          style={{ backgroundColor: '#1FA9FF' }}
          onClick={() => onFinish()}
        >
          To Fence Requestor
        </Button>
      </Grid>
    </Stack>
  );
}

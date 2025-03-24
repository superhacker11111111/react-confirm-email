import { useState } from 'react';
import { Stack, Button, Grid } from '@mui/material';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PATH_ONBOARDING } from '../../../routes/paths';

const makeRequestContent = [
  {
    first: true,
    text: 'In the next section, you can make requests for 3D models.',
  },
  {
    text: "If you're not ready to make your requests at this time, no problem!",
  },
  {
    text: 'Come back to Fence Requester at any time.',
  },
  {
    text: 'To request a 3D model, all you have to do is answer a few questions and upload an image or two.',
  },
  {
    text: 'Then, RealityFence will begin creating your models!',
  },
  {
    text: "You'll be notified when your models are completed. We will add them to your account, and they will be available to use!",
  },
  {
    text: 'In the meantime, the fences you had previously selected will be selected will be available for immediate use.',
  },
  {
    text: "Let's get started!",
    last: true,
  },
];

export default function AddFence() {
  const navigate = useNavigate();
  const [activeP, setActiveP] = useState(0);

  const handleNext = () => {
    setActiveP(activeP + 1);
  };

  const handleBack = () => {
    setActiveP(activeP - 1);
  };

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
        mt: { xs: 0, sm: 5, md: 5, lg: 5, xl: 5 },
        mr: { xs: 2, sm: 4, md: 6 },
        ml: { xs: 2, sm: 4, md: 6 },
        pt: 3,
        pb: 3,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          pt: { xs: 0, sm: 5, md: 5, lg: 5, xl: 5 },
          pb: 3,
          minHeight: { xs: '330px', sm: '550px', lg: '550px' },
          fontSize: { xs: '26px', sm: '40px', md: '45px', lg: '50px', xl: '50px' },
          color: '#58b1f2',
          fontWeight: '900',
          textAlign: 'center',
        }}
      >
        <Grid item xs={9} md={8} lg={6.5} xl={5.5}>
          <span>{makeRequestContent[activeP].text}</span>
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
            fontSize: { md: '20px', xs: '16px' },
            letterSpacing: '1px',
            width: { xs: '200px', sm: '220px', lg: '220px' },
            fontWeight: '900',
            fontFamily: 'Poppins',
          }}
          style={{ backgroundColor: '#1FA9FF' }}
          onClick={() =>
            makeRequestContent[activeP] && makeRequestContent[activeP].first
              ? onSelectFences()
              : handleBack()
          }
        >
          {makeRequestContent[activeP] && makeRequestContent[activeP].first
            ? 'Back to Selector '
            : 'Back'}
        </Button>

        <Button
          variant="contained"
          sx={{
            mb: 3,
            fontSize: { md: '20px', xs: '16px' },
            letterSpacing: '1px',
            width: { xs: '200px', xl: '220px', lg: '220px' },
            fontWeight: '900',
            fontFamily: 'Poppins',
          }}
          style={{ backgroundColor: '#1FA9FF' }}
          onClick={() =>
            makeRequestContent[activeP] && makeRequestContent[activeP].last
              ? onFinish()
              : handleNext()
          }
        >
          {makeRequestContent[activeP] && makeRequestContent[activeP].last ? 'Finish' : 'Next'}
        </Button>
      </Grid>
    </Stack>
  );
}

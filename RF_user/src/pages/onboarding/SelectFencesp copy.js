import { useState, useEffect } from 'react';
import { styled, Stack, Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// state initialize
import { PATH_ONBOARDING } from '../../routes/paths';
import { requestProductList } from '../../redux/slices/product';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const welcome_data = {
  pro: [
    {
      index: 1,
      text: 'In the next section, you will choose your 3D fences.',
    },
    {
      index: 2,
      text: 'With your Pro subscription, choose up to 30 fences.',
    },
    { index: 3, text: `Can't choose all 30 today? No problem!` },
    { index: 4, text: 'Return to Fence Selector at any time to complete your selections.' },
    { index: 5, text: `What if I need to make changes down the road?` },
    { index: 6, text: 'With your Pro subscription, you can swap to up 3 fences per month.' },
    {
      index: 7,
      text: `When you are finished in Fence Selector, your fences will live in your account, and will be ready for immediate use!`,
    },
    { index: 8, text: `Let's get started!`, last: true },
  ],
  proPlus: [
    {
      index: 1,
      text: 'In the next section, you will choose your 3D fences.',
    },
    {
      index: 2,
      text: 'With your Pro+ subscription, choose up to 50 fences.',
    },
    { index: 3, text: "Can't choose all 50 today? No problem!" },
    { index: 4, text: 'Return to Fence Selector at any time to complete your selections.' },
    { index: 5, text: `What if I need to make changes down the road?` },
    { index: 6, text: 'With your Pro+ subscription, you can swap to 3 fences per month.' },
    {
      index: 7,
      text: `What if RealityFence doesn't have the 3D Model of the fence I need?`,
    },
    {
      index: 8,
      text: `With your Pro+ subscription, you can request a model of ANY fence, and RealityFence will create it for you.`,
    },
    {
      index: 9,
      text: `But first, let's take a look at Fence Selector, where you can browse our extensive library of 3D Models.`,
    },
    { index: 10, text: `Let's get started!`, last: true },
  ],
  enterprise: [
    {
      index: 1,
      text: 'In the next section, you will choose your 3D fences.',
    },
    {
      index: 2,
      text: 'With your Enterprise subscription, choose up to 100 fences.',
    },
    { index: 3, text: `Can't choose all 100 today? No problem!` },
    { index: 4, text: 'Return to Fence Selector at any time to complete your selections.' },
    { index: 5, text: `What if I need to make changes down the road?` },
    {
      index: 6,
      text: 'With your Enterprise subscription, you can swap up to 10 fences per month.',
    },
    {
      index: 7,
      text: `What if RealityFence doesn't have the 3D Model of the fence I need?`,
    },
    {
      index: 8,
      text: `With your Enterprise subscription, you can request a model of ANY fence, and RealityFence will create it for you.`,
    },
    {
      index: 9,
      text: `But first, let's take a look at Fence Selector, where you can browse our extensive library of 3D Models.`,
    },
    { index: 10, text: `Let's get started!`, last: true },
  ],
};

export default function SelectFencesp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeP, setActiveP] = useState(0);
  const [content, setContent] = useState([]);
  useEffect(() => {
    switch (user?.userType) {
      case 1:
        setContent(welcome_data.pro);
        break;
      case 2:
        setContent(welcome_data.proPlus);
        break;
      case 3:
        setContent(welcome_data.enterprise);
        break;
      default:
        setContent(welcome_data.pro);
        break;
    }
  }, [user]);
  const handleNext = () => {
    setActiveP(activeP + 1);
  };
  const handleBack = () => {
    setActiveP(activeP - 1);
  };
  const onConfirm = async () => {
    if (user) {
      await dispatch(requestProductList(user.id));
    }
    await localStorage.setItem('layout', 'onboarding');
    await localStorage.removeItem('pageType');
    await navigate(PATH_ONBOARDING.onboarding.categoryfences);
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
        direction={activeP !== 0 ? 'row' : 'column'}
        justifyContent="center"
        alignItems="center"
        sx={{
          pt: 5,
          pb: 3,
          minHeight: { xs: '330px', sm: '550px', lg: '550px' },
          fontSize: { xs: '26px', sm: '40px', md: '45px', lg: '50px', xl: '50px' },
          fontWeight: 900,
          color: '#58b1f2',
          textAlign: 'center',
        }}
      >
        {activeP === 0 ? (
          <>
            <Grid item xs={7}>
              <span>Welcome to RealityFence</span>
            </Grid>
            <Grid item xs={6} sx={{ mt: 4, mb: 7 }}>
              <Img alt="complex" src="/favicon/android-chrome-192x192.png" />
            </Grid>
          </>
        ) : (
          <Grid item xs={9} md={8} lg={6.5} xl={5.5}>
            <span>{content[activeP - 1].text}</span>
          </Grid>
        )}
      </Grid>
      <Grid
        container
        item
        display="flex"
        flexDirection={{ xs: 'column-reverse', sm: 'row' }}
        sx={{ bottom: 0 }}
        justifyContent={{
          xs: 'center',
          md: activeP !== 0 ? 'space-between' : 'center',
          sm: activeP !== 0 ? 'space-between' : 'center',
          lg: activeP !== 0 ? 'space-between' : 'center',
        }}
        alignItems="flex-end"
        alignContent="center"
        sm={10}
        xs={6}
        md={7}
        lg={6}
        xl={5}
      >
        {activeP !== 0 && (
          <Grid item>
            <Button
              variant="contained"
              sx={{
                mb: 3,
                fontSize: { md: '20px', xs: '16px' },
                letterSpacing: '1px',
                fontFamily: 'Poppins',
                width: { xs: '180px', xl: '220px', lg: '220px' },
                fontWeight: 900,
              }}
              onClick={handleBack}
              style={{ backgroundColor: '#1FA9FF' }}
            >
              Back
            </Button>
          </Grid>
        )}

        <Grid item>
          <Button
            variant="contained"
            sx={{
              mb: 3,
              fontSize: { md: '20px', xs: '16px' },
              letterSpacing: '1px',
              fontFamily: 'Poppins',
              fontWeight: 900,
              width: { xs: '180px', xl: '220px', lg: '220px' },
            }}
            style={{ backgroundColor: '#1FA9FF' }}
            onClick={() =>
              content[activeP - 1] && content[activeP - 1].last ? onConfirm() : handleNext()
            }
          >
            {content[activeP - 1] && content[activeP - 1].last ? 'Confirm' : 'Next'}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}

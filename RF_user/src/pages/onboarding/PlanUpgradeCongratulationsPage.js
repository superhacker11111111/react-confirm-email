import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

// @mui
import { Container, Typography, Button, Grid, Alert } from '@mui/material';
//

// utils
import { PATH_ONBOARDING } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function PlanUpgradeCongratulationsPage() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('user :>> ', user);
  }, [user]);

  const handleClickItem = () => {
    navigate(PATH_ONBOARDING.onboarding.categoryfences);
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
        <Typography variant="h2" align="center" paragraph>
          Congratulations!
        </Typography>

        <Grid container spacing={30}>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
            <Alert severity="success" variant="outlined" sx={{ width: '250px' }}>
              Upgrade Successful!
            </Alert>
          </Grid>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
            <Button
              variant="text"
              color="inherit"
              sx={{
                fontSize: '20px',
                paddingX: '100px',
                color: '#1288E3',
                backgroundColor: '#C0DEFF !important',
                borderRadius: '14px',
                fontFamily: 'unset',
              }}
              onClick={handleClickItem}
            >
              Exit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

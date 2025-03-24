import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

// @mui
import { Container, Typography, Button, Grid, Alert } from '@mui/material';
import { PATH_ONBOARDING } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function UserAlmostCongratulationPage() {
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate(PATH_ONBOARDING.onboarding.fenceRequest);
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

        <Grid container sx={{ pt: { xs: 1 } }} spacing={30}>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
            <Alert severity="success" variant="outlined" sx={{ width: '250px' }}>
              Upgrade Successful!
            </Alert>
          </Grid>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              sx={{
                fontSize: '20px',
                paddingX: '50px',
              }}
              style={{ backgroundColor: '#1FA9FF' }}
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

import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

// @mui
import { Container, Typography, Button, Grid, Alert } from '@mui/material';

// ----------------------------------------------------------------------

export default function FenceRequestCongratulation() {
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate('/tutorial');
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
              Successfully submitted!
            </Alert>
          </Grid>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              sx={{
                fontSize: { md: '20px', xs: '16px' },
                paddingX: '50px',
                color: '#1288E3',
                backgroundColor: '#C0DEFF !important',
              }}
              onClick={handleClickItem}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

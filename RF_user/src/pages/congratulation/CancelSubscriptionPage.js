import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

// @mui
import { Container, Typography, Button, Grid, Alert } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function CancelSubscriptionCongratulationPage() {
  const navigate = useNavigate();
  const handleClickItem = () => {
    navigate(PATH_DASHBOARD.user.account);
  };
  return (
    <>
      <Helmet>
        <title> Subscription Cancel Success Page | RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: 30,
          minHeight: 1,
        }}
      >
        <Typography
          align="center"
          fontSize="48px"
          fontWeight={700}
          lineHeight="48px"
          fontFamily="Barlow"
          marginBottom={2}
        >
          Subscription Cancelled
        </Typography>

        <Grid container sx={{ pt: { xs: 1 } }} spacing={2}>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
            <Alert severity="success" variant="outlined" sx={{ width: '250px' }}>
              Success!
            </Alert>
          </Grid>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
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
              Exit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

// @mui
import { Container, Typography, Button, Grid, Stack, Box } from '@mui/material';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function CallForSwitchPage() {
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate(-1);
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
          Are you sure you want to switch
          <br />
          from annually to monthly?
        </Typography>

        <Grid container sx={{ pt: { xs: 1 } }} spacing={30}>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
            <Box style={{ padding: '3px', border: '3px' }}>
              <Stack
                display="flex"
                variant="outlined"
                sx={{ width: '230px', justifyContent: 'space-between', border: '2px' }}
                flexDirection="row"
              >
                <Iconify icon="cil:mobile" />
                Please Call <a href={`tel:${2489857575}`}>248-985-7575</a>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} container justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              sx={{
                fontSize: '20px',
                paddingX: '50px',
                width: '240px',
                color: '#1288E3',
                backgroundColor: '#C0DEFF !important',
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

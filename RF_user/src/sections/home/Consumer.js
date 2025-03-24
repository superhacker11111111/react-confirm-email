import { Typography, Container, Box, Grid } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';

export default function Consumer() {
  return (
    <Box
      gap={1}
      display="grid"
      sx={{
        backgroundColor: '#1FA9FF',
      }}
    >
      <Container component={MotionViewport}>
        <Grid
          display="flex"
          container
          justifyContent="space-between"
          sx={{ py: { xs: 3, md: 3 } }}
          spacing={3}
        >
          <Grid item xs={12} md={8}>
            <Box sx={{ py: 3 }}>
              <Typography
                sx={{
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: { md: '64px', xs: '52px' },
                  textShadow: `0px 4px 3px rgba(0, 0, 0, 0.3)`,
                }}
              >
                Did you know?
              </Typography>
              &nbsp;&nbsp;
              <Typography
                sx={{
                  color: '#ffffff',
                  textShadow: `0px 4px 3px rgba(0, 0, 0, 0.3)`,
                  fontSize: { md: '40px', xs: '30px' },
                }}
              >
                <span style={{ fontWeight: '700' }}>81</span>
                <span style={{ fontWeight: '400' }}>
                  % of consumers say that AR will make it easier to make purchasing decisions?
                </span>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3.7} style={{ textAlign: '-webkit-center' }}>
            <Box
              style={{
                backgroundColor: '#ffffff',
                textAlign: 'center',
                borderRadius: 20,
                width: { sm: '379px' },
                display: 'grid',
              }}
            >
              <Box sx={{ pt: 4, pb: 5 }}>
                <Typography sx={{ fontSize: '128px', fontWeight: '600' }}>81%</Typography>
                <Typography
                  sx={{ fontSize: '32px', fontWeight: '600' }}
                  style={{ marginTop: '-30px' }}
                >
                  OF CONSUMERS
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

import { Typography, Container, Box, Grid } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { MotionViewport, varFade } from '../../components/animate';

export default function Increase() {
  return (
    <Box
      gap={1}
      display="grid"
      sx={{
        backgroundColor: '#1FA9FF',
        boxShadow: 5,
        marginBottom: '140px',
      }}
    >
      <Container component={MotionViewport}>
        <Grid
          display="flex"
          container
          justifyContent="space-between"
          sx={{ px: { md: 6, lg: 6 }, pt: 12, pb: 8 }}
        >
          <Grid item xs={12} md={4.6} style={{ textAlign: '-webkit-center' }}>
            <Box
              style={{
                backgroundColor: '#ffffff',
                textAlign: 'center',
                borderRadius: 20,
                width: { sm: '379px' },
                display: 'grid',
              }}
            >
              <Box sx={{ pt: 4, pb: 5, boxShadow: 5 }}>
                <Typography sx={{ fontSize: '128px', fontWeight: '600' }}>95%</Typography>
                <Typography
                  sx={{ fontSize: '48px', fontWeight: '600' }}
                  style={{ marginTop: '-50px' }}
                >
                  INCREASE
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ py: 3, textAlign: 'center' }}>
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
                  fontSize: { md: '32px', xs: '28px' },
                }}
              >
                <span style={{ fontWeight: '400' }}>
                  Viewing products in AR can increase purchase intent by as much as
                </span>
                <span style={{ fontWeight: '700' }}> 95</span>
                <span style={{ fontWeight: '400' }}>%.</span>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ px: { md: 6, lg: 6 }, pb: 12 }}>
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 3,
              display: 'grid',
              px: { xs: 2, md: 6, lg: 6 },
              py: { xs: 4, md: 10, lg: 10 },
              boxShadow: 5,
            }}
          >
            <Typography sx={{ fontSize: '24px', fontWeight: '700', color: '#1FA9FF' }}>
              Verified Fence Buyer <CheckCircleRoundedIcon />
            </Typography>
            &nbsp;
            <Typography sx={{ fontSize: '20px', fontWeight: '800' }}>
              “It would have been so helpful to see the fence in person, almost like you are in a
              Home Depot. Instead, they just post what they have previously done on Facebook.
            </Typography>
            &nbsp;
            <Typography sx={{ fontSize: '20px', fontWeight: '800' }}>
              The only fences I was shown were in the booklet I was given, and it only really showed
              the different post caps on the top. So I just went with something like, super basic...
              because I am a very visual person. I mean it is done, it is up, and it works, but It
              is not really what I wanted.”
            </Typography>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

import { Typography, Container, Box, Grid } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { MotionViewport, varFade } from '../../components/animate';

export default function MoreLikely() {
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
          <Grid item xs={12} md={7}>
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
                  fontSize: { md: '32px', xs: '28px' },
                }}
              >
                <span style={{ fontWeight: '400' }}>
                  Customers that use AR to preview products are up to
                </span>
                <span style={{ fontWeight: '700' }}> 2.5x </span>
                <span style={{ fontWeight: '400' }}>more likely to make a purchase.</span>
              </Typography>
            </Box>
          </Grid>
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
                <Typography sx={{ fontSize: '128px', fontWeight: '600' }}>2.5x</Typography>
                <Typography
                  sx={{ fontSize: '48px', fontWeight: '600' }}
                  style={{ marginTop: '-50px' }}
                >
                  MORE LIKELY
                </Typography>
              </Box>
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
              “They brought a sample of the fence material, and that gave us an idea of what the
              color would look like, but I guess I didn’t really know how it would actually go with
              the yard.
            </Typography>
            &nbsp;
            <Typography sx={{ fontSize: '20px', fontWeight: '800' }}>
              It didn’t feel professional. I mean, it felt like a weekend project if my dad was in
              town.
            </Typography>
            &nbsp;
            <Typography sx={{ fontSize: '20px', fontWeight: '800' }}>
              If they would have showed up with technology like{' '}
              <span style={{ color: '#1FA9FF' }}> RealityFence</span>, I would have felt a lot more
              like, ‘okay, these guys kind of know what they’re doing.’ I probably wouldn’t have
              felt the need to get 3 more quotes. If they had been able to show me what it would
              have looked like, I would have felt so much more confident in my decision.”
            </Typography>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

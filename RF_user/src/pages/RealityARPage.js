import { Typography, Container, Grid, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Image from '../components/image';
import soldImage from '../assets/illustrations/AR_1.png';
import realityfences from '../assets/illustrations/AR_2.png';

export default function NewPage() {
  return (
    <Container
      sx={{
        pt: { lg: 8, xs: 5 },
        pb: { xs: 20, md: 30, lg: 30 },
        display: { md: 'flex' },
        height: { md: 'auto' },
      }}
    >
      <Grid container sx={{ px: { lg: 10, sx: 3 } }} justifyContent="space-between">
        <Grid item xs={12} md={7.5} lg={7.5}>
          <Typography sx={{ fontSize: { lg: '48px', md: '36px', xs: '24px' }, fontWeight: '800' }}>
            Augmented <br /> Reality (AR)
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '24px', sm: '18px', xs: '12px' },
              fontWeight: '800',
              pb: { md: 4, xs: 3 },
              pt: { md: 3, xs: 2 },
            }}
          >
            The Future of Fence Selection-Now
          </Typography>

          <Typography
            sx={{
              fontSize: { md: '22px', sm: '18px', xs: '12px' },
              lineHeight: 1.5,
              fontWeight: '500',
              pr: 3,
            }}
          >
            Augmented Reality (AR) is an exciting technology that overlays digital information onto
            the real world. But how does it change the way we select fences? Here&apos;s how:
            <br />
            <br />
            Traditional fence selection is often a gamble, full of guesswork. &quot;Will this style
            suit my yard?&quot; or &quot;What would this wood look like next to my house?&quot; With
            only static images and samples, a complete picture remains elusive.
            <br />
            <br />
            AR changes this. With AR, visualize different fences directly in your surroundings, all
            from your device. Experience your new fence before purchase, right where it&apos;s
            destined to be.
            <br />
            <br />
            At RealityFence, we take it a step further. We offer highly realistic 3D models, for an
            authentic pre-installation view. Every detail, every grain, right before your eyes. Your
            chosen fence feels like it&apos;s already there.
            <br />
            <br />
            Join us in this future of fence selection. Try, play, experience. Welcome to
            RealityFence-where seeing is truly believing.
          </Typography>
        </Grid>
        <Grid item xs={12} md={3.8} lg={3.8}>
          <Stack
            alignItems="center"
            sx={{ marginTop: { lg: '170px', md: '135px' }, display: { md: 'inherit', xs: 'none' } }}
          >
            <Image
              alt="mobile app"
              src={soldImage}
              sx={{
                filter: (theme) =>
                  `drop-shadow(0 48px 80px ${alpha(theme.palette.common.black, 0.24)})`,
              }}
            />
          </Stack>

          <Stack sx={{ mt: 20, display: { xs: 'none', md: 'inherit' } }}>
            <Image
              alt="mobile app"
              src={realityfences}
              sx={{
                mt: 1,

                filter: (theme) =>
                  `drop-shadow(0 48px 80px ${alpha(theme.palette.common.black, 0.24)})`,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

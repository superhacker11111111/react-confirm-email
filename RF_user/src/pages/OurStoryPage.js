import { Typography, Container, Grid, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Image from '../components/image';
import smartmockupaImage from '../assets/illustrations/smartmockups_1.png';
import smartmockupbImage from '../assets/illustrations/smartmockups_2.png';

export default function NewPage() {
  return (
    <Container
      sx={{
        pt: { md: 8, sm: 2 },
        pb: { xs: 20, md: 30, lg: 30 },
        display: { md: 'flex' },
        height: { md: 'auto' },
      }}
    >
      <Grid container sx={{ px: { lg: 10, xs: 2 } }} justifyContent="space-between">
        <Grid item xs={10.6} md={7.5} lg={7.5} sx={{ placeContent: 'center' }}>
          <Typography
            sx={{ fontSize: { md: '48px', sm: '36px', xs: '24px' }, fontWeight: '800', pb: 4 }}
          >
            Our Story
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '24px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '800',
            }}
          >
            About RealityFence
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '22px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '500',
            }}
          >
            RealityFence represents a revolutionary leap in the fencing industry, transforming a
            traditional field with the power of argumented reality. We&apos;re not just a business,
            we&apos;re an Innovation, bringing imagination and practicality together.
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '24px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '800',
              mt: 4,
            }}
          >
            Our Origins
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '22px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '500',
            }}
          >
            Our story begins with our founder, Drew Baskin. Hailing from a family with decades of
            fencing experise, Drew intimately knew the sounds, sights, and scents of the fencing
            world. His experience shaped our vision, turning the flicker of imagination into a
            powerful, game-changing force
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '24px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '800',
              mt: 4,
            }}
          >
            Identifying the Problem
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '22px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '500',
            }}
          >
            Through years in the industry, Drew observed how sales reps relied on traditional
            methods for customer demonstrations-fence panels, swatches, catalogs. The uncertainty on
            customers&apos; faces was clear. The leap from sample to imaging it in their own space
            was often too great.
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '24px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '800',
              mt: 4,
            }}
          >
            The Birth of an Idea
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '22px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '500',
            }}
          >
            The eureka moment came to Drew during an ordinary customer interaction. A client simply
            pointed at a neighbor&apos;s fence and said, &quot;I want that.&quot; In that moment,
            Drew envisioned a future where every customer could have such certainty in their choice.
            The solution was clear:augmented reality. With AR, customer could visualize different
            fence options in their actual environments, turning a daunting decision into a
            confident, immersive experience.
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '24px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '800',
              mt: 4,
            }}
          >
            Our Team
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '22px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '500',
            }}
          >
            Adam Shireman, Drew&apos;s mentor and high school teacher, partnered in this journey.
            Formerly an educator and then a player in software sales, Adam shared Drew&apos;s belief
            in the power of innovation and creativity. Their partnership led to the creation of
            RealityFence-a testament to shared dreams and collaboration.
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '24px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '800',
              mt: 4,
            }}
          >
            Our Mission
          </Typography>
          <Typography
            sx={{
              fontSize: { md: '22px', sm: '18px', xs: '12px' },
              lineHeight: { xs: 1.5 },
              fontWeight: '500',
            }}
          >
            RealityFence is more than just a company. It&apos;s a shared vision to reshape the
            fencing industry and transform the customer experience. With our solution, choosing a
            fence becomes an exciting, certain process, forever changing the way fences are sold.
          </Typography>
        </Grid>
        <Grid item xs={12} md={3.8} lg={3.8}>
          <Stack
            alignItems="center"
            sx={{ marginTop: '110px', display: { xs: 'none', md: 'inherit' } }}
          >
            <Image
              alt="mobile app"
              src={smartmockupaImage}
              sx={{
                filter: (theme) =>
                  `drop-shadow(0 48px 80px ${alpha(theme.palette.common.black, 0.24)})`,
              }}
            />
          </Stack>

          <Stack
            alignItems="center"
            sx={{ marginTop: '180px', display: { xs: 'none', md: 'inherit' } }}
          >
            <Image
              alt="mobile app"
              src={smartmockupbImage}
              sx={{
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

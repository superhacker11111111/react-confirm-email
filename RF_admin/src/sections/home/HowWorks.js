// @mui
import { Typography, Container, Box } from '@mui/material';
// assets
import selection from '../../assets/illustrations/selection.png';
import scan from '../../assets/illustrations/scan.png';
import sold from '../../assets/illustrations/sold.png';

// ----------------------------------------------------------------------

const STEPS = [
  {
    title: 'Choose a fence',
    description: 'Select between our premade or add custom fences in account.',
    image: selection,
  },
  {
    title: 'Place it',
    description: 'Choose where you want to see your fence.',
    image: scan,
  },
  {
    title: 'Easily Showcase',
    description: 'From here, you can easily save and share with customers!',
    image: sold,
  },
];

// ----------------------------------------------------------------------

export default function CareerLandingStep() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        pt: { xs: 10, md: 15 },
        pb: { xs: 5, md: 10 },
      }}
    >
      <Container>
        <Typography
          variant="h1"
          sx={{
            my: 3,
            fontFamily: 'Poppins',
          }}
        >
          It&apos;s this easy?
        </Typography>

        <Box
          sx={{
            display: 'grid',
            my: { xs: 8, md: 10 },
            gap: { xs: 8, md: 5 },
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {STEPS.map((value, index) => (
            <div key={value.title}>
              <img
                src={value.image}
                style={{ width: 300, height: 450, display: 'block', margin: 'auto' }}
                alt={value.title}
              />
              <Typography
                variant="overline"
                sx={{ mt: 4, display: 'block', color: 'text.disabled' }}
              >
                {/* Step {index + 1} */}
              </Typography>

              <Typography sx={{ fontSize: '34px', fontWeight: '700', mt: 2, mb: 1 }}>
                {value.title}
              </Typography>

              <Typography sx={{ color: 'text.secondary', fontWeight: '400', fontSize: '24px' }}>
                {value.description}
              </Typography>
            </div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

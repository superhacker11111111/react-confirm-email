// @mui
import { Typography, Container, Box, useMediaQuery, Stack } from '@mui/material';
// assets
import { MotionViewport, varFade } from '../../components/animate';
import selection from '../../assets/illustrations/selection.png';
import scan from '../../assets/illustrations/scan.png';
import sold from '../../assets/illustrations/sold.png';

// ----------------------------------------------------------------------

const STEPS = [
  {
    index: '1',
    title: 'Select a Fence',
    description: 'STEP 1',
    description1: 'STEP 1:',
    image: selection,
  },
  {
    index: '2',
    title: 'Tap to Place',
    description: 'STEP 2',
    description1: 'STEP 2:',
    image: scan,
  },
  {
    index: '3',
    title: 'Make the Sale',
    description: 'STEP 3',
    description1: 'STEP 3:',
    image: sold,
  },
];

// ----------------------------------------------------------------------

export default function CareerLandingStep() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        textAlign: 'center',
        pb: { xs: 1, md: 10 },
        mt: { xs: 3 },
        marginBottom: '40px',
      }}
    >
      <Container component={MotionViewport}>
        <Typography
          sx={{
            fontSize: { lg: '42px', md: '32px', sm: '28px', xs: '24px' },
            fontWeight: 900,
            color: 'black',
            fontFamily: 'Poppins',
          }}
        >
          It&apos;s as easy as...
        </Typography>

        {!isMobile ? (
          <Box
            sx={{
              display: 'grid',
              my: 3,
              mx: { lg: 23, md: 17, sm: 9, xs: 4 },
              gap: { xs: 2, md: 3 },
              gridTemplateColumns: 'repeat(3, 1fr)',
            }}
          >
            {STEPS.map((value, index) => (
              <div key={index}>
                <img
                  src={value.image}
                  style={{ display: 'block', margin: 'auto' }}
                  alt={value.title}
                />
                <Typography variant="overline" sx={{ display: 'block', color: 'text.disabled' }}>
                  {/* Step {index + 1} */}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { lg: '28px', md: '20px', sm: '16px', xs: '12px' },
                    fontWeight: '900',
                    mt: 2,
                    px: { xs: 1, md: 0.1 },
                    lineHeight: 1,
                  }}
                >
                  {value.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'Public Sans',
                    fontWeight: '750',
                    fontSize: { lg: '18px', md: '16px', xs: '12px' },
                    lineHeight: 1,
                    mt: 0.5,
                  }}
                  display={{ xs: 'none', md: 'block' }}
                >
                  {value.description}
                </Typography>
              </div>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              mb: 3,
              mt: 1,
              mx: 8,
              gap: { xs: 2, md: 3 },
              gridTemplateColumns: 'repeat(1, 1fr)',
            }}
          >
            {STEPS.map((value, index) => (
              <div key={index}>
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    mb: 2,
                    mt: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Public Sans',
                      fontWeight: '750',
                      fontSize: { lg: '18px', xs: '16px' },
                      lineHeight: 1,
                    }}
                  >
                    {value.description1}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { lg: '28px', md: '20px', xs: '16px' },
                      fontWeight: '900',
                      px: { xs: 1, md: 0.1 },
                      lineHeight: 1,
                    }}
                  >
                    {value.title}
                  </Typography>
                </Stack>
                <img
                  src={value.image}
                  style={{ display: 'block', margin: 'auto' }}
                  alt={value.title}
                />
              </div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

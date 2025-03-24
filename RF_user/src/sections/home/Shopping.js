// @mui
import { Typography, Container, Box, Button, Grid } from '@mui/material';
import { PATH_AUTH, PATH_PAGE } from '../../routes/paths';
import { MotionViewport } from '../../components/animate';
// components

// ----------------------------------------------------------------------

export default function CareerLandingStep() {
  return (
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <Container component={MotionViewport}>
        <Typography
          variant="h1"
          sx={{
            my: 3,
          }}
        >
          Why do you want to look at fences?
        </Typography>
        <Box
          sx={{
            display: 'grid',
            my: { xs: 8, md: 10 },
            gap: { xs: 8, md: 5 },
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            },
          }}
        >
          <Grid item xs={6}>
            <Button
              variant="text"
              color="inherit"
              style={{
                color: 'white',
                backgroundColor: '#1288e3',
                padding: '24px 46px',
                fontSize: 24,
                borderRadius: 5,
                fontFamily: 'system-ui',
                fontWeight: '600',
              }}
              href={PATH_AUTH.register}
            >
              I am shopping for a fence!
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              variant="text"
              color="inherit"
              style={{
                color: 'white',
                backgroundColor: '#1288e3',
                padding: '24px 46px',
                fontSize: 24,
                borderRadius: 5,
                fontFamily: 'system-ui',
                fontWeight: '600',
              }}
              href={PATH_PAGE.pricing}
            >
              I sell fences professionally!
            </Button>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

import { Typography, Grid, Container, Box } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
import smartmockupsImage from '../../assets/illustrations/smartmockups.png';
import diggerImage from '../../assets/illustrations/landingImage/Digger.png';
import tessellationImage from '../../assets/illustrations/landingImage/tessellation.png';
import measuringtapeImage from '../../assets/illustrations/landingImage/MeasuringTape.png';
import traficconeImage from '../../assets/illustrations/landingImage/TraficCone.png';
import electricdrillImage from '../../assets/illustrations/landingImage/ElectricDrill.png';
import handsawImage from '../../assets/illustrations/landingImage/HandSaw.png';
import jackhammerImage from '../../assets/illustrations/landingImage/Jackhammer.png';
import hammerImage from '../../assets/illustrations/landingImage/Hammer.png';
import wheelbarrowImage from '../../assets/illustrations/landingImage/Wheelbarrow.png';
import circularsawImage from '../../assets/illustrations/landingImage/CircularSaw.png';
import shovelImage from '../../assets/illustrations/landingImage/Shovel.png';
import wrenchpipeImage from '../../assets/illustrations/landingImage/WrenchPipe.png';

const STEPA = [
  {
    title: 'Digger',
    image: diggerImage,
  },
  {
    title: 'Tessellation',
    image: tessellationImage,
  },
  {
    title: 'Measuring Tape',
    image: measuringtapeImage,
  },
  {
    title: 'Trafic Cone',
    image: traficconeImage,
  },
  {
    title: 'Electric Drill',
    image: electricdrillImage,
  },
  {
    title: 'Hand Saw',
    image: handsawImage,
  },
];

const STEPB = [
  {
    title: 'Jackhammer',
    image: jackhammerImage,
  },
  {
    title: 'Hammer',
    image: hammerImage,
  },
  {
    title: 'Wheel Barrow',
    image: wheelbarrowImage,
  },
  {
    title: 'Circular Saw',
    image: circularsawImage,
  },
  {
    title: 'Shovel',
    image: shovelImage,
  },
  {
    title: 'Wrench Pipe',
    image: wrenchpipeImage,
  },
];
export default function Toolshelp() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        pt: { xs: 5, md: 9 },
        pb: { xs: 6, md: 12 },
      }}
    >
      <Container component={MotionViewport}>
        <Typography sx={{ maxWidth: 600, mx: 'auto', fontSize: '36px', fontWeight: '900' }}>
          Tools help you do things you could not before
        </Typography>

        <Container component={MotionViewport}>
          <Grid container spacing={4} style={{ justifyContent: 'center', marginTop: '20px' }}>
            <Grid item md={4} sm={4}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                }}
              >
                {STEPA.map((value, index) => (
                  <Box
                    key={value.title}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    sx={{
                      py: { xs: 2, md: 7 },
                      pr: { xs: 1 },
                    }}
                  >
                    <img src={value.image} style={{ margin: 'auto' }} alt={value.title} />
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item md={4} sm={4}>
              <img
                src={smartmockupsImage}
                alt="smart mockup"
                style={{ display: 'flex', margin: 'auto' }}
              />
            </Grid>
            <Grid item md={4} sm={4}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                }}
              >
                {STEPB.map((value, index) => (
                  <Box
                    key={value.title}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    sx={{
                      py: { xs: 2, md: 7 },
                      pr: { xs: 1 },
                    }}
                  >
                    <img src={value.image} style={{ margin: 'auto' }} alt={value.title} />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Container>
    </Box>
  );
}

// @mui
import { Typography, Container, Box } from '@mui/material';
// components
import SvgColor from '../../components/svg-color';

// ----------------------------------------------------------------------

const STEPS = [
  {
    title: 'Unmatched Professionalism',
    description: 'Showcasing with RealityFence is an immediate upgrade to your professionalism.',
    icon: '/assets/icons/ic_box_job.svg',
  },
  {
    title: 'Customer Confidence',
    description: 'No one will buy without confidence, that is where we come in!',
    icon: '/assets/icons/ic-pie-chart.svg',
  },
  {
    title: 'Immediate Engagement',
    description: 'Every time you use RealityFence expect “wait let me see that!” ',
    icon: '/assets/icons/ic-grid.svg',
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
        <Typography variant="h2" sx={{ my: 3 }} style={{ display: 'inline-block' }}>
          In an ultimate
        </Typography>
        &nbsp;&nbsp;
        <Typography
          variant="h2"
          sx={{ my: 3 }}
          style={{ color: '#1288E3', display: 'inline-block', textIndent: '6px' }}
        >
          Competitive
        </Typography>
        &nbsp;&nbsp;
        <Typography
          variant="h2"
          style={{ display: 'inline-block', textIndent: '6px' }}
          sx={{ my: 3 }}
        >
          industry
        </Typography>
        <Typography sx={{ maxWidth: 680, mx: 'auto', fontSize: '36px' }}>
          To be the best you need to stand out
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
              <Box
                sx={{
                  alignItems: 'center',
                  boxShadow: 3,
                  width: '70px',
                  height: '70px',
                  borderRadius: '16px',
                  mx: 'auto',
                }}
              >
                <SvgColor src={value.icon} sx={{ width: 70, height: 70, mx: 'auto' }} />
              </Box>
              <Typography
                variant="overline"
                sx={{ mt: 4, display: 'block', color: 'text.disabled' }}
              >
                {/* Step {index + 1} */}
              </Typography>

              <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                {value.title}
              </Typography>

              <Typography variant="body2">{value.description}</Typography>
            </div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

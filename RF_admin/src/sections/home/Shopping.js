// @mui
import { Typography, Container, Box, Button, Grid } from '@mui/material';

// ----------------------------------------------------------------------

const STEPS = [
  {
    title: 'Looking to buy a fence?',
    description: 'If you are fence shopping, we will help you get to your dream look!',
    icon: '/assets/icons/ic_shopcart.png',
    button: 'For Shoppers',
  },
  {
    title: 'Sales fences professionally?',
    description: 'Detach blocks, mix elements, attach new styles and produce sites faster',
    icon: '/assets/icons/ic_seller.png',
    button: 'FOR PROFESSIONALS',
  },
];

// ----------------------------------------------------------------------

export default function CareerLandingStep() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        pt: { xs: 16, md: 16 },
        pb: { xs: 8, md: 10 },
      }}
    >
      <Container>
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
          {STEPS.map((value, index) => (
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <img
                  src={value.icon}
                  style={{ width: '150px', height: '140px', mx: 'auto' }}
                  alt="shop"
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h2" sx={{ my: 3 }} style={{ display: 'inline-block' }}>
                  {value.title}
                </Typography>
                <Typography variant="body2" sx={{ my: 3 }}>
                  {value.description}
                </Typography>
                <Button
                  variant="text"
                  color="inherit"
                  style={{
                    color: 'white',
                    backgroundColor: '#1288e3',
                    padding: '8px 16px',
                    fontSize: 18,
                    borderRadius: 10,
                  }}
                  // href={PATH_AUTH.loginUnprotected}
                >
                  {value.button}
                </Button>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

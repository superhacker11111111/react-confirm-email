import { Typography, Container, Box, Button, Stack } from '@mui/material';
import { PATH_PAGE } from '../../routes/paths';
import { MotionViewport, varFade } from '../../components/animate';

const STEPER = [
  {
    title: 'Sell fences?',
    description:
      'Display custom 3D models of your fences in a realistic and interactive way, right in front of your customers. Give them the opportunity to see and experience your products before they even make the purchase.',
    Button: 'Get Started',
    href: PATH_PAGE.subscription,
  },
  {
    title: 'In the market to buy a fence?',
    description:
      ' RealityFence allows shoppers to virtually try different materials, designs, and styles on their property, simplifying the decision-making process.',
    Button: 'RealityFence Shopper',
    href: PATH_PAGE.shopper,
  },
];

export default function Plan() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        marginBottom: '140px',
      }}
    >
      <Container component={MotionViewport}>
        <Typography
          sx={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#212B36',
            textShadow: `0px 4px 3px rgba(0, 0, 0, 0.3)`,
          }}
        >
          A Plan for Everyone
        </Typography>
        <Stack sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              display: 'grid',
              my: { xs: 8, md: 10 },
              gap: { xs: 8, md: 5 },
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              },
              maxWidth: '900px',
            }}
          >
            {STEPER.map((value, index) => (
              <div key={value.title}>
                <Box
                  sx={{
                    height: '380px',
                    backgroundColor: '#F2FAFF',
                    borderRadius: '38px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    px: 7,
                    py: 4,
                    alignItems: 'center',
                    boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.34)',
                  }}
                >
                  <Typography sx={{ fontSize: '32px', fontWeight: '800' }}>
                    {value.title}
                  </Typography>
                  <Typography sx={{ fontSize: '16px' }}>{value.description}</Typography>
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      color: 'white',
                      backgroundColor: '#1288e3',
                      fontSize: '20px',
                      width: '243px',
                      height: '72px',
                    }}
                    href={value.href}
                  >
                    {value.Button}
                  </Button>
                </Box>
              </div>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

import { Typography, Box, Container, Grid, useMediaQuery } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';

const FueledFence = [
  {
    id: 1,
    title: 'AR Fence Library',
    description:
      "With our extensive AR fence library, we offer a fully customizable selection of fences to perfectly align with your offerings and cater to your customers' unique needs.",
    icon: '/assets/icons/fueled/library.svg',
  },
  {
    id: 2,
    title: 'Custom 3D Models',
    description:
      'We offer a tailored experience, allowing customers to request custom 3D models, expanding their design possibilities beyond our extensive library.',
    icon: '/assets/icons/fueled/models.svg',
  },
  {
    id: 3,
    title: 'Share Photo & Video',
    description:
      'With our camera integration, we enable users to capture photos and videos of your fences in their space, facilitating instant sharing with prospective customers.',
    icon: '/assets/icons/fueled/photo.svg',
  },
  {
    id: 4,
    title: 'Built-In Contact Card',
    description:
      'Transform every photo and video taken with the app into a personalized business card, establishing an enduring connection with your customer and enhancing post-visit communication and recall.',
    icon: '/assets/icons/fueled/card.svg',
  },
  {
    id: 5,
    title: 'Monthly Fence Swaps',
    description:
      'Enjoy flexibility with monthly fence swaps, ensuring your showcase always reflects your current offerings or new designs, adapting as your business needs evolve.',
    icon: '/assets/icons/fueled/swap.svg',
  },
  {
    id: 6,
    title: 'Streamlined Workflow',
    description:
      'Experience a streamlined workflow designed specifically for fence sellers. Drive faster sales, engage more deeply with customers, and watch your conversion rates climb.',
    icon: '/assets/icons/fueled/workflow.svg',
  },
];

export default function Fueled() {
  const isMobile = useMediaQuery('(max-width: 700px)');

  return (
    <Box sx={{ textAlign: 'center', backgroundColor: isMobile ? '#ffffff' : '#1FA9FF' }}>
      <Container
        component={MotionViewport}
        sx={{
          textAlign: 'center',

          px: { lg: 34, md: 10, sm: 6, xs: 2 },
          pb: { xs: 8, md: 20 },
          pt: 6,
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            color: isMobile ? 'black' : 'white',
            fontFamily: 'Poppins',
            mx: 'auto',
            mb: '30px',
            fontSize: { lg: '42px', md: '34px', xs: '24px' },
          }}
        >
          Feature-Fueled Fencing
        </Typography>

        <Grid
          container
          columnSpacing={1.5}
          rowSpacing={{ md: 3, xs: 2 }}
          columns={{ xs: 4, md: 12 }}
        >
          {FueledFence.map((item) => (
            <Grid item xs={2} sm={6} md={6} key={item.id}>
              <Box
                sx={{
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  px: { lg: '26px', sm: 2, xs: 1 },
                  pb: { lg: 5, xs: 3 },
                  pt: { lg: 4, xs: 2 },
                  borderRadius: '16px',
                  mx: 'auto',
                  textAlign: 'start',
                  backgroundColor: '#FFFFFF',
                  height: '100%',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    width: { lg: '68px', md: '60px', sm: '52px', xs: '45px' },
                    height: { lg: '68px', md: '60px', sm: '52px', xs: '45px' },
                    mx: 'auto',
                  }}
                >
                  <img
                    src={item.icon}
                    alt="Icon representing XYZ"
                    style={{
                      width: { lg: 68, md: 60, sm: 52, xs: 45 },
                      height: { lg: 68, md: 60, sm: 52, xs: 45 },
                      mx: 'auto',
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: { lg: '25px', md: '22px', xs: '14px' },
                    fontWeight: 900,
                    ml: '-2px',
                    mr: '-8px',
                  }}
                >
                  {item.title}
                </Typography>

                <Typography sx={{ fontSize: { lg: '18px', md: '14px', sm: '12px', xs: '10px' } }}>
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

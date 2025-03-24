import { m } from 'framer-motion';
import { useRef } from 'react';
import { Typography, Box, Container, Stack, Button, useMediaQuery } from '@mui/material';
// @mui
import Carousel from '../../components/carousel';
import { MotionViewport, varFade } from '../../components/animate';
// ----------------------------------------------------------------------

import checkIconImage from '../../assets/illustrations/checkIcon.png';

const UserSay = [
  {
    id: 1,
    description: (
      <span>
        &quot;I can&apos;t say enough positive things about RealityFence. This augmented reality
        fence building software has truly revolutionized the way we do business at Front Rock
        Fences. With RealityFence, we have been able to close more fence jobs than ever before. The
        software&apos;s advanced capabilities allow us to create stunning and realistic visual
        representations of potential fence designs, giving our clients a clear and compelling idea
        of what their finished product will look like.&quot;
      </span>
    ),
    name: 'Matt Wynn',
    company: 'Front Rock Fences',
  },
  {
    id: 2,
    description: (
      <span>
        &quot;I can&apos;t say enough positive things about RealityFence. This augmented reality
        fence building software has truly revolutionized the way we do business at Front Rock
        Fences. With RealityFence, we have been able to close more fence jobs than ever before. The
        software&apos;s advanced capabilities allow us to create stunning and realistic visual
        representations of potential fence designs, giving our clients a clear and compelling idea
        of what their finished product will look like.&quot;
      </span>
    ),
    name: 'Matt Wynn',
    company: 'Front Rock Fences',
  },
  {
    id: 3,
    description: (
      <span>
        &quot;I can&apos;t say enough positive things about RealityFence. This augmented reality
        fence building software has truly revolutionized the way we do business at Front Rock
        Fences. With RealityFence, we have been able to close more fence jobs than ever before. The
        software&apos;s advanced capabilities allow us to create stunning and realistic visual
        representations of potential fence designs, giving our clients a clear and compelling idea
        of what their finished product will look like.&quot;
      </span>
    ),
    name: 'Matt Wynn',
    company: 'Front Rock Fences',
  },
  {
    id: 4,
    description: (
      <span>
        &quot;I can&apos;t say enough positive things about RealityFence. This augmented reality
        fence building software has truly revolutionized the way we do business at Front Rock
        Fences. With RealityFence, we have been able to close more fence jobs than ever before. The
        software&apos;s advanced capabilities allow us to create stunning and realistic visual
        representations of potential fence designs, giving our clients a clear and compelling idea
        of what their finished product will look like.&quot;
      </span>
    ),
    name: 'Matt Wynn',
    company: 'Front Rock Fences',
  },
  {
    id: 5,
    description: (
      <span>
        &quot;I can&apos;t say enough positive things about RealityFence. This augmented reality
        fence building software has truly revolutionized the way we do business at Front Rock
        Fences. With RealityFence, we have been able to close more fence jobs than ever before. The
        software&apos;s advanced capabilities allow us to create stunning and realistic visual
        representations of potential fence designs, giving our clients a clear and compelling idea
        of what their finished product will look like.&quot;
      </span>
    ),
    name: 'Matt Wynn',
    company: 'Front Rock Fences',
  },
];

export default function UserSaying_v2() {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const carouselRef = useRef(null);

  const carouselSettings = {
    infinite: true,
    arrows: false,
    dots: true,
    speed: 500,
    arrowNext: <img src="/assets/icons/ic_next.svg" alt="Next" />,
    arrowPrev: <img src="/assets/icons/ic_prev.svg" alt="Prev" />,
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Box sx={{ backgroundColor: '#F4F4F4', pb: 2 }}>
      <Box sx={{ width: '100%', backgroundColor: { xs: '#1FA9FF', sm: '#FFFFFF' }, pb: 4 }}>
        <Container
          component={MotionViewport}
          maxWidth="lg"
          sx={{
            backgroundColor: { xs: '#1FA9FF', sm: '#FFFFFF' },
            py: { xs: 4, sm: 8 },
          }}
        >
          <m.div variants={varFade().inUp}>
            <Typography
              sx={{
                fontWeight: 900,
                color: { xs: 'white', sm: 'black' },
                fontFamily: 'Poppins',
                fontSize: { lg: '42px', md: '36px', xs: '28px' },
                textAlign: 'center',
              }}
            >
              Customer Testimonials
            </Typography>
            <Carousel ref={carouselRef} {...carouselSettings}>
              {UserSay.map((item) => (
                <Stack key={item.id}>
                  <Box
                    sx={{
                      boxShadow: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      mx: { xs: 1, sm: 10 },
                      py: { xs: 0, sm: 3 },
                      borderRadius: '32px',
                      textAlign: 'start',
                      backgroundColor: '#1FA9FF',
                      color: '#ffffff',
                      mt: { xs: 0, sm: 4 },
                      mb: '30px',
                      position: 'relative',
                    }}
                  >
                    <Stack
                      sx={{
                        justifyContent: 'space-around',
                        height: '100%',
                        px: { xs: 0, sm: '60px' },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { md: '20px', sm: '18px', xs: '18px' },
                          mb: 2,
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Stack sx={{ flexDirection: 'column' }}>
                        <div className="flex gap-3 items-center">
                          <img src={checkIconImage} alt="check icon" />
                          <Stack>
                            <Typography
                              sx={{ fontSize: { md: '18px', xs: '14px' }, fontWeight: '700' }}
                            >
                              {item.name}
                            </Typography>
                            <Typography sx={{ fontSize: { md: '18px', xs: '14px' } }}>
                              {item.company}
                            </Typography>
                          </Stack>
                        </div>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Carousel>
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Button
                sx={{
                  position: 'absolute',
                  left: { xs: '40px', sm: '150px', md: '200px', lg: '385px' },
                }}
                onClick={() => handlePrev()}
              >
                <img style={{ width: '30px' }} src="/assets/icons/ic_prev.svg" alt="prev" />
              </Button>
              <Button
                sx={{
                  position: 'absolute',
                  right: { xs: '40px', sm: '150px', md: '200px', lg: '385px' },
                }}
                onClick={() => handleNext()}
              >
                <img style={{ width: '30px' }} src="/assets/icons/ic_next.svg" alt="next" />
              </Button>
            </Stack>
          </m.div>
        </Container>
      </Box>
    </Box>
  );
}

import { m } from 'framer-motion';
import { useRef } from 'react';
import { Typography, Box, Container, Stack, Button, useMediaQuery } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
// @mui
import Carousel from '../../components/carousel';
import Customer1 from '../../assets/illustrations/v2/Customer1.png';
import CustomerBrand1 from '../../assets/illustrations/v2/CustomerBrand1.png';
// ----------------------------------------------------------------------

const UserSay = [
  {
    id: 1,
    image: Customer1,
    brand: CustomerBrand1,
    description: (
      <span>
        &quot;If you want to be successful, RealityFence comes first. Before a CRM, before a quoting
        tool - before everything.&quot;
      </span>
    ),
    name: 'Shawn King',
  },
  {
    id: 1,
    image: Customer1,
    brand: CustomerBrand1,
    description: (
      <span>
        &quot;If you want to be successful, RealityFence comes first. Before a CRM, before a quoting
        tool - before everything.&quot;
      </span>
    ),
    name: 'Shawn King',
  },
  {
    id: 1,
    image: Customer1,
    brand: CustomerBrand1,
    description: (
      <span>
        &quot;If you want to be successful, RealityFence comes first. Before a CRM, before a quoting
        tool - before everything.&quot;
      </span>
    ),
    name: 'Shawn King',
  },
  {
    id: 1,
    image: Customer1,
    brand: CustomerBrand1,
    description: (
      <span>
        &quot;If you want to be successful, RealityFence comes first. Before a CRM, before a quoting
        tool - before everything.&quot;
      </span>
    ),
    name: 'Shawn King',
  },
];

export default function CustomerSaying_v2() {
  const carouselRef = useRef(null);

  const isMobile = useMediaQuery('(max-width:720px)');

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
    <Box bgcolor="#F4F4F4" paddingY={2}>
      <Box bgcolor="#F4F4F4" sx={{ paddingY: 2, backgroundColor: '#FFFFFF' }}>
        <Container component={MotionViewport} maxWidth="lg" sx={{ paddingBottom: 12 }}>
          <m.div variants={varFade().inUp}>
            <Carousel ref={carouselRef} {...carouselSettings}>
              {UserSay.map((item) => (
                <Stack
                  key={item.id}
                  sx={{
                    display: 'flex !important',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: isMobile ? 0 : 10,
                    marginBottom: 4,
                  }}
                >
                  {isMobile && <img style={{ width: '300px' }} src={item.brand} alt="prev" />}
                  <Stack
                    flexDirection="row"
                    justifyContent="center"
                    alignItems={isMobile ? 'left' : 'center'}
                  >
                    <img
                      style={{ width: isMobile ? '150px' : '300px' }}
                      src={item.image}
                      alt="prev"
                    />
                    <Stack flexDirection="column" alignItems={isMobile ? 'left' : 'center'}>
                      {!isMobile && (
                        <img
                          style={{ width: '350px', marginBottom: 20 }}
                          src={item.brand}
                          alt="prev"
                        />
                      )}
                      <Typography
                        variant={isMobile ? 'h6' : 'h4'}
                        color="#0073CE"
                        fontFamily="Poppins"
                        sx={{
                          textAlign: isMobile ? 'left' : 'center',
                          width: isMobile ? '230px' : '390px',
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Typography
                        variant="h4"
                        color="#CD413D"
                        fontFamily="Poppins"
                        sx={{ marginTop: 4, textAlign: isMobile ? 'left' : 'center' }}
                      >
                        -&nbsp;{item.name}
                      </Typography>
                    </Stack>
                  </Stack>
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

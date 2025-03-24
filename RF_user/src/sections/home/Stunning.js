import { m } from 'framer-motion';
import { Typography, Container, Box, Stack, Button, useMediaQuery } from '@mui/material';
import { useRef } from 'react';
import { MotionViewport, varFade } from '../../components/animate';
import ActualFencesImage from '../../assets/illustrations/actualfence/actualfences.png';
import GalleryFencesImage from '../../assets/illustrations/actualfence/realityfences.png';
import ActualFencesImage1 from '../../assets/illustrations/actualfence/actualfences_1.png';
import GalleryFencesImage1 from '../../assets/illustrations/actualfence/realityfences_1.png';
import ActualFencesImage2 from '../../assets/illustrations/actualfence/actualfences_2.png';
import GalleryFencesImage2 from '../../assets/illustrations/actualfence/realityfences_2.png';
import ActualFencesImage3 from '../../assets/illustrations/actualfence/actualfences_3.png';
import GalleryFencesImage3 from '../../assets/illustrations/actualfence/realityfences_3.png';
import ActualFencesImage4 from '../../assets/illustrations/actualfence/actualfences_4.png';
import GalleryFencesImage4 from '../../assets/illustrations/actualfence/realityfences_4.png';
import ActualFencesmImage from '../../assets/illustrations/actualfence/actualfences_m.png';
import GalleryFencesmImage from '../../assets/illustrations/actualfence/realityfences_m.png';
import ActualFencesmImage1 from '../../assets/illustrations/actualfence/actualfences_m1.png';
import GalleryFencesmImage1 from '../../assets/illustrations/actualfence/realityfences_m1.png';
import ActualFencesmImage2 from '../../assets/illustrations/actualfence/actualfences_m2.png';
import GalleryFencesmImage2 from '../../assets/illustrations/actualfence/realityfences_m2.png';
import ActualFencesmImage3 from '../../assets/illustrations/actualfence/actualfences_m3.png';
import GalleryFencesmImage3 from '../../assets/illustrations/actualfence/realityfences_m3.png';
import ActualFencesmImage4 from '../../assets/illustrations/actualfence/actualfences_m4.png';
import GalleryFencesmImage4 from '../../assets/illustrations/actualfence/realityfences_m4.png';
import Carousel from '../../components/carousel';

export default function Stunning() {
  const carouselRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };
  const carouselSettings = {
    infinite: true,
    arrows: false,
    dots: true,
    speed: 500,
  };

  const StunningDetail = [
    {
      index: 1,
      title: 'Actual Fences',
      actual: ActualFencesImage,
      real: GalleryFencesImage,
    },
    {
      index: 2,
      title: 'Power Fences',
      actual: ActualFencesImage1,
      real: GalleryFencesImage1,
    },
    {
      index: 3,
      title: 'Actual Fence',
      actual: ActualFencesImage2,
      real: GalleryFencesImage2,
    },
    {
      index: 4,
      title: 'Power Fence',
      actual: ActualFencesImage3,
      real: GalleryFencesImage3,
    },
    {
      index: 5,
      title: 'Power Fence',
      actual: ActualFencesImage4,
      real: GalleryFencesImage4,
    },
  ];

  const StunningMobileDetail = [
    {
      index: 1,
      title: 'Actual Fences',
      actual: ActualFencesmImage,
      real: GalleryFencesmImage,
    },
    {
      index: 2,
      title: 'Power Fences',
      actual: ActualFencesmImage1,
      real: GalleryFencesmImage1,
    },
    {
      index: 3,
      title: 'Actual Fence',
      actual: ActualFencesmImage2,
      real: GalleryFencesmImage2,
    },
    {
      index: 4,
      title: 'Power Fence',
      actual: ActualFencesmImage3,
      real: GalleryFencesmImage3,
    },
    {
      index: 5,
      title: 'Power Fence',
      actual: ActualFencesmImage4,
      real: GalleryFencesmImage4,
    },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#1FA9FF"
      boxShadow={5}
      marginBottom={{ md: '100px', xs: '48px' }}
      position="relative"
      borderRadius={{ xs: 0, sm: 2 }}
      textAlign="-webkit-center"
      paddingBottom={2}
    >
      <Container component={MotionViewport} maxWidth="lg">
        <m.div variants={varFade().inUp}>
          <Box sx={{ py: { xs: 5, sm: 7, md: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                color: '#ffffff',
                fontWeight: '900',
                fontSize: { lg: '60px', md: '52px', sm: '42px', xs: '30px' },
                fontFamily: 'Poppins',
              }}
            >
              Any fence? Yep.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#ffffff',
                fontSize: { xs: '14px', sm: '18px', md: '21px', lg: '24px' },
                px: { xs: 2, md: 17, lg: 25 },
                pt: 1,
                pb: 4,
              }}
            >
              If you install it, you can demonstrate it with RealityFence. Beyond our extensive
              library, we specialize in creating any custom 3D models you&apos;ll need.
            </Typography>
            {isMobile ? (
              <>
                <Carousel ref={carouselRef} {...carouselSettings}>
                  {StunningMobileDetail.map((stunning) => (
                    <Stack
                      key={stunning.index}
                      sx={{
                        justifyContent: 'center',
                        mb: '10px',
                        px: '12px',
                      }}
                    >
                      <img alt="actual" className="w-[310px] h-[179px]" src={stunning.actual} />
                      <img alt="real" className="w-[310px] h-[179px]" src={stunning.real} />
                    </Stack>
                  ))}
                </Carousel>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    position: 'relative',
                    mt: '-5px',
                  }}
                >
                  <Button
                    sx={{
                      position: 'absolute',
                      left: { xs: '40px', sm: '150px', md: '200px', lg: '450px' },
                    }}
                    onClick={() => handlePrev()}
                  >
                    <img style={{ width: '30px' }} src="/assets/icons/ic_prev.svg" alt="prev" />
                  </Button>
                  <Button
                    sx={{
                      position: 'absolute',
                      right: { xs: '40px', sm: '150px', md: '200px', lg: '450px' },
                    }}
                    onClick={() => handleNext()}
                  >
                    <img style={{ width: '30px' }} src="/assets/icons/ic_next.svg" alt="next" />
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Carousel ref={carouselRef} {...carouselSettings}>
                  {StunningDetail.map((stunning) => (
                    <Stack
                      key={stunning.index}
                      sx={{
                        flexDirection: 'row',
                        display: 'flex !important',
                        justifyContent: 'center',
                        mb: '20px',
                      }}
                    >
                      <img alt="actual" className="w-[370px] h-full" src={stunning.actual} />
                      <img alt="real" className="w-[370px] " src={stunning.real} />
                    </Stack>
                  ))}
                </Carousel>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    position: 'relative',
                    mt: '-5px',
                  }}
                >
                  <Button
                    sx={{
                      position: 'absolute',
                      left: { xs: '40px', sm: '150px', md: '200px', lg: '450px' },
                    }}
                    onClick={() => handlePrev()}
                  >
                    <img style={{ width: '30px' }} src="/assets/icons/ic_prev.svg" alt="prev" />
                  </Button>
                  <Button
                    sx={{
                      position: 'absolute',
                      right: { xs: '40px', sm: '150px', md: '200px', lg: '450px' },
                    }}
                    onClick={() => handleNext()}
                  >
                    <img style={{ width: '30px' }} src="/assets/icons/ic_next.svg" alt="next" />
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        </m.div>
      </Container>
    </Box>
  );
}

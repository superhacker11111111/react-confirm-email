import { m } from 'framer-motion';
import { useRef } from 'react';
import { Typography, Box, Container, Stack, Rating, Button, useMediaQuery } from '@mui/material';
// @mui
import Carousel from '../../components/carousel';
import { MotionViewport, varFade } from '../../components/animate';

// import Carousel from 'react-material-ui-carousel';

// ----------------------------------------------------------------------

import checkIconImage from '../../assets/illustrations/checkIcon.png';
import invertedImage from '../../assets/illustrations/inverted.png';

const UserSay = [
  {
    id: 1,
    description: (
      <span>
        &quot;RealityFence is the new standard for us. No more trying to make sales with our
        Facebook page. We show the real deal, right in their yard, before we even drive the first
        post. It&apos;s a game changer, period!&quot;
      </span>
    ),
  },
  {
    id: 2,
    description: (
      <span>
        &quot;As someone who&apos;s built his life around fencing, RealityFence has been a
        game-changer. I&apos;m not just selling fences anymore, I&apos;m providing an experience.
        Seeing my customers light up when they see their perfect fence right in their yard -
        that&apos;s priceless. This isn&apos;t just an app, it&apos;s the future of my
        business.&quot;
      </span>
    ),
  },
  {
    id: 3,
    description: (
      <span>
        &quot;I&apos;m always on the road, and with RealityFence, every house call is a home run. No
        more vague descriptions or puzzled looks. I just pop open the app, and boom! Their fence,
        their yard, right on the screen. Their smiles say it all, and my closing rate? Sky-high.
        RealityFence is like my secret weapon in the field.&quot;
      </span>
    ),
  },
  {
    id: 4,
    description: (
      <span>
        &quot;Hauling fence samples was a headache. With RealityFence, that&apos;s history. I can
        now show options right on my tablet, in the customer&apos;s yard. This app&apos;s a real
        lifesaver. It&apos;s saved me time, effort, and a lot of trunk space!&quot;
      </span>
    ),
  },
  {
    id: 5,
    description: (
      <span>
        &quot;I was actually really surprised - RealityFence is super easy to use! Just pick a
        fence, scan the yard, tap to place, and bam! Instant visualization. It&apos;s so
        user-friendly, it&apos;s hard to believe.&quot;
      </span>
    ),
  },
];

export default function UserSaying() {
  const carouselRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 700px)');

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
    <Box
      sx={{
        textAlign: 'center',
        pb: { xs: 5, md: 12 },
        pt: { xs: 4, md: 10 },
        px: { xs: 0, md: 8, lg: 12 },
      }}
    >
      {isMobile ? (
        <Box sx={{ backgroundColor: '#1FA9FF', height: '350px' }}>
          <Carousel ref={carouselRef} {...carouselSettings}>
            {UserSay.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  mx: 'auto',
                  pt: 2.5,
                  textAlign: 'start',
                  backgroundColor: '#1FA9FF',
                  color: '#ffffff',
                  height: '300px',
                  position: 'relative',
                }}
              >
                <Stack sx={{ justifyContent: 'space-around', height: '100%', px: '20px' }}>
                  <Typography sx={{ fontSize: '24px', fontWeight: '900' }}>
                    What are our users saying?
                  </Typography>
                  <Typography sx={{ fontSize: { md: '24px', sm: '18px', xs: '14px' }, px: 1.5 }}>
                    {item.description}
                  </Typography>
                  <Stack sx={{ flexDirection: 'column' }}>
                    <div className="flex gap-3 items-center">
                      <img src={checkIconImage} alt="check icon" />
                      <Typography sx={{ fontSize: { md: '16px', xs: '12px' } }}>
                        Verified RealityFence User
                      </Typography>
                    </div>
                    <Rating sx={{ paddingLeft: '40px' }} name="read-only" value={5} readOnly />
                  </Stack>
                </Stack>
                <div className="absolute sm:right-20 sm:bottom-16 bottom-10 right-10 w-16">
                  <img src={invertedImage} alt="invert icon" />
                </div>
              </Box>
            ))}
          </Carousel>
        </Box>
      ) : (
        <Container component={MotionViewport} sx={{ px: { lg: 10, md: 5, xs: 2 } }}>
          <Typography
            sx={{
              fontWeight: 900,
              mx: 'auto',
              color: 'black',
              fontFamily: 'Poppins',
              fontSize: { lg: '42px', md: '36px', xs: '28px' },
              mb: '35px',
            }}
          >
            What are our users saying?
          </Typography>
          <Carousel ref={carouselRef} {...carouselSettings}>
            {UserSay.map((item) => (
              <Stack sx={{ px: { lg: 19, md: 4, xs: 3 } }} key={item.id}>
                <Box
                  sx={{
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    mx: 'auto',
                    pt: { lg: 3, md: 3, xs: 2 },
                    borderRadius: '32px',
                    textAlign: 'start',
                    backgroundColor: '#1FA9FF',
                    color: '#ffffff',
                    height: '270px',
                    mb: '30px',
                    position: 'relative',
                  }}
                >
                  <Stack sx={{ justifyContent: 'space-around', height: '100%', px: '60px' }}>
                    <Typography sx={{ fontSize: { md: '20px', sm: '18px', xs: '18px' } }}>
                      {item.description}
                    </Typography>
                    <Stack sx={{ flexDirection: 'column' }}>
                      <div className="flex gap-3 items-center">
                        <img src={checkIconImage} alt="check icon" />
                        <Typography sx={{ fontSize: { md: '15px', xs: '14px' } }}>
                          Verified RealityFence User
                        </Typography>
                      </div>
                      <Rating sx={{ paddingLeft: '40px' }} name="read-only" value={5} readOnly />
                    </Stack>
                  </Stack>
                  <div className="absolute sm:right-20 sm:bottom-8 bottom-10 right-10">
                    <img src={invertedImage} alt="invert icon" />
                  </div>
                </Box>
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
        </Container>
      )}

      {/* <CarouselArrows
        style={{ display: 'flex', justifyContent: 'space-evenly' }}
        filled
        shape="rounded"
        onNext={handleNext}
        onPrevious={handlePrev}
      /> */}
    </Box>
  );
}

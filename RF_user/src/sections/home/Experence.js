import { m } from 'framer-motion';
import { useRef } from 'react';
import { Typography, Box, Container, Stack, useMediaQuery, Button } from '@mui/material';
import Carousel from '../../components/carousel';
import { MotionViewport, varFade } from '../../components/animate';
// ----------------------------------------------------------------------

import checkIconImage from '../../assets/illustrations/checkIcon.png';
import invertedImage from '../../assets/illustrations/inverted.png';

const UserSay = [
  {
    index: 1,
    title: 'Disappointed',
    description: (
      <span>
        &quot;If I could&apos;ve seen that fence in my yard, like I was walking around it in Home
        Depot or something, that would&apos;ve been a game-changer. What I got? Some Facebook photos
        of past jobs and a booklet that mainly showed me different tops for fence posts.
        <br />
        <br />
        So, what did I do? I went with something really basic... didn&apos;t feel like I had much
        choice. I&apos;m a visual person, and I needed to see more than just pictures. Now the fence
        is there, it does its job, but it isn&apos;t exactly what I wanted.
        <br />
        <br />A personal, walk-around preview would&apos;ve given me the visual confidence I needed
        to pick out my perfect fence.&quot;
      </span>
    ),
  },
  {
    index: 2,
    title: 'Unprofessional ',
    description: (
      <span>
        &quot;They brought a sample of the fence material, and that gave us an idea of what the
        color would look like, but I guess I didn&apos;t really know how it would actually go with
        the yard.
        <br />
        <br />
        It didn&apos;t feel professional. I mean, it felt like a weekend project if my dad was in
        town.
        <br />
        <br />
        If they would have showed up with technology like RealityFence, I would have felt a lot more
        like, &apos;okay, these guys kind of know what they&apos;re doing.&apos; I probably
        wouldn&apos;t have felt the need to get 3 more quotes. If they had been able to show me what
        it would have looked like, I would have felt so much more confident in my decision.&quot;
      </span>
    ),
  },
  {
    index: 3,
    title: 'Like pulling teeth..',
    description: (
      <span>
        &quot; Man, choosing a fence was like pulling teeth. You think it&apos;s gonna be easy,
        right? Pick a style, pick a color, and you&apos;re good to go. But no, it was nothing like
        that. I spent weeks, maybe even a couple of months, going back and forth. Pictures, samples,
        brochures... you name it. Nothing was helping me picture it in my yard.
        <br />
        <br />
        Now, if I&apos;d had something like RealityFence, it would&apos;ve been like night and day.
        No more endless debates, no more second guessing, I&apos;d have seen what I was getting
        right there in my yard, instantly. With that kind of confidence, I could&apos;ve made my
        choice in a snap. And let me tell you, that would&apos;ve saved me a ton of time and stress.
        &quot;
      </span>
    ),
  },
  {
    index: 4,
    title: 'The bigger picture..',
    description: (
      <span>
        &quot;When you&apos;re thinking about a new fence, it&apos;s not just about the fence
        itself. It&apos;s about how it works with your house, your garden, your entire property. I
        mean, you&apos;re not just buying a barrier - you&apos;re creating a look, a feel. And I
        found that to be so difficult, because you can&apos;t just isolate a fence, it&apos;s part
        of a bigger picture.
        <br />
        <br />
        The brochures and samples were fine, but they couldn&apos;t show me what the fence would
        look like against my house, with my garden. I needed to see it in my space.&quot;
      </span>
    ),
  },
  {
    index: 5,
    title: 'But is it safe?',
    description: (
      <span>
        &quot;As a dad, when I&apos;m thinking about a fence, it&apos;s not just about how it looks
        - safety is my number one concern. I spent weeks pouring over different types of fences,
        wanting to make sure whatever we chose would be a safe barrier for my kids.
        <br />
        <br />
        But you know, it&apos;s hard to make a decision based on just pictures and catalogs.
        There&apos;s a world of difference between seeing a fence in a brochure and actually
        visualizing it right in your own backyard.
        <br />
        <br />
        If I could have seen how high and secure the fence looked in our yard, it would have been
        much easier to make a confident choice. That peace of mind, knowing you&apos;ve made the
        right decision for your family&apos;s safety, it&apos;s invaluable.&quot;
      </span>
    ),
  },
];

export default function Experience() {
  const carouselRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 800px)');
  const carouselSettings = {
    infinite: true,
    arrows: false,
    dots: true,
    speed: 500,
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
        pb: { xs: 12, md: 10 },
        pt: { xs: 0, sm: 8 },
      }}
    >
      {isMobile ? (
        <Container component={MotionViewport}>
          <m.div variants={varFade().inUp}>
            <Stack>
              {!isMobile && (
                <Typography
                  sx={{ fontSize: '24px', fontWeight: '900', mb: 4, lineHeight: 1 }}
                  className="px-5 sm:px-10"
                >
                  What are fence shoppers saying about their past experiences?
                </Typography>
              )}
              <Box sx={{ backgroundColor: '#1FA9FF', height: '550px' }}>
                <Carousel ref={carouselRef} {...carouselSettings}>
                  {UserSay.map((item) => (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        mx: 'auto',
                        pt: 4,
                        pb: 5,
                        textAlign: 'start',
                        backgroundColor: '#1FA9FF',
                        color: '#ffffff',
                        height: '500px',
                        position: 'relative',
                      }}
                      key={item.index}
                    >
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: 900,
                          px: '30px',
                          fontFamily: 'Poppins',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Stack sx={{ justifyContent: 'space-around', height: '100%', px: '30px' }}>
                        <Typography sx={{ fontSize: '14px', fontFamily: 'Poppins' }}>
                          {item.description}
                        </Typography>
                        <Stack sx={{ flexDirection: 'column' }}>
                          <div className="flex gap-3 items-center">
                            <img src={checkIconImage} alt="check icon" />
                            <Typography sx={{ fontSize: { md: '24px', xs: '14px' } }}>
                              Verified Fence Buyer
                            </Typography>
                          </div>
                        </Stack>
                      </Stack>
                      <div className="absolute sm:right-20 sm:bottom-10 bottom-5 right-10 w-16">
                        <img src={invertedImage} alt="invert icon" />
                      </div>
                    </Box>
                  ))}
                </Carousel>
              </Box>
            </Stack>
          </m.div>
        </Container>
      ) : (
        <Container component={MotionViewport} sx={{ px: { lg: 10, md: 5, xs: 2 }, mt: 2 }}>
          <m.div variants={varFade().inUp}>
            <Typography
              sx={{
                fontWeight: 900,
                mx: 'auto',
                color: 'black',
                fontFamily: 'Poppins',
                fontSize: { lg: '42px', md: '32px', xs: '24px' },
                pb: '30px',
                px: 14,
                lineHeight: 1.2,
              }}
            >
              What are fence shoppers saying about their past experiences?
            </Typography>
            <Carousel ref={carouselRef} {...carouselSettings}>
              {UserSay.map((item) => (
                <Stack sx={{ px: { lg: 19, md: 4, xs: 3 } }} key={item.index}>
                  <Box
                    sx={{
                      boxShadow: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      mx: 'auto',
                      pt: { lg: 3, md: 6, xs: 6 },
                      pb: 3,
                      borderRadius: '32px',
                      textAlign: 'start',
                      backgroundColor: '#1FA9FF',
                      color: '#ffffff',
                      height: '400px',
                      mb: '30px',
                      position: 'relative',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { lg: '32px', md: '24px' },
                        fontWeight: 900,
                        px: '45px',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Stack sx={{ justifyContent: 'space-around', height: '100%', px: '45px' }}>
                      <Typography sx={{ fontSize: { md: '16px', xs: '14px' }, lineHeight: 1.4 }}>
                        {item.description}
                      </Typography>
                      <Stack sx={{ flexDirection: 'column' }}>
                        <div className="flex gap-3 items-center">
                          <img src={checkIconImage} alt="check icon" />
                          <Typography sx={{ fontSize: { md: '16px', xs: '12px' } }}>
                            Verified Fence Buyer
                          </Typography>
                        </div>
                        {/* <Rating sx={{ paddingLeft: '40px' }} name="read-only" value={5} readOnly /> */}
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
                  left: { xs: '40px', sm: '250px', md: '300px', lg: '385px' },
                }}
                onClick={() => handlePrev()}
              >
                <img style={{ width: '30px' }} src="/assets/icons/ic_prev.svg" alt="prev" />
              </Button>
              <Button
                sx={{
                  position: 'absolute',
                  right: { xs: '40px', sm: '250px', md: '300px', lg: '385px' },
                }}
                onClick={() => handleNext()}
              >
                <img style={{ width: '30px' }} src="/assets/icons/ic_next.svg" alt="next" />
              </Button>
            </Stack>
          </m.div>
        </Container>
      )}
    </Box>
  );
}

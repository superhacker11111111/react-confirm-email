// @mui
import { m } from 'framer-motion';
import { Box, Stack, Container, useMediaQuery, Typography, Card, CardContent } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../components/animate';
import EntireYard from '../../assets/illustrations/v2/EntireYard.png';
import MeasureTool from '../../assets/illustrations/v2/MeasureTool.png';
import SharePhoto from '../../assets/illustrations/v2/SharePhoto.png';
import ContactCard from '../../assets/illustrations/v2/ContactCard.png';
import Customize from '../../assets/illustrations/v2/Customize.png';
import Sales1 from '../../assets/illustrations/v2/Sales1.png';
import Sales2 from '../../assets/illustrations/v2/Sales2.png';
// ----------------------------------------------------------------------

export default function Into_v2() {
  const isMobile = useMediaQuery('(max-width:700px)');

  return (
    <Box bgcolor="#F4F4F4" boxShadow={5} paddingY={2}>
      <Stack spacing={2} flexDirection="column" justifyContent="center" alignItems="center">
        <Container component={MotionViewport} maxWidth="lg">
          <m.div
            variants={varFade().inUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                p: 2,
                width: '90%',
                flexDirection: isMobile ? 'column-reverse' : 'row',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: isMobile ? '90%' : '45%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src={EntireYard} alt="blog" />
              </Box>
              <CardContent
                sx={{
                  p: isMobile ? 0 : 2,
                  width: isMobile ? '100%' : '65%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  paddingBottom: isMobile ? 3 : 0,
                }}
              >
                <Stack
                  sx={{
                    width: isMobile ? '100%' : '90%',
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  <Typography
                    component="div"
                    fontWeight={900}
                    sx={{
                      fontSize: isMobile ? '24px' : { sm: '28px', md: '31px', lg: '39px' },
                      width: isMobile ? '280px' : { sm: '340px', md: '365px', lg: '475px' },
                      lineHeight: 'normal',
                      mb: 2,
                    }}
                  >
                    Virtually Fence the
                    <span style={{ color: '#1FA9FF' }}> Entire Yard</span>
                  </Typography>
                  <Typography
                    fontWeight={isMobile ? 700 : 900}
                    sx={{
                      fontSize: isMobile ? '19px' : { sm: '19px', md: '22px', lg: '29px' },
                      width: isMobile ? '355px' : { sm: '335px', md: '365px', lg: '475px' },
                      lineHeight: 'normal',
                    }}
                  >
                    Dazzle your customers by showing them their entire fence, right in their yard,
                    before it’s even built.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </m.div>
        </Container>
        <Container component={MotionViewport} maxWidth="lg">
          <m.div
            variants={varFade().inUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                p: 2,
                width: '90%',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <CardContent
                sx={{
                  p: isMobile ? 0 : 2,
                  width: isMobile ? '100%' : '65%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  paddingBottom: isMobile ? 3 : 0,
                }}
              >
                <Stack
                  sx={{
                    width: isMobile ? '100%' : '90%',
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  <Typography
                    component="div"
                    fontWeight={900}
                    sx={{
                      fontSize: isMobile ? '24px' : { sm: '28px', md: '31px', lg: '39px' },
                      width: isMobile ? '280px' : { sm: '340px', md: '365px', lg: '475px' },
                      lineHeight: 'normal',
                      mb: 2,
                    }}
                  >
                    <span style={{ color: '#1FA9FF' }}>Measure</span> Tool
                  </Typography>
                  <Typography
                    fontWeight={isMobile ? 700 : 900}
                    sx={{
                      fontSize: isMobile ? '19px' : { sm: '19px', md: '22px', lg: '29px' },
                      width: isMobile ? '355px' : { sm: '335px', md: '365px', lg: '475px' },
                      lineHeight: 'normal',
                    }}
                  >
                    Experience a streamlined workflow designed specifically for fence installers,
                    including the ability for users to measure out the fence length in feet.
                  </Typography>
                </Stack>
              </CardContent>
              <Box sx={{ width: isMobile ? '100%' : '45%', display: 'flex', alignItems: 'center' }}>
                <img src={MeasureTool} alt="blog" />
              </Box>
            </Card>
          </m.div>
        </Container>
        <Container component={MotionViewport} maxWidth="lg">
          <m.div
            variants={varFade().inUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                p: 2,
                width: '90%',
                flexDirection: isMobile ? 'column-reverse' : 'row',
              }}
            >
              <Box sx={{ width: isMobile ? '100%' : '45%', display: 'flex', alignItems: 'center' }}>
                <img src={SharePhoto} alt="blog" />
              </Box>
              <CardContent
                sx={{
                  p: isMobile ? 0 : 2,
                  width: isMobile ? '100%' : '65%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  paddingBottom: isMobile ? 3 : 0,
                }}
              >
                <Stack
                  sx={{
                    width: isMobile ? '100%' : '90%',
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  <Typography
                    component="div"
                    fontWeight={900}
                    sx={{
                      fontSize: isMobile ? '24px' : { sm: '28px', md: '31px', lg: '39px' },
                      width: isMobile ? '280px' : { sm: '340px', md: '365px', lg: '475px' },
                      lineHeight: 'normal',
                      mb: 2,
                    }}
                  >
                    Share&nbsp;
                    <span style={{ color: '#1FA9FF' }}>Photo & Video</span>
                  </Typography>
                  <Typography
                    fontWeight={isMobile ? 700 : 900}
                    sx={{
                      fontSize: isMobile ? '19px' : { sm: '19px', md: '22px', lg: '29px' },
                      width: isMobile ? '355px' : { sm: '335px', md: '365px', lg: '475px' },
                      lineHeight: 'normal',
                    }}
                  >
                    Capture photos and videos of your fences directly on their property, and share
                    with them instantly!
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </m.div>
        </Container>
        <Container component={MotionViewport} maxWidth="lg">
          <m.div
            variants={varFade().inUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                p: 2,
                width: '90%',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <CardContent
                sx={{
                  p: isMobile ? 0 : 2,
                  width: isMobile ? '100%' : '65%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  paddingBottom: isMobile ? 3 : 0,
                }}
              >
                <Stack
                  sx={{
                    width: isMobile ? '100%' : '90%',
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  <Typography
                    component="div"
                    fontWeight={900}
                    sx={{
                      fontSize: isMobile ? '24px' : { sm: '28px', md: '31px', lg: '39px' },
                      width: isMobile ? '280px' : { sm: '340px', md: '365px', lg: '455px' },
                      lineHeight: 'normal',
                      mb: 2,
                    }}
                  >
                    Built in&nbsp;
                    <span style={{ color: '#1FA9FF' }}>Contact Card</span>
                  </Typography>
                  <Typography
                    fontWeight={isMobile ? 700 : 900}
                    sx={{
                      fontSize: isMobile ? '19px' : { sm: '19px', md: '22px', lg: '29px' },
                      width: isMobile ? '355px' : { sm: '335px', md: '365px', lg: '475px' },
                      lineHeight: 'normal',
                    }}
                  >
                    Transform every photo and video into a personalized business card for the best
                    impression and easy follow up.
                  </Typography>
                </Stack>
              </CardContent>
              <Box sx={{ width: isMobile ? '100%' : '45%', display: 'flex', alignItems: 'center' }}>
                <img src={ContactCard} alt="blog" />
              </Box>
            </Card>
          </m.div>
        </Container>
        <Container component={MotionViewport} maxWidth="lg">
          <m.div
            variants={varFade().inUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                p: 2,
                width: '90%',
                flexDirection: isMobile ? 'column-reverse' : 'row',
              }}
            >
              <Box sx={{ width: isMobile ? '100%' : '45%', display: 'flex', alignItems: 'center' }}>
                <img src={Customize} alt="blog" />
              </Box>
              <CardContent
                sx={{
                  p: isMobile ? 0 : 2,
                  width: isMobile ? '100%' : '65%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  paddingBottom: isMobile ? 3 : 0,
                }}
              >
                <Stack
                  sx={{
                    width: isMobile ? '100%' : '90%',
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  <Typography
                    component="div"
                    fontWeight={900}
                    sx={{
                      fontSize: isMobile ? '24px' : { sm: '28px', md: '31px', lg: '39px' },
                      width: isMobile ? '280px' : { sm: '340px', md: '365px', lg: '455px' },
                      lineHeight: 'normal',
                      mb: 2,
                    }}
                  >
                    <span style={{ color: '#1FA9FF' }}>Customize</span>&nbsp;Your Catalog
                  </Typography>
                  <Typography
                    fontWeight={isMobile ? 700 : 900}
                    sx={{
                      fontSize: isMobile ? '19px' : { sm: '19px', md: '22px', lg: '29px' },
                      width: isMobile ? '355px' : { sm: '335px', md: '365px', lg: '475px' },
                      lineHeight: 'normal',
                    }}
                  >
                    Choose from our extensive AR fence library, or request custom fences from our 3D
                    design team.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </m.div>
        </Container>
        <Container component={MotionViewport} maxWidth="lg">
          <m.div
            variants={varFade().inUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                pt: isMobile ? 4 : 2,
                width: '90%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                component="div"
                fontWeight={900}
                sx={{
                  fontSize: isMobile ? '24px' : { sm: '28px', md: '31px', lg: '39px' },
                  width: isMobile ? '280px' : { sm: '340px', md: '365px', lg: '455px' },
                  lineHeight: 'normal',
                  textAlign: 'center',
                }}
              >
                Skyrocket Your Sales
              </Typography>

              <CardContent>
                <Stack
                  flexDirection={isMobile ? 'column' : 'row'}
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={isMobile ? 2 : 0}
                >
                  <Stack sx={{ width: isMobile ? '100%' : '48%' }}>
                    <Box>
                      <img src={Sales1} alt="blog" />
                    </Box>
                    <Typography component="div" variant="h4" fontWeight={900} textAlign="center">
                      Sold on the spot with&nbsp;
                      <span style={{ color: '#1FA9FF' }}>
                        <br />
                        RealityFence
                      </span>
                    </Typography>
                  </Stack>
                  <Stack sx={{ width: isMobile ? '100%' : '48%' }}>
                    <Box>
                      <img src={Sales2} alt="blog" />
                    </Box>
                    <Typography component="div" variant="h4" fontWeight={900} textAlign="center">
                      Another <span style={{ color: '#1FA9FF' }}>happy</span> customer
                      {!isMobile && (
                        <>
                          <br />
                          &nbsp;
                        </>
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </m.div>
        </Container>
      </Stack>
    </Box>
  );
}

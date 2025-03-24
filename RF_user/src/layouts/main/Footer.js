import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Grid,
  Link,
  Stack,
  Container,
  Typography,
  Button,
  useMediaQuery,
} from '@mui/material';
// routes
import { PATH_AUTH, PATH_PAGE } from '../../routes/paths';
import instagramImage from '../../assets/illustrations/footer/Icon_instagram.png';
import facebookImage from '../../assets/illustrations/footer/Icon_facebook.png';
import twitterImage from '../../assets/illustrations/footer/Icon_twitter.png';
import linkedinImage from '../../assets/illustrations/footer/Icon_linkedin.png';
import youtubeImage from '../../assets/illustrations/footer/Icon_youtube.png';
import tiktokImage from '../../assets/illustrations/footer/Icon_tiktok.png';
import whitelogoImage from '../../assets/illustrations/whitelogo.png';
//
// ----------------------------------------------------------------------

const LINKS = [
  {
    id: 1,
    headline: 'Company',
    children: [
      { name: 'Our Story', path: PATH_PAGE.about },
      { name: 'Fences', path: PATH_PAGE.fences },
      { name: 'Login', path: PATH_AUTH.loginUnprotected },
    ],
  },
  {
    id: 2,
    headline: 'Support',
    children: [
      { name: 'Blog', path: PATH_PAGE.blogfences },
      { name: 'RealityFence EDU', path: PATH_PAGE.edfence },
      { name: 'FAQs', path: PATH_PAGE.faqs },
      { name: 'AR', path: PATH_PAGE.arpage },
    ],
  },
];

// ----------------------------------------------------------------------

Footer.propTypes = {
  variant: PropTypes.string,
};

// ---------------------------------------------------------------------

export default function Footer({ variant }) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const mainFooter = (
    <Box
      gap={1}
      display="grid"
      sx={{
        backgroundColor: '#1FA9FF',
      }}
    >
      <Container sx={{ textAlign: '-webkit-center', mt: 3 }}>
        <Grid
          container
          justifyContent={{
            xs: 'center',
            sm: 'space-between',
          }}
          sx={{
            textAlign: {
              xs: 'center',
              md: 'left',
            },
          }}
        >
          {/* {!isMobile ? (
            <div className="flex justify-between  w-full h-[30px]" />
          ) : (
            <div className="flex justify-between  w-full h-[10px]" />
          )} */}
          <Grid item xs={12} sm={4.5} md={2.6}>
            {!isMobile ? (
              <Stack sx={{ placeItems: 'center' }}>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '205px',
                    height: '86px',
                  }}
                >
                  <img src={whitelogoImage} alt="Instagram" />
                </Box>
              </Stack>
            ) : (
              ''
            )}
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', sm: 'column' },
                alignItems: 'center',
                gap: { lg: 4, md: 4, xs: 2 },
                justifyContent: 'space-between',
                mt: { sm: 5, xs: 9 },
              }}
            >
              <Button
                sx={{
                  width: { xs: '104px', sm: '168px' },
                  height: { xs: '45px', sm: '51px' },
                  backgroundColor: '#ffffff',
                  color: 'black',
                  fontSize: { md: '16px', xs: '14px' },
                  borderRadius: '31px',
                }}
                href={PATH_PAGE.subscription}
              >
                Get Started
              </Button>
              <Button
                sx={{
                  width: { xs: '104px', sm: '168px' },
                  height: { xs: '45px', sm: '51px' },
                  backgroundColor: '#ffffff',
                  color: 'black',
                  fontSize: { md: '16px', xs: '14px' },
                  borderRadius: '31px',
                }}
                href={PATH_PAGE.contact}
              >
                Contact
              </Button>
              <Button
                sx={{
                  width: { xs: '104px', sm: '168px' },
                  height: { xs: '45px', sm: '51px' },
                  backgroundColor: '#ffffff',
                  color: 'black',
                  fontSize: { md: '16px', xs: '14px' },
                  borderRadius: '31px',
                  lineHeight: 1,
                }}
                href={PATH_PAGE.shopper}
              >
                Shopper
              </Button>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            md={8.2}
            sx={{
              pt: { xs: '30px', sm: '8px' },
              marginBottom: 5,
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
            }}
          >
            <Grid item xs={12}>
              <Stack
                display="grid"
                gridTemplateColumns={{
                  md: 'repeat(3,1fr)',
                  xs: 'repeat(2, 1fr)',
                }}
                column-gap="15px"
                ml={{ xs: '8px' }}
              >
                {LINKS.map((list) => (
                  <Stack
                    key={list.id}
                    items={list.children}
                    alignItems={{ placeItems: 'start' }}
                    gap={{ md: '30px', xs: '25px' }}
                  >
                    <Typography
                      component="div"
                      color="#ffffff"
                      fontSize="21px"
                      fontWeight="700"
                      marginTop="20px"
                    >
                      {list.headline}
                    </Typography>

                    {list.children.map((link) => (
                      <a key={link.name} href={link.path} style={{ color: '#ffffff' }}>
                        <Typography sx={{ fontSize: '16px' }}>{link.name}</Typography>
                      </a>
                    ))}
                  </Stack>
                ))}
                <Stack spacing="28px" alignItems={{ lg: 'flex-start', placeItems: 'start' }}>
                  <Typography
                    component="div"
                    color="#ffffff"
                    fontSize="21px"
                    fontWeight="700"
                    paddingTop={{ md: '20px', xs: '45px' }}
                  >
                    Contact
                  </Typography>
                  <Link component={RouterLink} color="#ffffff" fontSize="16px">
                    <Typography textAlign="start" sx={{ marginRight: '-20px' }}>
                      Extend Your Reality LLC
                      <br /> 6689 Orchard Lake Rd #245
                      <br /> West Bloomfield MI, 48322
                      <br /> United States of America
                    </Typography>
                  </Link>
                  <Stack>
                    {/* <Link component={RouterLink} color="#ffffff" fontSize="18px"> */}
                    <Typography textAlign="start" sx={{ marginRight: '-20px', color: '#ffffff' }}>
                      <a href="tel:2489857575">248-985-7575</a>
                    </Typography>
                    {/* </Link> */}
                    <Typography textAlign="start" sx={{ marginRight: '-20px', color: '#ffffff' }}>
                      <a href="mailto:contact@realityfence.com">contact@realityfence.com</a>
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        {!isMobile ? (
          <>
            <Grid container item direction="column" md={6} sm={10} xs={11}>
              <Grid
                item
                container
                direction="row"
                xs={12}
                md={6}
                sx={{
                  mt: 14,
                  mb: 12,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Grid>
                  <a href="https://twitter.com/realityfence?s=21&t=MHMn60CoWkdnYSXH5GeIxA">
                    <img src={twitterImage} style={{ height: '45px' }} alt="twitter" />
                  </a>
                </Grid>
                <Grid>
                  <a href="https://www.facebook.com/profile.php?id=100089795147096&mibextid=LQQJ4d">
                    <img src={facebookImage} style={{ height: '45px' }} alt="facebook" />
                  </a>
                </Grid>
                <Grid>
                  <a href="https://www.linkedin.com/company/realityfence/">
                    <img src={linkedinImage} style={{ height: '45px' }} alt="linkedin" />
                  </a>
                </Grid>
                <Grid>
                  <a href="https://youtube.com/@realityfence">
                    <img src={youtubeImage} style={{ height: '45px' }} alt="youtube" />
                  </a>
                </Grid>
                <Grid>
                  <a href="https://instagram.com/realityfence?igshid=OGQ5ZDc2ODk2ZA==">
                    <img src={instagramImage} style={{ height: '45px' }} alt="Instagram" />
                  </a>
                </Grid>
                <Grid>
                  <a href="https://www.tiktok.com/@realityfence?_t=8eEN01ILXig&_r=1">
                    <img src={tiktokImage} style={{ height: '45px' }} alt="tiktok" />
                  </a>
                </Grid>
              </Grid>
            </Grid>
            <hr style={{ position: 'relative', paddingBottom: '150px' }} />
          </>
        ) : (
          <Grid container item direction="column" sx={{ px: 2 }}>
            <Grid
              item
              container
              direction="row"
              xs={11}
              sx={{
                mt: 3,
                mb: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Grid>
                <a href="https://twitter.com/realityfence?s=21&t=MHMn60CoWkdnYSXH5GeIxA">
                  <img src={twitterImage} style={{ height: '27px' }} alt="twitter" />
                </a>
              </Grid>
              <Grid>
                <a href="https://www.facebook.com/profile.php?id=100089795147096&mibextid=LQQJ4d">
                  <img src={facebookImage} style={{ height: '27px' }} alt="facebook" />
                </a>
              </Grid>
              <Grid>
                <a href="https://www.linkedin.com/company/realityfence/">
                  <img src={linkedinImage} style={{ height: '27px' }} alt="linkedin" />
                </a>
              </Grid>
              <Grid>
                <a href="https://youtube.com/@realityfence">
                  <img src={youtubeImage} style={{ height: '27px' }} alt="youtube" />
                </a>
              </Grid>
              <Grid>
                <a href="https://instagram.com/realityfence?igshid=OGQ5ZDc2ODk2ZA==">
                  <img src={instagramImage} style={{ height: '27px' }} alt="Instagram" />
                </a>
              </Grid>
              <Grid>
                <a href="https://www.tiktok.com/@realityfence?_t=8eEN01ILXig&_r=1">
                  <img src={tiktokImage} style={{ height: '27px' }} alt="tiktok" />
                </a>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );

  return mainFooter;
}

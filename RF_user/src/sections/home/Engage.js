import { m } from 'framer-motion';
import {
  Typography,
  Grid,
  Box,
  Container,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  ImageList,
  useMediaQuery,
} from '@mui/material';
import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';
// import FacebookPictureImage from '../../assets/illustrations/facebookpicture.png';
// import SmartmockupImage from '../../assets/illustrations/smartmockupImage.png';
// import chatImage from '../../assets/illustrations/chatImage.png';
import EngageBookImage from '../../assets/illustrations/engage_book.png';
import EngageSmartPhoneImage from '../../assets/illustrations/engage_smartphone.png';

export default function Engage() {
  const isMobile = useMediaQuery('(max-width:700px)');
  const Limitations = [
    {
      id: 1,
      title: 'Limited visual context',
      icon: 'mdi:multiply',
    },
    {
      id: 2,
      title: 'Lacks personalization',
      icon: 'mdi:multiply',
    },
    {
      id: 3,
      title: 'Poor customer interaction',
      icon: 'mdi:multiply',
    },
    {
      id: 4,
      title: 'Delays decision making',
      icon: 'mdi:multiply',
    },
    {
      id: 5,
      title: 'Decreased buyer confidence',
      icon: 'mdi:multiply',
    },
    {
      id: 6,
      title: 'Prolongs sales cycles',
      icon: 'mdi:multiply',
    },
    {
      id: 7,
      title: 'Lower conversion rates',
      icon: 'mdi:multiply',
    },
  ];

  const GameChanger = [
    {
      id: 1,
      title: 'Unparalleled visualization',
      icon: 'material-symbols:check',
    },
    {
      id: 2,
      title: 'Highly interactive ',
      icon: 'material-symbols:check',
    },
    {
      id: 3,
      title: 'Simplified decision making',
      icon: 'material-symbols:check',
    },
    {
      id: 4,
      title: 'Improved customer satisfaction',
      icon: 'material-symbols:check',
    },
    {
      id: 5,
      title: 'Boosted customer conversions',
      icon: 'material-symbols:check',
    },
    {
      id: 6,
      title: 'Streamlined sales process',
      icon: 'material-symbols:check',
    },
    {
      id: 7,
      title: 'Enhanced brand image',
      icon: 'material-symbols:check',
    },
  ];

  return (
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <Container component={MotionViewport} sx={{ px: { lg: 14, md: 6, sm: 4 } }}>
        <m.div variants={varFade().inUp}>
          <Typography
            sx={{
              fontWeight: 900,
              color: 'black',
              mx: 'auto',
              fontSize: { lg: '42px', md: '32px', sm: '24px', xs: '20px' },
              fontFamily: 'Poppins',
            }}
          >
            Still relying on a brochure?
          </Typography>
          <Box
            sx={{
              py: { xs: 3, md: 6, lg: 6 },
              pl: { xs: 0, sm: 3, md: 9, lg: 18 },
              pr: { xs: 0, sm: 3, md: 9, lg: 14 },
              textAlign: 'center',
            }}
          >
            <Grid item container display="flex" justifyContent="space-between">
              {/* <Grid item xs={5.4} md={6}>
              <ImageList
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  borderRadius: '4px',
                  boxShadow: 5,
                  placeContent: 'center',
                }}
              >
                <img src={FacebookPictureImage} alt="pictureImage" />
              </ImageList>
              <div className="md:pl-10 md:pt-2">
                <Typography
                  sx={{
                    fontSize: { lg: '12px', md: '10px', sm: '10px', xs: '6px' },
                    textAlign: 'start',
                  }}
                >
                  View more comments
                </Typography>
                <img src={chatImage} alt="pictureImage" />
              </div>
            </Grid> */}
              <Grid item xs={5.6} sm={5.8}>
                <ImageList
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    borderRadius: '4px',
                    boxShadow: 5,
                    placeContent: 'center',
                  }}
                >
                  <img src={EngageBookImage} alt="engagebook" />
                </ImageList>
              </Grid>
              <Grid
                item
                xs={6}
                sm={5.6}
                sx={{
                  display: 'flex',
                  alignItems: 'start',
                  flexDirection: 'column',
                  mt: { sm: 0, xs: '-10px' },
                }}
              >
                <Typography
                  sx={{
                    color: 'black',
                    fontSize: { lg: '32px', md: '28px', sm: '22px', xs: '14px' },
                    fontWeight: 900,
                    fontFamily: 'Public Sans',
                    textAlign: 'start',
                  }}
                >
                  Common Limitations:
                </Typography>
                <Stack textAlign="start">
                  {Limitations.map((value) => (
                    <ListItem sx={{ padding: '2px' }} key={value.id}>
                      <ListItemIcon style={{ marginRight: '8px' }}>
                        <Iconify
                          icon={value.icon}
                          sx={{ width: { lg: 24, xs: 10 } }}
                          color="#ff0606"
                        />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          sx={{
                            fontSize: { lg: '20px', md: '18px', sm: '16px', xs: '10px' },
                            fontWeight: 650,
                          }}
                        >
                          {value.title}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </m.div>
      </Container>
      <m.div variants={varFade().inUp}>
        <Container component={MotionViewport} sx={{ px: { lg: 14 }, pt: 4 }}>
          {!isMobile ? (
            <Typography
              sx={{
                fontWeight: 900,
                mx: 'auto',
                fontSize: { lg: '42px', md: '34px', sm: '24px', xs: '16px' },
                fontFamily: 'Poppins',
                color: 'black',
              }}
            >
              What if you could demonstrate your
              <br />
              fences directly in a customer&apos;s yard?
            </Typography>
          ) : (
            <Typography
              sx={{
                fontWeight: 900,
                mx: 'auto',
                fontSize: { lg: '42px', md: '34px', sm: '24px', xs: '15px' },
                fontFamily: 'Poppins',
                color: 'black',
              }}
            >
              What if you could demonstrate your fences
              <br />
              directly in a customer&apos;s yard?
            </Typography>
          )}
          <Box
            sx={{
              py: { xs: 3, md: 6, lg: 6 },
              pr: { xs: 0, sm: 3, md: 9, lg: 16 },
              pl: { xs: 0, sm: 3, md: 9, lg: 14 },
              marginBottom: { lg: '100px', xs: '64px' },
              textAlign: 'center',
            }}
          >
            <Grid item container display="flex" justifyContent="space-between">
              {/* <Grid item xs={5.4} md={6}>
              <Box>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '40px',
                  }}
                >
                  <img src={SmartmockupImage} alt="marketing market" />
                </div>
              </Box>
              <Typography
                sx={{
                  fontSize: { lg: '14px', md: '11px', sm: '8px', xs: '6px' },
                  px: { lg: 3, xs: 1 },
                }}
              >
                This is a fence viewed in Augmented Reality, digitally placed in the prospect&apos;
                s yard
              </Typography>
            </Grid> */}
              <Grid item xs={5.6} md={6}>
                <Box>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={EngageSmartPhoneImage} alt="engage smartphone" />
                  </div>
                </Box>
              </Grid>

              <Grid
                item
                xs={6}
                md={5.2}
                sx={{
                  display: 'flex',
                  alignItems: 'start',
                  flexDirection: 'column',
                  mt: { sm: '20px', xs: '-10px' },
                }}
              >
                <Typography
                  sx={{
                    color: 'black',
                    fontSize: { lg: '32px', md: '28px', sm: '22px', xs: '14px' },
                    fontWeight: 900,
                    fontFamily: 'Public Sans',
                    textAlign: 'start',
                  }}
                >
                  Game Changers:
                </Typography>
                <Stack textAlign="start">
                  {GameChanger.map((value) => (
                    <ListItem key={value.id} sx={{ padding: '2px' }}>
                      <ListItemIcon style={{ marginRight: '8px' }}>
                        <Iconify
                          icon={value.icon}
                          sx={{ width: { lg: 24, xs: 10 } }}
                          color="#2DBB5D"
                        />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          sx={{
                            fontSize: { lg: '20px', md: '18px', sm: '14px', xs: '10px' },
                            marginRight: { lg: '-30px' },
                            fontWeight: 650,
                          }}
                        >
                          {value.title}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </m.div>
    </Box>
  );
}

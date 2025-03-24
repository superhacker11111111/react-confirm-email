// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Button,
  Divider,
  Container,
  useMediaQuery,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
// components
import Image from '../../components/image';
import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';
import startnowimg from '../../assets/illustrations/startnowimg1.png';
import memberImage from '../../assets/illustrations/member.png';
// ----------------------------------------------------------------------

const StyledAppStoreButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  padding: '5px 12px',
  margin: theme.spacing(1),
  color: theme.palette.common.white,
  border: `solid 1px ${alpha(theme.palette.common.black, 0.24)}`,
  background: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.common.black} 100%) !important`,
  '& .MuiButton-startIcon': {
    marginLeft: 0,
  },
}));

// ----------------------------------------------------------------------

export default function DownloadAppElearning() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 5, md: 15 }, px: { xs: 2, md: 10 } }}>
      {!isMobile ? (
        <Box>
          <Grid container spacing={2} justifyContent={{ lg: 'space-between' }} alignItems="center">
            <Grid xs={12} md={9.8} lg={8}>
              <Stack
                sx={{
                  textAlign: { xs: 'center', md: 'center' },
                  mt: 2,
                  mb: 6,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { lg: '48px', md: '36px', xs: '24px' },
                    fontWeight: 900,
                    maxwidth: 400,
                  }}
                >
                  {' '}
                  Download RealityFence!{' '}
                </Typography>
              </Stack>
              <Box sx={{ pr: { md: 8, sm: 0 }, pl: { md: 8, sm: 0 } }}>
                <Stack
                  alignItems="center"
                  sx={{
                    py: 5,
                    borderRadius: 2,
                    mb: { xs: 8, md: 0 },
                    px: { xs: 3, md: 5 },
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h5" textAlign="center" mb={2} color="#212B36">
                    Scan QR code to install on your device
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 5, md: 1 }}>
                    <Stack direction="column" alignItems="center">
                      <Box
                        component="span"
                        className="svg-color"
                        sx={{
                          display: 'inline-block',
                          backgroundColor: '#212B36',
                          backgroundImage: `url(/assets/icons/ic_qrcode.svg)`,
                          backgroundSize: 'cover',
                          width: 120,
                          height: 120,
                          color: '#212B36',
                          border: 10,
                          borderStyle: 'solid',
                          borderRadius: '20px',
                        }}
                      />
                      <Typography variant="h5" textAlign="center" my={1} color="#212B36">
                        Apple Devices
                      </Typography>
                      <AppStoreButton />
                    </Stack>

                    <Divider
                      orientation="vertical"
                      sx={{ height: '100%', borderStyle: 'dashed' }}
                    />

                    <Stack direction="column" alignItems="center">
                      <Box
                        component="span"
                        className="svg-color"
                        sx={{
                          display: 'inline-block',
                          backgroundColor: '#212B36',
                          backgroundImage: `url(/assets/icons/ic_google_qr.svg)`,
                          backgroundSize: 'cover',
                          width: 120,
                          height: 120,
                          color: '#212B36',
                          border: 10,
                          borderStyle: 'solid',
                          borderRadius: '20px',
                        }}
                      />
                      <Typography variant="h5" textAlign="center" my={1} color="#212B36">
                        Android Devices
                      </Typography>
                      <GoogleStoreButton />
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Grid>

            <Grid xs={12} md={2.2} lg={4} sx={{ textAlign: '-webkit-center' }}>
              <Image
                alt="mobile app"
                src={startnowimg}
                sx={{
                  maxWidth: 430,
                  filter: (theme) =>
                    `drop-shadow(0 48px 80px ${alpha(theme.palette.common.black, 0.24)})`,
                }}
              />
            </Grid>
          </Grid>
          <Grid
            xs={6}
            md={8}
            lg={8}
            sx={{ mt: '-45px' }}
            style={{
              justifyContent: 'center',
              display: 'flex',
              maxwidth: '40%',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img src={memberImage} alt="marketing market" />
            </div>
          </Grid>
        </Box>
      ) : (
        <Stack>
          <Stack
            sx={{
              textAlign: { xs: 'center', md: 'unset' },
            }}
          >
            <Typography
              sx={{
                fontSize: '24px',
                fontWeight: 900,
              }}
            >
              Download
              <br /> RealityFence!
            </Typography>
          </Stack>

          <Stack
            alignItems="center"
            spacing={2}
            sx={{
              py: 3,
              borderRadius: 2,
              mb: { xs: 4, md: 0 },
              px: { xs: 3, md: 5 },
            }}
          >
            <Stack direction="column" alignItems="center">
              <Box
                component="span"
                className="svg-color"
                sx={{
                  display: 'inline-block',
                  backgroundColor: '#212B36',
                  backgroundImage: `url(/assets/icons/ic_qrcode.svg)`,
                  backgroundSize: 'cover',
                  width: 120,
                  height: 120,
                  color: '#212B36',
                  border: 10,
                  borderStyle: 'solid',
                  borderRadius: '20px',
                }}
              />
              <Typography variant="h5" textAlign="center" my={1} color="#212B36">
                Apple Devices
              </Typography>
              <AppStoreButton />
            </Stack>

            <Divider sx={{ width: '100%', borderStyle: 'dashed' }} />
            <Stack direction="column" alignItems="center">
              <Box
                component="span"
                className="svg-color"
                sx={{
                  display: 'inline-block',
                  backgroundColor: '#212B36',
                  backgroundImage: `url(/assets/icons/ic_google_qr.svg)`,
                  backgroundSize: 'cover',
                  width: 120,
                  height: 120,
                  color: '#212B36',
                  border: 10,
                  borderStyle: 'solid',
                  borderRadius: '20px',
                }}
              />
              <Typography variant="h5" textAlign="center" my={1} color="#212B36">
                Android Devices
              </Typography>
              <GoogleStoreButton />
            </Stack>
          </Stack>

          <Stack
            sx={{
              display: 'flex',
              justifyContent: 'center',
              px: 10,
            }}
          >
            <img src={memberImage} alt="marketing market" />
          </Stack>
        </Stack>
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

function AppStoreButton({ ...other }) {
  return (
    <Stack {...other}>
      <StyledAppStoreButton
        href="https://apps.apple.com/us/app/realityfence/id6453638654"
        startIcon={<Iconify icon="ri:apple-fill" width={28} />}
      >
        <Stack alignItems="flex-start">
          <Typography variant="caption" sx={{ opacity: 0.72 }}>
            Download on the
          </Typography>

          <Typography variant="h6" sx={{ mt: -0.5 }}>
            Apple Store
          </Typography>
        </Stack>
      </StyledAppStoreButton>
    </Stack>
  );
}

function GoogleStoreButton({ ...other }) {
  return (
    <Stack {...other}>
      <StyledAppStoreButton
        href="https://play.google.com/store/apps/details?id=com.realityfence.ar&hl=en_US&gl=US"
        startIcon={<Iconify icon="logos:google-play-icon" width={28} />}
      >
        <Stack alignItems="flex-start">
          <Typography variant="caption" sx={{ opacity: 0.72 }}>
            GET IT ON
          </Typography>

          <Typography variant="h6" sx={{ mt: -0.5 }}>
            Google Play
          </Typography>
        </Stack>
      </StyledAppStoreButton>
    </Stack>
  );
}

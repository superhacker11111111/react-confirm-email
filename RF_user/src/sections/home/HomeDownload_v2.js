// @mui
import { m } from 'framer-motion';
import { useState } from 'react';
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
  IconButton,
  Dialog,
  Link,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';
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

export default function DownloadAppElearning_v2() {
  const isMobile = useMediaQuery('(max-width:700px)');

  const [funModeOpen, setFunModeOpen] = useState(false);

  const handleFunOpen = () => {
    setFunModeOpen(true);
  };

  const handleFunClose = () => {
    setFunModeOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#F4F4F4',
          p: { xs: 2, sm: 10 },
        }}
      >
        <Container
          component={MotionViewport}
          sx={{
            py: 5,
            px: { xs: 2, md: 10 },
            backgroundColor: '#FFFFFF',
            boxShadow: 5,
            borderRadius: { xs: '20px', sm: '50px', md: '100px' },
          }}
        >
          <m.div variants={varFade().inUp}>
            <Stack
              sx={{
                textAlign: { xs: 'center', md: 'center' },
                my: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: { lg: '64px', md: '48px', sm: '36px', xs: '28px' },
                  fontWeight: 900,
                  maxwidth: 400,
                  lineHeight: 1,
                }}
              >
                {' '}
                Want to build a<br /> fence{' '}
                <span
                  style={{
                    color: '#1FA9FF',
                  }}
                >
                  right now
                </span>
                ?
              </Typography>
            </Stack>
            {isMobile ? (
              <Stack flexDirection="column" justifyContent="center" alignItems="center">
                <AppStoreButton
                  sx={{
                    width: '80%',
                  }}
                />
                <GoogleStoreButton
                  sx={{
                    width: '80%',
                  }}
                />
              </Stack>
            ) : (
              <Box sx={{ pr: { md: 8, sm: 0 }, pl: { md: 8, sm: 0 } }}>
                <Stack
                  alignItems="center"
                  sx={{
                    py: 5,
                    borderRadius: 2,
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
            )}

            <Stack
              sx={{
                mt: { xs: 2, md: 5 },
                mb: 3,
                textAlign: 'center',
                fontFamily: 'Public Sans',
              }}
            >
              <Typography variant="h4">No account yet? No problem!</Typography>
              <Typography variant="h4">
                Download the app and try&nbsp;
                <Link
                  style={{
                    color: '#1FA9FF',
                    cursor: 'pointer',
                  }}
                  onClick={handleFunOpen}
                >
                  Fun Mode!
                </Link>
              </Typography>
            </Stack>
          </m.div>
        </Container>
      </Box>
      <Box>
        <Container component={MotionViewport} maxWidth="sm">
          <m.div variants={varFade().inUp}>
            <Stack
              sx={{
                display: 'flex',
                justifyContent: 'center',
                px: 10,
                py: 5,
              }}
            >
              <img src={memberImage} alt="marketing market" />
            </Stack>
          </m.div>
        </Container>
      </Box>
      <Dialog open={funModeOpen} maxWidth="md" fullWidth onClose={handleFunClose}>
        <Stack sx={{ px: { lg: 4, xs: 1, md: 2 }, pt: 2, pb: 4 }}>
          <Grid item sx={{ alignSelf: { xs: 'end', md: 'end' } }}>
            <IconButton color="inherit" edge="start" onClick={handleFunClose}>
              <Iconify icon="carbon:close-filled" style={{ color: '1FA9FF' }} />
            </IconButton>
          </Grid>

          <iframe
            src="https://realityfencefunmode.lpages.co/realityfence-fun-modde/"
            width="100%"
            height="790px"
            title="Fun Mode"
          />
        </Stack>
      </Dialog>
    </>
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

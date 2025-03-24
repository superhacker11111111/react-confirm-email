// @mui
import { useNavigate } from 'react-router';
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, Button, Divider, Container, Typography } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import useResponsive from '../../hooks/useResponsive';
import { PATH_ONBOARDING } from '../../routes/paths';
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

export default function DownloadAppPage() {
  const navigation = useNavigate();
  const isDesktop = useResponsive('up', 'sm');

  return (
    <Container>
      <Stack
        sx={{
          textAlign: 'center',
          mt: 2,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { sm: '36px', xs: '32px' },
            fontWeight: 900,
            maxwidth: 400,
          }}
        >
          {' '}
          Download RealityFence!{' '}
        </Typography>
      </Stack>
      <Stack
        alignItems="center"
        direction="column"
        sx={{
          py: 5,
          mx: { lg: 20, md: 15 },
          borderRadius: 2,
          mb: { xs: 8, md: 0 },
          px: { xs: 3, md: 5 },
          border: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2} color="#212B36">
          Scan QR code to install on your device
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 5 }}>
          <Stack direction="column" alignItems="center">
            <Box
              component="span"
              className="svg-color"
              sx={{
                display: 'inline-block',
                backgroundColor: '#212B36',
                backgroundImage: `url(/assets/icons/ic_qrcode.svg)`,
                backgroundSize: 'cover',
                width: 140,
                height: 140,
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

          {isDesktop ? (
            <Divider orientation="vertical" sx={{ height: '100%', borderStyle: 'dashed' }} />
          ) : (
            <Divider sx={{ width: '100%', borderStyle: 'dashed' }} />
          )}
          <Stack direction="column" alignItems="center">
            <Box
              component="span"
              className="svg-color"
              sx={{
                display: 'inline-block',
                backgroundColor: '#212B36',
                backgroundImage: `url(/assets/icons/ic_google_qr.svg)`,
                backgroundSize: 'cover',
                width: 140,
                height: 140,
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
      <Stack justifyContent="center" mt={3} spacing={10} direction="row">
        <Button
          style={{
            width: '200px',
            color: '#FFFFFF',
            backgroundColor: '#1FA9FF',
            fontSize: 13,
            borderRadius: '14px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
          }}
          onClick={() => {
            navigation(PATH_ONBOARDING.onboarding.categoryfences);
          }}
        >
          Back
        </Button>
        <Button
          style={{
            width: '200px',
            backgroundColor: '#1FA9FF',
            color: '#FFFFFF',
            fontSize: 13,
            borderRadius: '14px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
          }}
          onClick={() => {
            navigation(PATH_ONBOARDING.onboarding.tutorial);
          }}
        >
          I’m Finished
          <br /> Downloading the App!
        </Button>
      </Stack>
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

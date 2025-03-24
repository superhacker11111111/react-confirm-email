// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, Typography, Divider, Button } from '@mui/material';
// import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';

// ------------------------------------------------------------

const StyledAppStoreButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  padding: '5px 12px',
  margin: theme.spacing(1),
  color: theme.palette.common.white,
  border: `solid 1px ${alpha(theme.palette.common.black, 0.24)}`,
  background: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.common.black} 100%)`,
  '& .MuiButton-startIcon': {
    marginLeft: 0,
  },
}));

export default function ScanQR() {
  return (
    <Stack spacing={5} sx={{ alignItems: 'center' }}>
      <Box sx={{ bosShadow: 15, px: { md: 5, xs: 2 }, py: 4 }}>
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
          <Stack spacing={3} direction="row" alignItems="center">
            <Box
              component="span"
              className="svg-color"
              sx={{
                display: 'inline-block',
                bgcolor: 'currentColor',
                backgroundImage: `url(/assets/icons/ic_qrcode.svg)`,
                backgroundSize: 'cover',
                width: 120,
                height: 120,
                color: 'grey.900',
                border: 10,
                borderStyle: 'solid',
                borderRadius: '20px',
              }}
            />
            <Typography variant="h6">
              Scan QR code to
              <br /> install on your device
            </Typography>
          </Stack>

          <Divider sx={{ my: 5, width: 1, borderStyle: 'dashed' }} />

          <AppStoreButton direction={{ xs: 'column', sm: 'row' }} />
        </Stack>
      </Box>

      <Stack style={{ alignItems: 'center', width: '80%' }}>
        <Button
          variant="contained"
          size="large"
          style={{ width: '80%' }}
          sx={{ mt: 3, float: 'right', fontSize: '18px', letterSpacing: '1px' }}
          type="submit"
        >
          Register
        </Button>
      </Stack>
    </Stack>
  );
}

// --------------------------------------------------------------------------

function AppStoreButton({ ...other }) {
  return (
    <Stack direction="row" flexWrap="wrap" {...other}>
      <StyledAppStoreButton startIcon={<Iconify icon="ri:apple-fill" width={28} />}>
        <Stack alignItems="flex-start">
          <Typography variant="caption" sx={{ opacity: 0.72 }}>
            Download on the
          </Typography>

          <Typography variant="h6" sx={{ mt: -0.5 }}>
            Apple Store
          </Typography>
        </Stack>
      </StyledAppStoreButton>

      <StyledAppStoreButton startIcon={<Iconify icon="logos:google-play-icon" width={28} />}>
        <Stack alignItems="flex-start">
          <Typography variant="caption" sx={{ opacity: 0.72 }}>
            Download from
          </Typography>
          <Typography variant="h6" sx={{ mt: -0.5 }}>
            Google Play
          </Typography>
        </Stack>
      </StyledAppStoreButton>
    </Stack>
  );
}

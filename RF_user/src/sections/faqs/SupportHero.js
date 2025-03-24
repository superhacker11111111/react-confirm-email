// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography, Stack, useMediaQuery, InputAdornment } from '@mui/material';
// utils
import { bgGradient } from '../../utils/cssStyles';
// components
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(14, 2.5),
  alignItems: 'center',
  // ...bgGradient({
  //   color: alpha(theme.palette.grey[900], 0.8),
  //   imgUrl: '/assets/background/overlay_2.jpg',
  // }),
  backgroundColor: '#1FA9FF',
}));

const StyledRootMobile = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(6, 2.5),
  alignItems: 'center',
  backgroundColor: '#1FA9FF',
}));

// ----------------------------------------------------------------------

export default function SupportHero() {
  const isMobile = useMediaQuery('(max-width:800px)');

  return (
    <div>
      {!isMobile ? (
        <StyledRoot>
          <Typography
            sx={{
              fontSize: { lg: '40px', md: '34px', sm: '28px', xs: '24px' },
              fontWeight: 800,
              textAlign: 'center',
              color: 'common.white',
              // textShadow: `0px 4px 3px rgba(0, 0, 0, 0.3)`,
            }}
          >
            Welcome to <br />
            {/* <Box component="span" sx={{ color: 'primary.main' }}>
          {`RealityFence `}
        </Box> */}
            RealityFence Support
          </Typography>

          {/* <TextField
        fullWidth
        hiddenLabel
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="carbon:search" width={24} sx={{ color: '#000000' }} />
            </InputAdornment>
          ),
          sx: { color: 'common.black', backgroundColor: '#ffffff' },
        }}
        sx={{ maxWidth: 366 }}
      /> */}
        </StyledRoot>
      ) : (
        <StyledRootMobile>
          <Typography
            sx={{
              fontSize: { lg: '40px', md: '34px', sm: '28px', xs: '24px' },
              fontWeight: 800,
              textAlign: 'center',
              color: 'common.white',
            }}
          >
            Welcome to <br />
            RealityFence Support
          </Typography>
        </StyledRootMobile>
      )}
    </div>
  );
}

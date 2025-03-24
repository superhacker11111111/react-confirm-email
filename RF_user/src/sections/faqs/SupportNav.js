import { useNavigate } from 'react-router';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Typography, CardActionArea, useMediaQuery } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { PATH_PAGE, PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

const StyledContactButton = styled((props) => (
  <CardActionArea sx={{ borderRadius: 1 }}>
    <Stack direction="row" alignItems="center" spacing={2} {...props} />
  </CardActionArea>
))(({ theme }) => ({
  ...theme.typography.subtitle2,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  border: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

export default function SupportNav() {
  const navigate = useNavigate();
  const Contact = () => {
    if (window.location.href.includes('dashboard')) {
      navigate(PATH_DASHBOARD.general.contactus);
    } else {
      navigate(PATH_PAGE.contact);
    }
  };
  const RFED = () => {
    if (window.location.href.includes('dashboard')) {
      navigate(PATH_DASHBOARD.general.edfences);
    } else {
      navigate(PATH_PAGE.edfence);
    }
  };
  const isMobile = useMediaQuery('(max-width:900px)');
  return (
    <Box
      sx={{
        mt: { xs: 2.5, md: 5 },
        pl: { xs: 2.5, md: 0 },
        pr: { xs: 2.5, md: 5 },
        width: '100%',
      }}
    >
      <Typography sx={{ fontSize: '22px', fontWeight: '900' }} paragraph>
        Do you still need help?
      </Typography>

      <Stack spacing={2}>
        <StyledContactButton onClick={Contact}>
          <Iconify icon="carbon:email" width={24} />
          <Typography variant="subtitle2">Contact Us</Typography>
        </StyledContactButton>

        <StyledContactButton onClick={RFED}>
          <img src="/assets/icons/ic_ed.svg" alt="ed" />
          <Typography variant="subtitle2">RealityFence ED</Typography>
        </StyledContactButton>

        <Typography
          variant="subtitle2"
          fontSize={20}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          {`Phone: `}
          <Box
            component="span"
            sx={{ color: 'primary.main', paddingLeft: '4px' }}
            className="sm:cursor-pointer md:cursor-default"
          >
            <a href={`tel:${2489857575}`}>248-985-7575</a>
          </Box>
        </Typography>
      </Stack>
    </Box>
  );
}

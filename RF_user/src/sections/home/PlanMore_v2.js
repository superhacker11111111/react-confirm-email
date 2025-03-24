import { m } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Typography,
  Container,
  Button,
  Box,
  useMediaQuery,
  Stack,
  Dialog,
  Grid,
  IconButton,
} from '@mui/material';

import { PATH_PAGE } from '../../routes/paths';
import { MotionViewport, varFade } from '../../components/animate';
import Iconify from '../../components/iconify';

export default function PlanMore() {
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:720px)');

  const [funModeOpen, setFunModeOpen] = useState(false);

  const handleFunOpen = () => {
    setFunModeOpen(true);
  };

  const handleFunClose = () => {
    setFunModeOpen(false);
  };

  // const handleTrial = () => {
  //   navigate(PATH_PAGE.trialpayment);
  // };

  return (
    <Box bgcolor="#1FA9FF" paddingY={8}>
      <Container component={MotionViewport} maxWidth="lg">
        <m.div variants={varFade().inUp}>
          <Stack
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="div" variant={isMobile ? 'h2' : 'h1'} color="#ffffff">
              Want to build a fence right now?
            </Typography>
            <Typography
              component="div"
              variant={isMobile ? 'h3' : 'h2'}
              color="#ffffff"
              fontWeight={isMobile ? 500 : 600}
              sx={{
                textAlign: 'center',
                mt: 2,
              }}
            >
              No account yet? No problem!
            </Typography>
            <Button
              sx={{
                backgroundColor: '#ffffff !important',
                color: '#1FA9FF',
                mt: 6,
                py: 1,
                width: 350,
                minHeight: 50,
                fontSize: '28px',
                fontWeight: 'bold',
                fontFamily: 'Public Sans',
              }}
              onClick={handleFunOpen}
            >
              Try Fun Mode
            </Button>
          </Stack>
        </m.div>
      </Container>
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
    </Box>
  );
}

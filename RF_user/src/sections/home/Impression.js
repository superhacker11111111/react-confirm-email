// @mui
import { m } from 'framer-motion';
import { Typography, Container, Box, Stack, useMediaQuery } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const STEPS = [
  {
    index: 1,
    title1: '2x',
    title: 'THE ATTENTION',
    description:
      '  AR delivers 2x the levels of visual attention leading to more powerful memories and responses from consumers. ',
    source: ' 2021 Global Deloitte Digital Study',
    description2:
      ' AR delivers 2x the levels of visual attention leading to more powerful memories and responses from consumers. ',
  },
  {
    index: 2,
    title1: '94%',
    title: 'HIGHER',
    description:
      '  Interacting with products that use AR have produced 94% higher conversion rates.',
    source: ' 2021 Global Deloitte Digital Study',
    description2:
      ' Product experiences with Augmented Reality have produced 94% higher conversion rates.  ',
  },
  {
    index: 3,
    title1: '95%',
    title: 'INCREASE',
    description: '  Viewing products in AR can increase purchase intent by as much as 95%.   ',
    source: 'J. Theor. Appl. Electron. Commer. Res. 2021, 16(7), 2694-2707',
    description2:
      ' Viewing products in Augmented reality (AR) can increase purchase intent by as much as 95%.  ',
  },
];

// ----------------------------------------------------------------------

export default function CareerLandingStep() {
  const isMobile = useMediaQuery('(max-width:700px)');

  return (
    <Box
      sx={{
        textAlign: 'center',
        pt: { xs: 2, md: 5 },
        pb: { xs: 2, md: 5 },
        backgroundColor: isMobile ? '#f4f4f4' : '#1FA9FF',
      }}
    >
      <Container component={MotionViewport} sx={{ px: { lg: 18 }, mt: 2 }}>
        <m.div variants={varFade().inUp}>
          <Typography
            sx={{
              fontWeight: 900,
              mx: 'auto',
              color: isMobile ? 'black' : 'white',
              fontFamily: 'Poppins',
              fontSize: { lg: '42px', md: '32px', sm: '28px', xs: '24px' },
            }}
          >
            A tool with the power to
            <br />
            make a serious impression
          </Typography>

          {!isMobile ? (
            <Box
              sx={{
                display: 'grid',
                mt: 3,
                mb: { xs: 3, md: 7 },
                mx: { xs: 2, md: 9 },
                gap: { xs: 2, md: 3 },
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                },
              }}
            >
              {STEPS.map((value, index) => (
                <Box
                  key={index}
                  sx={{
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    justifyContent: 'space-between',
                    borderRadius: '16px',
                    mx: 'auto',
                    textAlign: 'start',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                  }}
                >
                  <Stack sx={{ pb: 3 }}>
                    <Stack
                      sx={{
                        // spacing: '10px',
                        display: 'flex',
                        gap: { xs: 1 },
                        flexDirection: { md: 'column', xs: 'row' },
                        alignItems: 'baseline',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { lg: '74px', md: '54px', xs: '34px' },
                          fontWeight: 800,
                        }}
                      >
                        {value.title1}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { md: '20px', xs: '16px' },
                          fontWeight: 700,
                          mt: '-30px',
                        }}
                      >
                        {value.title}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: { lg: '20px', md: '16px', xs: '12px' },
                        mt: { md: 3 },
                        lineHeight: 1.2,
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Stack>
                  <Stack display="flex" flexDirection="row">
                    <Typography style={{ fontSize: '9.4px', fontWeight: 900 }}>
                      Source:&nbsp;{' '}
                    </Typography>
                    <Typography style={{ fontSize: '9.4px' }}>{value.source}</Typography>
                  </Stack>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                mt: 3,
                mb: 4,
                mx: 2,
                gap: 1,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              {STEPS.map((value, index) => (
                <div key={index}>
                  <Box
                    sx={{
                      boxShadow: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      py: 1.6,
                      px: 2.2,
                      justifyContent: 'space-between',
                      borderRadius: '24px',
                      mx: 'auto',
                      textAlign: 'start',
                      backgroundColor: index === 1 ? '#1FA9FF' : '#ffffff',
                      color: index === 1 ? '#ffffff' : '#000000',
                    }}
                  >
                    <Stack
                      sx={{
                        // spacing: '10px',
                        display: 'flex',
                        gap: 1,
                        flexDirection: { md: 'column', xs: 'row' },
                        alignItems: 'baseline',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '36px',
                          fontWeight: 800,
                        }}
                      >
                        {value.title1}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: 700,
                          mt: '-30px',
                        }}
                      >
                        {value.title}
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '14px', mt: { md: 3 } }}>
                      {value.description2}
                    </Typography>
                    <Stack
                      display="flex"
                      flexDirection="row"
                      justifyContent="end"
                      paddingRight="20px"
                      paddingTop="5px"
                    >
                      <Typography style={{ fontSize: '5px', fontWeight: 900 }}>
                        Source:&nbsp;{' '}
                      </Typography>
                      <Typography style={{ fontSize: '5px' }}>{value.source}</Typography>
                    </Stack>
                  </Box>
                </div>
              ))}
            </Box>
          )}
        </m.div>
      </Container>
    </Box>
  );
}

import PropTypes from 'prop-types';
import React, { useState } from 'react';
// @mui
import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  IconButton,
  Grid,
  Dialog,
  useMediaQuery,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// hooks
// import useCountdown from '../../hooks/useCountdown';
import Image from '../../components/image';
import Iconify from '../../components/iconify';
// -----------------------------------------------------------------------------------

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

BackFridayMobile.propTypes = {
  mobilecategory: PropTypes.shape({
    src: PropTypes.string,
    title: PropTypes.string,
  }),
};

function BackFridayMobile({ mobilecategory }) {
  const { src, title } = mobilecategory;

  return <Image src={src} alt={title} />;
}

// -----------------------------------------------------------------------------------
BackFridayDesktop.propTypes = {
  desktopcategory: PropTypes.shape({
    src: PropTypes.string,
    title: PropTypes.string,
  }),
};

function BackFridayDesktop({ desktopcategory }) {
  const { src, title } = desktopcategory;

  return <Image src={src} alt={title} />;
}

// -------------------------------------------------------------------------------------

export default function BlackHeader() {
  // const imgRef = useRef(null);
  // const url = new URL(window.location.href);

  const isMobile = useMediaQuery('(max-width:600px)');
  const [open, setOpen] = useState(false);
  const [funModeOpen, setFunModeOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFunOpen = () => {
    setFunModeOpen(true);
  };

  const handleFunClose = () => {
    setFunModeOpen(false);
  };

  // const { days, hours, minutes } = useCountdown(new Date('11/28/2023 00:00'));
  // const path = url.pathname;
  // const isMobile = useMediaQuery('(max-width:600px)');
  // const isTemp = useMediaQuery('(max-width:700px)');
  // const [imgHeight, setImgHeight] = useState(0);
  // const [imgWidth, setImgWidth] = useState(0);
  // const [scroll, setScroll] = useState('paper');
  // const [openModal, setModalOpen] = useState(path === '/');

  // const handleClickModal = (scrollType) => () => {
  //   setModalOpen(false);
  //   setScroll(scrollType);
  // };

  // const handleCloseModal = () => {
  //   setModalOpen(false);
  // };

  // const handleClaim = () => {
  //   sessionStorage.setItem('priceId', 'Black Friday');
  //   navigate(PATH_PAGE.payment);
  // };

  // const handleTrial = () => {
  //   if (window.location.pathname === '/') {
  //     navigate(PATH_PAGE.subscription);
  //   } else {
  //     navigate(PATH_PAGE.trialpayment);
  //   }
  // };

  // useEffect(() => {
  //   if (imgRef.current) {
  //     setImgHeight(imgRef.current.offsetHeight);
  //     setImgWidth(imgRef.current.offsetWidth);
  //   }
  // }, []);

  return (
    <Box
      gap={1}
      display="grid"
      sx={{
        width: 1,
        backgroundColor: '#1FA9FF',
        height: { xs: '36px', sm: '48px' },
      }}
    >
      <Stack
        direction="row"
        sx={{
          flexDirection: {},
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#FFFFFF',
            fontWeight: 500,
            fontSize: { xs: '16px', sm: '26px' },
            textShadow: '0px 4px 8px rgba(38, 50, 56, 0.08), 0px 2px 4px rgba(38, 50, 56, 0.16)',
            alignSelf: 'center',
          }}
        >
          Build a fence now with
        </Typography>
        <Button
          onClick={handleFunOpen}
          sx={{
            py: 0,
            px: { xs: 0.5, sm: 1 },
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: { xs: '16px', sm: '26px' },
              textShadow: '0px 4px 8px rgba(38, 50, 56, 0.08), 0px 2px 4px rgba(38, 50, 56, 0.16)',
            }}
          >
            <span style={{ borderBottom: 'solid 2px #ffffff', padding: 1 }}>Fun Mode</span>!
          </Typography>
        </Button>

        {/* <Typography
          sx={{
            color: '#FFFFFF',
            fontWeight: 500,
            fontSize: { xs: '16px', sm: '26px' },
            textShadow: '0px 4px 8px rgba(38, 50, 56, 0.08), 0px 2px 4px rgba(38, 50, 56, 0.16)',
            alignSelf: 'center',
          }}
        >
          Today!
        </Typography> */}
      </Stack>

      {/* <Dialog open={open} maxWidth="md" fullWidth onClose={handleClose}>
        <Stack sx={{ px: { lg: 4, xs: 1, md: 2 }, pt: 2, pb: 4 }}>
          <Grid item sx={{ alignSelf: { xs: 'end', md: 'end' } }}>
            <IconButton color="inherit" edge="start" onClick={handleClose}>
              <Iconify icon="carbon:close-filled" style={{ color: '1FA9FF' }} />
            </IconButton>
          </Grid>
          <Stack spacing={2} justifyContent={{ lg: 'space-between' }} alignItems="center">
            <Stack
              sx={{
                textAlign: { xs: 'center', md: 'center' },
                mt: 2,
                mb: 6,
              }}
            >
              <Typography
                sx={{
                  fontSize: { lg: '48px', md: '36px', xs: '32px' },
                  fontWeight: 900,
                  maxwidth: 400,
                }}
              >
                Download RealityFence!
              </Typography>
            </Stack>
            {isMobile ? (
              <>
                <AppStoreButton sx={{ width: '80%' }} />
                <GoogleStoreButton sx={{ width: '80%' }} />
              </>
            ) : (
              <Box sx={{ pr: { md: 8, sm: 0 }, pl: { md: 8, sm: 0 } }}>
                <Stack
                  alignItems="center"
                  sx={{
                    py: 5,
                    borderRadius: 2,
                    mb: { xs: 1, md: 0 },
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
                textAlign: 'center',
                fontSize: { lg: '32px', md: '36px', xs: '24px' },
                pt: 2,
                pb: 4,
              }}
            >
              <Typography
                fontFamily="Poppins"
                fontWeight={600}
                fontSize={{ lg: '32px', md: '24px', xs: '18px' }}
              >
                No account yet? No problem!
              </Typography>
              <Typography
                fontFamily="Poppins"
                fontWeight={600}
                fontSize={{ lg: '32px', md: '24px', xs: '18px' }}
              >
                Download the app and try <span style={{ color: '#1FA9FF' }}>Fun Mode!</span>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Dialog> */}
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
    // <Container sx={{ height: 1, display: 'flex', width: 1 }}>
    //   <Grid
    //     container
    //     spacing={1}
    //     sx={{
    //       mt: '4px',
    //       marginRight: 'auto',
    //       marginLeft: 'auto',
    //     }}
    //     justifyContent="center"
    //   >
    //     <Stack
    //       direction="row"
    //       sx={{
    //         flexDirection: {},
    //         marginRight: {
    //           xs: 5,
    //           sm: isTemp ? 2 : 12,
    //           md: 25,
    //           lg: 30,
    //         },
    //       }}
    //     >
    //       {/* <Button onClick={handleClickModal('paper')} style={{ padding: '0px, 4px' }}> */}
    //       <Button onClick={handleClaim} style={{ padding: '0px, 4px' }}>
    //         <Typography
    //           sx={{
    //             color: '#FFFFFF',
    //             fontWeight: 500,
    //             fontSize: { xs: '13px', sm: '21px', lg: '34px' },
    //             textShadow:
    //               '0px 4px 8px rgba(38, 50, 56, 0.08), 0px 2px 4px rgba(38, 50, 56, 0.16)',
    //           }}
    //         >
    //           <span style={{ textDecoration: 'underline' }}>BLACK FRIDAY</span>
    //         </Typography>
    //       </Button>
    //       <Typography
    //         sx={{
    //           color: '#FFFFFF',
    //           fontWeight: 500,
    //           fontSize: { xs: '13px', sm: '21px', lg: '34px' },
    //           textShadow:
    //             '0px 4px 8px rgba(38, 50, 56, 0.08), 0px 2px 4px rgba(38, 50, 56, 0.16)',
    //           alignSelf: 'center',
    //         }}
    //       >
    //         SALE ENDS
    //       </Typography>
    //     </Stack>

    //     <Stack
    //       direction="row"
    //       justifyContent="center"
    //       divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>&nbsp;</Box>}
    //       sx={{ typography: 'h2', gap: '5px' }}
    //     >
    //       <>
    //         <TimeBlock label={isMobile ? 'DAY' : 'DAYS'} value={days} />
    //         <TimeBlock label={isMobile ? 'HOUR' : 'HOURS'} value={hours} />
    //         <TimeBlock label={isMobile ? 'MIN' : 'MINUTES'} value={minutes} />
    //       </>
    //     </Stack>
    //   </Grid>

    //   {!isMobile ? (
    //     <Dialog
    //       open={openModal}
    //       scroll={scroll}
    //       onClose={handleCloseModal}
    //       maxWidth="lg"
    //       fullWidth
    //     >
    //       <DialogActions sx={{ padding: '2px !important' }}>
    //         <IconButton
    //           color="inherit"
    //           edge="start"
    //           sx={{ py: '4px !important', pr: '12px !important' }}
    //           onClick={handleCloseModal}
    //         >
    //           <Iconify
    //             icon="mdi:cancel-box"
    //             style={{ color: '1FA9FF', width: '24px !important', height: '24px !important' }}
    //           />
    //         </IconButton>
    //       </DialogActions>

    //       <DialogContent dividers={scroll === 'paper'}>
    //         <Stack sx={{ position: 'relative' }}>
    //           <img src="assets/desktopsvg/1.svg" alt="1" />
    //           <Button
    //             sx={{
    //               width: { lg: '280px', md: '210px', sm: '160px' },
    //               height: { lg: '84px', md: '63px', sm: '48px' },
    //               position: 'absolute',
    //               bottom: { lg: '72px', md: '60px', sm: '42px' },
    //               left: { lg: '132px', md: '112px', sm: '80px' },
    //               backgroundSize: 'cover',
    //             }}
    //             style={{
    //               backgroundImage: 'url(/assets/claim_yours.png)',
    //             }}
    //             onClick={handleClaim}
    //           />
    //         </Stack>
    //         <Stack>
    //           <img src="assets/desktopsvg/2.svg" alt="2" />
    //           <img src="assets/desktopsvg/3.svg" alt="3" />
    //           <img src="assets/desktopsvg/4.svg" alt="4" />
    //           <img src="assets/desktopsvg/5.svg" alt="5" />
    //           <img src="assets/desktopsvg/6.svg" alt="6" />
    //         </Stack>
    //         <>
    //           <img
    //             src="assets/desktopsvg/7(1).svg"
    //             style={{ paddingLeft: '304px', paddingRight: '304px' }}
    //             alt="71"
    //           />
    //           <Grid
    //             container
    //             sx={{
    //               pl: { lg: '338px', md: '272px', sm: '133px' },
    //               pr: { lg: '215px', md: '165px', sm: '90px' },
    //               display: 'flex',
    //               flexWrap: 'nowrap',
    //             }}
    //           >
    //             <Grid item xs={6.82}>
    //               <BusinessPotential />
    //             </Grid>
    //             <Grid item xs={5.2} sx={{ mt: '-40px' }}>
    //               <img src="assets/desktopsvg/7(2).svg" alt="72" />
    //             </Grid>
    //           </Grid>
    //         </>

    //         <Stack sx={{ position: 'relative', alignItems: 'center' }}>
    //           <img src="assets/desktopsvg/8.svg" alt="8" />
    //           <Button
    //             sx={{
    //               width: { lg: '180px', md: '129px', sm: '98px' },
    //               height: { lg: '54px', md: '39px', sm: '30px' },
    //               position: 'absolute',
    //               backgroundSize: 'cover',
    //               bottom: { lg: '34px', md: '22px', sm: '16px' },
    //             }}
    //             style={{
    //               backgroundImage: 'url(/assets/claim_yours.png)',
    //             }}
    //             onClick={handleClaim}
    //           />
    //         </Stack>
    //         <Stack sx={{ position: 'relative', alignItems: 'center' }}>
    //           <img src="assets/desktopsvg/9.svg" alt="9" />
    //           <Button
    //             sx={{
    //               width: { lg: '180px', md: '129px', sm: '98px' },
    //               height: { lg: '54px', md: '39px', sm: '30px' },
    //               position: 'absolute',
    //               backgroundSize: 'cover',
    //               bottom: { lg: '34px', md: '22px', sm: '16px' },
    //             }}
    //             style={{
    //               backgroundImage: 'url(/assets/claim_yours.png)',
    //             }}
    //             onClick={handleClaim}
    //           />
    //         </Stack>
    //         <Stack sx={{ position: 'relative', alignItems: 'center' }}>
    //           <img src="/assets/desktopsvg/10.svg" alt="10" />
    //           <Button
    //             sx={{
    //               width: { lg: '234px', md: '191px', sm: '136px' },
    //               height: { lg: '71px', md: '58px', sm: '41px' },
    //               position: 'absolute',
    //               backgroundSize: 'cover',
    //               bottom: { lg: '36px', md: '30px', sm: '26px' },
    //             }}
    //             style={{
    //               backgroundImage: 'url(/assets/pro_trial.png)',
    //             }}
    //             onClick={handleTrial}
    //           />
    //         </Stack>
    //       </DialogContent>
    //     </Dialog>
    //   ) : (
    //     <Dialog
    //       open={openModal}
    //       scroll={scroll}
    //       onClose={handleCloseModal}
    //       maxWidth="lg"
    //       fullWidth
    //     >
    //       <DialogActions sx={{ padding: '2px !important' }}>
    //         <IconButton
    //           color="inherit"
    //           edge="start"
    //           sx={{ py: '1px !important', pr: '8px !important' }}
    //           onClick={handleCloseModal}
    //         >
    //           <Iconify
    //             icon="mdi:cancel-box"
    //             style={{ color: '1FA9FF', width: '24px !important' }}
    //           />
    //         </IconButton>
    //       </DialogActions>
    //       <DialogContent dividers={scroll === 'paper'}>
    //         <Stack sx={{ position: 'relative' }}>
    //           <img
    //             src="assets/mobilesvg/1.png"
    //             // ref={imgRef}
    //             // onLoad={() => {
    //             //   setImgHeight(imgRef.current.offsetHeight);
    //             //   setImgWidth(imgRef.current.offsetWidth);
    //             // }}
    //             alt="1"
    //           />
    //           <Button
    //             style={{
    //               width: '123px',
    //               height: '37px',
    //               position: 'absolute',
    //               backgroundSize: 'cover',
    //               backgroundImage: 'url(/assets/claim_yours.png)',
    //               bottom: '192px',
    //               right: '10px',
    //             }}
    //             onClick={handleClaim}
    //           />
    //         </Stack>
    //         <Stack>
    //           <img src="assets/mobilesvg/2.png" alt="2" />
    //           <img src="assets/mobilesvg/3.png" alt="3" />
    //           <img src="assets/mobilesvg/4.png" alt="4" />
    //           <img src="assets/mobilesvg/5.png" alt="5" />
    //           <img src="assets/mobilesvg/6.png" alt="6" />
    //           <img src="assets/mobilesvg/7.png" alt="7" />
    //           <img src="assets/mobilesvg/8.png" alt="8" />
    //         </Stack>
    //         <Stack>
    //           <img
    //             src="assets/mobilesvg/9(1).png"
    //             style={{ paddingLeft: '12px', paddingRight: '12px' }}
    //             alt="91"
    //           />
    //           <Stack sx={{ pb: 2, pt: -2 }}>
    //             <BusinessPotential />
    //           </Stack>
    //           <Stack
    //             sx={{
    //               mt: { sm: -8, xs: '-55px' },
    //               pr: { sm: 12, xs: '91px' },
    //               pl: { sm: '92px', xs: '81px' },
    //               mb: '-40px',
    //             }}
    //           >
    //             <img src="assets/mobilesvg/9(2).png" alt="92" />
    //           </Stack>
    //         </Stack>
    //         <Stack sx={{ position: 'relative', alignItems: 'center' }}>
    //           <img src="assets/mobilesvg/10.png" alt="10" />
    //           <Button
    //             sx={{
    //               width: '133px',
    //               height: '40px',
    //               position: 'absolute',
    //               backgroundSize: 'cover',
    //               bottom: '46px',
    //             }}
    //             style={{
    //               backgroundImage: 'url(/assets/claim_yours.png)',
    //             }}
    //             onClick={handleClaim}
    //           />
    //         </Stack>
    //         <Stack sx={{ position: 'relative', alignItems: 'center' }}>
    //           <img src="assets/mobilesvg/11.png" alt="11" />
    //           <Button
    //             sx={{
    //               width: '133px',
    //               height: '40px',
    //               position: 'absolute',
    //               backgroundSize: 'cover',
    //               bottom: '46px',
    //             }}
    //             style={{
    //               backgroundImage: 'url(/assets/claim_yours.png)',
    //             }}
    //             onClick={handleClaim}
    //           />
    //         </Stack>
    //         <Stack sx={{ position: 'relative', alignItems: 'center' }}>
    //           <img src="assets/mobilesvg/12.png" alt="12" />
    //           <Button
    //             sx={{
    //               width: '107px',
    //               height: '32px',
    //               position: 'absolute',
    //               backgroundSize: 'cover',
    //               bottom: '56px',
    //             }}
    //             style={{
    //               backgroundImage: 'url(/assets/pro_trial.png)',
    //             }}
    //             onClick={handleTrial}
    //           />
    //         </Stack>
    //       </DialogContent>
    //     </Dialog>
    //   )}
    // </Container>
  );
}

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

function TimeBlock({ label, value }) {
  const paddedValue = String(value).padStart(2, '0');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: { xs: '5px', sm: '5px', lg: '7px' },
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          marginLeft: { xs: '5px' },
          justifyContent: 'center',
        }}
      >
        {String(paddedValue)
          .split('')
          .map((char, index) => (
            <Box
              key={index}
              sx={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: { xs: '15px', sm: '42px', lg: '42px' },
                height: { xs: '20px', sm: '53px', lg: '53px' },
                borderRadius: '5px',
                border: '0.5px solid rgba(255, 255, 255, 0.5)', // set border color opacity
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.10) 100%)', // set background color opacity
                backdropFilter: 'blur(32.5px)',
                fontWeight: 'bold',
                mx: '1px', // add some margin to separate the characters
              }}
            >
              <Box
                sx={{
                  color: 'white', // make the char white
                  fontFamily: 'Digital-7 Regular',
                  fontSize: { xs: '15px', sm: '34px', lg: '34px' },
                  fontWeight: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {char}
              </Box>
            </Box>
          ))}
      </div>
      <Box
        sx={{
          color: 'white',
          fontSize: { xs: '12px', lg: '15px' },
          fontWeight: 100,
        }}
      >
        {label}
      </Box>
    </div>
  );
}

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

// ----------------------------------------------------------------------

// function BusinessPotential() {
//   const [AvgPrice, setAvgPrice] = useState(0);
//   const [ProfitMargin, setProfitMargin] = useState(0);
//   const [YearlySales, setYearlySales] = useState(0);
//   const [ConversionsBoost, setConversionsBoost] = useState(15);

//   const [ProjSales, setProjSales] = useState(0);
//   const [ProjRevenue, setProjRevenue] = useState(0);
//   const [ProjProfit, setProjProfit] = useState(0);

//   const handleCalculate = () => {
//     setProjSales((ConversionsBoost * 0.01 + 1) * YearlySales - YearlySales);
//     setProjRevenue(AvgPrice * YearlySales * (1 + ConversionsBoost * 0.01) - AvgPrice * YearlySales);
//     setProjProfit(
//       AvgPrice * YearlySales * ProfitMargin * 0.01 * (1 + ConversionsBoost * 0.01) -
//         AvgPrice * YearlySales * ProfitMargin * 0.01
//     );
//   };

//   function createMarks(min, max, step) {
//     const marks = [];
//     for (let i = min; i <= max; i += step) {
//       marks.push({ value: i, label: i.toLocaleString() });
//     }
//     return marks;
//   }

//   const priceMark = createMarks(0, 20000, 20000);
//   const profitMark = createMarks(0, 100, 100);
//   const fenceSoldMark = createMarks(0, 2000, 2000);
//   const boostMark = createMarks(0, 100, 100);

//   const handlePotential = (event, value) => {
//     switch (event.target.name) {
//       case 'price':
//         setAvgPrice(value);
//         break;
//       case 'profit':
//         setProfitMargin(value);
//         break;
//       case 'fence_sold':
//         setYearlySales(value);
//         break;
//       case 'boost':
//         setConversionsBoost(value);
//         break;
//       default:
//         break;
//     }
//     handleCalculate();
//   };

//   return (
//     <Stack>
//       <Paper
//         elevation={4}
//         sx={{
//           px: { md: 4, sm: 3, xs: 1 },
//           py: { lg: '16px', md: '8px', xs: '8px' },
//           bgcolor: 'background.paper',
//         }}
//       >
//         <Box my={2}>
//           <Grid
//             container
//             rowSpacing={{ md: 4, sm: 3, xs: 2 }}
//             columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             sx={{ justifyContent: 'center' }}
//           >
//             <Grid
//               item
//               sm={6}
//               xs={10}
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 textAlign: 'center',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <Typography sx={{ fontSize: '9px', fontWeight: 600 }} gutterBottom>
//                 Average Price (Per Fence Sold)
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: { lg: '22px', md: '20px', xs: '16px' },
//                   fontWeight: 700,
//                 }}
//               >
//                 ${AvgPrice}
//               </Typography>
//               <Slider
//                 value={AvgPrice}
//                 size="small"
//                 aria-label="Small"
//                 onChange={handlePotential}
//                 onChangeCommitted={handleCalculate}
//                 name="price"
//                 valueLabelDisplay="auto"
//                 min={0}
//                 max={20000}
//                 step={1}
//                 marks={priceMark}
//                 sx={{
//                   '& .MuiSlider-markLabel': {
//                     minWidth: 'auto',
//                     margin: 0,
//                     fontSize: '10px',
//                     top: '20px',
//                   },
//                   color: '#1FA9FF',
//                   width: '100%',
//                   padding: '9px 0px !important',
//                 }}
//               />
//             </Grid>
//             <Grid
//               item
//               sm={6}
//               xs={10}
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 textAlign: 'center',
//               }}
//             >
//               <Typography sx={{ fontSize: '9px', fontWeight: 600 }} gutterBottom>
//                 Average Profit Margin
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: { lg: '22px', md: '20px', xs: '16px' },
//                   fontWeight: 700,
//                 }}
//               >
//                 {ProfitMargin}%
//               </Typography>
//               <Slider
//                 value={ProfitMargin}
//                 onChange={handlePotential}
//                 onChangeCommitted={handleCalculate}
//                 name="profit"
//                 size="small"
//                 aria-label="Small"
//                 valueLabelDisplay="auto"
//                 min={0}
//                 max={100}
//                 step={1}
//                 marks={profitMark}
//                 sx={{
//                   '& .MuiSlider-markLabel': {
//                     minWidth: 'auto',
//                     margin: 0,
//                     fontSize: '10px',
//                     top: '20px',
//                   },
//                   color: '#1FA9FF',
//                   width: '100%',
//                   padding: '9px 0px !important',
//                   fontSize: '8px',
//                 }}
//               />
//             </Grid>
//             <Grid
//               item
//               sm={6}
//               xs={10}
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 textAlign: 'center',
//               }}
//             >
//               <Typography sx={{ fontSize: '9px', fontWeight: 600 }} gutterBottom>
//                 Yearly Average # of Fences Sold
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: { lg: '22px', md: '20px', xs: '16px' },
//                   fontWeight: 700,
//                 }}
//               >
//                 {YearlySales}
//               </Typography>
//               <Slider
//                 value={YearlySales}
//                 onChange={handlePotential}
//                 onChangeCommitted={handleCalculate}
//                 name="fence_sold"
//                 valueLabelDisplay="auto"
//                 min={0}
//                 max={2000}
//                 step={1}
//                 aria-label="Small"
//                 marks={fenceSoldMark}
//                 sx={{
//                   '& .MuiSlider-markLabel': {
//                     minWidth: 'auto',
//                     margin: 0,
//                     fontSize: '10px',
//                     top: '20px',
//                   },
//                   color: '#1FA9FF',
//                   width: '100%',
//                   padding: '9px 0px !important',
//                   fontSize: '8px',
//                 }}
//               />
//             </Grid>
//             <Grid
//               item
//               sm={6}
//               xs={12}
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 textAlign: 'center',
//               }}
//             >
//               <Typography sx={{ fontSize: '9px', fontWeight: 600 }} gutterBottom>
//                 Sales Boost
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: { lg: '22px', md: '20px', xs: '16px' },
//                   fontWeight: 700,
//                 }}
//               >
//                 {ConversionsBoost}%
//               </Typography>
//               <Slider
//                 value={ConversionsBoost}
//                 aria-label="Small"
//                 onChange={handlePotential}
//                 onChangeCommitted={handleCalculate}
//                 name="boost"
//                 valueLabelDisplay="auto"
//                 min={0}
//                 max={100}
//                 step={1}
//                 marks={boostMark}
//                 sx={{
//                   '& .MuiSlider-markLabel': {
//                     minWidth: 'auto',
//                     margin: 0,
//                     fontSize: '10px',
//                     top: '20px',
//                   },
//                   color: '#1FA9FF',
//                   width: '80%',
//                   padding: '9px 0px !important',
//                   fontSize: '8px',
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>

//       <Box mt={2} mb={2} sx={{ alignSelf: 'center', width: '103%' }}>
//         <Grid
//           container
//           columnSpacing={{ xs: '4px', sm: '10px', md: '12px' }}
//           sx={{ textAlign: 'center' }}
//         >
//           <Grid item xs={4}>
//             <Box
//               sx={{
//                 backgroundColor: '#1FA9FF',
//                 color: '#ffffff',
//                 width: '100%',
//                 height: { xs: '100%' },
//                 py: { xs: 1, sm: 2 },
//                 pt: { lg: 1, sm: '6px' },
//                 pb: { lg: '11px', sm: '8px' },
//                 borderRadius: '6px',
//                 boxShadow: 3,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//               }}
//             >
//               <Stack sx={{ px: 1 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '9px',
//                     fontWeight: 600,
//                   }}
//                   mb={1}
//                 >
//                   Revenue Boost
//                 </Typography>
//               </Stack>

//               <Typography sx={{ fontSize: { lg: '16px', md: '14px', xs: '12px' } }}>
//                 ${ProjRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid item xs={4}>
//             <Box
//               sx={{
//                 backgroundColor: '#1FA9FF',
//                 color: '#ffffff',
//                 width: '100%',
//                 height: { xs: '100%' },
//                 py: { xs: 1, sm: 2 },
//                 pt: { lg: 1, sm: '6px' },
//                 pb: { lg: '11px', sm: '8px' },
//                 borderRadius: '6px',
//                 boxShadow: 3,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//               }}
//             >
//               <Stack sx={{ px: 1 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '9px',
//                     fontWeight: 600,
//                   }}
//                   mb={1}
//                 >
//                   Profit Boost
//                 </Typography>
//               </Stack>
//               <Typography sx={{ fontSize: { lg: '16px', md: '14px', xs: '12px' } }}>
//                 ${ProjProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid item xs={4}>
//             <Box
//               sx={{
//                 backgroundColor: '#1FA9FF',
//                 color: '#ffffff',
//                 width: '100%',
//                 height: { xs: '100%' },
//                 py: { xs: 1, sm: 2 },
//                 pt: { lg: 1, sm: '6px' },
//                 pb: { lg: '11px', sm: '8px' },
//                 borderRadius: '6px',
//                 boxShadow: 3,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//               }}
//             >
//               <Stack sx={{ px: 1 }}>
//                 <Typography
//                   sx={{
//                     fontSize: '9px',
//                     fontWeight: 600,
//                   }}
//                   mb={1}
//                 >
//                   Conversions Boost
//                 </Typography>
//               </Stack>
//               <Typography sx={{ fontSize: { lg: '16px', md: '14px', xs: '12px' } }}>
//                 {Math.floor(ProjSales)}
//               </Typography>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </Stack>
//   );
// }

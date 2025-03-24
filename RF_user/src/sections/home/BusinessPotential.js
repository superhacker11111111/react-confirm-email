import { m } from 'framer-motion';
import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Paper, Slider, Stack } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { MotionViewport, varFade, IconButtonAnimate } from '../../components/animate';

export default function BusinessPotential() {
  const [AvgPrice, setAvgPrice] = useState(0);
  const [ProfitMargin, setProfitMargin] = useState(0);
  const [YearlySales, setYearlySales] = useState(0);
  const [ConversionsBoost, setConversionsBoost] = useState(15);

  const [ProjSales, setProjSales] = useState(0);
  const [ProjRevenue, setProjRevenue] = useState(0);
  const [ProjProfit, setProjProfit] = useState(0);

  const handleCalculate = () => {
    setProjSales((ConversionsBoost * 0.01 + 1) * YearlySales - YearlySales);
    setProjRevenue(AvgPrice * YearlySales * (1 + ConversionsBoost * 0.01) - AvgPrice * YearlySales);
    setProjProfit(
      AvgPrice * YearlySales * ProfitMargin * 0.01 * (1 + ConversionsBoost * 0.01) -
        AvgPrice * YearlySales * ProfitMargin * 0.01
    );
  };

  function createMarks(min, max, step) {
    const marks = [];
    for (let i = min; i <= max; i += step) {
      marks.push({ value: i, label: i.toLocaleString() });
    }
    return marks;
  }

  const priceMark = createMarks(0, 20000, 20000);
  const profitMark = createMarks(0, 100, 100);
  const fenceSoldMark = createMarks(0, 2000, 2000);
  const boostMark = createMarks(0, 100, 100);

  const handlePotential = (e) => {
    switch (e.target.name) {
      case 'price':
        setAvgPrice(e.target.value);
        handleCalculate();
        break;
      case 'profit':
        setProfitMargin(e.target.value);
        handleCalculate();
        break;
      case 'fence_sold':
        setYearlySales(e.target.value);
        handleCalculate();
        break;
      case 'boost':
        setConversionsBoost(e.target.value);
        handleCalculate();
        break;
      default:
        break;
    }
  };

  const decrementprice = () => {
    setAvgPrice((prevValue) => prevValue - 1);
  };
  const incrementprice = () => {
    setAvgPrice((prevValue) => prevValue + 1);
  };

  const decrementmargin = () => {
    setProfitMargin((prevValue) => prevValue - 1);
  };
  const incrementmargin = () => {
    setProfitMargin((prevValue) => prevValue + 1);
  };

  const decrementsales = () => {
    setYearlySales((prevValue) => prevValue - 1);
  };
  const incrementsales = () => {
    setYearlySales((prevValue) => prevValue + 1);
  };

  const decrementboost = () => {
    setConversionsBoost((prevValue) => prevValue - 1);
  };
  const incrementboost = () => {
    setConversionsBoost((prevValue) => prevValue + 1);
  };

  return (
    <Box sx={{ backgroundColor: '#f4f4f4', pt: { xs: 5, sm: 10 } }}>
      <Container component={MotionViewport}>
        <m.div variants={varFade().inUp}>
          <Stack
            sx={{
              px: { lg: 28, md: 8, xs: 2 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: { lg: '42px', md: '32px', xs: '24px' },
                textAlign: 'center',
                fontWeight: 900,
                color: 'black',
                fontFamily: 'Poppins',
              }}
            >
              Unleash Your <br /> Business Potential
            </Typography>

            <Paper
              elevation={3}
              sx={{
                mt: { lg: 5, xs: 1 },
                py: { lg: 4, xs: 0 },
                px: 5,
                bgcolor: 'background.paper',
              }}
            >
              <Box my={2}>
                <Grid
                  container
                  rowSpacing={{ lg: 4, xs: 1 }}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { lg: '16px', xs: '12px' }, fontWeight: 700 }}
                      gutterBottom
                    >
                      Average Price (Per Fence Sold)
                    </Typography>

                    <Stack
                      display="flex"
                      flexDirection="row-reverse"
                      alignItems="center"
                      sx={{ paddingTop: '14px', paddingBottom: { lg: '14px', xs: '2px' } }}
                    >
                      <IconButtonAnimate
                        sx={{
                          minWidth: '8px',
                          maxWidth: '16px',
                          color: '#1FA9FF',
                          mx: 2,
                          px: 1,
                          py: '2px',
                        }}
                        onClick={incrementprice}
                      >
                        <Iconify icon="zondicons:add-outline" />
                      </IconButtonAnimate>
                      <Typography
                        sx={{
                          fontSize: { lg: '40px', md: '32px', xs: '24px' },
                          fontWeight: 900,
                        }}
                      >
                        ${AvgPrice}
                      </Typography>
                      <IconButtonAnimate
                        sx={{
                          minWidth: '8px',
                          maxWidth: '16px',
                          color: '#1FA9FF',
                          mx: 2,
                          px: 1,
                          py: '2px',
                        }}
                        onClick={decrementprice}
                      >
                        <Iconify icon="zondicons:minus-outline" />
                      </IconButtonAnimate>
                    </Stack>
                    <Slider
                      value={AvgPrice}
                      size="medium"
                      onChange={(e) => handlePotential(e)}
                      name="price"
                      valueLabelDisplay="auto"
                      min={0}
                      max={20000}
                      step={1}
                      marks={priceMark}
                      sx={{
                        '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 },
                        color: '#1FA9FF',
                        width: { sm: '55%', xs: '90%' },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { lg: '16px', xs: '12px' }, fontWeight: 700 }}
                      gutterBottom
                    >
                      Average Profit Margin
                    </Typography>

                    <Stack
                      display="flex"
                      flexDirection="row-reverse"
                      alignItems="center"
                      sx={{ paddingTop: '14px', paddingBottom: { lg: '14px', xs: '2px' } }}
                    >
                      <IconButtonAnimate
                        sx={{
                          minWidth: '8px',
                          maxWidth: '16px',
                          color: '#1FA9FF',
                          mx: 2,
                          px: 1,
                          py: '2px',
                        }}
                        onClick={incrementmargin}
                      >
                        <Iconify icon="zondicons:add-outline" />
                      </IconButtonAnimate>
                      <Typography
                        sx={{
                          fontSize: { lg: '40px', md: '32px', xs: '24px' },
                          fontWeight: 900,
                        }}
                      >
                        {ProfitMargin}%
                      </Typography>
                      <IconButtonAnimate
                        sx={{
                          minWidth: '8px',
                          maxWidth: '16px',
                          color: '#1FA9FF',
                          mx: 2,
                          px: 1,
                          py: '2px',
                        }}
                        onClick={decrementmargin}
                      >
                        <Iconify icon="zondicons:minus-outline" />
                      </IconButtonAnimate>
                    </Stack>
                    <Slider
                      value={ProfitMargin}
                      onChange={(e) => handlePotential(e)}
                      name="profit"
                      size="medium"
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                      step={1}
                      marks={profitMark}
                      sx={{
                        '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 },
                        color: '#1FA9FF',
                        width: { sm: '55%', xs: '90%' },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { lg: '16px', xs: '12px' }, fontWeight: 700 }}
                      gutterBottom
                    >
                      Yearly Average # of Fences Sold
                    </Typography>

                    <Stack
                      display="flex"
                      flexDirection="row-reverse"
                      alignItems="center"
                      sx={{ paddingTop: '14px', paddingBottom: { lg: '14px', xs: '2px' } }}
                    >
                      <IconButtonAnimate
                        sx={{
                          minWidth: '8px',
                          maxWidth: '16px',
                          color: '#1FA9FF',
                          mx: 2,
                          px: 1,
                          py: '2px',
                        }}
                        onClick={incrementsales}
                      >
                        <Iconify icon="zondicons:add-outline" />
                      </IconButtonAnimate>
                      <Typography
                        sx={{
                          fontSize: { lg: '40px', md: '32px', xs: '24px' },
                          fontWeight: 900,
                        }}
                      >
                        {YearlySales}
                      </Typography>
                      <IconButtonAnimate
                        sx={{
                          minWidth: '8px',
                          maxWidth: '16px',
                          color: '#1FA9FF',
                          mx: 2,
                          px: 1,
                          py: '2px',
                        }}
                        onClick={decrementsales}
                      >
                        <Iconify icon="zondicons:minus-outline" />
                      </IconButtonAnimate>
                    </Stack>
                    <Slider
                      value={YearlySales}
                      onChange={(e) => handlePotential(e)}
                      name="fence_sold"
                      valueLabelDisplay="auto"
                      min={0}
                      max={2000}
                      step={1}
                      size="medium"
                      marks={fenceSoldMark}
                      sx={{
                        '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 },
                        color: '#1FA9FF',
                        width: { sm: '55%', xs: '90%' },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { lg: '16px', xs: '12px' }, fontWeight: 700 }}
                      gutterBottom
                    >
                      Sales Boost
                    </Typography>

                    <Stack
                      display="flex"
                      flexDirection="row-reverse"
                      alignItems="center"
                      sx={{ paddingTop: '14px', paddingBottom: { lg: '14px', xs: '2px' } }}
                    >
                      <IconButtonAnimate
                        sx={{
                          minWidth: '8px',
                          maxWidth: '16px',
                          color: '#1FA9FF',
                          mx: 2,
                          px: 1,
                          py: '2px',
                        }}
                        onClick={incrementboost}
                      >
                        <Iconify icon="zondicons:add-outline" />
                      </IconButtonAnimate>
                      <Typography
                        sx={{
                          fontSize: { lg: '40px', md: '32px', xs: '24px' },
                          fontWeight: 900,
                        }}
                      >
                        {ConversionsBoost}%
                      </Typography>
                      <IconButtonAnimate
                        sx={{
                          minWidth: '8px',
                          maxWidth: '16px',
                          color: '#1FA9FF',
                          mx: 2,
                          px: 1,
                          py: '2px',
                        }}
                        onClick={decrementboost}
                      >
                        <Iconify icon="zondicons:minus-outline" />
                      </IconButtonAnimate>
                    </Stack>
                    <Slider
                      value={ConversionsBoost}
                      size="medium"
                      onChange={(e) => handlePotential(e)}
                      name="boost"
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                      step={1}
                      marks={boostMark}
                      sx={{
                        '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 },
                        color: '#1FA9FF',
                        width: { sm: '55%', xs: '90%' },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Box mt={5} mb={{ md: 20, xs: 10 }} sx={{ width: { sm: '90%' }, alignSelf: 'center' }}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                sx={{ textAlign: 'center' }}
              >
                <Grid item xs={4}>
                  <Box
                    sx={{
                      backgroundColor: '#1FA9FF',
                      color: '#ffffff',
                      width: '100%',
                      height: { xs: '100%', sm: '138px' },
                      py: 3,
                      borderRadius: 2,
                      boxShadow: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Stack sx={{ px: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                        mb={2}
                      >
                        Revenue Boost
                      </Typography>
                    </Stack>

                    <Typography sx={{ fontSize: { lg: '28px', xs: '16px' } }}>
                      ${ProjRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      backgroundColor: '#1FA9FF',
                      color: '#ffffff',
                      width: '100%',
                      height: { xs: '100%', sm: '138px' },
                      py: 3,
                      borderRadius: 2,
                      boxShadow: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Stack sx={{ px: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                        mb={2}
                      >
                        Profit Boost
                      </Typography>
                    </Stack>

                    <Typography sx={{ fontSize: { lg: '28px', xs: '16px' } }}>
                      ${ProjProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      backgroundColor: '#1FA9FF',
                      color: '#ffffff',
                      width: '100%',
                      height: { xs: '100%', sm: '138px' },
                      py: 3,
                      borderRadius: 2,
                      boxShadow: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Stack sx={{ px: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                        mb={2}
                      >
                        Conversions Boost
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: { lg: '28px', xs: '16px' } }}>
                      {Math.floor(ProjSales)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </m.div>
      </Container>
    </Box>
  );
}

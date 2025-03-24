import { m } from 'framer-motion';
import React, { useState } from 'react';
import { Box, Typography, Slider, Container, Card, CardContent, Grid, Paper } from '@mui/material';
import { GifBoxRounded } from '@mui/icons-material';
import { MotionViewport, varFade } from '../../components/animate';

function calculateNumberFences(cost, profitMargin, subscriptioncost) {
  const fenceboost = cost * (profitMargin / 100);
  return Math.ceil(subscriptioncost / fenceboost);
}

function fencesSoldBoost(fencesSold, margin) {
  const marginpercent = margin / 100;
  return Math.ceil((marginpercent + 1) * fencesSold);
}

function createMarks(min, max, step) {
  const marks = [];
  for (let i = min; i <= max; i += step) {
    marks.push({ value: i, label: i.toLocaleString() });
  }
  return marks;
}

export default function RoiCalculator() {
  const [margin, setboostFences] = useState(15);
  const [fencesSold, setFencesSold] = useState(100);
  const [cost, setCost] = useState(5000);
  const [profitMargin, setProfitMargin] = useState(20);

  const numberFence = calculateNumberFences(cost, profitMargin, 899);
  const fenceboost = fencesSoldBoost(fencesSold, margin);
  const estimatedRevenueBoost = cost * fenceboost - fencesSold * cost;
  const estimatedProfitBoost =
    cost * fenceboost * (profitMargin / 100) - fencesSold * cost * (profitMargin / 100);

  const profitMarginMarks = createMarks(0, 100, 10);
  const fencesSoldMarks = createMarks(50, 1000, 100);
  const costMarks = createMarks(1000, 50000, 8000);
  const marginSlider = createMarks(0, 100, 10);

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 3, md: 5 },
        px: { xs: 3, md: 5 },
      }}
    >
      <Container component={MotionViewport}>
        <Grid container sx={{ justifyContent: 'center' }}>
          <Typography
            variant="h2"
            sx={{ textAlign: 'center', color: 'black', fontFamily: 'Poppins', fontWeight: 900 }}
          >
            Unleash Your Business Potential
          </Typography>

          <Paper
            elevation={3}
            sx={{
              mt: 5,
              p: 4,
              bgcolor: 'background.paper',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Estimated sales boost with RealityFence(%): {margin}
                </Typography>
                <Slider
                  value={margin}
                  onChange={(event, newValue) => setboostFences(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={1}
                  marks={marginSlider}
                  sx={{
                    '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 },
                    color: '#1FA9FF',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Current annual sales volume: {fencesSold}</Typography>
                <Slider
                  value={fencesSold}
                  onChange={(event, newValue) => setFencesSold(newValue)}
                  valueLabelDisplay="auto"
                  min={50}
                  max={1000}
                  step={50}
                  marks={fencesSoldMarks}
                  sx={{
                    '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 },
                    color: '#1FA9FF',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Average cost of a fence sold($): {cost.toLocaleString()}
                </Typography>
                <Slider
                  value={cost}
                  onChange={(event, newValue) => setCost(newValue)}
                  valueLabelDisplay="auto"
                  min={1000}
                  max={50000}
                  step={250}
                  marks={costMarks}
                  sx={{
                    '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 },
                    color: '#1FA9FF',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Profit margin percentage(%): {profitMargin}</Typography>
                <Slider
                  value={profitMargin}
                  onChange={(event, newValue) => setProfitMargin(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={1}
                  marks={profitMarginMarks}
                  sx={{
                    '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 },
                    color: '#1FA9FF',
                  }}
                />
              </Grid>
            </Grid>
            <Box mt={4}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Fences Sold to Break Even:
                      </Typography>
                      <Typography variant="h5">{numberFence.toLocaleString()}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Fences Sold Per Year with Boost:
                      </Typography>
                      <Typography variant="h5">{fenceboost.toLocaleString()}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Estimated revenue boost:
                      </Typography>
                      <Typography variant="h5">
                        ${estimatedRevenueBoost.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Estimated profit boost:
                      </Typography>
                      <Typography variant="h5">${estimatedProfitBoost.toLocaleString()}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
}

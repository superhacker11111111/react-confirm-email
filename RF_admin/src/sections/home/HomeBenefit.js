import React, { useState } from 'react';
import { Box, Typography, Slider, Container, Card, CardContent, Grid, Paper } from '@mui/material';

function calculateFences(cost, profitMargin, subscription) {
  const profitPerFence = cost * (profitMargin / 100);
  return Math.ceil((subscription * 12) / profitPerFence);
}

function createMarks(min, max, step) {
  const marks = [];
  for (let i = min; i <= max; i += step) {
    marks.push({ value: i, label: i.toLocaleString() });
  }
  return marks;
}

export default function RoiCalculator() {
  const [cost, setCost] = useState(5000);
  const [profitMargin, setProfitMargin] = useState(20);
  const [fencesSold, setFencesSold] = useState(100);

  const fences300 = calculateFences(cost, profitMargin, 300);
  const fences500 = calculateFences(cost, profitMargin, 500);
  const estimatedBoost = Math.round(fencesSold * 1.1);
  const estimatedRevenueBoost = fencesSold * cost * (profitMargin / 100) * 0.1;

  const costMarks = createMarks(1000, 50000, 5000);
  const profitMarginMarks = createMarks(10, 100, 10);
  const fencesSoldMarks = createMarks(50, 1000, 50);

  return (
    <Container>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        What does a 5% Sales boost look like for my company?
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom>
              My average fence costs ($): {cost.toLocaleString()}
            </Typography>
            <Slider
              value={cost}
              onChange={(event, newValue) => setCost(newValue)}
              valueLabelDisplay="auto"
              min={1000}
              max={50000}
              step={250}
              marks={costMarks}
              sx={{ '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 }, color: '#1288E3' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>My profit margin is (%): {profitMargin}</Typography>
            <Slider
              value={profitMargin}
              onChange={(event, newValue) => setProfitMargin(newValue)}
              valueLabelDisplay="auto"
              min={10}
              max={100}
              step={5}
              marks={profitMarginMarks}
              sx={{ '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 }, color: '#1288E3' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Estimated fences sold per year: {fencesSold}</Typography>
            <Slider
              value={fencesSold}
              onChange={(event, newValue) => setFencesSold(newValue)}
              valueLabelDisplay="auto"
              min={50}
              max={1000}
              step={50}
              marks={fencesSoldMarks}
              sx={{ '& .MuiSlider-markLabel': { minWidth: 'auto', margin: 0 }, color: '#1288E3' }}
            />
          </Grid>
        </Grid>
        <Box mt={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Yearly Fences: 300
                  </Typography>
                  <Typography variant="h5">{fences300.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Yearly Fences: 500
                  </Typography>
                  <Typography variant="h5">{fences500.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estimated Boost
                  </Typography>
                  <Typography variant="h5">{estimatedBoost.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estimated Revenue Boost
                  </Typography>
                  <Typography variant="h5">${estimatedRevenueBoost.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

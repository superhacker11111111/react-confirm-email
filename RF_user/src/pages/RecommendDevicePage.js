import { Typography, Container, Box, Grid, Stack } from '@mui/material';
import soldImage1 from '../assets/illustrations/sold.png';
import HomePageImage1 from '../assets/illustrations/scan.png';

export default function RecommendDevicePage() {
  return (
    <Container>
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: { lg: '48px', xs: '30px' },
            fontWeight: '800',
            color: '#212B36',
          }}
        >
          Recommended Devices
        </Typography>
        <Grid container justifyContent="space-between" width="100%" sx={{ mb: 12, mt: 8 }}>
          <Grid
            item
            md={5}
            sm={5.5}
            xs={12}
            gap={2}
            textAlign={{ sm: '-webkit-right', xs: '-webkit-center' }}
          >
            <Stack sx={{ width: { lg: '70%', md: '80%', sm: '90%', xs: '70%' } }}>
              <Box sx={{ textAlign: '-webkit-center', pb: 4 }}>
                <img src={HomePageImage1} alt="Home Page" style={{ display: 'flex' }} />
              </Box>
              <Box sx={{ textAlign: '-webkit-center' }}>
                <img src={soldImage1} alt="Sell Fences" style={{ display: 'flex' }} />
              </Box>
            </Stack>
          </Grid>
          <Grid
            item
            md={6}
            sm={6}
            xs={12}
            sx={{
              borderRadius: '38px',
              alignItems: 'start',
              textAlign: 'start',
              justifyContent: 'space-between',
              px: { lg: 3, md: 3, xs: 1 },
            }}
          >
            <Typography
              sx={{
                fontSize: { lg: '24px', md: '20px', xs: '18px' },
                fontWeight: 800,
                mb: 3,
                pt: { xs: 4, md: 0 },
              }}
            >
              LiDAR Technology
            </Typography>
            <Typography sx={{ fontSize: { lg: '20px', md: '18px', xs: '16px' }, fontWeight: 800 }}>
              What is LiDAR?
            </Typography>
            <Typography sx={{ fontSize: { lg: '20px', md: '18px', xs: '16px' }, mb: 4 }}>
              LiDAR, or Light Detection and Ranging, uses laser light to measure distances and
              create precise 3D models.
            </Typography>

            <Typography sx={{ fontSize: { lg: '20px', md: '18px', xs: '16px' }, fontWeight: 800 }}>
              Why LiDAR?
            </Typography>
            <Typography sx={{ fontSize: { lg: '20px', md: '18px', xs: '16px' }, mb: 3 }}>
              LiDAR technology enhances RealityFence&apos;s performance by providing accurate
              real-world measurements.
            </Typography>
            <Box
              variant="text"
              style={{
                size: 'large',
                color: 'white',
                backgroundColor: '#1FA9FF',
                padding: '6px 10px',
                width: '80%',
              }}
            >
              <Typography
                sx={{ fontSize: { lg: '20px', md: '18px', xs: '16px' }, fontWeight: 800 }}
              >
                Our Recommended Devices With LiDAR:
              </Typography>

              <li style={{ fontSize: '18px' }}>iPad Pro (v. 2020 and later)</li>
            </Box>

            <Typography
              sx={{ fontSize: { lg: '20px', md: '18px', xs: '16px' }, mt: 3, fontWeight: 800 }}
            >
              Other Devices With LiDAR:
            </Typography>

            <li style={{ fontSize: '18px' }}>iPhone 14 Pro Max</li>
            <li style={{ fontSize: '18px' }}>iPhone 14 Pro</li>
            <li style={{ fontSize: '18px' }}>iPhone 13 Pro Max</li>
            <li style={{ fontSize: '18px' }}>iPhone 13 Pro</li>
            <li style={{ fontSize: '18px' }}>iPhone 12 Pro</li>
            <li style={{ fontSize: '18px' }}>iPhone 12 Pro Max</li>

            <Typography
              sx={{ fontSize: { lg: '20px', md: '18px', xs: '16px' }, fontWeight: 800, mt: 5 }}
            >
              Will RealityFence work without LiDAR?
            </Typography>
            <Typography sx={{ fontSize: { lg: '20px', md: '18px', xs: '16px' }, mb: 2 }}>
              Yes. While RealityFence works on all compatible devices, but having a LiDAR-equipped
              device significantly enhances precision and quality of the 3D modeling and
              measurements.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

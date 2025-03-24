// @mui
import { Typography, Container, Box, Button, Grid } from '@mui/material';
import { PATH_AUTH, PATH_PAGE } from '../../routes/paths';
import memberImage from '../../assets/illustrations/member.png';
import instagramImage from '../../assets/illustrations/landingImage/Instagram.png';
import tiktokImage from '../../assets/illustrations/landingImage/Tiktok.png';
import facebookImage from '../../assets/illustrations/landingImage/Facebook.png';
import twitterImage from '../../assets/illustrations/landingImage/Twitter.png';
import linkedinImage from '../../assets/illustrations/landingImage/LinkedIn.png';
import youtubeImage from '../../assets/illustrations/landingImage/Youtube.png';
import { MotionViewport, varFade } from '../../components/animate';

export default function Connecting() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Container component={MotionViewport}>
        <Typography
          variant="h2"
          sx={{
            my: 3,
          }}
        >
          Where can we connect?!
        </Typography>
      </Container>
      <Grid
        xs={6}
        md={8}
        lg={8}
        sx={{ mt: '-45px' }}
        style={{ justifyContent: 'center', display: 'flex', maxwidth: '80%', marginTop: '10px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img src={memberImage} alt="marketing market" />
        </div>
      </Grid>
      <Container component={MotionViewport}>
        <Grid container spacing={2} style={{ justifyContent: 'center' }}>
          <Grid item xs={5} md={2} sm={4} sx={{ px: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img src={instagramImage} alt="Instagram" />
            </div>
          </Grid>
          <Grid item xs={5} md={2} sm={4} sx={{ px: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img src={tiktokImage} alt="Tiktok" />
            </div>
          </Grid>
          <Grid item xs={5} md={2} sm={4} sx={{ px: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img src={facebookImage} alt="Facebook" />
            </div>
          </Grid>
          <Grid item xs={5} md={2} sm={4} sx={{ px: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img src={twitterImage} alt="Twitter" />
            </div>
          </Grid>
          <Grid item xs={5} md={2} sm={4} sx={{ px: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img src={linkedinImage} alt="Linkdin" />
            </div>
          </Grid>
          <Grid item xs={5} md={2} sm={4} sx={{ px: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img src={youtubeImage} alt="Youtube" />
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

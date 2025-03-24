import { useSelector } from 'react-redux';
import { Typography, Grid, Stack } from '@mui/material';
// import fenceImage from '../../../assets/illustrations/fence.png';

export default function MyFences() {
  const { selectedFences } = useSelector((state) => state.product);
  return (
    <Grid
      container
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      style={{ display: 'flex' }}
    >
      <Stack style={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: { xs: '30px', sm: '40px' }, fontWeight: '900' }}>
          My Fences
        </Typography>
        <Typography sx={{ fontSize: { xs: '18px', sm: '24px' }, fontWeight: '700' }}>
          {selectedFences.length} Added
        </Typography>
      </Stack>

      <Grid container item sx={{ px: { lg: 14, sm: 4, xs: 1 } }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
          style={{ marginTop: '18px', justifyContent: 'center' }}
        >
          {selectedFences?.map((fence, index) => (
            <Grid item xs={2} sm={6} md={6} key={fence.id}>
              <Grid
                item
                container
                key={fence.id}
                display="flex"
                direction="row"
                sx={{
                  p: 2,
                  borderWidth: '1px',
                  width: '100%',
                  boxShadow: '0px 6px 6px #a6a6a6',
                  mb: '10px',
                }}
                gap={1}
              >
                <Grid
                  item
                  xs={2}
                  key={fence.id}
                  sx={{
                    width: '58px !important',
                  }}
                >
                  {fence && fence.filesImage && fence.filesImage.length > 0 && (
                    <img src={fence.filesImage[0]?.preview} alt="fence" />
                  )}
                </Grid>

                <Grid item xs={9}>
                  <Typography
                    style={{
                      fontSize: { md: '16px', xs: '16px' },
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fence.name}
                  </Typography>

                  <Typography style={{ fontSize: '14px', fontWeight: 600 }}>
                    {fence.style}
                  </Typography>
                  <Typography style={{ fontSize: '14px', fontWeight: 600 }}>
                    {fence.size}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

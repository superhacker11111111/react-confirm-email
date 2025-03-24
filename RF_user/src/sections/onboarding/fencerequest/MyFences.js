import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Typography, Grid, Box, Stack } from '@mui/material';
// import fenceImage from '../../../assets/illustrations/fence.png';

MyFences.propTypes = {
  available: PropTypes.number,
};

export default function MyFences({ available }) {
  //
  const { selected_list } = useSelector((state) => state.product);
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
          {selected_list && selected_list.length}/{available} Selected
        </Typography>
      </Stack>

      <Grid container item sx={{ px: { lg: 14, sm: 4, xs: 2 } }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
          style={{ marginTop: '18px', justifyContent: 'center' }}
        >
          {selected_list &&
            selected_list.length > 0 &&
            selected_list.map((fence, index) => (
              <Grid item xs={2} sm={6} md={6} key={fence.id}>
                <Stack
                  key={fence.id}
                  display="flex"
                  direction="row"
                  style={{
                    boxShadow: '0px 6px 6px #a6a6a6',
                    marginBottom: '10px',
                  }}
                  sx={{
                    p: 2,
                    borderWidth: '1px',
                    width: '100%',
                  }}
                >
                  <Box
                    key={fence.id}
                    sx={{
                      width: '58px !important',
                      height: '58px',
                    }}
                  >
                    {fence && fence.filesImage && fence.filesImage.length > 0 && (
                      <img src={fence.filesImage[0]?.preview} alt="fence" />
                    )}
                  </Box>

                  <Stack sx={{ pl: 2 }}>
                    <Typography
                      style={{
                        fontSize: { md: '16px', xs: '16px' },
                        fontWeight: 700,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fence.name.length > 32 ? `${fence.name.slice(0, 32)}...` : fence.name}
                    </Typography>

                    <Typography style={{ fontSize: '14px', fontWeight: 600 }}>
                      {fence.style}
                    </Typography>
                    <Typography style={{ fontSize: '14px', fontWeight: 600 }}>
                      {fence.size}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

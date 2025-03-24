import { useSelector } from 'react-redux';
import { Typography, Grid } from '@mui/material';
// import trashImage from '../../../assets/illustrations/trash.png';

export default function RemovedFences() {
  const { removed_list } = useSelector((state) => state.product);
  return (
    <>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item style={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: { xs: '30px', sm: '40px' }, fontWeight: '900' }}>
            Removed Fences&nbsp;
          </Typography>
          {/* <img src={trashImage} alt="Removed" /> */}
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: { xs: '18px', sm: '24px' }, fontWeight: '700' }}>
            {removed_list.length} Removed
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="center"
        style={{ display: 'flex', gap: '32px' }}
      >
        <Grid container item sx={{ px: { lg: 14, sx: 2 } }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
            style={{ marginTop: '18px', justifyContent: 'center' }}
          >
            {removed_list &&
              removed_list?.map((fence, index) => (
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
                        {fence.name.length > 32 ? `${fence.name.slice(0, 32)}...` : fence.name}
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
    </>
  );
}

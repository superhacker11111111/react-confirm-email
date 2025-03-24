import { useSelector } from 'react-redux';
import { Typography, Grid, Box } from '@mui/material';

export default function Summary() {
  const { removed_list, selected_list, selectedFences, new_request_list } = useSelector(
    (state) => state.product
  );

  return (
    <Grid
      container
      item
      alignItems="center"
      sx={{
        py: 9,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
      style={{ marginTop: '60px', display: 'flex', justifyContent: 'center' }}
      sm={6.4}
    >
      <Box style={{ textAlign: 'center' }}>
        <Typography
          sx={{ fontSize: { xs: '32px', md: '40px' }, fontWeight: '700', textAlign: 'center' }}
        >
          Fence Swapper <br /> Summary
        </Typography>
      </Box>
      <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ py: 3 }}>
        <Grid item xs={9} sm={8}>
          <Typography style={{ fontSize: '14px' }}>My Fences Removed</Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          style={{
            alignContent: 'center',
            display: 'flex',
            justifyContent: 'end',

            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '14px', color: '#000000' }}>
            {removed_list.length ? removed_list.length : 0}
          </Typography>
        </Grid>
      </Grid>
      <hr style={{ borderTop: '1px solid #bbb', width: '85%' }} />
      <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ py: 3 }}>
        <Grid item xs={9} sm={8}>
          <Typography style={{ fontSize: '14px' }}>My Fences Added</Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          style={{
            alignContent: 'center',
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '14px', color: '#000000' }}>
            {selectedFences.length ? selectedFences.length : 0}
          </Typography>
        </Grid>
      </Grid>
      <hr style={{ borderTop: '1px solid #bbb', width: '85%' }} />
      <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ py: 3 }}>
        <Grid item xs={9} sm={8}>
          <Typography style={{ fontSize: '14px' }}>My Requests Submitted</Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          style={{
            alignContent: 'center',
            display: 'flex',
            justifyContent: 'end',

            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '14px', color: '#000000' }}>
            {new_request_list.length ? new_request_list.length : 0}
          </Typography>
        </Grid>
      </Grid>
      <hr style={{ borderTop: '1px solid #bbb', width: '85%' }} />
      <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ py: 3 }}>
        <Grid item xs={7} sm={6}>
          <Typography style={{ fontSize: '16px', fontWeight: '400', textAlign: 'right' }}>
            Fences Added
          </Typography>
        </Grid>
        <Grid
          item
          xs={5}
          sm={4}
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '16px', color: '#000000' }}>
            {selectedFences.length > 0 ? selectedFences.length : 0}
          </Typography>
        </Grid>
      </Grid>

      <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ pt: 2, pb: 6 }}>
        <Grid item xs={7} sm={6}>
          <Typography style={{ fontSize: '18px', fontWeight: '900', textAlign: 'right' }}>
            Total Fences
          </Typography>
        </Grid>
        <Grid
          item
          xs={5}
          sm={4}
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '18px', fontWeight: '900', color: 'black' }}>
            {selectedFences.length + selected_list.length - removed_list.length}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

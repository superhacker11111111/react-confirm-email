import PropTypes from 'prop-types';
import { Typography, Grid, Box, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscription } from '../../../redux/slices/subscription';

Summary.propTypes = {
  // subInfo: PropTypes.shape({
  //   subOrigneTitle: PropTypes.string,
  //   orginePrice: PropTypes.string,
  // }),
  // subUpgradeInfo: PropTypes.shape({
  //   subUpgradeTitle: PropTypes.string,
  //   subUpgradePrice: PropTypes.string,
  // }),
  // subUpgradeTitle: PropTypes.string,
  // type: PropTypes.number,
  selectedCount: PropTypes.number,
  requestCount: PropTypes.number,
  user: PropTypes.object,
};

export default function Summary({
  // type,
  // subInfo,
  // subUpgradeInfo,
  selectedCount,
  requestCount,
  user,
}) {
  const { subscription } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSubscription(user.plan));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.plan]);

  return (
    <Stack sx={{ px: 2 }} alignItems="center">
      <Grid
        container
        item
        sx={{
          py: { md: 9, xs: 5 },
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z24,
        }}
        style={{ marginTop: { md: '60px', xs: '30px' }, display: 'flex', justifyContent: 'center' }}
        sm={6.4}
      >
        <Box style={{ textAlign: 'center' }}>
          <Typography
            sx={{ fontSize: { xs: '32px', md: '40px' }, fontWeight: '700', textAlign: 'center' }}
          >
            {subscription?.name} Summary
          </Typography>
          <Typography style={{ fontSize: '24px', fontWeight: '700' }} sx={{ pb: 2 }}>
            {selectedCount + requestCount}/{subscription?.totalFences} Fences
          </Typography>
        </Box>
        <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ py: 3 }}>
          <Grid item xs={9} sm={8}>
            <Typography style={{ fontSize: '14px', fontWeight: 'bold' }}>My Fences</Typography>
            <Typography style={{ fontSize: '14px' }}>All selections from Fence Selector</Typography>
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
            <Typography sx={{ fontSize: '14px', color: '#000000' }}>{selectedCount}</Typography>
          </Grid>
        </Grid>
        {/* {type !== 1 && (
          <>
            <hr style={{ borderTop: '1px solid #bbb', width: '85%' }} />
            <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ py: 3 }}>
              <Grid item xs={9} sm={8}>
                <Typography style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  My Requests
                </Typography>
                <Typography style={{ fontSize: '14px' }}>
                  All requests from Fence Requester
                </Typography>
              </Grid>
              <Grid
                item
                xs={3}
                sm={2}
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontSize: '14px', color: '#000000' }}>{requestCount}</Typography>
              </Grid>
            </Grid>
          </>
        )} */}

        <hr style={{ borderTop: '1px solid #bbb', width: '85%' }} />
        <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ py: 3 }}>
          <Grid item xs={7} sm={6}>
            <Typography style={{ fontSize: '16px', fontWeight: '400', textAlign: 'right' }}>
              Total Fences Selected
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
            <Typography sx={{ fontSize: '16px', color: '#000000' }}>{selectedCount}</Typography>
          </Grid>
        </Grid>

        <Grid container style={{ justifyContent: 'center', width: '80%' }} sx={{ pt: 2, pb: 6 }}>
          <Grid item xs={7} sm={6}>
            <Typography style={{ fontSize: '18px', fontWeight: '900', textAlign: 'right' }}>
              Total Remaining
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
            <Typography sx={{ fontSize: '18px', fontWeight: '900', color: '#000000' }}>
              {Number(subscription?.totalFences) - Number(selectedCount)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}

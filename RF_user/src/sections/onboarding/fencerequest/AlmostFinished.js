import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Grid, Stack } from '@mui/material';
import groupImage from '../../../assets/illustrations/Group.png';
import { getSubscription } from '../../../redux/slices/subscription';

AlmostFinished.propTypes = {
  user: PropTypes.object,
};

export default function AlmostFinished({ user }) {
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
          pb: { md: 4, xs: 2 },
          pt: 4,
          px: 1,
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z24,
        }}
        sm={10}
      >
        <Grid container sx={{ display: 'flex', px: 1 }}>
          <Grid item sm={1} xs={1.5}>
            <div style={{ display: 'flex', justifyContent: 'center', marginRight: '10px' }}>
              <img src={groupImage} alt="Group" style={{ maxwidth: '68px', minWidth: '47px' }} />
            </div>
          </Grid>

          <Grid
            item
            sm={11}
            xs={10.5}
            sx={{
              pr: { md: 6, xs: 0.5 },
              pl: { md: 5.5, xs: 2 },
              fontSize: { xs: '17px', md: '20px' },
            }}
          >
            <ol style={{ fontWeight: '600', marginBottom: '20px' }}>
              <li style={{ listStyle: 'initial' }}>
                Once you have confirmed “My Fences” and “My Requests,” your fences will be added to
                your account, and RealityFence will begin creating your requested 3D models.
              </li>
            </ol>
            <ol style={{ fontWeight: '600', marginBottom: '20px' }}>
              <li style={{ listStyle: 'initial' }}>
                If you have any unused selections, you may return to Fence Selector, or My Requests
                at any time.
              </li>
            </ol>
            <ol
              style={{
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              <li style={{ listStyle: 'initial' }}>
                Once you have made all of your selections, if you need to make changes, you can swap
                10% of your fences per month.
              </li>
            </ol>
            <Typography
              style={{
                textAlign: 'center',

                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              {subscription?.name} Subscription = {subscription?.swapCount} swaps per month
            </Typography>
            <ol
              style={{
                listStyle: 'inherit',
                fontWeight: '600',
                marginBottom: '20px',
              }}
              disabled={subscription?.name === 'Pro'}
            >
              <li style={{ listStyle: 'initial' }}>
                If you have not selected all of your fences, you can continue with your current
                selections, and return to finish at any time. All of your current selections will be
                available for immediate use. You may also come back to Fence Request to finish your
                fence selection process.
              </li>
            </ol>
            <ol style={{ fontWeight: '600', marginBottom: '20px' }}>
              <li style={{ listStyle: 'initial' }}>
                Once you&apos;ve submitted My Fences and My Requests, this action can&apos;t be
                undone.
              </li>
            </ol>
            <ol
              style={{ fontWeight: '600', marginBottom: '10px' }}
              disabled={subscription?.name === 'Pro'}
            >
              <li style={{ listStyle: 'initial' }}>
                Please verify the information below prior to submitting.
              </li>
            </ol>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}

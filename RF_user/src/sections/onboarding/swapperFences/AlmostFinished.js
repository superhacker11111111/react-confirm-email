import { Grid, useMediaQuery } from '@mui/material';
import groupImage from '../../../assets/illustrations/Group.png';

export default function AlmostFinished() {
  // const isDesktop = useResponsive('up', 'lg');
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Grid
      container
      item
      alignItems="center"
      sx={{
        // mr: { xs: 2, lg: 10 },
        // ml: { xs: 2, lg: 10 },
        py: 4,
        px: 1,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
      sm={10}
    >
      <Grid container sx={{ display: 'flex', px: 1 }} justifyContent="center">
        {!isMobile && (
          <Grid item sm={1} xs={2}>
            <div style={{ display: 'flex', justifyContent: 'center', marginRight: '10px' }}>
              <img src={groupImage} alt="Group" style={{ maxwidth: '68px', minWidth: '47px' }} />
            </div>
          </Grid>
        )}
        <Grid
          item
          sm={11}
          xs={10}
          sx={{
            pr: { md: 6, xs: 0.5 },
            pl: { md: 5.5, xs: 2 },
            fontSize: { xs: '17px', md: '20px' },
          }}
        >
          <ol style={{ fontWeight: '600', marginBottom: '20px' }}>
            <li style={{ listStyle: 'initial' }}>
              Once you have submitted, your fences will be updated to your account. If you made any
              requests, RealityFence will begin creating your requested 3D models.
            </li>
            <br />
            <li style={{ listStyle: 'initial' }}>
              Don&apos;t forget, you can come back to Fence Swapper every month, and swap out 10% of
              your fences.
            </li>
            <br />
            <li style={{ listStyle: 'initial' }}>
              Once you&apos;ve submitted, this action can&apos;t be undone.
            </li>
            <br />
            <li style={{ listStyle: 'initial' }}>
              Please verify the information below before submitting.
            </li>
          </ol>
        </Grid>
      </Grid>
    </Grid>
  );
}

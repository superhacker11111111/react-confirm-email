import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
// @mui
import { Container, Button, Grid, Typography, Card, useMediaQuery, Stack } from '@mui/material';
import { Edit } from '@mui/icons-material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

const ManageItems = [
  {
    title: 'Video',
    link: PATH_DASHBOARD.general.media.editVideo,
  },
  {
    title: 'Gallery Images',
    link: PATH_DASHBOARD.general.media.editgalleryImage,
  },
];

export default function GeneralMediaManagePage() {
  const { themeStretch } = useSettingsContext();
  const isIcon = useMediaQuery('(min-width:420px)');
  const isDesktop = useResponsive('up', 'sm');

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Media | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack mb={1}>
          <Typography variant="h4">Media Manager</Typography>
        </Stack>

        <Card sx={{ p: 3 }}>
          <Typography variant="caption" fontWeight="bold" color="#637381">
            MANAGE CATEGORIES
          </Typography>
          {ManageItems &&
            ManageItems.length > 0 &&
            ManageItems.map((item, index) => (
              <Grid key={index} container gap={1} mb={1} pl={2}>
                <Grid item xs={isIcon ? 6 : 12} sm={3.5}>
                  <Typography variant="h6">{item.title}</Typography>
                </Grid>
                <Grid item xs={isIcon ? 5 : 12} sm={8} container gap={1}>
                  <Button variant="outlined" onClick={() => navigate(item.link)}>
                    {isDesktop ? (
                      <>
                        <Edit />
                        &nbsp; Edit Media
                      </>
                    ) : (
                      <Edit />
                    )}
                  </Button>
                </Grid>
              </Grid>
            ))}
        </Card>
      </Container>
    </>
  );
}

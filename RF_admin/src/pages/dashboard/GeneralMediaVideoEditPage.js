import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
//
import { getVideos } from '../../redux/slices/media';
import { useDispatch, useSelector } from '../../redux/store';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import MediaVideoEditForm from '../../sections/@dashboard/general/media/MediaVideoEditForm';

export default function GeneralMediaVideoEditPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const { video } = useSelector((state) => state.media);
  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Media: Edit Videos | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="Edit Videos" links={[{ name: '' }]} />
        <MediaVideoEditForm video={video} />
      </Container>
    </>
  );
}

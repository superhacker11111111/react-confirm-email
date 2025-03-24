import { useEffect } from 'react';
import { Stack, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactPlayer from 'react-player';
import { PATH_DASHBOARD, PATH_ONBOARDING } from '../../routes/paths';
import { getVideos } from '../../redux/slices/media';

export default function Tutorial() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { video } = useSelector((state) => state.media);
  const videoUrl = video && video.tutorialURL;
  const captionsUrl = 'valid-captions.vtt';

  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  const handleClickDash = () => {
    navigate(PATH_DASHBOARD.user.account);
  };
  const handleClickBack = () => {
    navigate(PATH_ONBOARDING.onboarding.downloadApp);
  };
  return (
    <Stack
      sx={{
        pb: 3,
        mx: { xs: 2, md: 6, lg: 12, xl: 24 },
        px: { xs: 0, lg: 6 },
        mt: { sm: 0, xs: 11 },
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
    >
      <Stack sx={{ px: { lg: 8, md: 2, xs: 1 }, pt: 4, pb: 4 }}>
        <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', height: 0 }}>
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              file: {
                attributes: {
                  crossOrigin: 'true',
                  controlsList: 'nodownload',
                  type: 'video/mp4',
                },
                tracks: [
                  {
                    kind: 'captions',
                    src: captionsUrl,
                    srcLang: 'en',
                    label: 'English',
                    default: true,
                  },
                ],
              },
            }}
          />
        </div>
      </Stack>

      <Stack
        display="flex"
        justifyContent="center"
        direction="row"
        gap={{ xs: 1, sm: 30 }}
        alignItems="center"
        sx={{ px: { xs: 1, sm: 0 } }}
      >
        <Button
          variant="contained"
          sx={{
            fontSize: { sm: '18px', xs: '16px' },
            width: '220px',
            height: '52px',
            fontWeight: '900',
          }}
          style={{ backgroundColor: '#1FA9FF' }}
          onClick={handleClickBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{
            fontSize: { sm: '18px', xs: '16px' },
            width: '220px',
            height: '52px',
            fontWeight: '900',
          }}
          style={{ backgroundColor: '#1FA9FF' }}
          onClick={handleClickDash}
        >
          Finish
        </Button>
      </Stack>
    </Stack>
  );
}

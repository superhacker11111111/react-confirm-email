import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Button, Typography, Stack } from '@mui/material';
// routes
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { CreateOrUpdateVideo } from '../../../../redux/slices/media';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import setAuthToken from '../../../../utils/setAuthToken';
import useResponsive from '../../../../hooks/useResponsive';
import { useSnackbar } from '../../../../components/snackbar';

MediaVideoEditForm.propTypes = {
  video: PropTypes.object,
};

export default function MediaVideoEditForm({ video }) {
  console.log(video);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const isMobile = useResponsive('down', 'sm');

  const NewVideoSchema = Yup.object().shape({
    marketing: Yup.string(),
    tutorial: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      marketing: video.marketing || '',
      tutorial: video.tutorial || '',
    }),
    [video]
  );

  const methods = useForm({
    resolver: yupResolver(NewVideoSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleClick = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      setAuthToken(localStorage.getItem('accessToken'));
      const videoData = {
        marketingURL: { preview: values.marketing },
        tutorialURL: { preview: values.tutorial },
      };
      dispatch(CreateOrUpdateVideo(videoData, SnackBar, navigate));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid item>
      <Card sx={{ p: 5, width: '100%' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleClick)}>
          <Grid item container direction="column" gap={4}>
            <Stack>
              <Typography variant="subtitle2">Marketing Page Video</Typography>
              <RHFTextField
                name="marketing"
                placeholder="Enter URL..."
                sx={{ width: isMobile ? '100%' : '60%' }}
              />
            </Stack>
            <Stack>
              <Typography variant="subtitle2">Tutorial Video</Typography>
              <RHFTextField
                name="tutorial"
                placeholder="Enter URL..."
                sx={{ width: isMobile ? '100%' : '60%' }}
              />
            </Stack>
          </Grid>
          <Grid
            container
            item
            spacing={2}
            p={5}
            direction={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            md={7}
          >
            <Grid item>
              <Button
                variant="contained"
                sx={{ width: '160px' }}
                onClick={() => navigate(PATH_DASHBOARD.general.media.root)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" sx={{ width: '160px' }}>
                Save
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </Grid>
  );
}

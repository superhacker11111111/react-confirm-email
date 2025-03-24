import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// utils
import setServiceToken from '../../../utils/setAuthToken';
// components
import FormProvider, { RHFTextField } from '../../../components/hook-form';

import { addService, updateService } from '../../../redux/slices/service';
import { useSnackbar } from '../../../components/snackbar';
// ----------------------------------------------------------------------

ServiceNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentService: PropTypes.object,
};

export default function ServiceNewEditForm({ isEdit, currentService }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const NewServiceSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    order: Yup.number().required('Order is required'),
  });
  const defaultValues = useMemo(
    () => ({
      title: currentService?.title || '',
      order: currentService?.order || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentService]
  );

  const methods = useForm({
    resolver: yupResolver(NewServiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentService) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentService]);

  const onSubmit = async (serviceData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setServiceToken(localStorage.getItem('token'));
      if (isEdit) {
        dispatch(updateService(currentService.id, serviceData, SnackBar, navigate));
      } else {
        dispatch(addService(serviceData, SnackBar, navigate));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="title" label="Description" />
              <RHFTextField name="order" label="Order" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Service' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

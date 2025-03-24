import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Button, Collapse, Alert, InputAdornment } from '@mui/material';
// routes
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFSwitch,
} from '../../../../components/hook-form';
import { addSubscription, updateSubscription } from '../../../../redux/slices/subscription';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import setAuthToken from '../../../../utils/setAuthToken';
import useResponsive from '../../../../hooks/useResponsive';
import { useSnackbar } from '../../../../components/snackbar';

SubscriptionNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  subscription: PropTypes.object,
};

export default function SubscriptionNewEditForm({ isEdit = false, subscription }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const displayAlert = async () => {
    await setOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await setOpen(false);
  };

  const isMobile = useResponsive('down', 'sm');

  const NewSubscriptionSchema = Yup.object().shape({
    name: Yup.string().required('Subscription Name is required'),
    price: Yup.string().required('Price is required'),
    discount: Yup.string().required('Discount is required'),
    totalFences: Yup.string().required('Total Fences is required'),
    totalUsers: Yup.string().required('Total Users is required'),
    // swapCount: Yup.string().required('Swap Count is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: subscription?.name || '',
      totalFences: subscription?.totalFences || '',
      totalUsers: subscription?.totalUsers || '',
      requestAvailable: subscription?.requestAvailable || false,
      popular: subscription?.popular || false,
      price: subscription?.price || 0,
      discount: subscription?.discount || 0,
      // swapCount: subscription?.swapCount || 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subscription]
  );

  const methods = useForm({
    resolver: yupResolver(NewSubscriptionSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && subscription) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, subscription]);

  const handleClick = async () => {
    try {
      setAuthToken(localStorage.getItem('accessToken'));
      const subscriptionData = {
        name: values.name,
        price: values.price,
        discount: values.discount,
        totalFences: values.totalFences,
        totalUsers: values.totalUsers,
        requestAvailable: values.requestAvailable,
        popular: values.popular,
        // swapCount: values.swapCount,
      };
      if (isEdit) {
        dispatch(updateSubscription(subscription.id, subscriptionData, SnackBar, navigate));
      } else {
        dispatch(addSubscription(subscriptionData, displayAlert));
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid item>
      <Collapse in={open}>
        <Alert sx={{ mb: 2 }}>Successfully created!</Alert>
      </Collapse>

      <Card sx={{ p: 5, width: '100%' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleClick)}>
          <Grid item container direction="column" gap={2}>
            <RHFTextField
              name="name"
              label="Subscription Name"
              sx={{ width: isMobile ? '100%' : '60%' }}
            />
            <RHFTextField name="price" label="Price" sx={{ width: isMobile ? '100%' : '60%' }} />
            <RHFTextField
              name="discount"
              label="Discount"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">Yearly Pay</InputAdornment>,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{ width: isMobile ? '100%' : '60%' }}
            />
            <RHFTextField
              name="totalFences"
              label="Total Fences"
              sx={{ width: isMobile ? '100%' : '60%' }}
            />
            <RHFTextField
              name="totalUsers"
              label="Total Users"
              sx={{ width: isMobile ? '100%' : '60%' }}
            />
            {/* <RHFTextField
              name="swapCount"
              label="Swappable Count"
              sx={{ width: isMobile ? '100%' : '60%' }}
            /> */}
            <RHFCheckbox name="requestAvailable" label="Fence Requests" />
            <RHFSwitch name="popular" label="Popular" />
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
                onClick={() => navigate(PATH_DASHBOARD.general.subscription.list)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" sx={{ width: '160px' }}>
                {isEdit ? 'Save' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </Grid>
  );
}

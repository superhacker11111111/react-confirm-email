import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Stack,
  Box,
  Typography,
  Divider,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
//
import setServiceToken from '../../../../utils/setAuthToken';
// components
import FormProvider, { RHFCheckbox, RHFTextField } from '../../../../components/hook-form';
//
import { addPrice, updatePrice } from '../../../../redux/slices/price';
import { getServices } from '../../../../redux/slices/service';
import { useSnackbar } from '../../../../components/snackbar';

// ----------------------------------------------------------------------

PricingNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPrice: PropTypes.object,
};

export default function PricingNewEditForm({ isEdit, currentPrice }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };
  const { services } = useSelector((state) => state.service);
  const [optionsDisabled, setOptionsDisabled] = useState({});
  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    commons: Yup.string().required('Commons to is required'),
    price: Yup.string().required('Price to is required'),
    discount: Yup.string().required('Discount to is required'),
    order: Yup.string().required('Order to is required'),
    license: Yup.string().required('License to is required'),
  });

  const defaultValues = useMemo(
    () => ({
      commons: currentPrice?.commons.toString() || '',
      price: currentPrice?.price || 0,
      license: currentPrice?.license || '',
      discount: Number(currentPrice?.discount) || 0,
      order: Number(currentPrice?.order) || 0,
      popular: currentPrice?.popular || false,
    }),
    [currentPrice]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (services) {
      if (currentPrice) {
        setOptionsDisabled(currentPrice.options);
      } else {
        const opt = {};
        services.forEach((item) => {
          opt[item.id] = false;
        });
        setOptionsDisabled(opt);
      }
    }
  }, [currentPrice, services]);

  useEffect(() => {
    if (isEdit && currentPrice) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPrice]);

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      setServiceToken(localStorage.getItem('token'));
      setLoadingSend(false);
      const priceData = {
        price: data.price,
        license: data.license,
        discount: data.discount,
        order: data.order,
        popular: data.popular,
        commons: data.commons.split(','),
        options: optionsDisabled,
      };
      if (isEdit) {
        dispatch(updatePrice(currentPrice.id, priceData, SnackBar, navigate, reset));
      } else {
        dispatch(addPrice(priceData, SnackBar, navigate, reset));
      }
    } catch (error) {
      setLoadingSend(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleCreateAndSend)}>
      <Card>
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ p: 3, bgcolor: 'background.neutral' }}
        >
          <RHFTextField name="license" label="License" />
          <RHFTextField
            name="price"
            label="Price"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">/mo</InputAdornment>,
            }}
          />
          <RHFTextField
            name="discount"
            label="Discount"
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">Yearly Pay</InputAdornment>,
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <RHFTextField name="order" label="Order" type="number" />
          {/* <RHFSelect fullWidth name="State" label="State" InputLabelProps={{ shrink: true }}>
            {STATUS_OPTIONS.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </RHFSelect> */}
          <RHFCheckbox name="popular" label="Popualr" />
        </Stack>

        <>
          {' '}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
              Services:
            </Typography>

            <Stack spacing={3}>
              <RHFTextField
                size="small"
                name="commons"
                label="Common Services"
                helperText="Please separate by comma."
              />
              {services.map((item, index) => (
                <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
                    <RHFTextField
                      disabled
                      size="small"
                      name="title"
                      value={item.title}
                      label="Description"
                      InputLabelProps={{ shrink: true }}
                    />
                    {/* <RHFCheckbox name={item.id} label="Active" /> */}
                    <FormControlLabel
                      label="active"
                      checked={optionsDisabled[item.id] ? optionsDisabled[item.id] : false}
                      name={item.id}
                      control={
                        <Switch
                          onChange={(event) => {
                            // const opt = optionsDisabled;
                            // optionsDisabled = event.target.name = event.target.checked;
                            // console.log(optionsDisabled);
                            setOptionsDisabled({
                              ...optionsDisabled,
                              [event.target.name]: event.target.checked,
                            });
                          }}
                        />
                      }
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
          </Box>
        </>
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isEdit ? 'Update' : 'Create'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

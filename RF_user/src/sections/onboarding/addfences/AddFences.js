import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Grid,
  Stack,
  Container,
  Alert,
  Button,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { AWS_S3_BUCKET } from '../../../config-global';
//
import axios from '../../../utils/axios';

// components
import { getCategories } from '../../../redux/slices/category';
import { setRequest, setNewRequest } from '../../../redux/slices/product';
import { getSubscription } from '../../../redux/slices/subscription';
// assests
import { FENCE_STATUS, S3_PRODUCT_IMAGE_FOLDER } from '../../../assets/data/roles';

import { useSettingsContext } from '../../../components/settings';
import FormProvider, { RHFEditor, RHFUpload, RHFTextField } from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { PATH_ONBOARDING } from '../../../routes/paths';
// ----------------------------------------------------------------------

export default function ProductNewEditForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const layout = localStorage.getItem('pageType');
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.auth);
  const { new_request_list, request_list, selected_list } = useSelector((state) => state.product);
  const { subscription } = useSelector((state) => state.subscription);

  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(100);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(setNewRequest([]));
  }, [dispatch]);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    // category: Yup.string().required('Category is required'),
    color: Yup.string().required('Color is required'),
    size: Yup.string().required('Panel Height x Width is required'),
    filesImage: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      category: '',
      sub_category: '',
      style: '',
      size: '',
      color: '',
      filesImage: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(getSubscription(user.plan));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (subscription) {
      setAvailable(subscription.totalFences);
    }
  }, [subscription]);

  const handleDropImage = useCallback(
    (acceptedFiles) => {
      const files = values.filesImage || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('filesImage', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.filesImage]
  );

  const handleUploadImage = async () => {
    const imageUrlList = [];
    values.filesImage.map(async (image) => {
      const data = {
        key: S3_PRODUCT_IMAGE_FOLDER + Date.now().toString() + image.path,
        values,
      };
      const preSignedURL = await axios.post('/auth/presignedUrl', data);
      imageUrlList.push(`https://${AWS_S3_BUCKET}.s3.amazonaws.com/${data.key}`);
      const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
      await fetch(preSignedURL.data.signedUrl, {
        method: 'PUT',
        headers: myHeaders,
        body: image,
      });
    });
    return imageUrlList;
  };

  const handleRemoveImageFile = (inputFile) => {
    const filtered = values.filesImage && values.filesImage?.filter((file) => file !== inputFile);
    setValue('filesImage', filtered);
  };
  const handleRemoveAllImageFiles = () => {
    setValue('filesImage', []);
  };

  const handleAddRequest = async () => {
    if (Number(available) - Number(selected_list.length) - Number(request_list.length) < 1) {
      enqueueSnackbar(
        'Failed to add to My Requests, you don’t have any selections available at this time.',
        {
          variant: 'error',
        }
      );
    }
    // else if (request_list.length === selectedAvailable) {
    //   console.log('selectedAvailable :>> ', selectedAvailable);
    //   enqueueSnackbar('Please remove fences in My Fences before requesting new ones. ', {
    //     variant: 'error',
    //   });
    // }
    else {
      dispatch(
        setRequest([
          ...request_list,
          {
            ...values,
            id: request_list.length + 1,
            status: FENCE_STATUS.NOT_STARTED,
            addedBy: user.id,
          },
        ])
      );
      dispatch(
        setNewRequest([
          ...new_request_list,
          {
            ...values,
            id: request_list.length + 1,
            status: FENCE_STATUS.NOT_STARTED,
            addedBy: user.id,
          },
        ])
      );

      reset();
      setOpen(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setOpen(false);
    }
  };

  const handleCancel = () => {
    navigate(PATH_ONBOARDING.onboarding.categoryfences);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleAddRequest)}>
      <Container
        maxWidth={themeStretch ? false : 'lg'}
        sx={{ mb: 2, mt: { lg: '10px', xs: '-48px' } }}
      >
        <Grid container item direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: { md: '35px', xs: '28px' }, fontWeight: '900' }}>
            Fence Request
          </Typography>

          {layout !== 'addFenceSwapper' && (
            <Typography sx={{ fontSize: { md: '20px', xs: '16px' }, fontWeight: '900' }}>
              Request Available:{' '}
              {Number(available) - Number(selected_list.length) - Number(request_list.length)}
            </Typography>
          )}
        </Grid>
        <Stack
          spacing={4}
          sx={{
            borderRadius: 2,
            p: 2,
            boxShadow: (theme) => theme.customShadows.z24,
          }}
        >
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid container item direction="column" spacing={2}>
              <Grid item>
                <Collapse in={open}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseOutlined fontSize="inherit" />
                      </IconButton>
                    }
                    severity="success"
                    sx={{ width: '100%' }}
                  >
                    Successfully added to My Requests!
                  </Alert>
                </Collapse>
              </Grid>
              <Grid item>
                <RHFTextField
                  fullWidth
                  name="name"
                  placeholder={`Product Display Name (E.g. "Cedar Gothic Picket")`}
                  label="Product Display Name"
                />
              </Grid>
              <Grid container item spacing={3}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <RHFTextField
                    name="size"
                    placeholder="Panel Height x Width (E.g. 4x8 ft.)"
                    label="Panel Height x Width"
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <RHFTextField name="color" label="Color" placeholder="brown" />
                </Grid>
              </Grid>
              <Grid item>
                <RHFEditor
                  simple
                  name="description"
                  placeholder={`Please describe the fence in detail, including: \n  • Picket style \n  • Picket or rail width \n  • Post cap style \n  • Any other necessary details`}
                />
              </Grid>
              <Grid item container spacing={3}>
                <Grid item xs={12}>
                  <RHFUpload
                    multiple
                    thumbnail
                    name="filesImage"
                    maxSize={10 * 1024 * 1024}
                    onDrop={handleDropImage}
                    onRemove={handleRemoveImageFile}
                    onRemoveAll={handleRemoveAllImageFiles}
                    onUpload={handleUploadImage}
                    style={{ height: '180px' }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction={{ xs: 'column-reverse', sm: 'row' }}
              justifyContent={{ xs: 'center', sm: 'space-between' }}
              alignItems={{ xs: 'center', sm: 'center' }}
              marginBottom={2}
              marginTop={2}
              xs={11}
              md={10}
              lg={9}
              xl={8}
            >
              <Grid item>
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    fontSize: { md: '20px', xs: '16px' },
                    letterSpacing: '1px',
                    width: '200px',
                    fontWeight: 'bold',
                  }}
                  style={{ backgroundColor: '#1FA9FF' }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    mt: 3,
                    fontSize: { md: '20px', xs: '16px' },
                    letterSpacing: '1px',
                    width: '200px',
                  }}
                  style={{ backgroundColor: '#1FA9FF' }}
                >
                  Add Request
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </FormProvider>
  );
}

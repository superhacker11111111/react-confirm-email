/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Container, Alert, Button, Collapse, Typography, IconButton } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

import { AWS_S3_BUCKET } from '../../../config-global';
import axios from '../../../utils/axios';
// components
import { getCategories } from '../../../redux/slices/category';
import { setRequestSwapper } from '../../../redux/slices/product';

// assests
import { FENCE_STATUS, S3_PRODUCT_IMAGE_FOLDER } from '../../../assets/data/roles';
import { useSettingsContext } from '../../../components/settings';
import FormProvider, { RHFEditor, RHFUpload, RHFTextField } from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { getSubscription } from '../../../redux/slices/subscription';

// ----------------------------------------------------------------------

export default function ProductNewEditForm() {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettingsContext();
  const { user } = useSelector((state) => state.auth);
  const { subscription } = useSelector((state) => state.subscription);

  const [open, setOpen] = useState(false);

  const requestList = useSelector((state) => state.product.new_request_list);
  const total_selected_list = useSelector((state) => state.product.selected_list);
  const origin_requestList = useSelector((state) => state.product.request_list);
  const { selectedFences, removed_list } = useSelector((state) => state.product);
  // const { categories } = useSelector((state) => state.category);
  // const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  // const [designOptions, setDesignOptions] = useState([]);
  // const [colorOptions, setColorOptions] = useState(true[]);
  // const [available, setAvailable] = useState(30);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSubscription(user.plan));
  }, [user]);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Name should be 50 characters at max.'),
    color: Yup.string()
      .required('Color is required')
      .max(50, 'Color should be 50 characters at max.'),
    size: Yup.string()
      .required('Panel Height x Width is required')
      .max(50, 'Size should be 50 characters at max.'),
    description: Yup.string().required('Description is required'),
    filesImage: Yup.array()
      .min(1, 'Images is required')
      .max(5, 'You can upload a maximum of 5 images per request'),
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

  const { watch, setValue, handleSubmit } = methods;

  const values = watch();

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
    if (
      total_selected_list.length +
        selectedFences.length -
        removed_list.length +
        origin_requestList.length +
        requestList.length <
      subscription?.totalFences
    ) {
      dispatch(
        setRequestSwapper([
          ...requestList,
          {
            ...values,
            id: requestList.length + 1,
            status: FENCE_STATUS.NOT_STARTED,
            addedBy: user.id,
          },
        ])
      );
      setOpen(true);
      setValue('name', '');
      setValue('size', '');
      setValue('color', '');
      setValue('description', '');
      setValue('filesImage', '');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setOpen(false);
    } else {
      enqueueSnackbar('Please remove fences in My Fences before requesting new ones.', {
        variant: 'error',
      });
    }
  };

  return (
    <Stack className="step1">
      <FormProvider methods={methods} onSubmit={handleSubmit(handleAddRequest)}>
        <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mb: 2 }}>
          <Stack direction="column" justifyContent="space-between" alignItems="left" mb="10px">
            <Typography sx={{ fontSize: { xs: '28px', md: '40px' }, fontWeight: 800 }}>
              Request Fences
            </Typography>
            <Stack>
              <Typography sx={{ fontSize: '20px', fontWeight: 400, lineHeight: '30px' }}>
                We can create a custom 3D model of any fence that you install. All you have to do is
                fill out the information below. Every 3D model is different, but each model usually
                costs around <strong>$30</strong>. Request as many as you need, and we will send you
                a quote!
              </Typography>
            </Stack>
          </Stack>
          <Stack className="step7">
            <Stack
              className="step2"
              spacing={2}
              sx={{
                borderRadius: 2,
                p: 2,
                boxShadow: (theme) => theme.customShadows.z24,
              }}
            >
              <Stack>
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
              </Stack>
              <Stack className="step3" gap={2}>
                <Stack
                  flexDirection={{ xs: 'column-reverse', md: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'left', md: 'center' }}
                  gap={{ xs: 2, md: 0 }}
                >
                  <Stack
                    sx={{
                      width: { xs: '100%', md: '60%' },
                    }}
                  >
                    <RHFTextField
                      fullWidth
                      name="name"
                      placeholder={`Product Display Name (E.g. "Cedar Gothic Picket")`}
                      label="Product Display Name"
                    />
                  </Stack>

                  <Button
                    className="step5"
                    variant="contained"
                    type="submit"
                    sx={{
                      fontSize: '20px',
                      letterSpacing: '1px',
                      width: '200px',
                    }}
                    style={{ backgroundColor: '#1FA9FF' }}
                  >
                    Add Request
                  </Button>
                </Stack>
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width={{ xs: '100%', md: '60%' }}
                  gap={3}
                >
                  <RHFTextField
                    name="size"
                    placeholder="Panel Height x Width (E.g. 4x8 ft.)"
                    label="Panel Height x Width"
                  />
                  <RHFTextField name="color" label="Color or Wood Type" placeholder="brown" />
                </Stack>
                <RHFEditor
                  simple
                  name="description"
                  placeholder={`Please describe the fence in detail, including: \n  • Picket style \n  • Picket or rail width \n  • Post cap style \n  • Any other necessary details`}
                />
              </Stack>
              <Stack className="step4">
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
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </FormProvider>
    </Stack>
  );
}

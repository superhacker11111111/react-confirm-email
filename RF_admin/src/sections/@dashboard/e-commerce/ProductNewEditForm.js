import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Stack,
  Typography,
  Alert,
  IconButton,
  Paper,
  Chip,
  Box,
  TextField,
  MenuItem,
  Collapse,
} from '@mui/material';
import { AddCircleOutlineOutlined, CloseRounded, ChangeCircle, Close } from '@mui/icons-material';
//
import setAuthToken from '../../../utils/setAuthToken';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { updateProduct, addProduct } from '../../../redux/slices/product';
import { getCategories } from '../../../redux/slices/category';
import { getTags } from '../../../redux/slices/tag';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFUpload3D,
} from '../../../components/hook-form';
import { FENCE_STATUS, S3_3D_FOLDER, S3_PRODUCT_IMAGE_FOLDER } from '../../../assets/data/roles';
import { AWS_S3_BUCKET } from '../../../config-global';
import { useAuthContext } from '../../../auth/useAuthContext';

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  product: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, product }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const { categories } = useSelector((state) => state.category);
  const { user } = useAuthContext();
  const { tags } = useSelector((state) => state.tag);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tagList, setTagList] = useState([]);
  const [selectedTagList, setSelectedTagList] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [designOptions, setDesignOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const showAlert = async () => {
    await setAlertOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await setAlertOpen(false);
  };

  // Category
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      setSelectedTagList(product.tags);
      const array =
        categories &&
        categories.length > 0 &&
        categories.filter((category) => category.id === product.category);

      setSubCategoryOptions(array && array.length > 0 && array[0].sub_categories);
      setDesignOptions(array && array.length > 0 && array[0].styles);
      setColorOptions(array && array.length > 0 && array[0].colors);
    }
  }, [product, categories]);

  useEffect(() => {}, []);

  useEffect(() => {
    const arr = [];
    if (tags.length > 0) {
      tags.forEach((ele) => {
        if (product) {
          if (product.tags && product.tags.indexOf(ele.title) < 0) arr.push(ele.title);
        } else {
          arr.push(ele.title);
        }
      });
    }
    setTagList(arr);
  }, [tags, product]);

  //---------------------
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    category: Yup.string().required('Category is required'),
    style: Yup.string().required('Style is required'),
    size: Yup.string().required('Size is required'),
    files3D: Yup.array().min(1, '3D files are required'),
    filesImage: Yup.array().min(1, 'Images are required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: product?.name || '',
      description: product?.description || '',
      filesImage: product?.filesImage || [],
      files3D: product?.files3D || [],
      category: product?.category || '',
      style: product?.style || '',
      sub_category: product?.sub_category || '',
      size: product?.size || '',
      color: product?.color || '',
    }),
    [product]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && product) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, product]);

  const onChangeKeyword = async (keyword) => {
    dispatch(getTags(keyword));
  };

  const onCreateOrUpdate = async (data) => {
    try {
      const fileImageList = await handleUpload();
      const file3DList = await handle3DUpload();
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setAuthToken(localStorage.getItem('accessToken'));
      if (isEdit) {
        const updateData = {
          name: values.name,
          description: values.description,
          filesImage: fileImageList,
          files3D: file3DList,
          color: values.color,
          tags: selectedTagList,
          sub_category: values.sub_category,
          style: values.style,
          category: values.category,
          size: values.size,
          status: FENCE_STATUS.MODELING,
          addedBy: user.id,
        };
        dispatch(updateProduct(product.id, updateData, SnackBar, navigate));
      } else {
        const createData = {
          name: values.name,
          description: values.description,
          filesImage: fileImageList,
          files3D: file3DList,
          color: values.color,
          tags: selectedTagList,
          sub_category: values.sub_category,
          style: values.style,
          category: values.category,
          size: values.size,
          status: FENCE_STATUS.MODELING,
          addedBy: user.id,
          visible: false,
        };
        resetTag();
        dispatch(addProduct(createData, navigate, SnackBar, reset, showAlert));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = useCallback(
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

  const handleUpload = async () => {
    const imageUrlList = await Promise.all(
      values.filesImage.map(async (image) => {
        if (!image.key) {
          const data = {
            key: S3_PRODUCT_IMAGE_FOLDER + Date.now().toString() + image.path,
            values,
          };
          const preSignedURL = await axios.post('/auth/presignedUrl', data);
          const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
          await fetch(preSignedURL.data.signedUrl, {
            method: 'PUT',
            headers: myHeaders,
            body: image,
          });

          return {
            preview: `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${data.key}`,
            key: data.key,
          };
        }
        return image;
      })
    );
    return imageUrlList;
  };

  const handleRemoveFile = (inputFile) => {
    if (inputFile.key) {
      const filtered =
        values.filesImage && values.filesImage?.filter((file) => file.key !== inputFile.key);
      setValue('filesImage', filtered);
    } else {
      const filtered = values.filesImage && values.filesImage?.filter((file) => file !== inputFile);
      setValue('filesImage', filtered);
    }
  };

  const handleRemoveAllFiles = () => {
    setValue('filesImage', []);
  };

  const handle3DDrop = useCallback(
    (acceptedFiles) => {
      const files = values.files3D || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('files3D', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.files3D]
  );

  const handle3DUpload = async () => {
    const file3DList = await Promise.all(
      values.files3D.map(async (file) => {
        if (!file.key) {
          const data = {
            key: S3_3D_FOLDER + Date.now().toString() + file.path,
            values,
          };
          const preSignedURL = await axios.post('/auth/presignedUrl', data);
          const myHeaders = new Headers({
            'Content-Type': file.path.endsWith('.fbx')
              ? 'model/vnd.autodesk.fbx'
              : 'model/gltf-binary',
          });
          await fetch(preSignedURL.data.signedUrl, {
            method: 'PUT',
            headers: myHeaders,
            body: file,
          });

          return {
            preview: `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${data.key}`,
            key: data.key,
          };
        }
        return file;
      })
    );
    return file3DList;
  };

  const handleRemove3DFile = (inputFile) => {
    if (inputFile.key) {
      const filtered =
        values.files3D && values.files3D?.filter((file) => file.key !== inputFile.key);
      setValue('files3D', filtered);
    } else {
      const filtered = values.files3D && values.files3D?.filter((file) => file !== inputFile);
      setValue('files3D', filtered);
    }
  };

  const handleRemoveAll3DFiles = () => {
    setValue('files3D', []);
  };

  const addTag = (text) => {
    const array = tagList.filter((tag) => tag !== text);
    setTagList(array);
    setSelectedTagList([...selectedTagList, text]);
  };

  const deleteTag = (text) => {
    const array = selectedTagList.filter((tag) => tag !== text);
    setSelectedTagList(array);
    tagList.push(text);
    setTagList(tagList);
  };

  const resetTag = () => {
    setSelectedTagList(product?.tags ? product?.tags : []);
    const arr = [];
    if (tags.length > 0) {
      tags.forEach((ele) => {
        if (product) {
          if (product.tags.indexOf(ele.title) < 0) arr.push(ele.title);
        } else {
          arr.push(ele.title);
        }
      });
    }
    setTagList(arr);
  };

  const onCategotyChange = (val) => {
    const array =
      categories && categories.length > 0 && categories.filter((category) => category.id === val);
    setSubCategoryOptions(array && array[0].sub_categories);
    setDesignOptions(array && array[0].styles);
    setColorOptions(array && array[0].colors);
  };

  return (
    <FormProvider methods={methods}>
      <Card sx={{ p: 3 }}>
        <Stack flexDirection="column" spacing={2}>
          <Collapse in={alertOpen}>
            <Alert
              severity="success"
              sx={{ width: '100%' }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlertOpen(false);
                  }}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              Successfully added to My Requests!
            </Alert>
          </Collapse>
          <RHFTextField
            fullWidth
            name="name"
            placeholder={`Product Display Name (E.g. "Cedar Gothic Picket")`}
            label="Product Display Name"
          />
          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
            gap={2}
          >
            <RHFSelect
              name="category"
              label="Select Category"
              onChange={(e) => {
                setValue('category', e.target.value);
                onCategotyChange(e.target.value);
              }}
            >
              <MenuItem />
              {categories &&
                categories.length > 0 &&
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="sub_category" label="Select Sub-Category (Optional)">
              <MenuItem />
              {subCategoryOptions &&
                subCategoryOptions.length > 0 &&
                subCategoryOptions.map((sub_category, index) => (
                  <MenuItem key={index} value={sub_category.title}>
                    {sub_category.title}
                  </MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="style" label="Select Style/Design">
              <MenuItem />
              {designOptions &&
                designOptions.length > 0 &&
                designOptions.map((design, index) => (
                  <MenuItem key={index} value={design.title}>
                    {design.title}
                  </MenuItem>
                ))}
            </RHFSelect>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
            gap={2}
          >
            <RHFTextField
              name="size"
              placeholder="Panel Height x Width (E.g. 4x8 ft.)"
              label="Panel Height x Width"
            />
            <RHFSelect name="color" label="Color/Wood Grain">
              <MenuItem />
              {colorOptions &&
                colorOptions.length > 0 &&
                colorOptions.map((color, index) => (
                  <MenuItem key={index} value={color.title}>
                    {color.title}
                  </MenuItem>
                ))}
            </RHFSelect>
          </Box>
          <RHFEditor
            simple
            name="description"
            placeholder="Other structural or design details (Dog Ear, Gothic Fence Cap, Pressure Treated, etc.)"
          />
          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            gap={5}
          >
            <RHFUpload
              multiple
              thumbnail
              name="filesImage"
              maxSize={10485760}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={handleUpload}
              style={{ height: '180px' }}
            />

            <RHFUpload3D
              multiple
              thumbnail
              name="files3D"
              maxSize={52428800}
              onDrop={handle3DDrop}
              onRemove={handleRemove3DFile}
              onRemoveAll={handleRemoveAll3DFiles}
              onUpload={handle3DUpload}
              style={{ height: '180px' }}
            />
          </Box>
          <Typography variant="h5" sx={{ mt: 5 }}>
            Tagging
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
            gap={5}
          >
            <Card sx={{ p: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Tag List
              </Typography>
              <Paper
                sx={{
                  border: '1px solid #dce0e4',
                  p: 1,
                  minHeight: '300px',
                  alignItems: 'center',
                  marginBottom: 2,
                }}
              >
                {tagList &&
                  tagList.length > 0 &&
                  tagList.map((tag, index) => (
                    <Chip
                      key={tag}
                      label={
                        <>
                          {tag}&nbsp;
                          <AddCircleOutlineOutlined fontSize="lg" />
                        </>
                      }
                      clickable
                      variant="outlined"
                      sx={{ m: '2px', fontSize: '14px', alignItems: 'center' }}
                      onClick={(e) => addTag(tag)}
                    />
                  ))}
              </Paper>
              <TextField
                placeholder="Start typing..."
                onChange={(e) => {
                  onChangeKeyword(e.target.value);
                }}
              />
            </Card>
            <ChangeCircle
              sx={{
                fontSize: '80px',
                rotate: '135deg',
                alignSelf: 'center',
                marginRight: 'auto',
                marginLeft: 'auto',
              }}
              onClick={resetTag}
            />
            <Card sx={{ p: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Product Tags
              </Typography>
              <Paper
                sx={{
                  border: '1px solid #dce0e4',
                  p: 1,
                  minHeight: '300px',
                  height: '95%',
                  alignItems: 'center',
                }}
              >
                {selectedTagList &&
                  selectedTagList.length > 0 &&
                  selectedTagList.map((tag, index) => (
                    <Chip
                      key={tag}
                      label={
                        <>
                          {tag}&nbsp;
                          <CloseRounded fontSize="lg" />
                        </>
                      }
                      clickable
                      variant="outlined"
                      sx={{ m: '2px', fontSize: '14px', alignItems: 'center' }}
                      onClick={() => deleteTag(tag)}
                    />
                  ))}
              </Paper>
            </Card>
          </Box>
          <Stack
            flexDirection={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="center"
            alignItems="center"
            sx={{ columnGap: 20, rowGap: 1 }}
          >
            <LoadingButton
              variant="contained"
              sx={{
                // mt: 3,
                fontSize: '20px',
                letterSpacing: '1px',
                width: '200px',
              }}
              onClick={() => navigate(PATH_DASHBOARD.general.fences)}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{
                // mt: 3,
                fontSize: '20px',
                letterSpacing: '1px',
                width: '200px',
              }}
              onClick={handleSubmit(onCreateOrUpdate)}
            >
              {isEdit ? 'Save' : 'Add Product'}
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  );
}

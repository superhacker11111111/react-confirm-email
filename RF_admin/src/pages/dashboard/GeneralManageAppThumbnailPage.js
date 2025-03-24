import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import * as Yup from 'yup';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container, Button, Typography, Card, Dialog, DialogTitle, Stack } from '@mui/material';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  setColors,
  setStyles,
  setSubCategories,
  updateCategory,
  getCategory,
} from '../../redux/slices/category';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFUpload } from '../../components/hook-form';
import { S3_THUMBNAIL_FOLDER } from '../../assets/data/roles';
import axios from '../../utils/axios';
import { AWS_S3_BUCKET } from '../../config-global';
// ----------------------------------------------------------------------

export default function GeneralManageAppThumbnailPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDesktop = useResponsive('up', 'sm');
  const { title } = useParams();
  const [thumbnail, setThumbnail] = useState({});
  const [page, setPage] = useState(false);
  const [open, setOpen] = useState(false);
  const [thumbnailList, setThumbnailList] = useState([]);
  const { subCategoryList, styleList, colorList } = useSelector((state) => state.category);
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };
  const NewThumbnailSchema = Yup.object().shape({
    title: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: thumbnail?.title || '',
      preview: thumbnail.preview ? { preview: thumbnail?.preview, key: thumbnail?.key } : null,
    }),
    [thumbnail]
  );

  const methods = useForm({
    resolver: yupResolver(NewThumbnailSchema),
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('preview', newFiles, { shouldValidate: true });
    },
    [setValue]
  );

  const handleRemoveFile = (inputFile) => {
    setValue('preview', '');
  };

  const handleUpload = async () => {
    if (!values.preview[0].key) {
      if (thumbnail.preview) {
        await axios.post('/auth/deleteFile', { key: thumbnail.key });
      }
      const data = {
        key: S3_THUMBNAIL_FOLDER + Date.now().toString() + values.preview[0].path,
        values,
      };
      const preSignedURL = await axios.post('/auth/presignedUrl', data);

      const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
      await fetch(preSignedURL.data.signedUrl, {
        method: 'PUT',
        headers: myHeaders,
        body: values.preview[0],
      });
      return {
        preview: `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${data.key}`,
        key: data.key,
      };
    }
    return values.preview[0];
  };

  const getSubtitles = () => {
    switch (title) {
      case 'sub-category':
        return 'Sub-Categories';
      case 'style':
        return 'Style';
      case 'color':
        return 'Color';
      default:
        return 'Sub-Categories';
    }
  };

  const onHandleSave = async () => {
    if (values.preview && values.preview.length > 0) {
      const file = await handleUpload();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = thumbnailList.findIndex((obj) => obj.title === thumbnail.title);
      if (index !== -1) {
        const updatedThumbnailList = [...thumbnailList]; // Create a new array with the existing elements
        updatedThumbnailList[index] = {
          // Update the desired element
          title: thumbnail.title,
          key: file.key,
          preview: file.preview,
          edit: !!file,
        };
        switch (title) {
          case 'sub-category':
            if (localStorage.getItem('category_page_edit') === 'create') {
              dispatch(setSubCategories(updatedThumbnailList));
              SnackBar('Successfully Updated!', 'success');
            } else {
              dispatch(
                updateCategory(
                  localStorage.getItem('current_edit_category_id'),
                  { sub_categories: updatedThumbnailList },
                  SnackBar,
                  null,
                  true
                )
              );
              dispatch(getCategory(localStorage.getItem('current_edit_category_id')));
            }
            break;
          case 'style':
            if (localStorage.getItem('category_page_edit') === 'create') {
              dispatch(setStyles(updatedThumbnailList));
              SnackBar('Successfully Updated!', 'success');
            } else {
              dispatch(
                updateCategory(
                  localStorage.getItem('current_edit_category_id'),
                  { styles: updatedThumbnailList },
                  SnackBar,
                  null,
                  true
                )
              );
              dispatch(getCategory(localStorage.getItem('current_edit_category_id')));
            }
            break;
          case 'color':
            if (localStorage.getItem('category_page_edit') === 'create') {
              dispatch(setColors(updatedThumbnailList));
              SnackBar('Successfully Updated!', 'success');
            } else {
              dispatch(
                updateCategory(
                  localStorage.getItem('current_edit_category_id'),
                  { colors: updatedThumbnailList },
                  SnackBar,
                  null,
                  true
                )
              );
              dispatch(getCategory(localStorage.getItem('current_edit_category_id')));
            }
            break;
          default:
            break;
        }
      }
    }
    setPage(false);
  };

  useEffect(() => {
    switch (title) {
      case 'sub-category':
        setThumbnailList(subCategoryList);
        break;
      case 'style':
        setThumbnailList(styleList);
        break;
      case 'color':
        setThumbnailList(colorList);
        break;
      default:
        setThumbnailList(subCategoryList);
        break;
    }
  }, [colorList, styleList, subCategoryList, title]);

  const onHandleEdit = (data) => {
    setThumbnail(data);
    setPage(true);
  };
  return (
    <>
      <Helmet>
        <title> Ecommerce: Manage App Thumbnail | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card sx={{ p: 3 }}>
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Manage App Thumbnail</Typography>

            {page ? (
              <Stack gap={1}>
                <Button
                  variant="contained"
                  sx={{ fontSize: '16px', width: '100px' }}
                  onClick={onHandleSave}
                >
                  Save
                </Button>

                <Button
                  variant="contained"
                  sx={{ fontSize: '16px', width: '100px' }}
                  onClick={() => setOpen(true)}
                >
                  Exit
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                sx={{ fontSize: '16px', width: '100px' }}
                onClick={() =>
                  !localStorage.getItem('category_page_edit') === 'create'
                    ? navigate(PATH_DASHBOARD.eCommerce.newCategory)
                    : navigate(
                        PATH_DASHBOARD.eCommerce.cedit(
                          paramCase(localStorage.getItem('current_edit_category_id'))
                        )
                      )
                }
              >
                Back
              </Button>
            )}
          </Stack>
          <Typography variant="h6">{getSubtitles()}</Typography>
          {!page ? (
            thumbnailList &&
            thumbnailList.length > 0 &&
            thumbnailList.map((category, index) => (
              <Stack
                key={index}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                boxShadow={1}
                borderRadius="10px"
                width={isDesktop ? '40%' : '80%'}
                p={1}
                mb={1}
              >
                <Typography variant="subtitle1">{category.title}</Typography>
                <Stack flexDirection="row" alignItems="center" gap={1}>
                  <Button variant="outlined" onClick={() => onHandleEdit(category)}>
                    Edit Thumbnail
                  </Button>
                  {category.edit ? (
                    <Iconify color="green" icon="eva:checkmark-circle-2-fill" />
                  ) : (
                    <Iconify color="red" icon="carbon:close-filled" />
                  )}
                </Stack>
              </Stack>
            ))
          ) : (
            <FormProvider methods={methods}>
              <Stack direction="column" spacing={4} width={isDesktop ? '50%' : '100%'}>
                <RHFTextField name="title" />
                <RHFUpload
                  thumbnail
                  name="preview"
                  maxSize={10485760}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                />
                <Button
                  variant="outlined"
                  style={{ width: '116px', height: '52px', alignSelf: 'end' }}
                >
                  Crop Image
                  <WallpaperIcon />
                </Button>
              </Stack>
            </FormProvider>
          )}
        </Card>
        <Dialog open={open}>
          <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
            Do you want to exit without saving?
          </DialogTitle>
          <Stack justifySelf="center">
            <Button
              variant="contained"
              sx={{
                mb: 2,
                mx: 12,
                fontSize: '18px',
                fontWeight: 900,
                borderRadius: 1.5,
              }}
              onClick={() => {
                setOpen(false);
                onHandleSave();
              }}
            >
              Save & Exit
            </Button>
            <Button
              variant="contained"
              sx={{
                mb: 2,
                mx: 12,
                fontSize: '18px',
                fontWeight: 900,
                borderRadius: 1.5,
              }}
              onClick={() => {
                setOpen(false);
                setPage(false);
              }}
            >
              Don`t Save & Exit
            </Button>
            <Button
              variant="contained"
              sx={{
                mb: 10,
                mx: 12,
                fontSize: '18px',
                fontWeight: 900,
                borderRadius: 1.5,
              }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Dialog>
      </Container>
    </>
  );
}

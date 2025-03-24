import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
  Button,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material';
import { AddCircleOutlineRounded } from '@mui/icons-material';
//
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import axios from '../../../utils/axios';
// routes
// components
import { useSnackbar } from '../../../components/snackbar';
import { Upload } from '../../../components/upload';
import {
  addCategory,
  setColors,
  setStyles,
  setSubCategories,
  updateCategory,
  setCategory,
  setCategoryImages,
} from '../../../redux/slices/category';
import { S3_CATEGORY_IMAGE_FOLDER } from '../../../assets/data/roles';
import { AWS_S3_BUCKET } from '../../../config-global';
import { PATH_DASHBOARD } from '../../../routes/paths';
import setAuthToken from '../../../utils/setAuthToken';

CategoryNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  category: PropTypes.object,
};

export default function CategoryNewEditForm({ isEdit = false, category }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const { subCategoryList, styleList, colorList, categoryTitle, categoryImage } = useSelector(
    (state) => state.category
  );

  const [newSubCategory, setNewSubCategory] = useState({
    key: '',
    preview: '',
    title: '',
    edit: false,
  });
  const [newStyle, setNewStyle] = useState({
    key: '',
    preview: '',
    title: '',
    edit: false,
  });
  const [newColor, setNewColor] = useState({
    key: '',
    preview: '',
    title: '',
    edit: false,
  });

  const handleDrop = async (file) => {
    if (categoryImage.preview) {
      await axios.post('/auth/deleteFile', { key: categoryImage.key });
    }
    const data = {
      key: S3_CATEGORY_IMAGE_FOLDER + Date.now().toString() + file[0].path,
      file,
    };
    const preSignedURL = await axios.post('/auth/presignedUrl', data);

    const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
    await fetch(preSignedURL.data.signedUrl, {
      method: 'PUT',
      headers: myHeaders,
      body: file[0],
    });
    dispatch(
      setCategoryImages({
        preview: `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${data.key}`,
        key: data.key,
      })
    );
  };

  const onHandleCreate = (type) => {
    switch (type) {
      case 1:
        if (newSubCategory.title) {
          if (
            subCategoryList.length === 0 ||
            subCategoryList.map((item) => item.title).indexOf(newSubCategory.title) < 0
          ) {
            dispatch(setSubCategories([...subCategoryList, newSubCategory]));
            setNewSubCategory({
              title: '',
              edit: false,
            });
          } else {
            enqueueSnackbar('The sub category already exist', { variant: 'error' });
          }
        } else {
          enqueueSnackbar(`Sub Category can't be Empty String`, { variant: 'error' });
        }
        break;

      case 2:
        if (newStyle.title) {
          if (
            styleList.length === 0 ||
            styleList.map((item) => item.title).indexOf(newStyle.title) < 0
          ) {
            dispatch(setStyles([...styleList, newStyle]));
            setNewStyle({
              title: '',
              edit: false,
            });
          } else {
            enqueueSnackbar('The style already exist', { variant: 'error' });
          }
        } else {
          enqueueSnackbar(`Style can't be Empty String`, { variant: 'error' });
        }
        break;

      case 3:
        if (newColor.title) {
          if (
            colorList.length === 0 ||
            colorList.map((item) => item.title).indexOf(newColor.title) < 0
          ) {
            dispatch(setColors([...colorList, newColor]));
            setNewColor({
              title: '',
              edit: false,
            });
          } else {
            enqueueSnackbar('The color already exist', { variant: 'error' });
          }
        } else {
          enqueueSnackbar(`Color can't be Empty String`, { variant: 'error' });
        }
        break;
      default:
        break;
    }
  };

  const onHandleDelete = (type, tag) => {
    let array = [];
    switch (type) {
      case 1:
        array =
          subCategoryList &&
          subCategoryList.length > 0 &&
          subCategoryList.filter((subItem) => subItem.title !== tag.title);
        dispatch(setSubCategories(array));
        break;
      case 2:
        array =
          styleList &&
          styleList.length > 0 &&
          styleList.filter((style) => style.title !== tag.title);
        dispatch(setStyles(array));
        break;
      case 3:
        array =
          colorList &&
          colorList.length > 0 &&
          colorList.filter((color) => color.title !== tag.title);
        dispatch(setColors(array));
        break;
      default:
        break;
    }
  };

  const handleCreate = async () => {
    try {
      // const image = await handleUpload();

      await new Promise((resolve) => setTimeout(resolve, 500));
      setAuthToken(localStorage.getItem('accessToken'));
      dispatch(setStyles([]));
      dispatch(setCategory(''));
      dispatch(setColors([]));
      dispatch(setSubCategories([]));
      dispatch(setCategoryImages({ key: '', preview: '' }));
      if (isEdit) {
        const updateData = {
          name: categoryTitle,
          images: categoryImage,
          sub_categories: subCategoryList,
          styles: styleList,
          colors: colorList,
        };
        dispatch(updateCategory(category.id, updateData, SnackBar, navigate));
      } else {
        const categoryData = {
          name: categoryTitle,
          images: categoryImage,
          subCategories: subCategoryList,
          styles: styleList,
          colors: colorList,
        };
        dispatch(addCategory(categoryData, SnackBar, navigate));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 5, width: '100%' }}>
      <Grid item container direction="row" spacing={1}>
        <Grid item container spacing={2} direction="column" md={9}>
          <Grid item container direction="column">
            <Grid item>
              <Typography variant="subtitle2" sx={{ color: '##212121', fontWeight: 'medium' }}>
                Category
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Category Name"
                  value={categoryTitle}
                  sx={{ width: '85%' }}
                  onChange={(e) => {
                    dispatch(setCategory(e.target.value));
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid item container ml={5} sx={{ py: 5 }}>
            <Grid item container direction="column">
              <Grid item>
                <Typography variant="subtitle2" sx={{ color: '##212121', fontWeight: 'medium' }}>
                  Sub-Category(Optional)
                </Typography>
              </Grid>

              <Grid item>
                <OutlinedInput
                  placeholder="Add Sub-Category"
                  value={newSubCategory.title}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => onHandleCreate(1)} edge="end">
                        <AddCircleOutlineRounded />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e) =>
                    setNewSubCategory({
                      title: e.target.value,
                      edit: false,
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid item container direction="column">
              <Grid item>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Sub-Categories
                </Typography>
              </Grid>
              <Stack direction="row" spacing={1}>
                <Grid item width="80%">
                  <Paper sx={{ border: '1px solid #dce0e4', p: 1 }}>
                    {subCategoryList &&
                      subCategoryList.length > 0 &&
                      subCategoryList.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag.title}
                          sx={{ m: 0.5 }}
                          onDelete={() => onHandleDelete(1, tag)}
                        />
                      ))}
                  </Paper>
                </Grid>
                <Button
                  variant="outlined"
                  style={{ width: '116px', height: '52px', alignSelf: 'center' }}
                  onClick={() => {
                    if (subCategoryList && subCategoryList.length > 0) {
                      localStorage.setItem('category_page_edit', isEdit ? 'edit' : 'create');
                      navigate(PATH_DASHBOARD.eCommerce.thumbnailList(paramCase('sub_category')));
                    } else {
                      SnackBar('Please add Sub Category', 'error');
                    }
                  }}
                >
                  Manage App Thumbnails
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Grid item container ml={5} sx={{ py: 5 }}>
            <Grid item container direction="column">
              <Grid item>
                {' '}
                <Typography variant="subtitle2" sx={{ color: '##212121', fontWeight: 'medium' }}>
                  Style/Design
                </Typography>
              </Grid>
              <Grid item>
                {' '}
                <OutlinedInput
                  placeholder="Add Style/Design"
                  value={newStyle.title}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => onHandleCreate(2)} edge="end">
                        <AddCircleOutlineRounded />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e) => setNewStyle({ title: e.target.value, edit: false })}
                />
              </Grid>
            </Grid>
            <Grid item container direction="column">
              <Grid item>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Structural Design Elements
                </Typography>
              </Grid>
              <Stack direction="row" spacing={1}>
                <Grid item width="80%">
                  <Paper sx={{ border: '1px solid #dce0e4', p: 1 }}>
                    {styleList &&
                      styleList.length > 0 &&
                      styleList.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag.title}
                          sx={{ m: 0.5 }}
                          onDelete={() => onHandleDelete(2, tag)}
                        />
                      ))}
                  </Paper>
                </Grid>
                <Button
                  variant="outlined"
                  style={{ width: '116px', height: '52px', alignSelf: 'center' }}
                  onClick={() => {
                    if (styleList && styleList.length > 0) {
                      localStorage.setItem('category_page_edit', isEdit ? 'edit' : 'create');
                      navigate(PATH_DASHBOARD.eCommerce.thumbnailList(paramCase('style')));
                    } else {
                      SnackBar('Please add Style/Design', 'error');
                    }
                  }}
                >
                  Manage App Thumbnails
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Grid item container ml={5} sx={{ py: 5 }}>
            <Grid item container direction="column">
              <Grid item>
                {' '}
                <Typography variant="subtitle" sx={{ color: '##212121', fontWeight: 'medium' }}>
                  Color (Optional)
                </Typography>
              </Grid>
              <Grid item>
                {' '}
                <OutlinedInput
                  placeholder="Add Color"
                  value={newColor.title}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => onHandleCreate(3)} edge="end">
                        <AddCircleOutlineRounded />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e) => setNewColor({ title: e.target.value, edit: false })}
                />
              </Grid>
            </Grid>
            <Grid item container direction="column">
              <Grid item>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Colors
                </Typography>
              </Grid>
              <Stack direction="row" spacing={1}>
                <Grid item width="80%">
                  <Paper sx={{ border: '1px solid #dce0e4', p: 1 }}>
                    {colorList &&
                      colorList.length > 0 &&
                      colorList.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag.title}
                          sx={{ m: 0.5 }}
                          onDelete={() => onHandleDelete(3, tag)}
                        />
                      ))}
                  </Paper>
                </Grid>
                <Button
                  variant="outlined"
                  style={{ width: '116px', height: '52px', alignSelf: 'center' }}
                  onClick={() => {
                    if (colorList && colorList.length > 0) {
                      localStorage.setItem('category_page_edit', isEdit ? 'edit' : 'create');
                      navigate(PATH_DASHBOARD.eCommerce.thumbnailList(paramCase('color')));
                    } else {
                      SnackBar('Please add Color', 'error');
                    }
                  }}
                >
                  Manage App Thumbnails
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Grid item container direction="column">
            <Grid item>
              <Typography variant="subtitle2" sx={{ color: '##212121', fontWeight: 'medium' }}>
                Category Thumbnail
              </Typography>
            </Grid>
            <Stack direction="row" spacing={4}>
              <Grid item width="80%">
                <Upload
                  thumbnail
                  accept={{ 'image/*': [] }}
                  file={categoryImage.preview ? categoryImage : ''}
                  onDrop={handleDrop}
                  maxSize={10485760}
                />
              </Grid>
              <Button
                variant="outlined"
                style={{ width: '116px', height: '52px', alignSelf: 'end' }}
              >
                Crop Image
                <WallpaperIcon />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Stack
        spacing={2}
        mt={12}
        direction={{ xs: 'column-reverse', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        md={8}
      >
        <Button
          variant="contained"
          sx={{ width: '160px' }}
          onClick={() =>
            navigate(!isEdit ? PATH_DASHBOARD.general.fences : PATH_DASHBOARD.eCommerce.category)
          }
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ width: '160px' }} onClick={handleCreate}>
          Save
        </Button>
      </Stack>
    </Card>
  );
}

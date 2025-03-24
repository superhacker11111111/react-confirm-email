import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
// @mui
import {
  Container,
  Button,
  Grid,
  Typography,
  Card,
  useMediaQuery,
  Dialog,
  DialogTitle,
  Stack,
  Box,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { deleteCategory, getCategories } from '../../redux/slices/category';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function GeneralManageAppThumbnailEditPage() {
  const { themeStretch } = useSettingsContext();
  const isIcon = useMediaQuery('(min-width:420px)');
  const isDesktop = useResponsive('up', 'sm');
  const { title, name } = useParams();
  console.log('title', title);
  console.log('name', name);
  const [thumbnailList, setThumbnailList] = useState([]);
  const { categories, subCategoryList, styleList, colorList } = useSelector(
    (state) => state.category
  );

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const onHandleDelete = (id) => {
    dispatch(deleteCategory(id, SnackBar));
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <>
      <Helmet>
        <title> Ecommerce: Manage App Thumbnail | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card sx={{ p: 3 }}>
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Manage App Thumbnail</Typography>
            <Stack gap={1}>
              <Button variant="contained" sx={{ fontSize: '16px', width: '100px' }}>
                Save
              </Button>
              <Button variant="contained" sx={{ fontSize: '16px', width: '100px' }}>
                Exit
              </Button>
            </Stack>
          </Stack>
          <Typography variant="h6">{getSubtitles()}</Typography>
          <Stack>{}</Stack>
          {thumbnailList &&
            thumbnailList.length > 0 &&
            thumbnailList.map((category) => (
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                boxShadow={1}
                borderRadius="10px"
                width={isDesktop ? '35%' : '80%'}
                p={1}
                mb={1}
              >
                <Typography variant="subtitle1">{category.title}</Typography>
                <Stack flexDirection="row" alignItems="center" gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(PATH_DASHBOARD.eCommerce.cedit(paramCase(category.id)))}
                  >
                    Edit Thumbnail
                  </Button>
                  {category.edit && <Iconify color="green" icon="eva:checkmark-circle-2-fill" />}
                </Stack>
              </Stack>
            ))}
        </Card>
        <Dialog open={open}>
          <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
            Are you sure you want to delete?
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
                onHandleDelete(deleteId);
                setOpen(false);
              }}
            >
              Delete Category
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

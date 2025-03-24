import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { deleteCategory, getCategories } from '../../redux/slices/category';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function EcommerceCategoryManagePage() {
  const { themeStretch } = useSettingsContext();
  const isIcon = useMediaQuery('(min-width:420px)');
  const isDesktop = useResponsive('up', 'sm');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const { categories } = useSelector((state) => state.category);

  const onHandleDelete = (id) => {
    dispatch(deleteCategory(id, SnackBar));
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Category | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Category"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Category' },
          ]}
        />
        <Card sx={{ p: 3 }}>
          {categories &&
            categories.length > 0 &&
            categories.map((category) => (
              <Grid key={category.id} container gap={1} mb={1}>
                <Grid item xs={isIcon ? 6 : 12} sm={3.5}>
                  <Typography variant="h5">{category.name}</Typography>
                </Grid>
                <Grid item xs={isIcon ? 5 : 12} sm={8} container gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      localStorage.setItem('current_edit_category_id', category.id);
                      navigate(PATH_DASHBOARD.eCommerce.cedit(paramCase(category.id)));
                    }}
                  >
                    {isDesktop ? (
                      <>
                        <Edit />
                        &nbsp; Edit Category
                      </>
                    ) : (
                      <Edit />
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setDeleteId(category.id);
                      setOpen(true);
                    }}
                  >
                    {isDesktop ? (
                      <>
                        <Delete />
                        &nbsp; Delete Category
                      </>
                    ) : (
                      <Delete />
                    )}
                  </Button>
                </Grid>
              </Grid>
            ))}
        </Card>
        <Button
          variant="contained"
          sx={{ mt: 5, fontSize: '18px' }}
          onClick={() => navigate(PATH_DASHBOARD.general.fences)}
        >
          Back to 3D Models
        </Button>
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

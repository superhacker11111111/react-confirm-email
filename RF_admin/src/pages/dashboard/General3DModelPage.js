import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  InputAdornment,
} from '@mui/material';
// components
import { ModelWidget, FenceCard } from '../../sections/@dashboard/general/3dmodel';
import { useSnackbar } from '../../components/snackbar';
import LoadingScreen from '../../components/loading-screen';
import Iconify from '../../components/iconify';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import { getProducts, updateProductsVisible } from '../../redux/slices/product';
import {
  setCategoryImages,
  setCategoryTitle,
  setColors,
  setStyles,
  setSubCategories,
} from '../../redux/slices/category';

// ----------------------------------------------------------------------

export default function General3DModelPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, type) => {
    enqueueSnackbar(message, { variant: type });
  };
  const { products, totalCount, isLoading } = useSelector((state) => state.product);
  const [changedValues, setChangedValues] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const onHandleChange = (id, checked) => {
    if (products && products.length > 0) {
      const changedProducts = products.filter((item) => item.id === id);
      if (changedProducts[0].visible === checked) {
        const changes = changedValues.filter((item) => item.id !== id);
        setChangedValues(changes);
      } else {
        setChangedValues([
          ...changedValues,
          {
            id,
            visible: checked,
          },
        ]);
      }
    }
  };

  const onHandleSave = () => {
    if (changedValues.length > 0) {
      dispatch(updateProductsVisible(changedValues, SnackBar));
      setChangedValues([]);
    } else {
      SnackBar('No Changes', 'error');
    }
  };

  const onGetData = () => {
    dispatch(getProducts(keyword));
  };

  return (
    <>
      <Helmet>
        <title> General: 3D Models | RealityFence</title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={7} direction="column">
          <Grid item>
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography variant="h4" mb={2}>
                3D Models
              </Typography>
              <Button
                variant="contained"
                sx={{ width: '130px', marginTop: '5px', marginBottom: '5px' }}
                onClick={onHandleSave}
              >
                Save
              </Button>
            </Stack>
            <Grid container spacing={3} direction="column">
              <Grid item container>
                <Grid item xs={12} sm={6} md={4} xl={3}>
                  <Box sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <ModelWidget title="Total" total={totalCount} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h4" mb={2}>
              Manage 3D Models
            </Typography>
            <Grid container spacing={3} direction="column">
              <Grid item container spacing={2} direction={{ sx: 'column', sm: 'row' }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    sx={{ width: '100%', fontSize: theme.typography.h6.fontSize }}
                    onClick={() => navigate(PATH_DASHBOARD.eCommerce.new)}
                  >
                    Create New Product
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    sx={{ width: '100%', fontSize: theme.typography.h6.fontSize }}
                    onClick={() => navigate(PATH_DASHBOARD.eCommerce.tag)}
                  >
                    Tagging
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    sx={{ width: '100%', fontSize: theme.typography.h6.fontSize }}
                    onClick={() => {
                      dispatch(setSubCategories([]));
                      dispatch(setStyles([]));
                      dispatch(setColors([]));
                      dispatch(setCategoryTitle(''));
                      dispatch(setCategoryImages({}));
                      localStorage.removeItem('category_page_edit');
                      localStorage.removeItem('current_edit_category_id');
                      navigate(PATH_DASHBOARD.eCommerce.newCategory);
                    }}
                  >
                    Create Category
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    sx={{ width: '100%', fontSize: theme.typography.h6.fontSize }}
                    onClick={() => navigate(PATH_DASHBOARD.eCommerce.category)}
                  >
                    Edit Category
                  </Button>
                </Grid>
              </Grid>
              <Grid item sx={{ display: 'flex' }}>
                <TextField
                  placeholder="Search..."
                  value={keyword}
                  sx={{ width: '25%', boxShadow: 5, borderRadius: 1, mr: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          size="large"
                          sx={{ minWidth: '16px', px: '16px' }}
                          onClick={onGetData}
                        >
                          <Iconify icon="eva:search-outline" />
                        </Button>
                      </InputAdornment>
                    ),
                    sx: { pr: 0.5 },
                  }}
                  onChange={(event) => setKeyword(event.target.value)}
                />
                {/* <PaginationCustom sx={{ width: '25%' }} /> */}
              </Grid>
              <Box
                mt={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                gap={2}
              >
                {isLoading ? (
                  <LoadingScreen />
                ) : (
                  products &&
                  products.length > 0 &&
                  products.map((product) => (
                    <FenceCard product={product} onHandleChange={onHandleChange} />
                  ))
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

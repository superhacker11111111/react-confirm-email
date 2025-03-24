import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Tab, Tabs, Card, Grid, Divider, Container, Typography, Button } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { setFavour } from '../../redux/slices/product';
// routes
// components
import Markdown from '../../components/markdown';
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
// sections
import {
  ProductDetailsSummary,
  ProductDetailsCarousel,
} from '../@dashboard/e-commerce/onboardingDetails';
import AddFavour from '../../assets/fav_add.png';
import RemoveFavour from '../../assets/fav_remove.png';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

DetailFencePage.propTypes = {
  product: PropTypes.object,
};

export default function DetailFencePage({ product }) {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { isLoading, favorite_list } = useSelector((state) => state.product);

  const [currentTab, setCurrentTab] = useState('description');

  const { enqueueSnackbar } = useSnackbar();

  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddFavour = async (data) => {
    if (favorite_list.map((item) => item.id).indexOf(product.id) > -1) {
      enqueueSnackbar('The fence is already added to your favorite list', { variant: 'error' });
    } else {
      const fenceData = {
        id: product.id,
        filesImage: product.filesImage[0],
        name: product.name,
        size: product.size,
        style: product.style,
        color: product.color,
      };
      dispatch(setFavour([...favorite_list, fenceData]));
    }
    if (favorite_list.includes(product.id)) setIsFavorited(true);
    else setIsFavorited(false);
  };

  const TABS = [
    {
      value: 'description',
      label: 'description',
      component: product ? <Markdown children={product?.description} /> : null,
    },
    {
      value: 'color',
      label: 'color',
      component: product ? <Markdown children={product?.color} /> : null,
    },
    {
      value: 'sub_category',
      label: 'sub_category',
      component: product ? <Markdown children={product?.sub_category} /> : null,
    },
    {
      value: 'size',
      label: 'size',
      component: product ? <Markdown children={product?.size} /> : null,
    },
    {
      value: 'style',
      label: 'style',
      component: product ? <Markdown children={product?.style} /> : null,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`Ecommerce: ${product?.name || ''} | RealityFence`}</title>
      </Helmet>

      <Container
        maxWidth={themeStretch ? false : 'lg'}
        sx={{
          // mt: '170px',
          '@media (max-width: 1200px)': {
            mt: localStorage.getItem('layout') === 'swapper' ? '0px' : '200px', // change the mt value for screens with a max-width of 1200px
          },
        }}
      >
        <Typography variant="h5"> ${product?.name}</Typography>

        {product && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5} lg={5}>
                <Box boxShadow={4} borderRadius={2} p={2}>
                  <div className="flex justify-start">
                    <Button onClick={handleAddFavour}>
                      <img
                        alt="add"
                        src={AddFavour}
                        style={{
                          height: '38px',
                          zIndex: 9,
                        }}
                      />
                    </Button>
                  </div>
                  <ProductDetailsCarousel product={product} />
                </Box>
              </Grid>

              <Grid item xs={12} md={6} lg={5}>
                <ProductDetailsSummary product={product} />
              </Grid>
            </Grid>
            <div className="w-full mt-5">
              <Card>
                <Tabs
                  value={currentTab}
                  onChange={(event, newValue) => setCurrentTab(newValue)}
                  sx={{ px: 3, bgcolor: 'background.neutral' }}
                >
                  {TABS.map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                  ))}
                </Tabs>

                <Divider />

                {TABS.map(
                  (tab) =>
                    tab.value === currentTab && (
                      <Box
                        key={tab.value}
                        sx={{
                          p: 3,
                        }}
                      >
                        {tab.component}
                      </Box>
                    )
                )}
              </Card>
            </div>
          </>
        )}

        {/* {isLoading && <SkeletonProductDetails />} */}
      </Container>
    </>
  );
}

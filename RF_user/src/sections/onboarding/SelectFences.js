import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// @mui
import { Grid } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProductsCategory } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import FormProvider from '../../components/hook-form';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import { FileChangeViewButton, FileListView, FileGridView } from '../@dashboard/file';
import {
  SelectFencesDrawer,
  SelectFencesList,
  SelectFencesSort,
  SelectFencesTagFiltered,
  SelectFencesSearch,
} from './select_fences';

// ----------------------------------------------------------------------
SelectFences.propTypes = {
  currentCategory: PropTypes.object,
};
export default function SelectFences({ currentCategory }) {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const dispatch = useDispatch();
  const [view, setView] = useState('list');
  useEffect(() => {
    dispatch(getProductsCategory(id));
  }, [dispatch, id]);
  const { products } = useSelector((state) => state.product);
  const [openFilter, setOpenFilter] = useState(false);
  const handleChangeView = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };
  const defaultValues = {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: [0, 200],
    rating: '',
    sortBy: 'featured',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    formState: { dirtyFields },
  } = methods;

  const isDefault =
    (!dirtyFields.gender &&
      !dirtyFields.category &&
      !dirtyFields.colors &&
      !dirtyFields.priceRange &&
      !dirtyFields.rating) ||
    false;

  const values = watch();

  const dataFiltered = applyFilter(products, values);

  const handleResetFilter = () => {
    reset();
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  return (
    <>
      <Helmet>
        <title> Ecommerce: Shop | RealityFence</title>
      </Helmet>
      <Grid
        container
        direction="column"
        px={1}
        mt={{ xs: '200px', sm: '200px', md: 25, lg: 21 }}
        paddingX="24px"
      >
        <Grid item>
          <span className="text-2xl font-bold">Wood</span>&nbsp;&nbsp;&nbsp;
          <FileChangeViewButton value={view} onChange={handleChangeView} />
          {view === 'list' ? (
            <div className="w-full mt-5">
              <SelectFencesList
                products={dataFiltered}
                loading={products && !products.length && isDefault}
                type={1}
              />
            </div>
          ) : (
            <div className="w-full mt-5">
              <SelectFencesList
                products={dataFiltered}
                loading={products && !products.length && isDefault}
                type={2}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, filters) {
  const { gender, category, colors, priceRange, rating, sortBy } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }

  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }

  // FILTER PRODUCTS
  if (gender.length) {
    products = products.filter((product) => gender.includes(product.gender));
  }

  if (category !== 'All') {
    products = products.filter((product) => product.category === category);
  }

  if (colors.length) {
    products = products.filter((product) => product.colors.some((color) => colors.includes(color)));
  }

  if (min !== 0 || max !== 200) {
    products = products.filter((product) => product.price >= min && product.price <= max);
  }

  if (rating) {
    products = products.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRating > convertRating(rating);
    });
  }

  return products;
}

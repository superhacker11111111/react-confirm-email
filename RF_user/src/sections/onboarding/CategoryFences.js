/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import orderBy from 'lodash/orderBy';
// import queryString from 'query-string';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Grid, CircularProgress, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCategories } from '../../redux/slices/product';
// components
import { FileChangeViewButton } from '../@dashboard/file';
// sections
import { SelectFencesCategoryList, SelectFencesList } from './select_fences';
import { Selectable } from '../../assets/data/roles';

// ----------------------------------------------------------------------

export default function SelectFences() {
  const dispatch = useDispatch();
  const { category, categoryTitle, loading } = useSelector((state) => state.product);
  const { selectableElements, selectable } = useSelector((state) => state.product);
  const [data, setData] = useState([]);
  const [view, setView] = useState('grid');
  const [selectType, setSelectType] = useState([]);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch, category.id]);

  useEffect(() => {
    setData(selectableElements);
    setSelectType(selectable);
  }, [selectableElements, selectable]);

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

  const dataFiltered = applyFilter(data, values);

  const handleChangeView = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  //---------------

  return (
    <>
      <Helmet>
        <title> RealityFence | CategoryFences </title>
      </Helmet>

      <Grid
        container
        direction="column"
        sx={
          localStorage.getItem('layout') === 'swapper'
            ? {
                pl: { lg: 2, md: 3, sm: 3, xs: 2 },
                pr: { lg: 5, md: 3, sm: 3, xs: 2 },
                // mt: '75px',
              }
            : { px: { xs: 3, lg: 0 }, mt: '-75px' }
        }
      >
        <Grid item gap={2} display="flex" alignItems="center">
          <Typography sx={{ fontSize: { xs: '24px', md: '28px' }, fontWeight: 800 }}>
            {categoryTitle}
          </Typography>
          {selectType === Selectable.Fence && (
            <FileChangeViewButton value={view} onChange={handleChangeView} />
          )}
        </Grid>
        {loading ? (
          <Stack sx={{ mt: { md: 30, xs: 16 }, alignItems: 'center' }}>
            <CircularProgress color="primary" />
          </Stack>
        ) : category && selectableElements && selectableElements.length > 0 ? (
          <Grid item sx={{ placeContent: { xs: 'center', sm: 'start' } }}>
            {selectType === Selectable.Category && (
              <div className="w-full mt-5">
                <SelectFencesCategoryList
                  categorys={dataFiltered}
                  loading={data && !data.length && isDefault}
                />
              </div>
            )}
            {selectType === Selectable.Fence && view === 'list' && (
              <div className="w-full mt-5">
                <SelectFencesList
                  products={dataFiltered}
                  loading={data && !data.length && isDefault}
                  type={1}
                />
              </div>
            )}
            {selectType === Selectable.Fence && view !== 'list' && (
              <div className="w-full mt-5">
                <SelectFencesList
                  products={dataFiltered}
                  loading={data && !data.length && isDefault}
                  type={2}
                />
              </div>
            )}
          </Grid>
        ) : (
          <Stack sx={{ mt: { md: 30, xs: 16 } }}>
            <Typography fontSize={16} align="center">
              Not Found
            </Typography>
          </Stack>
        )}
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter(categorys, filters) {
  const { gender, category, colors, priceRange, rating, sortBy } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // SORT BY
  if (sortBy === 'featured') {
    categorys = orderBy(categorys, ['sold'], ['desc']);
  }

  if (sortBy === 'newest') {
    categorys = orderBy(categorys, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    categorys = orderBy(categorys, ['price'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    categorys = orderBy(categorys, ['price'], ['asc']);
  }

  // FILTER PRODUCTS
  if (gender.length) {
    categorys = categorys.filter((product) => gender.includes(product.gender));
  }

  if (category !== 'All') {
    categorys = categorys.filter((product) => product.category === category);
  }

  if (colors.length) {
    categorys = categorys.filter((product) =>
      product.colors.some((color) => colors.includes(color))
    );
  }

  if (min !== 0 || max !== 200) {
    categorys = categorys.filter((product) => product.price >= min && product.price <= max);
  }

  if (rating) {
    categorys = categorys.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRating > convertRating(rating);
    });
  }

  return categorys;
}

/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Typography, Grid, CircularProgress } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getFences, getfenceSuccess } from '../../redux/slices/fence';

// components
import { FileChangeViewButton } from '../@dashboard/file';
// sections

import { SelectFencesList } from './select_fences';

// ----------------------------------------------------------------------

export default function SelectFences() {
  const dispatch = useDispatch();
  const { fence, isloading } = useSelector((state) => state.fence);
  const [data, setData] = useState([]);
  const [view, setView] = useState('grid');

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

  useEffect(() => {
    dispatch(getFences());
  }, [dispatch]);

  const handleChangeView = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  //---------------

  return (
    <>
      <Helmet>
        <title> Ecommerce: Shop | RealityFence</title>
      </Helmet>
      <Grid container direction="column" px={3} mt="-64px">
        <Grid item>
          <span className="text-3xl font-bold">Fences</span>&nbsp;&nbsp;&nbsp;
          <FileChangeViewButton value={view} onChange={handleChangeView} />
        </Grid>
        {isloading ? (
          <Stack sx={{ mt: { sm: 30, xs: 16 }, alignItems: 'center' }}>
            <CircularProgress color="primary" />
          </Stack>
        ) : fence && fence.length > 0 ? (
          <Grid item>
            {view === 'list' && (
              <div className="w-full mt-5">
                <SelectFencesList
                  products={fence}
                  loading={!fence || (!fence.length && isDefault)}
                  type={1}
                />
              </div>
            )}
            {view !== 'list' && (
              <div className="w-full mt-5">
                <SelectFencesList
                  products={fence}
                  loading={!fence || (!fence.length && isDefault)}
                  type={2}
                />
              </div>
            )}
          </Grid>
        ) : (
          <Stack sx={{ mt: { sm: 30, xs: 16 } }}>
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

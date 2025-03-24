/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet-async';
// import { useState } from 'react';
import orderBy from 'lodash/orderBy';
import { useForm } from 'react-hook-form';
// import { useLocation } from 'react-router-dom';
import { Typography, Stack, useMediaQuery, CircularProgress } from '@mui/material';
import { useSelector } from '../../redux/store';
// import { getCompany } from '../../redux/slices/user';
import { SwapFencesList } from './swapperFences';

// ----------------------------------------------------------------------

export default function FenceSwapper() {
  // const dispatch = useDispatch();
  const { selected_list, isloading } = useSelector((state) => state.product);
  // const { user } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery('(max-width:600px)');
  // const [load] = useState(20);

  // useEffect(() => {
  //   const companyData = {
  //     companyId: user.id,
  //     filter: 'current',
  //     pageSize: 10,
  //   };
  //   const params = {
  //     companyId: companyData.companyId,
  //     filter: companyData.filter,
  //     pageNumber: companyData.pageNumber,
  //     pageSize: companyData.pageSize,
  //     limit: load,
  //   };
  //   const searchParams = queryString.stringify(params);
  //   dispatch(getCompany(searchParams));
  // }, [dispatch, user.id, load]);

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

  const dataFiltered = applyFilter(selected_list, values);

  return (
    <>
      <Helmet>
        <title> RealityFence | Fence Swapper </title>
      </Helmet>

      <Stack direction="column" px={{ lg: 5, md: 3, sm: 3, xs: 2 }}>
        <Typography sx={{ fontSize: { xs: '24px', md: '28px' }, fontWeight: 800, mb: 1 }}>
          My Fences
        </Typography>
        {isloading ? (
          <Stack sx={{ mt: 22, alignItems: 'center' }}>
            <CircularProgress color="primary" />
          </Stack>
        ) : selected_list && selected_list.length > 0 ? (
          <SwapFencesList
            products={dataFiltered}
            loading={selected_list && !selected_list.length && isDefault}
          />
        ) : (
          <Stack sx={{ mt: 22, alignItems: 'center' }}>
            <Typography fontSize={16} align="center">
              Not Found
            </Typography>
            {/* <CircularProgress color="primary" /> */}
          </Stack>
        )}
      </Stack>
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

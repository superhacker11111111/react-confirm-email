import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCategory } from '../../redux/slices/category';

import { useSettingsContext } from '../../components/settings';
// sections
import CategoryNewEditForm from '../../sections/@dashboard/e-commerce/CategoryNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceCategoryManagePage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { id } = useParams();

  const { category } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategory(id));
  }, [dispatch, id]);
  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Category | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={2}>
          Edit Category
        </Typography>

        <CategoryNewEditForm isEdit category={category} key={category?.id} />
      </Container>
    </>
  );
}

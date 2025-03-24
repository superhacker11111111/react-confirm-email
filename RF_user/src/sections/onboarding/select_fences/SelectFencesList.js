import PropTypes from 'prop-types';
//
import { useState, useEffect } from 'react';
// @mui
import { Box } from '@mui/material';
// components
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
//
// import { PATH_ONBOARDING } from '../../../routes/paths';
import setServiceToken from '../../../utils/setUserToken';
//
import { SkeletonProductItem } from '../../../components/skeleton';
//
import SelectFencesCardT from './SelectFencesCardT';
//
//
import { addStatus } from '../../../redux/slices/product';
import FormProvider from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

SelectFencesList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
  type: PropTypes.number,
};

export default function SelectFencesList({ products, loading, type, ...other }) {
  const { user } = useSelector((state) => state.auth);
  const { selectFences } = useSelector((state) => state.product);
  const categoryId = useParams().id;
  const [checkedList, setCheckedList] = useState([]);
  // const [changed, setChanged] = useState(false);
  // const [loadingSend, setLoadingSend] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  useEffect(() => {
    if (selectFences && selectFences.length > 0) {
      const list = [];
      selectFences.forEach((fence) => {
        list.push(fence.product_id);
      });
      setCheckedList([...list]);
    } else {
      setCheckedList([]);
    }
  }, [selectFences]);
  // const { status } = useSelector((state) => state.status);
  const methods = useForm({});

  const {
    reset,
    handleSubmit,
    // formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = async (data) => {
    // if (changed) {
    // setLoadingSend(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      setServiceToken(localStorage.getItem('token'));
      // setLoadingSend(false);
      const selectData = {
        id: user.id,
        category: categoryId,
        list: checkedList,
      };
      dispatch(addStatus(selectData, SnackBar, navigate, reset));
    } catch (error) {
      console.log('error :>> ', error);
      // setLoadingSend(false);
    }
    // } else {
    //   navigate(PATH_ONBOARDING.onboarding.categoryfences);
    // }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleCreateAndSend)}>
      {type === 1 ? (
        <Box gap={2} display="grid" gridTemplateColumns="repeat(1, 1fr)" {...other}>
          {(loading ? [...Array(0)] : products).map((product, index) =>
            product ? (
              <SelectFencesCardT product={product} type={1} key={index} />
            ) : (
              <SkeletonProductItem key={index} />
            )
          )}
        </Box>
      ) : (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          {...other}
        >
          {(loading ? [...Array(1)] : products).map((product, index) =>
            product ? (
              <SelectFencesCardT key={index} product={product} type={2} />
            ) : (
              <SkeletonProductItem key={index} />
            )
          )}
        </Box>
      )}
    </FormProvider>
  );
}

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// form
import { useSelector, useDispatch } from 'react-redux';
// @mui
import { Stack, Button, Typography } from '@mui/material';
import { setSelected, setFavour } from '../../../../redux/slices/product';
import { useSnackbar } from '../../../../components/snackbar';
import Fence from '../../../../assets/fence.png';
// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsSummary({ product, ...other }) {
  const navigate = useNavigate();

  const { selected_list, favorite_list } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  //
  const { id, name, price, cover, size, available, structural_design, tags, sub_category, grain } =
    product;
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const handleAddFavour = async (data) => {
    if (favorite_list.map((item) => item.id).indexOf(product.id) > -1) {
      enqueueSnackbar('The fence is already added to your favorite list', { variant: 'error' });
    } else {
      const fenceData = {
        id: product.id,
        image: product.filesImage,
        name: product.name,
        size: product.size,
        style: product.style,
        color: product.color,
      };
      dispatch(setFavour([...favorite_list, fenceData]));
    }
  };
  const handleAddSelected = async (data) => {
    if (selected_list.map((item) => item.id).indexOf(product.id) > -1) {
      enqueueSnackbar('The fence is already added to your selected list', { variant: 'error' });
    } else {
      const fenceData = {
        id: product.id,
        filesImage: product.filesImage,
        name: product.name,
        size: product.size,
        style: product.style,
        color: product.color,
      };
      dispatch(setSelected([...selected_list, fenceData]));
    }
  };
  const handleClickItem = () => {
    navigate(-1);
  };
  return (
    <Stack
      spacing={3}
      sx={{
        p: (theme) => ({
          md: theme.spacing(5, 5, 0, 2),
        }),
      }}
      {...other}
    >
      <Stack spacing={5} sx={{ alignItems: 'center' }}>
        <Typography variant="h5">{name}</Typography>
        <Stack spacing={2}>
          <Button
            variant="text"
            color="inherit"
            style={{
              backgroundColor: '#212B36',
              width: '250px',
              height: '50px',
              fontSize: 13,
              borderRadius: '14px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onClick={handleAddSelected}
          >
            {/* <img src={Fence} alt="fence" style={{ marginTop: '5px' }} />
            &nbsp; &nbsp; &nbsp; */}
            <p className="text-[#fff]">Add to My Fence</p>
          </Button>

          <Button
            variant="text"
            color="inherit"
            style={{
              backgroundColor: '#D9D9D9',
              width: '250px',
              height: '50px',
              fontSize: 13,
              borderRadius: '14px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onClick={handleClickItem}
          >
            <p className="text-[#000]">Back to Fence Selector</p>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

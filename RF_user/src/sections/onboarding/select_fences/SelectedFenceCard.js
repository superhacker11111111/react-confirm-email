import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Stack, Button, Typography } from '@mui/material';
//
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
// redux
import { addStatus } from '../../../redux/slices/product';
// components
import Image from '../../../components/image';
import { useSnackbar } from '../../../components/snackbar';
// ----------------------------------------------------------------------

SelectFencesCard.propTypes = {
  product: PropTypes.object,
  type: PropTypes.number,
};

export default function SelectFencesCard({ product, type }) {
  const {
    name,
    // sub_category,
    // structural_design,
    // grain,
    size,
    filesImage,
    description,
    // priceSale,
    // status,
    //  sizes,
    // priceSale,
  } = product;
  const { user } = useSelector((state) => state.auth);
  // const categoryId = useParams().id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };
  const methods = useForm({});
  const { reset } = methods;
  //
  const handleCreateAndSend = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const selectData = {
        id: user.id,
        // category: categoryId,
      };
      dispatch(addStatus(selectData, SnackBar, navigate, reset));
    } catch (error) {
      console.log('err :>> ', error);
    }
  };
  return (
    <Card
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        p: 2,
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          padding: '5px',
          marginTop: '5px',
          marginBottom: '5px',
          marginLeft: '5px',
          minWidth: '100px',
          maxWidth: '200px',
          borderRadius: '10px',
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Image
          alt={name}
          // src={filesImage && filesImage.length > 0 && filesImage[0].preview}
          src={filesImage[0].preview}
          sx={{ borderRadius: 1.5, height: '100%', cursor: 'pointer' }}
        />
      </Box>
      <Stack spacing={1} sx={{ pl: 3, mr: 3 }} direction="column" justifyContent="space-between">
        <Stack>
          <Link component={RouterLink} color="inherit" variant="subtitle2">
            <Typography
              variant="h6"
              style={{
                marginTop: '0px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </Typography>
          </Link>
          <Typography
            style={{
              marginTop: '0px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <Typography
            variant="body2"
            style={{
              marginTop: '0px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {size}
          </Typography>
        </Stack>

        <Button
          variant="text"
          color="inherit"
          style={{
            backgroundColor: '#212B36',
            fontSize: 13,
            borderRadius: '14px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={handleCreateAndSend}
        >
          {/* <img src={Fence} alt="fence" style={{ marginTop: '5px' }} />
          &nbsp; &nbsp; &nbsp; */}
          <p className="text-[#fff]">Add to My Fence</p>
        </Button>
      </Stack>
    </Card>
  );
}

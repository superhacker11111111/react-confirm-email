import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
// @mui
import { Box, Card, Stack, Button, Switch, Typography, Dialog, DialogTitle } from '@mui/material';

import { useSnackbar } from '../../../../components/snackbar';
import Image from '../../../../components/image';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { deleteProduct } from '../../../../redux/slices/product';
// ----------------------------------------------------------------------

FenceCard.propTypes = {
  product: PropTypes.object,
  onHandleChange: PropTypes.func,
};

export default function FenceCard({ product, onHandleChange }) {
  //
  const { id, name, category, sub_category, style, color, size, visible, filesImage } = product;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [checked, setChecked] = useState(visible);
  const [open, setOpen] = useState(false);
  const SnackBar = (message, type) => {
    enqueueSnackbar(message, { variant: type });
  };
  return (
    <>
      <Card
        sx={{
          '&:hover .add-cart-btn': {
            opacity: 1,
          },
          display: 'flex',
          flexDirection: 'row',
          padding: 2,
          justifyContent: 'space-between',
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '90%',
          }}
        >
          <Box
            sx={{
              width: { sm: '30%', xs: '50%', xl: '30%', md: '50%' },
              // height: '120px',
              display: 'flex',
              borderRadius: '10px',
              boxShadow: 3,
              alignSelf: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              alt={name}
              src={filesImage && filesImage.length > 0 ? filesImage[0].preview : ''}
              sx={{ borderRadius: 1 }}
            />
          </Box>
          <Stack
            spacing={1}
            sx={{ pl: 3, mr: 3, width: { sm: '70%', xs: '50%', xl: '70%', md: '50%' } }}
          >
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
            <Stack style={{ marginLeft: 8, marginTop: 0 }}>
              <Typography variant="body2" style={{ marginTop: '0px' }}>
                {category}
              </Typography>
              <Typography variant="body2" style={{ marginTop: '0px' }}>
                {sub_category}
              </Typography>
              <Typography variant="body2" style={{ marginTop: '0px' }}>
                {style}
              </Typography>
              <Typography variant="body2" style={{ marginTop: '0px' }}>
                {color}
              </Typography>
              <Typography variant="body2" style={{ marginTop: '0px' }}>
                {size}
              </Typography>
              {/* <Link component={RouterLink} color="inherit" variant="subtitle2">
          <div className="md:text-[15px] lg:text-[20px]">{name}</div>
        </Link> */}
            </Stack>
          </Stack>
        </Stack>

        <Stack
          sx={{
            width: '10%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Stack gap={1}>
            <Button
              sx={{ fontSize: '12px', padding: '2px' }}
              variant="outlined"
              onClick={() => navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(id)))}
            >
              Edit
            </Button>
            <Button
              sx={{ fontSize: '12px', padding: '2px' }}
              variant="contained"
              color="error"
              onClick={() => setOpen(true)}
            >
              Delete
            </Button>
          </Stack>

          <Switch
            checked={checked}
            onChange={(event) => {
              setChecked(!checked);
              onHandleChange(id, event.target.checked);
            }}
            color="success"
          />
        </Stack>
      </Card>
      <Dialog open={open}>
        <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
          Are you sure you want to delete
        </DialogTitle>
        <Stack justifySelf="center">
          <Button
            variant="contained"
            sx={{
              mb: 2,
              mx: 12,
              fontSize: '18px',
              fontWeight: 900,
              borderRadius: 1.5,
            }}
            onClick={() => {
              setOpen(false);
              dispatch(deleteProduct(id, SnackBar));
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            sx={{
              mb: 10,
              mx: 12,
              fontSize: '18px',
              fontWeight: 900,
              borderRadius: 1.5,
            }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}

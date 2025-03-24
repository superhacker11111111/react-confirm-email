import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography } from '@mui/material';
// import AWS from 'aws-sdk';
// utils
import Label from '../../../components/label';
import Image from '../../../components/image';

import { getSelectableProducts } from '../../../redux/slices/product';
import { Selectable } from '../../../assets/data/roles';
// ----------------------------------------------------------------------

SelectFencesCard.propTypes = {
  category: PropTypes.object,
};

export default function SelectFencesCard({ category }) {
  const dispatch = useDispatch();
  const { id, name, description, images, status } = category;
  const onItemClick = (type, params, categoryTitle) => {
    dispatch(getSelectableProducts(type, params, categoryTitle));
  };

  return (
    <Card
      sx={{
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{ position: 'relative', p: 2 }}
        onClick={() => onItemClick(Selectable.Fence, { category: id }, name)}
      >
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'relative',
              textAlign: 'center',
              paddingTop: '25px',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <Image
          alt={description}
          src={images.preview}
          ratio="1/1"
          sx={{
            cursor: 'pointer',
            borderRadius: 1.5,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            right: 20,
            bottom: { xs: 6, sm: 8, xl: 26 },
            fontSize: { xs: '12px', sm: '16px', md: '20px', lg: '24px' },
          }}
        >
          {name}
        </Typography>
      </Box>
    </Card>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, Stack, Switch, Typography } from '@mui/material';
import Label from '../../../../components/label';
// ----------------------------------------------------------------------

FenceCard.propTypes = {
  product: PropTypes.object,
  checked: PropTypes.bool,
  onHandleChange: PropTypes.func,
};

export default function FenceCard({ product, checked, onHandleChange }) {
  //
  const { id, name, category, sub_category, style, color, size, filesImage, isDeleted } = product;
  return (
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
          <img
            alt={name}
            src={filesImage && filesImage.length > 0 ? filesImage[0].preview : ''}
            style={{ borderRadius: 1 }}
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

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isDeleted ? 'space-between' : 'end',
          alignItems: 'flex-end',
          width: '10%',
        }}
      >
        {isDeleted && <Label color="error">Deleted</Label>}
        <Switch
          checked={checked}
          color="success"
          onChange={(event) => {
            onHandleChange(id, event.target.checked);
          }}
        />
      </Stack>
    </Card>
  );
}

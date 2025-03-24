/* eslint-disable no-shadow */
/* eslint-disable no-import-assign */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Button, Typography } from '@mui/material';
//
import { paramCase } from 'change-case';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
// redux
import { setRemoved } from '../../../redux/slices/product';
// components
import Image from '../../../components/image';
import { useSnackbar } from '../../../components/snackbar';
//
import { PATH_ONBOARDING } from '../../../routes/paths';
// ----------------------------------------------------------------------

SwapFencesCard.propTypes = {
  product: PropTypes.object,
  type: PropTypes.number,
};

export default function SwapFencesCard({ product, type }) {
  const navigate = useNavigate();
  const { id, name, category, color, description, filesImage, style, size, sub_category } = product;

  const { removed_list } = useSelector((state) => state.product);

  const [isRemoved, setIsRemoved] = useState(false);

  // const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const removed_id_list = removed_list && removed_list.map((item) => item.id);
    if (removed_id_list.includes(id)) setIsRemoved(true);
    else setIsRemoved(false);
  }, [removed_list, id, isRemoved]);

  const handleClick = (id) => {
    sessionStorage.setItem('fileId', id);
    navigate(PATH_ONBOARDING.onboarding.viewDetail(paramCase(id)));
  };

  const handleRemoveClick = () => {
    // check if the fence is already removed.
    if (
      Array.isArray(removed_list) &&
      removed_list.map((item) => item.id).indexOf(product.id) > -1
    ) {
      enqueueSnackbar('The fence is already removed from your removed list', {
        variant: 'error',
      });
      return;
    }

    // const currentSelected = selectedFences.filter((item) => item.id !== product.id);
    // const fenceData = selected_list.filter((item) => item !== null && item.id !== product?.id);
    const removefenceData = {
      id: product.id,
      filesImage,
      name,
      size,
      style,
      color,
      description,
    };
    const newList = removed_list || [];
    dispatch(setRemoved([...newList, removefenceData]));
  };

  const handleBackClick = () => {
    const removedList = removed_list.filter((item) => item.id !== product.id);
    dispatch(setRemoved(removedList));

    // const newFenceData = removed_list.filter((fence) => fence.id === product.id);
    // dispatch(setSelected([...selected_list, newFenceData[0]]));
  };

  return (
    <Card
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        p: { xs: 1, md: 2 },
        width: '100%',
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      <Card
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'visible',
          '&:hover .add-cart-btn': {
            opacity: 1,
          },
        }}
      >
        <Image
          alt={name}
          sx={{
            cursor: 'pointer',
            borderRadius: 1,
            width: { xs: '120px', sm: '150px', lg: '200px' },
            height: { xs: '120px', sm: '150px', lg: '200px' },
          }}
          onClick={() => handleClick(id)}
          src={(filesImage && filesImage.length > 0 && filesImage[0].preview) || filesImage.preview}
        />
      </Card>
      <Stack
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          pl: { xs: 2, lg: 3 },
        }}
      >
        <Stack
          spacing={1}
          direction="column"
          sx={{
            width: '100%',
          }}
        >
          <Typography
            variant="subtitle2"
            color="#919EAB"
            sx={{ fontSize: { xs: '12px', sm: '14px' } }}
          >
            {category}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '14px', width: '100%', mt: 0 }}>
            {name}
          </Typography>

          <Stack
            spacing={1}
            sx={{
              pl: { xs: 2, lg: 3 },
              my: '6px !important',
            }}
            direction="column"
          >
            {sub_category === '' ? null : (
              <Typography
                variant="body2"
                style={{
                  marginTop: '0px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                sx={{ fontSize: '12px' }}
              >
                Sub-Category: {sub_category}
              </Typography>
            )}
            <Typography
              variant="body2"
              style={{
                marginTop: '0px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              sx={{ fontSize: '12px' }}
            >
              Style/Design: {style}
            </Typography>
            <Typography
              variant="body2"
              style={{
                marginTop: '0px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              sx={{ fontSize: '12px' }}
            >
              Color: {color}
            </Typography>
            <Typography
              variant="body2"
              style={{
                marginTop: '0px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              sx={{ fontSize: '12px' }}
            >
              Size: {size}
            </Typography>
          </Stack>
        </Stack>
        {isRemoved ? (
          <Button
            variant="text"
            sx={{
              '&:hover': {
                backgroundColor: 'grey',
              },
              alignItems: 'center',
              fontSize: { sx: '10px', md: '16px' },
              borderRadius: { sx: '6px', md: '8px' },
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              width: '100%',
              display: 'flex',
            }}
            style={{ backgroundColor: '#1FA9FF' }}
            onClick={handleBackClick}
          >
            <p className="pl-2 text-white">Add Back My Fences</p>
          </Button>
        ) : (
          <Button
            variant="text"
            sx={{
              '&:hover': {
                backgroundColor: 'grey',
              },
              alignItems: 'center',
              fontSize: { sx: '10px', md: '16px' },
              borderRadius: { sx: '6px', md: '8px' },
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              width: '100%',
              display: 'flex',
            }}
            style={{ backgroundColor: '#212B36' }}
            onClick={handleRemoveClick}
          >
            <p className="pl-2 text-white">Remove From My Fences</p>
          </Button>
        )}
      </Stack>
    </Card>
  );
}

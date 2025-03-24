/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { paramCase } from 'change-case';
// @mui
import { Card, Stack, Button, Typography } from '@mui/material';
//
import { useSelector, useDispatch } from 'react-redux';
// redux
// import IconButton from '@mui/material/IconButton';
// import FavourIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  // setFavour,
  setSelected,
  setRemoved,
  setCurrentSelectedFences,
  setSelectedList,
} from '../../../redux/slices/product';
// components
import Image from '../../../components/image';
import { useSnackbar } from '../../../components/snackbar';
import { PATH_ONBOARDING } from '../../../routes/paths';
// ----------------------------------------------------------------------

SelectFencesCard.propTypes = {
  product: PropTypes.object,
  type: PropTypes.number,
};

export default function SelectFencesCard({ product, type }) {
  const navigate = useNavigate();
  const { id, name, color, size, filesImage, style, sub_category, description } = product;

  const { user } = useSelector((state) => state.auth);
  const {
    // favorite_list,
    selected_list,
    removed_list,
    request_list,
    new_request_list,
    categoryTitle,
    selectedFences,
    onboardingAvailable,
  } = useSelector((state) => state.product);

  const { subscription } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isSelected, setIsSelected] = useState(false);
  // const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // check if this fence is selected
    //
    let selected_id_list = [];
    // newly selected list
    if (selectedFences && selectedFences.length > 0) {
      const new_selected_id_list = selectedFences.map((item) => (item ? item.id : null));
      selected_id_list = [...selected_id_list, ...new_selected_id_list];
    }
    // original selected list
    if (selected_list && selected_list.length > 0) {
      const origin_selected_id_list = selected_list
        .filter((item) => item !== null && item !== '' && item !== undefined)
        .map((item) => item.id);
      selected_id_list = [...selected_id_list, ...origin_selected_id_list];
    }
    // removed list
    if (removed_list && removed_list.length > 0) {
      const removed_id_list = removed_list && removed_list.map((item) => item.id);
      selected_id_list = selected_id_list.filter((item) => !removed_id_list.includes(item));
    }
    if (selected_id_list.includes(id)) setIsSelected(true);
    else setIsSelected(false);
  }, [selectedFences, selected_list, id, isSelected, removed_list]);

  // useEffect(() => {
  //   if (favorite_list.find((fence) => fence.id === product.id)) setIsFavorited(true);
  //   else setIsFavorited(false);
  // }, [favorite_list, product.id]);

  const handleClick = (id) => {
    sessionStorage.setItem('fileId', id);
    navigate(PATH_ONBOARDING.onboarding.viewDetail(paramCase(id)));
  };

  // const handleSwitchFavour = async (data) => {
  //   if (
  //     Array.isArray(favorite_list) &&
  //     favorite_list.length > 0 &&
  //     (favorite_list.map((item) => item.id).includes(product.id) ||
  //       (user.favoriteFences && user.favoriteFences.map((item) => item.id).includes(product.id)))
  //   ) {
  //     // remove from favorite_list
  //     const updatedList = favorite_list.filter((fence) => fence.id !== product.id);
  //     dispatch(setFavour(updatedList));
  //     return;
  //   }
  //   const fenceData = {
  //     id: product.id,
  //     filesImage: product.filesImage,
  //     name: product.name,
  //     size: product.size,
  //     color: product.color,
  //     style: product.style,
  //   };
  //   const updatedList = Array.isArray(favorite_list) ? [...favorite_list, fenceData] : [fenceData];
  //   dispatch(setFavour(updatedList));
  // };

  // add fences on onboarding
  const handleAddSelected = async () => {
    // Add curly braces to wrap the else block
    if (
      selected_list &&
      selected_list.length > 0 &&
      selected_list.map((item) => item && item.id).indexOf(product.id) > -1
    ) {
      enqueueSnackbar('The fence is already added to your selected list', { variant: 'error' });
    } else if (onboardingAvailable < 1) {
      enqueueSnackbar(
        `Your subscription can't select fence anymore. Please upgrade plan or remove other ones.`,
        {
          variant: 'error',
        }
      );
    } else {
      const fenceData = {
        id: product.id,
        filesImage: product.filesImage,
        sub_category: product.sub_category,
        name: product.name,
        size: product.size,
        style: product.style,
        color: product.color,
      };
      dispatch(setSelected([...selected_list, fenceData]));
    }
  };

  // add fences on swapper
  const handleAddSelectedSwapper = async () => {
    const removed_id_list = removed_list && removed_list.map((item) => item.id);
    // check current selected count is over than max fences
    if (
      selected_list.length +
        selectedFences.length +
        request_list.length +
        new_request_list.length -
        removed_list.length +
        1 >
      subscription.totalFences
    ) {
      enqueueSnackbar('Please remove fences in My Fences before adding new ones.', {
        variant: 'error',
      });
      return;
    }

    // check already exist
    if (selectedFences.map((item) => item.id).indexOf(product.id) > -1) {
      enqueueSnackbar('The fence is already added to your selected list', { variant: 'error' });
      return;
    }

    // if the fence is exist on my fences (selected_list)
    // remove from removed_list
    // swapAvailable++

    if (removed_id_list.includes(product.id)) {
      const removedList = removed_list.filter((item) => item.id !== product.id);
      dispatch(setRemoved(removedList));
    }
    // if the fence is newly added
    // add on selectedFences
    // swapAvailable--
    else {
      const fenceData = {
        id: product.id,
        filesImage: product.filesImage,
        name: product.name,
        size: product.size,
        color: product.color,
        style: product.style,
        sub_category: product.sub_category,
      };
      dispatch(setCurrentSelectedFences([...selectedFences, fenceData]));
    }
  };

  const handleRemoveOnBoarding = () => {
    const currentSelected = selectedFences
      .filter((item) => item !== null && item !== '' && item !== undefined)
      .filter((item) => item.id !== product.id);
    const selectedList = selected_list
      .filter((item) => item !== null && item !== '' && item !== undefined)
      .filter((item) => item.id !== product.id);
    dispatch(setCurrentSelectedFences(currentSelected));
    dispatch(setSelectedList(selectedList));
  };

  // this function isn't used
  const handleRemoveOnSwapper = () => {
    const new_selected_id_list = selectedFences.map((item) => (item ? item.id : null));

    if (
      Array.isArray(removed_list) &&
      removed_list.map((item) => item.id).indexOf(product.id) > -1
    ) {
      enqueueSnackbar('The fence is already removed from your removed list', {
        variant: 'error',
      });
      return;
    }
    // check if the fence is selected newly
    if (new_selected_id_list.includes(product.id)) {
      const currentSelected = selectedFences.filter((item) => item.id !== product.id);
      const selectedList = selected_list.filter((item) => item.id !== product.id);
      dispatch(setCurrentSelectedFences(currentSelected));
      dispatch(setSelectedList(selectedList));
    } else {
      const removefenceData = {
        id: product.id,
        filesImage,
        name,
        size,
        style,
        description,
      };
      dispatch(setRemoved([...removed_list, removefenceData]));
    }
  };

  return (
    <>
      {type === 1 ? (
        <Card
          sx={{
            '&:hover .add-cart-btn': {
              opacity: 1,
            },
            p: { xs: 2, sm: 2 },
            width: { lg: '94%', md: '100%' },
            display: 'flex',
          }}
        >
          {/* <div style={{ position: 'absolute', zIndex: 2 }}>
            <IconButton
              color={isFavorited ? 'primary' : undefined}
              onClick={handleSwitchFavour}
              sx={{
                width: '20px',
                cursor: 'pointer',
                position: 'absolute',
                marginLeft: '10px',
              }}
            >
              {isFavorited ? <FavourIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div> */}
          <Card sx={{ position: { xs: 'relative', md: 'static' }, paddingTop: 2 }}>
            <Image
              alt={name}
              sx={{
                borderRadius: 1.5,
                cursor: 'pointer',
                width: { xs: '120px', sm: '150px', md: '180px' },
                height: { xs: '120px', sm: '150px', md: '180px' },
              }}
              onClick={() => handleClick(id)}
              src={filesImage && filesImage.length > 0 && filesImage[0].preview}
            />
          </Card>

          <Stack spacing={1} sx={{ pl: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: '14px', sm: '20px' } }}
              className="truncate ..."
            >
              {name}
            </Typography>
            <Typography
              variant="subtitle2"
              color="#919EAB"
              sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}
            >
              {categoryTitle ? ` Category: ${categoryTitle}` : ''}
            </Typography>
            {sub_category === '' ? (
              ''
            ) : (
              <Typography
                variant="body2"
                style={{
                  marginTop: '0px',
                  fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
                }}
              >
                {sub_category ? `Sub-Category: ${sub_category}` : ''}
              </Typography>
            )}

            <Typography
              variant="body2"
              style={{
                marginTop: '0px',
                fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
              }}
            >
              {style ? `Style/Design: ${style}` : ''}
            </Typography>
            <Typography
              variant="body2"
              style={{
                marginTop: '0px',
                fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
              }}
            >
              {color ? `Color : ${color}` : ''}
            </Typography>
            <Typography
              variant="body2"
              style={{
                marginTop: '0px',
                fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
              }}
            >
              {size ? `Size: ${size}` : ''}
            </Typography>
            <Stack
              sx={{
                position: { xs: 'relative', sm: 'absolute' },
                right: { xs: 0, sm: 20 },
                bottom: { xs: 0, sm: 20 },
              }}
            >
              {isSelected && user.onboardingPass === false ? (
                <Button
                  variant="contained"
                  color="inherit"
                  style={{
                    backgroundColor: '#1FA9FF',
                    fontSize: '12px',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    lineHeight: 1,
                  }}
                  sx={{ width: { sm: '240px', xs: '160px' } }}
                  onClick={
                    localStorage.getItem('layout') === 'swapper'
                      ? handleRemoveOnSwapper
                      : handleRemoveOnBoarding
                  }
                >
                  <p className=" text-white">Remove From My Fences</p>
                </Button>
              ) : (
                <Button
                  className="flex items-center justify-center"
                  variant="text"
                  color="inherit"
                  style={{
                    fontSize: '12px',
                    backgroundColor: '#212B36',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  sx={{ width: { sm: '240px', xs: '160px' } }}
                  disabled={isSelected}
                  onClick={
                    localStorage.getItem('layout') === 'swapper'
                      ? handleAddSelectedSwapper
                      : handleAddSelected
                  }
                >
                  <p className="text-white">Add to My Fences</p>
                </Button>
              )}
            </Stack>
          </Stack>
        </Card>
      ) : (
        <Card
          sx={{
            '&:hover .add-cart-btn': {
              opacity: 1,
            },
            p: 2,
            width: '100%',
          }}
        >
          <Card style={{ position: 'relative', p: 4 }}>
            {/* <div style={{ position: 'absolute', zIndex: 2 }}>
              <IconButton
                color={isFavorited ? 'primary' : undefined}
                onClick={handleSwitchFavour}
                sx={{
                  width: '20px',
                  cursor: 'pointer',
                  position: 'absolute',
                  marginLeft: '10px',
                }}
              >
                {isFavorited ? <FavourIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </div> */}
            <Image
              alt={name}
              src={
                (filesImage && filesImage.length > 0 && filesImage[0].preview) || filesImage.preview
              }
              ratio="1/1"
              sx={{ borderRadius: 1.5, top: 15, cursor: 'pointer' }}
              onClick={() => handleClick(id)}
            />
          </Card>

          <Stack spacing={1} sx={{ p: 1 }}>
            <Typography variant="subtitle1" className="truncate ...">
              {name}
            </Typography>
            <Typography variant="subtitle2" color="#919EAB">
              {categoryTitle ? ` Category: ${categoryTitle}` : ''}
            </Typography>
            {sub_category === '' ? (
              ''
            ) : (
              <Typography
                variant="body2"
                style={{
                  marginTop: '0px',
                }}
              >
                {sub_category ? `Sub-Category: ${sub_category}` : ''}
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
            >
              {style ? `Style/Design: ${style}` : ''}
            </Typography>
            <Typography
              variant="body2"
              style={{
                marginTop: '0px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {color ? `Color : ${color}` : ''}
            </Typography>
            <Typography
              variant="body2"
              style={{
                marginTop: '0px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {size ? `Size: ${size}` : ''}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <div className="flex justify-center w-full">
                <Stack width="100%" direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
                  {isSelected && user.onboardingPass === false ? (
                    <Button
                      variant="contained"
                      color="inherit"
                      style={{
                        marginTop: '15px',
                        marginBottom: '15px',
                        backgroundColor: '#1FA9FF',
                        width: '100%',
                        fontSize: '12px',
                        borderRadius: '9px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      onClick={
                        user.onboardingPass === true
                          ? handleRemoveOnSwapper
                          : handleRemoveOnBoarding
                      }
                    >
                      <p className="text-white">Remove From My Fences</p>
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="inherit"
                      style={{
                        marginTop: '15px',
                        marginBottom: '15px',
                        backgroundColor: '#212B36',
                        width: '100%',
                        fontSize: '12px',
                        borderRadius: '8px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      disabled={isSelected}
                      onClick={
                        localStorage.getItem('layout') === 'swapper'
                          ? handleAddSelectedSwapper
                          : handleAddSelected
                      }
                    >
                      <p className="text-white">Add to My Fences</p>
                    </Button>
                  )}
                </Stack>
              </div>
            </Stack>
          </Stack>
        </Card>
      )}
    </>
  );
}

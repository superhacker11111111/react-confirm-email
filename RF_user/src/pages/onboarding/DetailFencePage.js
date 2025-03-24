/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
// @mui
import { Card, Stack, Button, Typography, Box, Grid, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
// redux
import {
  setSelected,
  setCurrentSelectedFences,
  setRemoved,
  setSelectedList,
} from '../../redux/slices/product';
// components
import Image from '../../components/image';
import { useSnackbar } from '../../components/snackbar';
import { getFenceByid } from '../../redux/slices/fence';

// ----------------------------------------------------------------------

export default function DetailFencePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileId = sessionStorage.getItem('fileId');

  const { fenceDetail, isloading } = useSelector((state) => state.fence);
  const { subscription } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const {
    selected_list,
    request_list,
    removed_list,
    categoryTitle,
    // swapCount,
    // swapAddCount,
    selectedFences,
    onboardingAvailable,
  } = useSelector((state) => state.product);

  const { enqueueSnackbar } = useSnackbar();

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    dispatch(getFenceByid(fileId));
  }, [dispatch, fileId]);

  useEffect(() => {
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
    if (selected_id_list.includes(fileId)) setIsSelected(true);
    else setIsSelected(false);
  }, [selectedFences, selected_list, fileId, isSelected, removed_list]);

  // useEffect(() => {
  //   if (favorite_list.find((fence) => fence.id === fileId)) setIsFavorited(true);
  //   else setIsFavorited(false);
  // }, [favorite_list, fileId]);

  const onClickBack = () => navigate(-1);

  // const location = useLocation();

  // add fences on onboarding
  const handleAddSelected = async () => {
    // Add curly braces to wrap the else block
    if (
      selected_list &&
      selected_list.length > 0 &&
      selected_list.map((item) => item && item.id).indexOf(fenceDetail.id) > -1
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
        id: fenceDetail.id,
        filesImage: fenceDetail.filesImage,
        sub_category: fenceDetail.sub_category,
        name: fenceDetail.name,
        size: fenceDetail.size,
        style: fenceDetail.style,
        color: fenceDetail.color,
      };
      dispatch(setSelected([...selected_list, fenceData]));
    }
  };

  // add fences on swapper
  const handleAddSelectedSwapper = async () => {
    const removed_id_list = removed_list && removed_list.map((item) => item.id);

    // check current selected count is over than max fences
    if (
      selected_list.length + selectedFences.length + request_list.length - removed_list.length + 1 >
      subscription.totalFences
    ) {
      enqueueSnackbar('Please remove fences in My Fences before adding new ones.', {
        variant: 'error',
      });
      return;
    }

    // check already exist
    if (selectedFences.map((item) => item.id).indexOf(fenceDetail.id) > -1) {
      enqueueSnackbar('The fence is already added to your selected list', { variant: 'error' });
      return;
    }

    if (removed_id_list.includes(fenceDetail.id)) {
      const removedList = removed_list.filter((item) => item.id !== fenceDetail.id);
      dispatch(setRemoved(removedList));
    }
    // if the fence is newly added
    else {
      const fenceData = {
        id: fenceDetail.id,
        filesImage: fenceDetail.filesImage,
        name: fenceDetail.name,
        size: fenceDetail.size,
        color: fenceDetail.color,
        style: fenceDetail.style,
        sub_category: fenceDetail.sub_category,
      };
      dispatch(setCurrentSelectedFences([...selectedFences, fenceData]));
    }
  };

  const handleRemoveOnBoarding = () => {
    const currentSelected = selectedFences
      .filter((item) => item !== null && item !== '' && item !== undefined)
      .filter((item) => item.id !== fenceDetail.id);
    const selectedList = selected_list
      .filter((item) => item !== null && item !== '' && item !== undefined)
      .filter((item) => item.id !== fenceDetail.id);
    dispatch(setCurrentSelectedFences(currentSelected));
    dispatch(setSelectedList(selectedList));
  };
  // this function isn't used
  const handleRemoveOnSwapper = () => {
    const new_selected_id_list = selectedFences.map((item) => (item ? item.id : null));
    if (
      Array.isArray(removed_list) &&
      removed_list.map((item) => item.id).indexOf(fenceDetail.id) > -1
    ) {
      enqueueSnackbar('The fence is already removed from your removed list', {
        variant: 'error',
      });
      return;
    }
    // check if the fence is selected newly
    if (new_selected_id_list.includes(fenceDetail.id)) {
      const currentSelected = selectedFences.filter((item) => item.id !== fenceDetail.id);
      const selectedList = selected_list.filter((item) => item.id !== fenceDetail.id);
      // dispatch(setSwapAvailable(swapCount + 1));
      dispatch(setCurrentSelectedFences(currentSelected));
      dispatch(setSelectedList(selectedList));
    } else {
      const removefenceData = {
        id: fenceDetail.id,
        filesImage: fenceDetail.filesImage,
        name: fenceDetail.name,
        size: fenceDetail.size,
        style: fenceDetail.style,
        description: fenceDetail.description,
      };
      // dispatch(setSwapAvailable(swapCount - 1));
      dispatch(setRemoved([...removed_list, removefenceData]));
    }
  };

  return (
    <>
      {isloading ? (
        <Stack sx={{ mt: { md: 30, xs: 20 }, alignItems: 'center' }}>
          <CircularProgress color="primary" />
        </Stack>
      ) : fenceDetail ? (
        <Card
          sx={{
            '&:hover .add-cart-btn': {
              opacity: 1,
            },
            py: 2,
            px: 4,
            mx: '8px',
            mt: localStorage.getItem('layout') === 'swapper' ? '75px' : '-75px',
          }}
        >
          <Grid container justifyContent="space-between">
            <Grid item sm={5} sx={{ position: 'relative' }}>
              <Box sx={{ mb: 2 }}>
                <Image
                  sx={{
                    boxShadow: '0px 6px 9px #a6a6a6',
                    borderRadius: 4.5,
                    objectFit: 'cover',
                    aspectRatio: 1 / 1,
                    cursor: 'pointer',
                  }}
                  src={fenceDetail?.filesImage?.[0]?.preview}
                  alt="favour"
                />
              </Box>
            </Grid>

            <Grid item sm={6} display="flex" flexDirection="column" justifyContent="space-between">
              <Stack spacing={1} sx={{ mx: 3 }}>
                <Typography
                  fontSize={{ md: '30px', xs: '26px' }}
                  style={{
                    fontWeight: 700,
                    marginTop: '0px',
                    // overflow: 'hidden',
                    // textOverflow: 'ellipsis',
                    // whiteSpace: 'nowrap',
                  }}
                >
                  {fenceDetail?.name}
                </Typography>
                <Stack style={{ marginLeft: '18px' }}>
                  <Typography fontSize={{ md: '20px', sm: '18px' }} color="#919EAB">
                    Category: {categoryTitle}
                  </Typography>
                  {fenceDetail?.sub_category === '' ? (
                    ''
                  ) : (
                    <Typography
                      fontSize={{ md: '20px', sm: '18px' }}
                      color="#919EAB"
                      style={{
                        marginTop: '0px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Sub-Category: {fenceDetail?.sub_category}
                    </Typography>
                  )}

                  <Typography
                    fontSize={{ md: '20px', sm: '18px' }}
                    color="#919EAB"
                    style={{
                      marginTop: '0px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Style/Design: {fenceDetail?.style}
                  </Typography>
                  <Typography
                    fontSize={{ md: '20px', sm: '18px' }}
                    color="#919EAB"
                    style={{
                      marginTop: '0px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Color: {fenceDetail?.color}
                  </Typography>
                  <Typography
                    fontSize={{ md: '20px', sm: '18px' }}
                    color="#919EAB"
                    style={{
                      marginTop: '0px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Size: {fenceDetail?.size}
                  </Typography>

                  <Typography fontSize={{ md: '20px', sm: '18px' }} color="#919EAB">
                    Description:
                  </Typography>
                  <Typography
                    fontSize={{ md: '20px', sm: '18px' }}
                    sx={{ mx: 3 }}
                    color="#919EAB"
                    dangerouslySetInnerHTML={{ __html: fenceDetail?.description }}
                  />
                </Stack>
              </Stack>
              <Stack
                sx={{ width: { md: '70%' }, mx: 3, mt: 1 }}
                display="flex"
                flexDirection="column"
                gap={1}
              >
                <Stack>
                  {isSelected && user.onboardingPass === false ? (
                    <Button
                      variant="contained"
                      color="inherit"
                      style={{
                        backgroundColor: '#1FA9FF',
                        borderRadius: '14px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      onClick={
                        user.onboardingPass === true
                          ? handleRemoveOnSwapper
                          : handleRemoveOnBoarding
                      }
                    >
                      <p style={{ marginTop: '4px', marginBottom: '4px', color: 'white' }}>
                        Remove From My Fences
                      </p>
                    </Button>
                  ) : (
                    <Button
                      className="flex items-center justify-center"
                      variant="text"
                      color="inherit"
                      style={{
                        backgroundColor: '#212B36',
                        borderRadius: '14px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      disabled={user.onboardingPass === true && isSelected}
                      onClick={
                        user.onboardingPass === true ? handleAddSelectedSwapper : handleAddSelected
                      }
                    >
                      <p style={{ marginTop: '4px', marginBottom: '4px', color: 'white' }}>
                        Add to My Fences
                      </p>
                    </Button>
                  )}
                </Stack>
                <Button
                  variant="text"
                  color="inherit"
                  style={{
                    backgroundColor: '#D9D9D9',
                    borderRadius: '14px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={onClickBack}
                >
                  <p style={{ marginTop: '4px', marginBottom: '4px', color: 'black' }}>Back</p>
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      ) : (
        <Stack sx={{ mt: { md: 30, xs: 20 } }}>
          <Typography fontSize={16} align="center">
            Not Found
          </Typography>
        </Stack>
      )}
    </>
  );
}

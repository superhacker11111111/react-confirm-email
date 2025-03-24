import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Grid, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from '../../utils/axios';
import { userAction } from '../../redux/actions/userAction';
import { useSnackbar } from '../../components/snackbar';
import {
  AlmostFinished,
  Summary,
  MyFences,
  MyRequests,
  RemovedFences,
} from './swapperFences/index';
import { setRemoved, setCurrentSelectedFences, setNewRequest } from '../../redux/slices/product';
import { FENCE_STATUS, S3_PRODUCT_IMAGE_FOLDER } from '../../assets/data/roles';
import { initialize } from '../../redux/actions/authAction';

export default function SwapComfirm() {
  const { user } = useSelector((state) => state.auth);
  const {
    selected_list,
    new_request_list,
    favorite_list,
    selectedFences,
    removed_list,
    swapCount,
    swapAddCount,
    swapRemoveCount,
  } = useSelector((state) => state.product);
  const { subscription } = useSelector((state) => state.subscription);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickItem = () => {
    // localStorage.setItem('pageType', 'requestfences');
    // navigate(PATH_ONBOARDING.onboarding.requestFencesSwapper);
    navigate(-1);
  };

  const handleUpload = async (values) => {
    const imageUrlList = await Promise.all(
      values.map(async (image) => {
        const data = {
          key: S3_PRODUCT_IMAGE_FOLDER + Date.now().toString() + image.path,
          values,
        };
        const preSignedURL = await axios.post('/auth/presignedUrl', data);
        const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
        await fetch(preSignedURL.data.signedUrl, {
          method: 'PUT',
          headers: myHeaders,
          body: image,
        });
        return {
          preview: `https://rf-test-test.s3.us-east-1.amazonaws.com/${data.key}`,
          key: data.key,
        };
      })
    );
    return imageUrlList;
  };

  const handleRequestData = async (request) => {
    if (request.length < 1) {
      return [];
    }
    const requestData = await Promise.all(
      request.map(async (fence) => {
        const imageUrlList = await handleUpload(fence.filesImage);
        return {
          name: fence.name,
          description: fence.description,
          category: fence.category,
          sub_category: fence.sub_category,
          style: fence.style,
          size: fence.size,
          color: fence.color,
          filesImage: imageUrlList,
          status: FENCE_STATUS.NOT_STARTED,
          addedBy: user.id,
        };
      })
    );
    return requestData;
  };

  const onlyUnique = (value, index, array) => array.indexOf(value) === index;

  const handleSubmit = async () => {
    if (
      selectedFences.length + selected_list.length + new_request_list.length - removed_list.length >
      subscription.totalFences
    ) {
      enqueueSnackbar(
        `You can select only ${subscription.totalFences} Fences. If you want to select more fences, upgrade your subscription.`,
        {
          variant: 'error',
        }
      );
      return;
    }

    // const swapAvailableDate = moment(
    //   new Date(
    //     new Date(
    //       new Date().getFullYear(),
    //       new Date().getMonth() + 1,
    //       new Date().getDate(),
    //       new Date().getHours(),
    //       new Date().getMinutes(),
    //       new Date().getSeconds()
    //     )
    //   )
    // ).format('YYYY-MM-DD hh:mm:ss');

    let FavoriteList = [
      ...(user?.favoriteFences ?? []),
      ...(Array.isArray(favorite_list)
        ? favorite_list.map((fence) => fence && fence.id).filter((id) => id !== null)
        : []),
    ];

    FavoriteList = FavoriteList.filter(onlyUnique);

    let selectedFences_list = [
      ...selectedFences.map((fence) => (fence ? fence.id : null)).filter((id) => id !== null),
      ...(Array.isArray(selected_list)
        ? selected_list.map((fence) => (fence ? fence.id : null)).filter((id) => id !== null)
        : []),
    ];

    selectedFences_list = selectedFences_list.filter(onlyUnique);
    let removed_id_list = [];
    removed_id_list = removed_list && removed_list.map((item) => item.id);

    removed_id_list.forEach((fence) => {
      selectedFences_list = selectedFences_list.filter((item) => item !== fence);
    });

    const requestData = await handleRequestData(new_request_list);
    const updateData = {
      selectedFences: selectedFences_list,
      requestFences: requestData,
      favoriteFences: FavoriteList,
      // swapDate: swapAvailableDate,
      email: user?.email.toLowerCase(),
      swapCount,
      swapRemoveCount,
      swapAddCount,
    };
    dispatch(setCurrentSelectedFences([]));
    dispatch(setRemoved([]));
    dispatch(setNewRequest([]));
    dispatch(userAction.updateFences(user?.id, updateData, navigate));
    dispatch(initialize());
  };

  return (
    <Stack
      style={{ width: '1100px' }}
      spacing={6}
      alignItems="center"
      sx={{
        mt: 5,
        py: 2,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
    >
      <Grid item xs={9} md={8} lg={6.5} xl={5.5} sx={{ pt: 8 }}>
        <Typography
          sx={{ fontSize: { xs: '36px', md: '48px' }, fontWeight: '700', textAlign: 'center' }}
        >
          You are almost Done!
        </Typography>
      </Grid>

      {/* <AlmostFinished /> */}
      <Box
        alignItems="center"
        justifyContent="center"
        gap={{ xs: 1, sm: 10 }}
        display="flex"
        flexDirection={{ xs: 'column-reverse', sm: 'row' }}
      >
        <Button
          variant="text"
          color="inherit"
          style={{
            color: 'white',
            backgroundColor: '#1FA9FF',
            fontSize: '15px',
            width: '250px',
            borderRadius: '14px',
            height: '50px',
          }}
          onClick={handleClickItem}
        >
          Back
        </Button>
        <LoadingButton
          variant="text"
          color="inherit"
          style={{
            color: 'white',
            backgroundColor: '#1FA9FF',
            width: '250px',
            fontSize: '15px',
            borderRadius: '14px',
            height: '50px',
            lineHeight: 1,
          }}
          loading={isLoading}
          onClick={() => {
            setIsLoading((prev) => !prev);
            handleSubmit();
          }}
        >
          Submit Fence Swaps
          <br /> And Requests
          {/* <CheckIcon style={{ fontSize: '42px' }} /> */}
        </LoadingButton>
      </Box>

      <Summary />
      <RemovedFences />
      <MyFences />
      <MyRequests />
    </Stack>
  );
}

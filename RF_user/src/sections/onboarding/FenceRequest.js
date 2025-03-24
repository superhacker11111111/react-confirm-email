import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Stack, Button, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//
import axios from '../../utils/axios';
import { userAction } from '../../redux/actions/userAction';
import { PATH_ONBOARDING } from '../../routes/paths';
import { Summary, MyFences, MyRequests } from './fencerequest/index';
import { FENCE_STATUS, S3_PRODUCT_IMAGE_FOLDER } from '../../assets/data/roles';
import { getUser } from '../../redux/actions/authAction';
import { getSubscription } from '../../redux/slices/subscription';
import { setNewRequest } from '../../redux/slices/product';

export default function FenceRequest() {
  const { user } = useSelector((state) => state.auth);
  const { subscription } = useSelector((state) => state.subscription);
  const { selected_list, request_list, favorite_list, new_request_list } = useSelector(
    (state) => state.product
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [available, setAvailable] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (user && hasFetched) {
      dispatch(getUser(user.id));
      dispatch(getSubscription(user.plan));
      setHasFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hasFetched]);

  useEffect(() => {
    if (subscription) {
      setAvailable(subscription.totalFences);
    }
  }, [subscription]);

  const handleClickItem = () => {
    // if (subscription && subscription.requestAvailable) {
    // localStorage.setItem('pageType', 'addFence');
    // navigate(PATH_ONBOARDING.onboarding.requestFences);
    // } else {
    navigate(PATH_ONBOARDING.onboarding.categoryfences);
    // }
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

  const handleRequestData = async () => {
    if (new_request_list.length > 0) {
      const requestData = await Promise.all(
        new_request_list.map(async (fence) => {
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
    }
    return [];
  };

  const handleClick = async () => {
    setIsLoading(true);
    const requestData = await handleRequestData();
    const updateData = {
      selectedFences: selected_list.map((fence) => fence.id),
      requestFences: requestData,
      favoriteFences: favorite_list.map((fence) => fence.id),
      email: user?.email.toLowerCase(),
      onboardingPass: true,
    };
    dispatch(setNewRequest([]));
    dispatch(userAction.updateFences(user?.id, updateData, navigate));
    setIsLoading(true);
  };

  return (
    <Stack
      style={{ width: '1100px' }}
      spacing={{ md: 6, xs: 2 }}
      alignItems="center"
      sx={{
        mt: { md: 5, xs: 2 },
        pb: 5,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
    >
      <Grid item xs={9} md={8} lg={6.5} xl={5.5} sx={{ pt: { md: 8, sm: 4, xs: 3 } }}>
        <Typography
          sx={{
            fontSize: { xs: '33px', sm: '38px', md: '48px' },
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          You are almost finished!
        </Typography>
      </Grid>

      {/* <AlmostFinished user={user} /> */}

      <Stack
        sx={{
          display: 'grid',
          my: { xs: 8, md: 10 },
          gap: { xs: 3, md: 6 },
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          },
        }}
        style={{ justifyContent: 'center' }}
      >
        <Button
          variant="text"
          color="inherit"
          style={{
            color: 'white',
            backgroundColor: '#1FA9FF',
            padding: '10px 142px',
            borderRadius: '14px',
            fontFamily: 'unset',
            height: '50px',
            width: '290px',
          }}
          sx={{ fontSize: { md: '20px', xs: '16px' } }}
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
            padding: '0 58px',
            gap: '2px',
            width: '290px',
            borderRadius: '14px',
            fontFamily: 'unset',
            height: '50px',
            lineHeight: 1,
          }}
          sx={{ fontSize: { md: '20px', xs: '16px' } }}
          loading={isLoading}
          onClick={() => {
            setIsLoading((prev) => !prev);
            handleClick();
          }}
        >
          Confirm Selection
        </LoadingButton>
      </Stack>

      <Summary
        type={user?.userType}
        selectedCount={selected_list && selected_list.length}
        requestCount={request_list && request_list.length}
        user={user}
      />

      <MyFences available={available} />
      {/* {subscription && subscription.requestAvailable && <MyRequests />} */}
    </Stack>
  );
}

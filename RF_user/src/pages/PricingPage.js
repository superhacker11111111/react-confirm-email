import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
// @mui
import { Box, Container, Typography, Button } from '@mui/material';
//
import { useDispatch, useSelector } from '../redux/store';
import { userAction } from '../redux/actions/userAction';
import { getSubscriptionsSuccess } from '../redux/slices/subscription';
// utils
import axios from '../utils/axios';
import { PATH_PAGE } from '../routes/paths';
//
// sections
import { PlanCard } from '../sections/pricinghome';
import { ALLOWED_SUBSCRIPTION_STATUS } from '../assets/data/roles';

// ----------------------------------------------------------------------

export default function PricingPage() {
  const dispatch = useDispatch();

  const colors = { backColor: '#1FA9FF', fontColor: '#FFFFFF', buttonBorder: '#1FA9FF' };

  useEffect(() => {
    dispatch(getSubscriptionsSuccess());
  }, [dispatch]);
  const { user } = useSelector((state) => state.auth);
  const { subscriptions } = useSelector((state) => state.subscription);
  const { selected_list, request_list, favorite_list } = useSelector((state) => state.product);

  // const prices = useSelector((state) => state.price.prices);

  const navigate = useNavigate();

  const handleSubmit = (id) => {
    sessionStorage.setItem('priceId', id);
    navigate(PATH_PAGE.checkout_v2);
  };
  const handleSubmitT = (id) => {
    sessionStorage.setItem('priceId', id);
    navigate(PATH_PAGE.paymentUpgrade.view(paramCase(id)));
  };
  const handleUpload = async (values) => {
    const imageUrlList = [];
    values.filesImage.map(async (image) => {
      const folder = 'products/';
      const data = {
        key: folder + Date.now().toString() + image.path,
        values,
      };
      const preSignedURL = await axios.post('/auth/presignedUrl', data);
      imageUrlList.push({
        key: preSignedURL.data.key,
        preview: `https://rf-test-test.s3.us-east-1.amazonaws.com/${data.key}`,
      });
      const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
      await fetch(preSignedURL.data.signedUrl, {
        method: 'PUT',
        headers: myHeaders,
        body: image,
      });
    });
    return imageUrlList;
  };

  const handleRequestData = async (request) => {
    const requestData = [];
    if (request.length > 0) {
      request.map(async (fence) => {
        const imageUrlList = await handleUpload(fence);
        requestData.push({
          name: fence.name,
          description: fence.description,
          category: fence.category,
          sub_category: fence.sub_category,
          structural_design: fence.structural_design,
          size: fence.size,
          grain: fence.grain,
          filesImage: imageUrlList,
          requestBy: user.id,
        });
      });
    }
    return requestData;
  };

  const handleClickSkip = async () => {
    const requestData = await handleRequestData(request_list);
    const updateData = {
      selectedFences: selected_list.map((fence) => fence.id),
      requestFences: requestData,
      favoriteFences: favorite_list.map((fence) => fence.id),
      email: user?.email.toLowerCase(),
    };
    dispatch(userAction.updateFences(user?.id, updateData, navigate));
  };

  return (
    <>
      <Helmet>
        <title> Pricing | RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: { xs: 10, sm: 15 },
          pb: 10,
          minHeight: 1,
        }}
      >
        {!user || ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) > -1 ? (
          <>
            {' '}
            <Typography variant="h3" align="center" paragraph>
              Sell fences professionally?
              <br /> Let&apos;s get you started with the <br />
              <Typography variant="h3" component="span" sx={{ color: '#1FA9FF' }}>
                best product display <br />
                in the world{' '}
              </Typography>
            </Typography>
            <Typography align="center" sx={{ color: 'text.secondary' }}>
              Bring an extra level of engagement and professionalism
            </Typography>
          </>
        ) : (
          <>
            {' '}
            <Typography variant="h3" align="center" paragraph>
              Upgrade now for more value!
            </Typography>
          </>
        )}

        <Box gap={3} display="grid" gridTemplateColumns={{ md: 'repeat(3, 1fr)' }} sx={{ my: 5 }}>
          {user && ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) > -1
            ? subscriptions &&
              subscriptions.length > 0 &&
              subscriptions?.map((price, index) => (
                <PlanCard
                  key={index}
                  isDisabled={!(Number(price.id) > Number(user?.userType))}
                  plan={price}
                  buttonColor={colors}
                  onButtonClick={handleSubmitT}
                />
              ))
            : subscriptions?.map((price, index) => (
                <PlanCard
                  key={index}
                  plan={price}
                  buttonColor={colors}
                  onButtonClick={handleSubmit}
                />
              ))}
        </Box>
        {user && ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) > -1 && (
          <div className="flex justify-end w-full">
            <Button
              variant="text"
              color="inherit"
              style={{
                backgroundColor: '#C0DEFF',
                padding: '10px 142px',
                fontSize: '20px',
                color: '#1FA9FF',
                borderRadius: '14px',
                fontFamily: 'unset',
                height: '50px',
              }}
              onClick={handleClickSkip}
            >
              Skip
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}

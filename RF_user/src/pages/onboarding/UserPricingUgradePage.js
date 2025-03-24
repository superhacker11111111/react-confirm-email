import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
// import { paramCase } from 'change-case';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';

// @mui
import { Box, Container, Typography, Card, Stack, Button, useMediaQuery } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
//
import { useDispatch, useSelector } from '../../redux/store';
import { getSubscription, getSubscriptions } from '../../redux/slices/subscription';
// utils
// import axios from '../../utils/axios';
import { PATH_ONBOARDING } from '../../routes/paths';
// import { userAction } from '../../redux/actions/userAction';
import Iconify from '../../components/iconify';
// import {FENCE_STATUS, S3_PRODUCT_IMAGE_FOLDER } from '../../assets/data/roles';
// ----------------------------------------------------------------------

PlanCard.propTypes = {
  type: PropTypes.number,
  isDisabled: PropTypes.bool,
  plan: PropTypes.shape({
    name: PropTypes.string,
    popular: PropTypes.bool,
    requestAvailable: PropTypes.bool,
    price: PropTypes.string,
    totalFences: PropTypes.string,
    totalUsers: PropTypes.string,
    id: PropTypes.string,
  }),
  onButtonClick: PropTypes.func,
  buttonColor: PropTypes.shape({
    backColor: PropTypes.string,
    fontColor: PropTypes.string,
    buttonBorder: PropTypes.string,
  }),
};

PlanCardMobile.propTypes = {
  type: PropTypes.number,
  isDisabled: PropTypes.bool,
  plan: PropTypes.shape({
    name: PropTypes.string,
    popular: PropTypes.bool,
    requestAvailable: PropTypes.bool,
    price: PropTypes.string,
    totalFences: PropTypes.string,
    totalUsers: PropTypes.string,
    id: PropTypes.string,
  }),
  onButtonClick: PropTypes.func,
  buttonColor: PropTypes.shape({
    backColor: PropTypes.string,
    fontColor: PropTypes.string,
    buttonBorder: PropTypes.string,
  }),
};

export default function UserPricingUgradePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:650px)');
  // const userId = useParams().id;
  const { user } = useSelector((state) => state.auth);
  const colors = { backColor: '#1FA9FF', fontColor: '#FFFFFF', buttonBorder: '#1FA9FF' };
  // const { selected_list, request_list, favorite_list } = useSelector((state) => state.product);

  useEffect(() => {
    if (user) {
      dispatch(getSubscription(user.plan));
    }
    dispatch(getSubscriptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { subscriptions } = useSelector((state) => state.subscription);

  const handleSubmit = (id) => {
    localStorage.setItem('priceId', id);
    navigate(PATH_ONBOARDING.onboarding.userAlmostUpgrade);
  };

  // const handleUpload = async (values) => {
  //   const imageUrlList = Promise.all(
  //     values.filesImage.map(async (image) => {
  //       const data = {
  //         key: S3_PRODUCT_IMAGE_FOLDER + Date.now().toString() + image.path,
  //         values,
  //       };
  //       const preSignedURL = await axios.post('/auth/presignedUrl', data);
  //       const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
  //       await fetch(preSignedURL.data.signedUrl, {
  //         method: 'PUT',
  //         headers: myHeaders,
  //         body: image,
  //       });
  //       return {
  //         key: preSignedURL.data.key,
  //         preview: `https://rf-test-test.s3.us-east-1.amazonaws.com/${data.key}`,
  //       };
  //     })
  //   );
  //   return imageUrlList;
  // };

  // const handleRequestData = async (request) => {
  //   if (request.length > 0) {
  //     const requestData = Promise.all(
  //       request.map(async (fence) => {
  //         const imageUrlList = await handleUpload(fence);
  //         return {
  //           name: fence.name,
  //           description: fence.description,
  //           category: fence.category,
  //           sub_category: fence.sub_category,
  //           style: fence.style,
  //           size: fence.size,
  //           color: fence.color,
  //           filesImage: imageUrlList,
  //           status: FENCE_STATUS.NOT_STARTED,
  //           addedBy: user.id,
  //         };
  //       })
  //     );
  //     return requestData;
  //   }
  //   return [];
  // };

  // const handleClickSkip = async () => {
  //   const requestData = await handleRequestData(request_list);
  //   const updateData = {
  //     selectedFences: selected_list.map((fence) => fence.id),
  //     requestFences: requestData,
  //     favoriteFences: favorite_list.map((fence) => fence.id),
  //     email: user?.email.toLowerCase(),
  //   };
  //   dispatch(userAction.updateFences(user?.id, updateData, navigate));
  // };

  // const handleClickSkip = async () => {
  //   navigate(
  //     localStorage.getItem('layout') === 'onboarding'
  //       ? PATH_ONBOARDING.onboarding.fenceRequestCongratulation
  //       : PATH_DASHBOARD.user.account
  //   );
  // };

  const handleClickBack = async () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>

      <Container
        component={MotionViewport}
        id="pricing-home"
        maxWidth="lg"
        sx={{
          pt: { xs: 4, md: 8 },
          pb: { xs: 5, md: 10 },
          px: { xs: 3, sm: 5, md: 10, lg: 18 },
        }}
      >
        <Box
          sx={{
            mt: 5,
            mb: 3,
            textAlign: 'center',
          }}
        >
          <m.div variants={varFade().inDown}>
            <Typography sx={{ fontSize: { md: '40px', xs: '32px' }, fontWeight: '900' }}>
              Need More Fences?
            </Typography>
          </m.div>
        </Box>
        {!isMobile ? (
          <Box
            gap={{ md: 6, sm: 5 }}
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            sx={{ my: { md: 12, sm: 8, xs: 4 } }}
          >
            {subscriptions &&
              subscriptions.length > 0 &&
              subscriptions.map(
                (price, index) =>
                  price.price !== '0' && (
                    <PlanCard
                      key={index}
                      plan={price}
                      buttonColor={colors}
                      isDisabled={user && user.plan === price.id}
                      onButtonClick={handleSubmit}
                    />
                  )
              )}
          </Box>
        ) : (
          <Box
            gap={2}
            display="grid"
            sx={{ justifyContent: 'center', alignItems: 'center', my: { md: 12, sm: 8, xs: 4 } }}
            gridTemplateColumns="repeat(1, 1fr)"
          >
            {subscriptions &&
              subscriptions.length > 0 &&
              subscriptions.map(
                (price, index) =>
                  price.price !== '0' && (
                    <PlanCardMobile
                      key={index}
                      plan={price}
                      buttonColor={colors}
                      isDisabled={user && user.plan === price.id}
                      onButtonClick={handleSubmit}
                    />
                  )
              )}
          </Box>
        )}

        <Stack
          display="flex"
          alignItems="center"
          sx={{
            flexDirection: { sm: 'row', xs: 'column' },
            justifyContent: 'space-between',
            px: { md: 14, sm: 8 },
          }}
        >
          <Button
            variant="text"
            color="inherit"
            style={{
              backgroundColor: '#C0DEFF',
              color: '#1FA9FF',
              borderRadius: '14px',
              fontFamily: 'Poppins',
              height: '50px',
              marginTop: '20px',
              fontWeight: 900,
              width: '33%',
            }}
            sx={{
              padding: { md: '10px 142px', xs: '10px 102px' },
              fontSize: { sm: '20px', xs: '18px' },
            }}
            onClick={handleClickBack}
          >
            Back
          </Button>
          <Button
            variant="text"
            color="inherit"
            style={{
              backgroundColor: '#C0DEFF',
              color: '#1FA9FF',
              borderRadius: '14px',
              fontFamily: 'Poppins',
              height: '50px',
              marginTop: '20px',
              fontWeight: 900,
              width: '33%',
            }}
            sx={{
              padding: { md: '10px 142px', xs: '10px 102px' },
              fontSize: { sm: '20px', xs: '18px' },
            }}
            onClick={handleClickBack}
          >
            Skip
          </Button>
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

// export function PlanCard({ plan, isDisabled = false, onButtonClick, buttonColor, type }) {
//   if (!plan) return null;
//   const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;

//   const { backColor, fontColor, buttonBorder } = buttonColor;

//   const handleClick = () => {
//     onButtonClick(id);
//   };

//   return (
//     <Card
//       sx={{
//         pb: 3,
//         px: { md: 5, sm: 2, xs: 5 },
//         pt: popular ? 8 : 4.5,
//         height: popular ? '112%' : '100%',
//         alignSelf: popular ? 'center' : 'flex-start',
//         boxShadow: `0px 8px 12px rgba(0, 0, 0, 0.3)`,
//         // boxShadow: (theme) => theme.customShadows.z8,
//       }}
//     >
//       <Stack spacing={5}>
//         <Stack direction={{ sm: 'row', sx: 'column' }} justifyContent="space-between" >
//           <Typography component="div" sx={{ marginTop: '20px', fontSize: '20px', fontWeight: 800 }}>
//             {name}
//           </Typography>

//           {popular ? (
//             <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-2.5 py-1 rounded-[10px] absolute top-8 left-5">
//               POPULAR
//             </span>
//           ) : (
//             ''
//           )}
//           <Stack direction="row" spacing={0.5} sx={{ marginTop: '20px' }}>
//             <Typography fontSize="24px" component="span">
//               $
//             </Typography>
//             <Typography fontSize="32px" component="span" fontWeight={900}>
//               {price}
//             </Typography>
//           </Stack>
//         </Stack>

//         <Stack spacing={2.5}>
//           <Stack spacing={1.5} direction="row" alignItems="center">
//             <Iconify
//               icon="carbon:checkmark-outline"
//               sx={{ color: '#FA541C', width: 20, height: 20 }}
//             />
//             <Typography fontSize="14px" fontWeight="700">
//               {totalFences} Fences
//             </Typography>
//           </Stack>
//           <Stack spacing={1.5} direction="row" alignItems="center">
//             <Iconify
//               icon="carbon:checkmark-outline"
//               sx={{ color: '#FA541C', width: 20, height: 20 }}
//             />
//             <Typography fontSize="14px" fontWeight="700">
//               {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`} Users
//             </Typography>
//           </Stack>
//           <Stack spacing={1.5} direction="row" alignItems="center">
//             <Iconify
//               icon="carbon:checkmark-outline"
//               sx={{ color: '#FA541C', width: 20, height: 20 }}
//             />
//             <Typography fontSize="14px" fontWeight="700">
//               Premium Support
//             </Typography>
//           </Stack>
//           <Stack spacing={1.5} direction="row" alignItems="center" mb={20}>
//             <Iconify
//               icon={requestAvailable ? 'carbon:checkmark-outline' : 'carbon:close-outline'}
//               sx={{ color: requestAvailable ? '#FA541C' : 'grey', width: 20, height: 20 }}
//             />
//             <Typography fontSize="14px" fontWeight="700">
//               Request Custom Fences
//             </Typography>
//           </Stack>
//           <Button
//             size="large"
//             disabled={isDisabled}
//             fullWidth
//             variant="contained"
//             color="primary"
//             onClick={handleClick}
//             style={{
//               marginTop: '30px',
//               backgroundColor: isDisabled ? 'grey' : '#1FA9FF',
//               color: fontColor,
//               border: isDisabled ? 'grey 1px solid' : `${buttonBorder} 1px solid`,
//             }}
//           >
//             Choose Subscription
//           </Button>
//         </Stack>
//       </Stack>
//     </Card>
//   );
// }

// ----------------------------------------------------------------------

export function PlanCard({ plan, isDisabled = false, onButtonClick, buttonColor, type }) {
  if (!plan) return null;
  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;

  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onButtonClick(id);
  };

  return (
    <Card
      sx={{
        pb: 3,
        px: { md: 5, sm: 2, xs: 5 },
        pt: popular ? 8 : 4.5,
        height: popular ? '112%' : '100%',
        alignSelf: popular ? 'center' : 'flex-start',
        boxShadow: `0px 8px 12px rgba(0, 0, 0, 0.3)`,
        // boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={5}>
        <Stack
          direction={{ sm: 'row', sx: 'column' }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            <Typography
              component="div"
              sx={{
                marginTop: '20px',
                fontSize: { sm: '28px', lg: '25px', xl: '36px' },
                fontWeight: '900',
                fontFamily: 'Poppins',
              }}
            >
              {name}
            </Typography>
            {price === '0' ? (
              <Typography fontSize="18px" fontWeight="700">
                Free For 7 Day
              </Typography>
            ) : (
              <Typography fontSize="18px" fontWeight="700">
                <br />
              </Typography>
            )}
          </Stack>

          {popular ? (
            <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-2.5 py-1 rounded-[10px] absolute top-8 left-5">
              POPULAR
            </span>
          ) : (
            ''
          )}

          <Stack direction="column" alignItems="flex-end" sx={{ marginTop: '2px' }}>
            <Stack direction="row" justifyContent="center" spacing={0.5}>
              <Typography fontSize="26px" component="span" fontWeight={600}>
                $
              </Typography>
              <Typography fontSize="30px" component="span" fontWeight={900}>
                {price}
              </Typography>
            </Stack>
            <Typography
              sx={{ fontSize: { xs: '14px', sm: '16px' } }}
              component="span"
              fontWeight={900}
            >
              Per Month
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={2.5}>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="26px" fontWeight="900">
              {totalFences} Fences
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="16px" fontWeight="700">
              {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`}
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="16px" fontWeight="700">
              Premium Support
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="16px" fontWeight="700">
              One-Touch Sharing
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center" mb={20}>
            <Iconify
              icon={requestAvailable ? 'carbon:checkmark-outline' : 'carbon:close-outline'}
              sx={{ color: requestAvailable ? '#2DBB5D' : '#FF0606', width: 20, height: 20 }}
            />
            <Typography
              fontSize="16px"
              fontWeight="700"
              color={requestAvailable ? 'black' : 'grey'}
            >
              Request Custom Fences
            </Typography>
          </Stack>
          <Button
            size="large"
            disabled={isDisabled}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              marginTop: '30px',
              backgroundColor: isDisabled ? 'grey' : '#1FA9FF',
              color: fontColor,
              border: isDisabled ? 'grey 1px solid' : `${buttonBorder} 1px solid`,
            }}
          >
            Choose Subscription
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function PlanCardMobile({ plan, isDisabled = false, onButtonClick, buttonColor, type }) {
  if (!plan) return null;
  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;

  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onButtonClick(id);
  };

  return (
    <Card
      sx={{
        p: 2,
        pt: 4,
        pb: popular ? 3 : 2,
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography
              variant="h4"
              component="div"
              sx={{
                marginTop: '20px',
                fontSize: { xs: '26px', sm: '28px' },
                fontFamily: 'Poppins',
              }}
            >
              {name}
            </Typography>
            {price === '0' ? (
              <Typography fontSize="18px" fontWeight="700">
                Free For 7 Day
              </Typography>
            ) : (
              <Typography fontSize="18px" fontWeight="700">
                <br />
              </Typography>
            )}
          </Stack>

          {popular ? (
            <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-2.5 py-1 rounded-[10px] absolute top-5 left-5">
              POPULAR
            </span>
          ) : (
            ''
          )}

          <Stack direction="column" alignItems="flex-end" sx={{ marginTop: '2px' }}>
            <Stack direction="row" justifyContent="center" spacing={0.5}>
              <Typography fontSize="26px" component="span" fontWeight={600}>
                $
              </Typography>
              <Typography fontSize="30px" component="span" fontWeight={900}>
                {price}
              </Typography>
            </Stack>
            <Typography
              sx={{ fontSize: { xs: '14px', sm: '16px' } }}
              component="span"
              fontWeight={900}
            >
              Per Month
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography sx={{ fontSize: { xs: '20px', sm: '26px' } }} fontWeight="900">
              {totalFences} Fences
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }} fontWeight="700">
              {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`}
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }} fontWeight="700">
              Premium Support
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }} fontWeight="700">
              One-Touch Sharing
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center" mb={20}>
            <Iconify
              icon={requestAvailable ? 'carbon:checkmark-outline' : 'carbon:close-outline'}
              sx={{ color: requestAvailable ? '#2DBB5D' : '#FF0606', width: 20, height: 20 }}
            />
            <Typography
              sx={{ fontSize: { xs: '14px', sm: '16px' } }}
              fontWeight="700"
              color={requestAvailable ? 'black' : 'grey'}
            >
              Request Custom Fences
            </Typography>
          </Stack>

          <Button
            size="large"
            disabled={isDisabled}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              marginTop: '30px',
              backgroundColor: isDisabled ? 'grey' : '#1FA9FF',
              color: fontColor,
              border: isDisabled ? 'grey 1px solid' : `${buttonBorder} 1px solid`,
            }}
          >
            Choose Subscription
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

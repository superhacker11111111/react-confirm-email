import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Stack,
  DialogTitle,
  Grid,
} from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
//
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useDispatch, useSelector } from '../../redux/store';
import { getSubscriptions } from '../../redux/slices/subscription';
// utils
import { PATH_PAGE } from '../../routes/paths';
//
import PlanCard from './Plancard';
import PlanCardAlmost from './Plancardalmost';
import { PRICE_VIEW_AVAILABLE } from '../../assets/data/roles';
import Iconify from '../../components/iconify';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function PricingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptions } = useSelector((state) => state.subscription);

  const [open, setOpen] = useState(false);

  const colors = { backColor: '#1FA9FF', fontColor: '#FFFFFF', buttonBorder: '#1FA9FF' };
  const isViewAvailable = localStorage.getItem('isPriceViewAvailable');

  const InformationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    company: Yup.string().required('CompanyName is required'),
    email: Yup.string().required('Email is required').email('Email is invalid.'),
  });

  const defaultInformationValues = useMemo(
    () => ({
      name: '',
      company: '',
      email: '',
    }),
    []
  );

  const informationMethods = useForm({
    resolver: yupResolver(InformationSchema),
    defaultValues: defaultInformationValues,
  });

  const { watch, handleSubmit } = informationMethods;

  useEffect(() => {
    dispatch(getSubscriptions());
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubscriptionClick = (id) => {
    sessionStorage.setItem('priceId', id);
    navigate(PATH_PAGE.checkout_v2);
  };

  const onViewPrice = async () => {
    setOpen(false);
    const contactData = watch();
    localStorage.setItem('isPriceViewAvailable', PRICE_VIEW_AVAILABLE.AVAILABLE);
    try {
      await axios.post('/contact/sendViewPriceMessage', contactData);
    } catch (err) {
      console.log(err);
    }
  };

  const isMobile = useMediaQuery('(max-width:750px)');

  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>
      <>
        {' '}
        {!isMobile ? (
          // <Box sx={{ backgroundColor: '#1FA9FF' }}>
          //   <Container
          //     component={MotionViewport}
          //     id="pricing-home"
          //     sx={{
          //       pt: { xs: 4, md: 8 },
          //       pb: { xs: 5, md: 10 },
          //       px: { lg: 12, md: 8, xs: 2 },
          //     }}
          //   >
          //     <Box
          //       sx={{
          //         mb: 5,
          //         textAlign: 'center',
          //       }}
          //     >
          //       <m.div variants={varFade().inDown}>
          //         <Typography
          //           sx={{
          //             color: '#ffffff',
          //             fontSize: { lg: '42px', md: '32px', sm: '28px', xs: '24px' },
          //             fontWeight: 900,
          //           }}
          //         >
          //           The Right Plan for Your Business
          //         </Typography>
          //       </m.div>
          //     </Box>

          //     <Box
          //       gap={{ lg: 3, sm: 1 }}
          //       display="grid"
          //       gridTemplateColumns={{ sm: 'repeat(4, 1fr)' }}
          //       sx={{ my: 5 }}
          //     >
          //       {subscriptions &&
          //         subscriptions.length > 0 &&
          //         subscriptions.map((price, index) => (
          //           <PlanCard
          //             key={index}
          //             plan={price}
          //             buttonColor={colors}
          //             onSubscriptionClick={onSubscriptionClick}
          //             onPriceViewClick={handleOpen}
          //             isViewAvailable={isViewAvailable}
          //           />
          //         ))}
          //     </Box>
          //   </Container>
          // </Box>
          <Box sx={{ backgroundColor: '#1FA9FF' }}>
            <Container
              component={MotionViewport}
              id="pricing-home"
              sx={{
                pt: { xs: 4, md: 8 },
                pb: { xs: 5, md: 10 },
                px: { lg: 12, md: 8, sm: 3, xs: 2 },
              }}
            >
              <Box
                sx={{
                  mb: 5,
                  textAlign: 'center',
                }}
              >
                <m.div variants={varFade().inDown}>
                  <Typography
                    sx={{
                      color: '#ffffff',
                      fontSize: { lg: '42px', md: '32px', sm: '28px', xs: '24px' },
                      fontWeight: 900,
                    }}
                  >
                    The Right Plan for Your Business
                  </Typography>
                </m.div>
              </Box>

              {/* <Box
                gap={{ lg: '36px', sm: '32px' }}
                display="grid"
                gridTemplateColumns={{ lg: 'repeat(3, 1fr)', sm: 'repeat(2, 1fr)' }}
                sx={{ my: 5, justifyContent: 'center' }}
              >
                {subscriptions &&
                  subscriptions.length > 0 &&
                  subscriptions.map((price, index) => (
                    <PlanCard
                      key={index}
                      plan={price}
                      buttonColor={colors}
                      onSubscriptionClick={onSubscriptionClick}
                      onPriceViewClick={handleOpen}
                      isViewAvailable={isViewAvailable}
                    />
                  ))}
              </Box> */}

              <Grid
                container
                gap={2}
                sx={{ justifyContent: 'center', alignItems: 'center' }}
                columns={{ md: 12 }}
              >
                {subscriptions &&
                  subscriptions.length > 0 &&
                  subscriptions.map((price, index) => (
                    <Grid item xs={2} sm={3.5} md={3.5} key={index}>
                      <PlanCard
                        key={index}
                        plan={price}
                        buttonColor={colors}
                        onSubscriptionClick={onSubscriptionClick}
                        onPriceViewClick={handleOpen}
                        isViewAvailable={isViewAvailable}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Container>
          </Box>
        ) : (
          <Box sx={{ backgroundColor: 'ffffff' }}>
            <Container
              component={MotionViewport}
              id="pricing-home"
              sx={{
                pt: { xs: 2, md: 4 },
                pb: { xs: 5, md: 10 },
                px: { lg: 20, md: 8, xs: 2 },
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  px: 7,
                }}
              >
                <m.div variants={varFade().inDown}>
                  <Typography
                    sx={{
                      fontSize: { lg: '42px', md: '32px', sm: '28px', xs: '24px' },
                      fontWeight: 900,
                    }}
                  >
                    The Right Plan for Your Business
                  </Typography>
                </m.div>
              </Box>

              <Box
                gap={6}
                display="grid"
                gridTemplateColumns="repeat(1, 1fr)"
                sx={{ mb: 5, mt: 3, mx: 4 }}
              >
                {subscriptions &&
                  subscriptions.length > 0 &&
                  subscriptions.map((price, index) => (
                    <PlanCardAlmost
                      key={index}
                      plan={price}
                      buttonColor={colors}
                      onSubscriptionClick={onSubscriptionClick}
                      onPriceViewClick={handleOpen}
                      isViewAvailable={isViewAvailable}
                    />
                  ))}
              </Box>
            </Container>
          </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '16px' }}>
            <Typography fontSize="28px" fontWeight="700">
              Want to learn more about RealityFence?
            </Typography>
            <Typography fontSize="20px" fontWeight="300">
              Please add a few details to continue:
            </Typography>
          </DialogTitle>
          <Iconify
            icon="eva:close-circle-fill"
            style={{
              position: 'absolute',
              right: 4,
              top: 4,
              color: '#1FA9FF',
            }}
            width={30}
            onClick={handleClose}
          />

          <DialogContent>
            <FormProvider methods={informationMethods}>
              <Stack spacing={1} mt={2}>
                <RHFTextField fullWidth label="Name" name="name" />
                <RHFTextField fullWidth label="Company" name="company" />
                <RHFTextField fullWidth label="Email" name="email" />
              </Stack>
            </FormProvider>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit(onViewPrice)}
              style={{
                width: '200px',
                backgroundColor: '#1FA9FF',
                color: '#FFFFFF',
                paddingTop: '10px',
                paddingBottom: '10px',
              }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
}

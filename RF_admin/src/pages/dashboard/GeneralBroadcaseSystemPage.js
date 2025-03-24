import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
import * as Yup from 'yup';
// @mui
import { Container, Button, Typography, Card, Stack, Alert, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../utils/axios';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { BROADCAST_TYPE } from '../../assets/data/roles';

// ----------------------------------------------------------------------

const StyledButton = styled(Button)(({ theme }) => ({
  width: '180px',
  color: 'white',
  fontSize: '18px',
  backgroundColor: 'black',
  border: '1px solid black',
  '&:hover': {
    backgroundColor: 'black',
    border: '1px solid black',
    opacity: 0.72,
  },
}));

export default function GeneralBroadcastSystemPage() {
  const { themeStretch } = useSettingsContext();
  const isDesktop = useResponsive('up', 'sm');

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [broadcastType, setBroadcastType] = useState(BROADCAST_TYPE.SMS);

  const broadcastMessageSchema = Yup.object().shape({
    title:
      broadcastType === BROADCAST_TYPE.EMAIL
        ? Yup.string().required('Title is required')
        : Yup.string(),
    content:
      broadcastType === BROADCAST_TYPE.SMS
        ? Yup.string().required('SMS Text is required')
        : Yup.string().required('Email Text is required'),
  });

  const defaultBroadcastValues = useMemo(
    () => ({
      title: '',
      content: '',
    }),
    []
  );

  const broadcastMethods = useForm({
    resolver: yupResolver(broadcastMessageSchema),
    defaultValues: defaultBroadcastValues,
  });

  const broadcastValues = broadcastMethods.watch();

  const showSuccessAlert = async () => {
    setOpenSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpenSuccess(false);
  };

  const showErrorAlert = async () => {
    setOpenError(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpenError(false);
  };

  const sendMessage = () => {
    const data = {
      ...broadcastValues,
      type: broadcastType,
    };
    axios
      .post('contact/sendAnnounceMessage', data)
      .then((res) => {
        showSuccessAlert();
        broadcastMethods.reset();
        broadcastMethods.clearErrors();
      })
      .catch((err) => {
        showErrorAlert();
      });
  };

  return (
    <>
      <Helmet>
        <title> Broadcast System | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Broadcast System
        </Typography>
        <Card sx={{ p: 3 }}>
          <Stack flexDirection="row" gap={2} height="45px">
            <StyledButton
              variant="outlined"
              sx={{
                bgcolor: broadcastType !== BROADCAST_TYPE.SMS && '#CDD0D8',
                borderColor: broadcastType !== BROADCAST_TYPE.SMS && '#CDD0D8',
              }}
              onClick={() => {
                setBroadcastType(BROADCAST_TYPE.SMS);
                broadcastMethods.reset();
              }}
            >
              SMS
            </StyledButton>
            <StyledButton
              variant="outlined"
              sx={{
                bgcolor: broadcastType !== BROADCAST_TYPE.EMAIL && '#CDD0D8',
                borderColor: broadcastType !== BROADCAST_TYPE.EMAIL && '#CDD0D8',
              }}
              onClick={() => {
                setBroadcastType(BROADCAST_TYPE.EMAIL);
                broadcastMethods.reset();
              }}
            >
              Email
            </StyledButton>
          </Stack>
          <FormProvider
            methods={broadcastMethods}
            onSubmit={broadcastMethods.handleSubmit(sendMessage)}
          >
            {broadcastType === BROADCAST_TYPE.SMS ? (
              <Stack>
                <Typography variant="h6" sx={{ mb: 1, mt: 5, fontFamily: 'DM Sans' }}>
                  SMS Message
                </Typography>
                <RHFTextField
                  label="SMS Text"
                  name="content"
                  multiline
                  rows={6}
                  sx={{
                    width: isDesktop ? '70%' : '100%',
                  }}
                />
              </Stack>
            ) : (
              <Stack>
                <Typography variant="h6" sx={{ mb: 1, mt: 5, fontFamily: 'DM Sans' }}>
                  Subject
                </Typography>
                <RHFTextField
                  label="Email Subject"
                  name="title"
                  sx={{
                    width: isDesktop ? '70%' : '100%',
                    mb: 1,
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1, fontFamily: 'DM Sans' }}>
                  Email
                </Typography>
                <RHFTextField
                  label="Email Text"
                  name="content"
                  multiline
                  rows={6}
                  sx={{
                    width: isDesktop ? '70%' : '100%',
                  }}
                />
              </Stack>
            )}

            <Stack
              width={isDesktop ? '70%' : '100%'}
              flexDirection={isDesktop ? 'row' : 'column-reverse'}
              justifyContent={isDesktop ? 'space-between' : 'center'}
              gap={isDesktop ? 0 : 1}
              alignItems="center"
              mt={3}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1FA9FF',
                  width: '160px',
                  fontSize: '18px',
                  fontFamily: 'DM Sans',
                }}
                onClick={() => {
                  broadcastMethods.reset();
                  broadcastMethods.clearErrors();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#1FA9FF',
                  width: '160px',
                  fontSize: '18px',
                  fontFamily: 'DM Sans',
                }}
              >
                Send Message
              </Button>
            </Stack>
          </FormProvider>
          <Collapse in={openSuccess} sx={{ mt: 3 }}>
            <Alert severity="success" variant="outlined" sx={{ width: '70%' }}>
              Successfully Sent!
            </Alert>
          </Collapse>
          <Collapse in={openError} sx={{ mt: 3 }}>
            <Alert severity="error" variant="outlined" sx={{ width: '70%' }}>
              Something went wrong!
            </Alert>
          </Collapse>
        </Card>
      </Container>
    </>
  );
}

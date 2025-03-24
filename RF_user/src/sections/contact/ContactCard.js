import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  Stack,
  Typography,
  Box,
  Button,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FormProvider, {
  RHFTextField,
  RHFCheckbox,
  RHFEditor,
  RHFPhoneNumber,
} from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';
import { contactMessage } from '../../redux/slices/contact';

export default function ContactCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };

  const ContactSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email Address is required'),
    phone: Yup.string().required('Phone is required'),
    company: Yup.string().required('Company is required'),
    message: Yup.string().required('Message is required'),
  });

  const defaultContactValues = useMemo(
    () => ({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      subject: '',
      sales: false,
      customer: false,
    }),
    []
  );

  const contactMethods = useForm({
    resolver: yupResolver(ContactSchema),
    defaultValues: defaultContactValues,
  });

  const { watch, reset, handleSubmit } = contactMethods;

  const contactData = watch();
  const onSubmit = () => {
    const registerData = {
      name: contactData.name,
      email: contactData.email.toLowerCase(),
      phone: contactData.phone,
      company: contactData.company,
      message: contactData.message,
      sales: contactData.sales,
      customer: contactData.customer,
      subject: contactData.subject,
    };
    sessionStorage.setItem('registerType', 'shopper');
    dispatch(contactMessage(registerData, navigate, SnackBar, reset));
    reset();
  };

  return (
    <Stack sx={{ pb: { md: 20, xs: 9 } }}>
      <FormProvider methods={contactMethods} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ boxShadow: { xs: 0, sm: 15 }, px: { md: 5, xs: 0.5 }, pb: 4, pt: 2 }}>
          <Grid
            container
            spacing={{ md: 4, xs: 2 }}
            sx={{ pb: { md: 4, xs: 2 }, pt: { md: 4, xs: 0 } }}
          >
            <Grid item md={6} xs={12}>
              <Typography sx={{ fontWeight: '700' }}>Name</Typography>
              <RHFTextField name="name" fullWidth placeholder="Enter you name" />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography sx={{ fontWeight: '700' }}>Email Address</Typography>
              <RHFTextField name="email" fullWidth placeholder="Enter your email" />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography sx={{ fontWeight: '700' }}>Phone</Typography>
              <RHFPhoneNumber name="phone" fullWidth placeholder="Enter phone number" />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography sx={{ fontWeight: '700' }}>Company</Typography>
              <RHFTextField name="company" fullWidth placeholder="Company name" />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ fontWeight: '700' }}>Subject</Typography>
              <RHFTextField name="subject" fullWidth placeholder="Enter a Subject" />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ fontWeight: '700' }}>Message</Typography>
              <RHFEditor
                name="message"
                fullWidth
                placeholder="Hi there! I would like to get in touch because..."
                minRows={8}
                maxRows={8}
              />
            </Grid>
          </Grid>

          <Typography sx={{ fontWeight: '700' }}>Category</Typography>
          <Typography>Help us to help you!</Typography>

          <Grid container spacing={4} sx={{ py: 2 }}>
            <Grid item md={6} xs={12}>
              <Grid container sx={{ justifyContent: 'space-between' }}>
                <Grid item xs={5.5} style={{ alignSelf: 'center' }}>
                  <ListItem sx={{ backgroundColor: '#FAFAFA', height: '54px' }}>
                    <ListItemIcon>
                      <RHFCheckbox name="sales" tabIndex={-1} />
                    </ListItemIcon>
                    <ListItemText primary="Sales" />
                  </ListItem>
                </Grid>
                <Grid item xs={5.5}>
                  <ListItem sx={{ backgroundColor: '#FAFAFA', height: '54px' }}>
                    <ListItemIcon>
                      <RHFCheckbox name="customer" tabIndex={-1} />
                    </ListItemIcon>
                    <ListItemText primary="Customer Support" />
                  </ListItem>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={6} xs={12} style={{ textAlign: 'center' }}>
              <Button
                size="large"
                variant="contained"
                style={{ background: '#1FA9FF' }}
                type="submit"
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </Stack>
  );
}

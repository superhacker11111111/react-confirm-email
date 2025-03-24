import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import jwtDecode from 'jwt-decode';

// @mui
import { Grid, Typography, Stack, Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// sections
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { addUsers } from '../../redux/slices/user';
import { useSnackbar } from '../../components/snackbar';
import { PATH_ONBOARDING } from '../../routes/paths';

function ProPlus() {
  return (
    <Grid item xs={10} sm={8} md={5} lg={5}>
      <Stack spacing={1} mt={2}>
        <Typography variant="h5">Add Users</Typography>
        <p style={{ fontSize: '14px', marginTop: '30px', color: '#637381' }}>
          Your Pro+ account includes up to <u>5 users</u> add up to 4 more emails below:
        </p>
        <RHFTextField fullWidth label="Email" name="email1" />
        <RHFTextField fullWidth label="Email" name="email2" />
        <RHFTextField fullWidth label="Email" name="email3" />
        <RHFTextField fullWidth label="Email" name="email4" />
      </Stack>
    </Grid>
  );
}

function Enterprise() {
  return (
    <Grid item xs={10} sm={8} md={10} lg={10}>
      <Stack spacing={1} mt={2}>
        <Typography variant="h5">Add Users</Typography>
        <p style={{ fontSize: '14px', marginTop: '30px', color: '#637381' }}>
          Your Enterprise account includes up to <u>10 users</u> add up to 9 more emails below:
        </p>
        <Stack direction="row" spacing={5}>
          <RHFTextField label="Email" name="email1" style={{ width: '50%' }} />
          <RHFTextField label="Email" name="email2" style={{ width: '50%' }} />
        </Stack>
        <Stack direction="row" spacing={5}>
          <RHFTextField label="Email" name="email3" style={{ width: '50%' }} />
          <RHFTextField label="Email" name="email4" style={{ width: '50%' }} />
        </Stack>
        <Stack direction="row" spacing={5}>
          <RHFTextField label="Email" name="email5" style={{ width: '50%' }} />
          <RHFTextField label="Email" name="email6" style={{ width: '50%' }} />
        </Stack>
        <Stack direction="row" spacing={5}>
          <RHFTextField label="Email" name="email7" style={{ width: '50%' }} />
          <RHFTextField label="Email" name="email8" style={{ width: '50%' }} />
        </Stack>
        <Stack direction="row" spacing={5}>
          <RHFTextField label="Email" name="email9" style={{ width: '50%' }} />
          <span style={{ width: '50%' }} />
        </Stack>
      </Stack>
    </Grid>
  );
}
export default function AddUsersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = jwtDecode(localStorage.getItem('accessToken'));

  const SnackBar = (msg, result) => {
    enqueueSnackbar(msg, { variant: result });
  };

  const NewUsersSchema = Yup.object().shape({
    email1: Yup.string().email('Please enter a valid Email'),
    email2: Yup.string().email('Please enter a valid Email'),
    email3: Yup.string().email('Please enter a valid Email'),
    email4: Yup.string().email('Please enter a valid Email'),
    email5: Yup.string().email('Please enter a valid Email'),
    email6: Yup.string().email('Please enter a valid Email'),
    email7: Yup.string().email('Please enter a valid Email'),
    email8: Yup.string().email('Please enter a valid Email'),
    email9: Yup.string().email('Please enter a valid Email'),
  });

  const defaultValues = useMemo(
    () => ({
      email1: '',
      email2: '',
      email3: '',
      email4: '',
      email5: '',
      email6: '',
      email7: '',
      email8: '',
      email9: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUsersSchema),
    defaultValues,
  });

  const OnSend = () => {
    const emailList = [];
    const emails = [];

    Object.values(values).forEach(
      (element) => element && emails.indexOf(element) < 0 && emails.push(element)
    );
    if (emails.length > 0) {
      emails.forEach((mail) => {
        if (mail !== '') {
          emailList.push(mail);
        }
      });
      dispatch(
        addUsers(id, emailList, SnackBar, (response) => {
          if (response.data.code === 200) {
            navigate(PATH_ONBOARDING.onboarding.selectfencesp);
          }
        })
      );
      enqueueSnackbar('Successfully Added!', { variant: 'success' });
      navigate(PATH_ONBOARDING.onboarding.selectfencesp);
    } else {
      enqueueSnackbar('Please insert one!', { variant: 'error' });
    }
  };

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(OnSend)}>
      <Stack
        spacing={4}
        alignItems="center"
        sx={{
          mt: 6,
          mr: { xs: 1, lg: 5 },
          ml: { xs: 1, lg: 5 },
          pt: 3,
          borderRadius: 2,
          minHeight: '650px',
          boxShadow: (theme) => theme.customShadows.z24,
        }}
      >
        <Grid container sx={{ pt: 3, pb: 3 }}>
          <Grid item xs sm md lg />
          {user?.userType === 2 ? ProPlus() : Enterprise()}
          <Grid item xs sm md lg />
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent={{ md: 'space-between', xs: 'center', sm: 'space-between' }}
          alignItems="center"
          marginTop={6}
          sm={10}
          xs={10}
          md={7}
        >
          <Grid item>
            <Button
              variant="contained"
              sx={{
                fontSize: '16px',
                letterSpacing: '1px',
                width: '220px',
                fontWeight: 'bold',
                fontFamily: 'Poppins',
              }}
              style={{ backgroundColor: '#1FA9FF' }}
              onClick={() => navigate(PATH_ONBOARDING.onboarding.selectfencesp)}
            >
              Skip For Now
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                fontSize: '16px',
                letterSpacing: '1px',
                width: '220px',
                fontFamily: 'Poppins',
              }}
              style={{ backgroundColor: '#1FA9FF' }}
              type="submit"
            >
              Send And Continue
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </FormProvider>
  );
}

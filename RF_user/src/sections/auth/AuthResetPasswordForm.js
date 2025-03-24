import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { forgotPassword } from '../../redux/actions/authAction';

import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    sessionStorage.setItem('email-recovery', data.email);
    localStorage.setItem('registerEmail', data.email);
    dispatch(forgotPassword(data.email.toLowerCase(), navigate, SnackBar, reset));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3, mb: 5, backgroundColor: '#1FA9FF !important' }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}

import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { Link, Typography } from '@mui/material';

// routes
import { PATH_AUTH } from '../../routes/paths';

// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';

// sections
import AuthVerifyCodeForm from '../../sections/auth/AuthVerifyCodeForm';

// assets
import { EmailInboxIcon } from '../../assets/icons';
import { resend, verify } from '../../redux/actions/authAction';
import { EMAIL_TYPE } from '../../assets/data/roles';

// ----------------------------------------------------------------------

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };

  const resendCode = () => {
    dispatch(resend(SnackBar));
  };

  const email = localStorage.getItem('registerEmail');

  const onhandleSubmit = async (code, reset) => {
    // call api
    const formData = {
      code,
      email,
      emailType: EMAIL_TYPE.SIGNUP_EMAIL,
    };
    dispatch(verify(formData, navigate, SnackBar, reset));
  };

  return (
    <>
      <EmailInboxIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Please check your email!
      </Typography>

      <AuthVerifyCodeForm onhandleSubmit={onhandleSubmit} />

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        <Typography variant="body2" sx={{ my: 3 }}>
          Don&apos;t have a code? &nbsp;
          <Link variant="subtitle2" onClick={resendCode} className="cursor-pointer">
            Resend code to {email}
          </Link>
        </Typography>

        <Link
          component={RouterLink}
          to={PATH_AUTH.login}
          color="inherit"
          variant="subtitle2"
          sx={{
            mx: 'auto',
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Iconify icon="eva:chevron-left-fill" width={16} />
          Return to sign in
        </Link>
      </Typography>
    </>
  );
}

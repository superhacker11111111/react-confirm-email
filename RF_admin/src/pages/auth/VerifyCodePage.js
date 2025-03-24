import { Link as RouterLink } from 'react-router-dom';
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
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function VerifyCodePage() {
  const { enqueueSnackbar } = useSnackbar();
  const { resend, verify } = useAuthContext();

  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };

  const onhandleSubmit = () => {
    resend(localStorage.getItem('current'), SnackBar);
  };
  return (
    <>
      <EmailInboxIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Please check your email!
      </Typography>

      <AuthVerifyCodeForm onVerify={verify} />

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        <Typography variant="body2" sx={{ my: 3 }}>
          Don’t have a code? &nbsp;
          <Link variant="subtitle2" onClick={onhandleSubmit}>
            Resend code
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

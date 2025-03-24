import { Helmet } from 'react-helmet-async';
// sections
import AuthChangePasswordForm from '../../sections/auth/AuthChangePasswordForm';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function ChangePasswordPage() {
  return (
    <>
      <Helmet>
        <title> Change Password | RealityFence</title>
      </Helmet>

      <AuthChangePasswordForm />
    </>
  );
}

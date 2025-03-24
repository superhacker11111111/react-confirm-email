// layouts
import AuthLayout from '../../layouts/auth';
//
import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <AuthLayout>
      <AuthLoginForm />
    </AuthLayout>
  );
}

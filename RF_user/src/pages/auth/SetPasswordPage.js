import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
// sections
import SetPassword from '../../sections/auth/SetPassword';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function SetPasswordPage() {
  // const token = new URLSearchParams(useLocation().search).get('token');
  const { token } = useParams();
  const { email } = jwtDecode(token);
  return (
    <>
      <Helmet>
        <title> SetPassword | RealityFence</title>
      </Helmet>

      <SetPassword email={email} />
    </>
  );
}

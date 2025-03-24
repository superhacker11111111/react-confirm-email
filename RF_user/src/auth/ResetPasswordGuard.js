import PropTypes from 'prop-types';
import { Navigate, useParams } from 'react-router-dom';
// routes
import { PATH_AUTH } from '../routes/paths';
import { isValidToken } from './utils';

// ----------------------------------------------------------------------

ResetPasswordGuard.propTypes = {
  children: PropTypes.node,
};

export default function ResetPasswordGuard({ children }) {
  const recovery_email = sessionStorage.getItem('email-recovery');
  const token = localStorage.getItem('accessToken');

  if (isValidToken(token)) {
    return <Navigate to={PATH_AUTH.login} />;
  }

  return <> {children} </>;
}

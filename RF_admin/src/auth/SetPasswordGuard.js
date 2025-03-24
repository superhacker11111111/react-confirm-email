import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
// routes
import { PATH_AUTH } from '../routes/paths';
// components
import LoadingScreen from '../components/loading-screen';
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

SetPasswordGuard.propTypes = {
  children: PropTypes.node,
};

export default function SetPasswordGuard({ children }) {
  const { isInitialized } = useAuthContext();
  const token = new URLSearchParams(useLocation().search).get('token');

  if (!token) {
    return <Navigate to={PATH_AUTH.login} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}

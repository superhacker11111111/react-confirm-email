import PropTypes from 'prop-types';
import { Navigate, useParams } from 'react-router-dom';
// routes
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------

SetPasswordGuard.propTypes = {
  children: PropTypes.node,
};

export default function SetPasswordGuard({ children }) {
  const { token } = useParams();

  if (!token) {
    return <Navigate to={PATH_AUTH.login} />;
  }

  return <> {children} </>;
}

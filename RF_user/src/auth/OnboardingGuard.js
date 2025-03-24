import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// routes
import { PATH_PAGE } from '../routes/paths';
// components
import LoadingScreen from '../components/loading-screen';
import { ALLOWED_SUBSCRIPTION_STATUS } from '../assets/data/roles';

// ----------------------------------------------------------------------

OnboardingGuard.propTypes = {
  children: PropTypes.node,
};

export default function OnboardingGuard({ children }) {
  const { user, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!user || (user && ALLOWED_SUBSCRIPTION_STATUS.indexOf(user.subscription_status) < 0)) {
    return (
      <Navigate
        to={sessionStorage.getItem('priceId') ? PATH_PAGE.checkout_v2 : PATH_PAGE.getstarted}
      />
    );
  }

  return <> {children} </>;
}

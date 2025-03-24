import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Box } from '@mui/material';
import { initialize } from '../../redux/actions/authAction';
import {
  // setFavour,
  // setRemoved,
  // setRequest,
  // setSelected,
  requestProductList,
} from '../../redux/slices/product';
import useResponsive from '../../hooks/useResponsive';
// components
import { useSettingsContext } from '../../components/settings';
//
import Main from './Main';
import Header from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
import NavHorizontal from './nav/NavHorizontal';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext();
  const dispatch = useDispatch();
  const stripePromise = loadStripe(
    'pk_test_51NC2yeHUZOYcp0t3CYbstLijbMfnuRMdyLOdH4ZY0Npyu3qJizfwmae0QB6sEmOWVJB5yBVBCsywim4xG46lEzt700spnHGTyi'
  );

  const { user } = useSelector((state) => state.auth);
  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!hasFetched) {
      localStorage.removeItem('pageType');
      dispatch(initialize());
      if (user?.id) {
        dispatch(requestProductList(user?.id, user?.userType));

        // dispatch(setSelected([]));
        // dispatch(setFavour([]));
        // dispatch(setRemoved([]));
        // dispatch(setRequest([]));
        setHasFetched(true);
      }
    }
  }, [dispatch, user?.id, user?.userType, hasFetched]);

  const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} />;

  if (isNavHorizontal) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        {isDesktop ? <NavHorizontal /> : renderNavVertical}

        <Main>
          <Elements stripe={stripePromise}>
            <Outlet />
          </Elements>
        </Main>
      </>
    );
  }

  if (isNavMini) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {isDesktop ? <NavMini /> : renderNavVertical}
          <Main>
            <Elements stripe={stripePromise}>
              <Outlet />
            </Elements>
          </Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={handleOpen} />

      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}
        <Main>
          <Elements stripe={stripePromise}>
            <Outlet />
          </Elements>
        </Main>
      </Box>
    </>
  );
}

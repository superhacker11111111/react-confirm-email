import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, AppBar, Toolbar, Slider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// config
import { HEADER, NAV } from '../../../config-global';
import { Header1, Header2 } from './config-header';
// components
import { useSettingsContext } from '../../../components/settings';
// import { UserType } from '../../../assets/data/roles';
import { getSubscription } from '../../../redux/slices/subscription';
// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { themeLayout } = useSettingsContext();
  const { user } = useSelector((state) => state.auth);
  const { user_on } = useSelector((state) => state.users);
  const plan = user_on ? user_on.plan.chatAt(0) : user.plan.charAt(0);
  const { subscription } = useSelector((state) => state.subscription);
  const [value, setValue] = useState(0);
  const [headConfig, setHeadConfig] = useState(Header1);
  const isNavMini = themeLayout === 'mini';
  const isNavHorizontal = themeLayout === 'horizontal';
  const isDesktop = useResponsive('up', 'lg');
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/selectfencesp') {
      setValue(0);
    }
    if (location.pathname === '/categoryfences') {
      setValue(25);
    }
    if (location.pathname === '/download') {
      setValue(68);
    }
    if (location.pathname === '/tutorial') {
      setValue(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (user && user.plan) {
      dispatch(getSubscription(user.plan));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // useEffect(() => {
  //   if (subscription && subscription.requestAvailable) {
  //     setHeadConfig(Header2);
  //   }
  // }, [subscription]);

  const renderContent = (
    <>
      {isDesktop && (
        <div className="w-full">
          <div className="flex justify-between w-full ">
            {Header1.map((index) => (
              <p className="text-[#000000] text-[25px] font-bold " key={index}>
                {index}
              </p>
            ))}
          </div>
          <Stack direction="row" width={1} sx={{ px: 5 }}>
            <Slider
              disabled
              size="middle"
              style={{ color: '#1FA9FF' }}
              value={value}
              onChange={handleChange}
              aria-labelledby="continuous-slider"
            />
          </Stack>
        </div>
      )}

      {!isDesktop && (
        <Stack direction="row" width={1}>
          <Slider
            disabled
            size="middle"
            style={{ color: '#1FA9FF' }}
            value={value}
            onChange={handleChange}
            aria-labelledby="continuous-slider"
          />
        </Stack>
      )}
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        bgcolor: 'white',

        ...(isDesktop && {
          height: HEADER.H_DASHBOARD_DESKTOP,

          ...(isNavHorizontal && {
            width: 1,
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        <div className="w-full col">{renderContent}</div>
      </Toolbar>
    </AppBar>
  );
}

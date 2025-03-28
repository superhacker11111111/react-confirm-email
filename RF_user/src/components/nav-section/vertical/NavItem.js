import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Tooltip, Link, ListItemText } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
// auth
import RoleBasedGuard from '../../../auth/RoleBasedGuard';
import {
  requestProductList,
  setRemoved,
  setRequestSwapper,
  setCurrentSelectedFences,
} from '../../../redux/slices/product';
import { getSubscription } from '../../../redux/slices/subscription';
//
import Iconify from '../../iconify';
//
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';
import { PATH_ONBOARDING } from '../../../routes/paths';

// ----------------------------------------------------------------------

NavItem.propTypes = {
  open: PropTypes.bool,
  active: PropTypes.bool,
  item: PropTypes.object,
  depth: PropTypes.number,
  isExternalLink: PropTypes.bool,
};

export default function NavItem({ item, depth, open, active, isExternalLink, ...other }) {
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { title, path, icon, info, children, disabled, caption, roles } = item;
  const subItem = depth !== 1;

  const renderContent = (
    <StyledItem depth={depth} active={active} disabled={disabled} caption={!!caption} {...other}>
      {icon && <StyledIcon>{icon}</StyledIcon>}

      {subItem && (
        <StyledIcon>
          <StyledDotIcon active={active && subItem} />
        </StyledIcon>
      )}

      <ListItemText
        primary={translate(title)}
        secondary={
          caption && (
            <Tooltip title={translate(caption)} placement="top-start">
              <span>{translate(caption)}</span>
            </Tooltip>
          )
        }
        primaryTypographyProps={{
          noWrap: true,
          component: 'span',
          variant: active ? 'subtitle2' : 'body2',
          style: {
            color: '#68718B',
          },
        }}
        secondaryTypographyProps={{
          noWrap: true,
          variant: 'caption',
        }}
      />

      {info && (
        <Box component="span" sx={{ lineHeight: 0 }}>
          {info}
        </Box>
      )}

      {!!children && (
        <Iconify
          width={16}
          icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
          sx={{ ml: 1, flexShrink: 0 }}
        />
      )}
    </StyledItem>
  );

  const fenceSwapper = () => {
    if (user) {
      dispatch(requestProductList(user.id));
      dispatch(getSubscription(user.plan));
      dispatch(setRemoved([]));
      dispatch(setRequestSwapper([]));
      dispatch(setCurrentSelectedFences([]));
      navigate(PATH_ONBOARDING.onboarding.fenceSwapper);
    }
  };

  const renderItem = () => {
    // ExternalLink
    if (isExternalLink)
      return (
        <Link href={path} target="_blank" rel="noopener" underline="none">
          {renderContent}
        </Link>
      );

    // Has child
    if (children) {
      return renderContent;
    }

    // if the title is "Finish Onboarding",we need to get the fence list
    if (title === 'Fence Swapper') {
      return (
        <Link underline="none" onClick={fenceSwapper}>
          {renderContent}
        </Link>
      );
    }

    // Default
    return (
      <Link component={RouterLink} to={path} underline="none">
        {renderContent}
      </Link>
    );
  };

  return <RoleBasedGuard roles={roles}> {renderItem()} </RoleBasedGuard>;
}

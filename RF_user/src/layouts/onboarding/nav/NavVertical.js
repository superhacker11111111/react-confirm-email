import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Drawer } from '@mui/material';
import {TreeView, TreeItem} from '@mui/x-tree-view'
// hooks
import useResponsive from '../../../hooks/useResponsive';
// config
import { NAV } from '../../../config-global';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
//
import { navConfig2 } from './config-navigation';

// ----------------------------------------------------------------------

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
const StyledTreeView = styled(TreeView)({
  height: 240,
  flexGrow: 1,
  maxWidth: 400,
});
export default function NavVertical({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        marginTop: { xs: 0, sm: 0, md: 0, lg: '260px' },
        marginLeft: '16px',
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <p className="text-[30px] pl-5">Categories</p>
      <StyledTreeView
        sx={{
          mt: 1,
          pl: 4,
          '& .MuiTreeItem-label': {
            fontSize: '20px',
          },
        }}
        multiSelect
        defaultCollapseIcon={<Iconify icon="eva:chevron-down-fill" />}
        defaultExpandIcon={<Iconify icon="eva:chevron-right-fill" />}
        defaultEndIcon={null}
      >
        {navConfig2?.map((level1, index) => (
          <TreeItem nodeId={index.toString()} key={index} label={level1.title} sx={{}}>
            {level1.children.map((level2, listIndex) => (
              <TreeItem key={listIndex} nodeId={level2.title} label={level2.title} depth={1}>
                {level2.children?.map((level3, inx) => (
                  <TreeItem key={inx} nodeId={level3.title} label={level3.title} />
                ))}
              </TreeItem>
            ))}
          </TreeItem>
        ))}
        {/* <NavSectionVertical data={userConfig} /> */}
      </StyledTreeView>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              zIndex: 0,
              width: NAV.W_DASHBOARD,
              // marginTop: '325px',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}
        >
          <div className="mt-[30px]">{renderContent}</div>
        </Drawer>
      )}
    </Box>
  );
}

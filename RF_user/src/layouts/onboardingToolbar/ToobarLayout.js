import { Outlet } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
//
import Main from './Main';
import Toolbar from './toolbar/SwapperToolbar';

// ----------------------------------------------------------------------

export default function ToolbarLayout() {
  return (
    <div className="flex flex-col">
      <div className="w-full fixed z-10">
        <Toolbar sx={{ width: '100%' }} />
      </div>
      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        <Main>
          <Outlet />
        </Main>
      </Box>
    </div>
  );
}

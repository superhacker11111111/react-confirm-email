// @mui
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledRoot = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '60%',
  margin: 'auto',
  gap: 40,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    width: '100%',
  },
  [theme.breakpoints.down('lg')]: {
    width: '80%',
  },
}));

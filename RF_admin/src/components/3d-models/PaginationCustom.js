import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Stack,
  Switch,
  TablePagination,
  FormControlLabel,
  Grid,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

PaginationCustom.propTypes = {
  rowsSortByOptions: PropTypes.arrayOf(PropTypes.string),
  sx: PropTypes.object,
};

export default function PaginationCustom({ rowsSortByOptions = [5, 10, 25], sx, ...other }) {
  return (
    <Grid container direction="row" spacing={3} alignItems="center">
      <Grid item>
        <Typography variant="subtitle1">Page &nbsp;&nbsp;&nbsp; 10 of 11</Typography>
      </Grid>
      <Grid item sx={{ display: 'flex', flexDirection: 'row' }}>
        <Iconify icon="eva:arrow-ios-back-fill" />
        <Iconify icon="eva:arrow-ios-forward-outline" />
      </Grid>
    </Grid>
  );
}

import PropTypes from 'prop-types';
// @mui
import { Grid, Typography, Select, MenuItem, Button } from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

PaginationCustom.propTypes = {
  sx: PropTypes.object,
  onHandleChange: PropTypes.func,
  onFilterChange: PropTypes.func,
  filter: PropTypes.string,
};

export default function PaginationCustom({ filter, onHandleChange, onFilterChange, sx, ...other }) {
  return (
    <Grid container direction="row" spacing={3} alignItems="center">
      <Grid item>
        <Select
          value={filter}
          onChange={(event) => {
            onFilterChange(event.target.value);
            onHandleChange({
              filter: event.target.value,
            });
          }}
        >
          <MenuItem value="current">Current Assets</MenuItem>
          <MenuItem value="all">All Assets</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
}

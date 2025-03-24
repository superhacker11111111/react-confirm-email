import PropTypes from 'prop-types';
// @mui
import { TextField, InputAdornment } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

FileFilterBox.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function FileFilterBox({ filterName, onFilterName }) {
  return (
    <TextField
      size="small"
      value={filterName}
      onChange={onFilterName}
      style={{ width: '94%', boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.1)' }}
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />
  );
}

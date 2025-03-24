import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../../components/iconify';

// ----------------------------------------------------------------------

ShopperTabletoolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterCountry: PropTypes.string,
  filterState: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterCountry: PropTypes.func,
  onFilterState: PropTypes.func,
  onResetFilter: PropTypes.func,
  optionsSubscription: PropTypes.arrayOf(PropTypes.object),
  countries: PropTypes.array,
  states: PropTypes.array,
};

export default function ShopperTabletoolbar({
  isFiltered,
  filterName,
  filterCountry,
  filterState,
  optionsSubscription,
  onFilterName,
  onFilterCountry,
  onFilterState,
  onResetFilter,
  countries,
  states,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        select
        label="Country"
        value={filterCountry}
        onChange={onFilterCountry}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        <MenuItem
          key="all"
          value="all"
          sx={{
            mx: 1,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
          }}
        >
          all
        </MenuItem>
        {countries &&
          countries.length > 0 &&
          countries.map((country, index) => (
            <MenuItem
              key={index}
              value={country}
              sx={{
                mx: 1,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {country}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        fullWidth
        select
        label="State"
        value={filterState}
        onChange={onFilterState}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        <MenuItem
          key="all"
          value="all"
          sx={{
            mx: 1,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
          }}
        >
          all
        </MenuItem>
        {states &&
          states.length > 0 &&
          states.map((state, index) => (
            <MenuItem
              key={index}
              value={state}
              sx={{
                mx: 1,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {state}
            </MenuItem>
          ))}
      </TextField>

      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}

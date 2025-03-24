import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';

import { defaultCountries, FlagEmoji, parseCountry } from 'react-international-phone';
// @mui
import { MenuItem, TextField, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

RHFCountryDialcodeSelect.propTypes = {
  name: PropTypes.string,
  native: PropTypes.bool,
  children: PropTypes.node,
  helperText: PropTypes.node,
  maxHeight: PropTypes.number,
};

export default function RHFCountryDialcodeSelect({
  name,
  native,
  children,
  helperText,
  maxHeight = 220,
  ...other
}) {
  const { control } = useFormContext();

  const countriesData = defaultCountries.map((c) => parseCountry(c));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          sx={{
            width: '160px',
            marginRight: '8px',
          }}
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!native && {
                    px: 1,
                    maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                    '& .MuiMenuItem-root': {
                      px: 1,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                    },
                  }),
                },
              },
            },
            renderValue: (renderValue) => (
              <Stack flexDirection="row" alignItems="center">
                <FlagEmoji iso2={renderValue} style={{ display: 'flex', marginRight: '8px' }} />
                <Typography color="gray">
                  +{countriesData.filter((c) => c.iso2 === renderValue)[0].dialCode}
                </Typography>
              </Stack>
            ),
            sx: { textTransform: 'capitalize' },
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {countriesData.map((countryData) => (
            <MenuItem key={countryData.iso2} value={countryData.iso2}>
              <Stack flexDirection="row" alignItems="center">
                <FlagEmoji iso2={countryData.iso2} style={{ marginRight: '8px' }} />
                <Typography marginRight="8px">{countryData.name}</Typography>
                <Typography color="gray">+{countryData.dialCode}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

import { InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  defaultCountries,
  FlagEmoji,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

const MuiPhone = forwardRef(({ value, onChange, ...restProps }, ref) => {
  const { phone, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    defaultCountry: 'us',
    value,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  return (
    <TextField
      ref={ref}
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={phone}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ marginRight: '2px', marginLeft: '-8px' }}>
            <Select
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: 'max-content',
                // Remove default outline (display only on focus)
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                // Update default spacing
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                },
              }}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              renderValue={(renderValue) => (
                <FlagEmoji iso2={renderValue} style={{ display: 'flex' }} />
              )}
            >
              {defaultCountries.map((c) => {
                const countryData = parseCountry(c);
                return (
                  <MenuItem key={countryData.iso2} value={countryData.iso2}>
                    <FlagEmoji iso2={countryData.iso2} style={{ marginRight: '8px' }} />
                    <Typography marginRight="8px">{countryData.name}</Typography>
                    <Typography color="gray">+{countryData.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
});

MuiPhone.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default MuiPhone;

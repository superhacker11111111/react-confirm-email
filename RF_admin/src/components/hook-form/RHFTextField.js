import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFTextField({ name, helperText, ...other }) {
  const { control } = useFormContext();
  const formatValue = (value) => {
    if (typeof value === 'number') {
      // Check if the number has decimal places
      const isDecimal = value % 1 !== 0;

      if (isDecimal) {
        // Format the number with 2 decimal places
        return value.toFixed(2);
      }
      // Return the number as is
      return value.toString();
    }
    return value;
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={
            typeof field.value === 'number' && field.value === 0 ? '' : formatValue(field.value)
          }
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}

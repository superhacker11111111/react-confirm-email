import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
import MuiPhone from '../phone-number/index';

// ----------------------------------------------------------------------

RHFPhoneNumber.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFPhoneNumber({ name, helperText, ...other }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiPhone
          {...field}
          fullWidth
          value={field.value}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}

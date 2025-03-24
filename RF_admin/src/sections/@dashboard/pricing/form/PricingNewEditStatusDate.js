// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, TextField, MenuItem } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['popular', 'normal'];
const LICENCES_OPTIONS = ['BAISC', 'PROFFESIONAL', 'ENTERPRISE'];
// ----------------------------------------------------------------------

export default function PricingNewEditStatusDate(props) {
  const { control, watch } = useFormContext();

  const values = watch();

  // console.log(props.test_props);

  // const handleChange = () => {
  //   props.setTitle({});
  // };

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <RHFSelect fullWidth name="Licences" label="Licences" InputLabelProps={{ shrink: true }}>
        {LICENCES_OPTIONS.map((index) => (
          <MenuItem key={index} value={index}>
            {index}
          </MenuItem>
        ))}
      </RHFSelect>
      <RHFTextField
        // disabled
        name="Price"
        label="Price"
        // value={`INV-${values.PricingNumber}`}
        // value="$300"
      />
      <RHFTextField
        // disabled
        name="Comment"
        label="Comment"
        // value={`INV-${values.PricingNumber}`}
        // value="Saving $24 a year"
      />

      <RHFSelect fullWidth name="status" label="Status" InputLabelProps={{ shrink: true }}>
        {STATUS_OPTIONS.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </RHFSelect>
    </Stack>
  );
}

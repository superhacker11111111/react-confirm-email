import PropTypes from 'prop-types';
// @mui
import { Typography, TextField, Stack } from '@mui/material';

// ----------------------------------------------------------------------
PaymentBillingAddress.propTypes = {
  event: PropTypes.bool,
  handleEvent: PropTypes.func,
};

export default function PaymentBillingAddress({ handleEvent, event }) {
  return (
    <div>
      <Typography variant="h6">Billing Address</Typography>

      <Stack spacing={3} mt={5}>
        <TextField
          fullWidth
          label="Country"
          onChange={(e) => handleEvent('country', e.target.value)}
        />
        <TextField fullWidth label="State" onChange={(e) => handleEvent('state', e.target.value)} />
        <TextField
          fullWidth
          label="ZipCode"
          onChange={(e) => handleEvent('zipcode', e.target.value)}
        />
        <TextField
          fullWidth
          label="Address"
          onChange={(e) => handleEvent('address', e.target.value)}
        />
      </Stack>
    </div>
  );
}

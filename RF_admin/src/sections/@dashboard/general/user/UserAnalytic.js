import PropTypes from 'prop-types';
// @mui
import { Stack, Typography, Box } from '@mui/material';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

UserAnalytic.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  color: PropTypes.string,
  price: PropTypes.number,
  total: PropTypes.number,
};

export default function UserAnalytic({ title, total, icon, color, price }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 200 }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
        <Iconify icon={icon} width={50} sx={{ color }} />
      </Stack>

      <Stack spacing={0.5} sx={{ ml: 2 }}>
        <Typography variant="h6">{title}</Typography>

        <Typography variant="subtitle2">
          {fShortenNumber(total) ? fShortenNumber(total) : '0'}{' '}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            users
          </Box>
        </Typography>

        <Typography variant="subtitle2" sx={{ color }}>
          {fCurrency(price)}
        </Typography>
      </Stack>
    </Stack>
  );
}

import PropTypes from 'prop-types';
// @mui
import { Typography, Box, Stack } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// components

// ----------------------------------------------------------------------

ModelWidget.propTypes = {
  sx: PropTypes.object,
  color: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function ModelWidget({ title, total, color = 'primary', sx, ...other }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{
        p: 3,
        borderRadius: 2,
        color: 'common.black',
        bgcolor: `${color}.white`,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ ml: 3 }}>
        <Typography variant="h3">{title}</Typography>
        <Typography variant="h4" sx={{ opacity: 0.72 }}>
          {' '}
          {fNumber(total)} Models
        </Typography>
      </Box>
    </Stack>
  );
}

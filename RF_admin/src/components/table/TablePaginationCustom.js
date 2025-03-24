import PropTypes from 'prop-types';
// @mui
import { Box, Switch, TablePagination, FormControlLabel, Button } from '@mui/material';

// ----------------------------------------------------------------------

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  onSelectedDelete: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  onSelectedDelete,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...other
}) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent={onChangeDense || onSelectedDelete ? 'space-between' : 'end'}
      alignItems="center"
      sx={{ ...sx, border: '1px solid #e5e8eb' }}
    >
      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            position: {
              sm: 'absolute',
            },
          }}
        />
      )}

      {onSelectedDelete && (
        <Button
          variant="contained"
          sx={{
            ml: 2,
          }}
          onClick={onSelectedDelete}
        >
          Delete Selected
        </Button>
      )}
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        style={{ border: '0px' }}
      />
    </Box>
  );
}

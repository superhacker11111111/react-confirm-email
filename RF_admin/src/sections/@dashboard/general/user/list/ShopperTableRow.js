import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  Button,
  Modal,
  Box,
  useMediaQuery,
} from '@mui/material';

import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ShopperTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function ShopperTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    fullName,
    phoneNumber,
    email,
    address1,
    city,
    state,
    zipCode,
    avatarUrl,
    status,
    interestLevel,
  } = row;
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="left" spacing={2}>
            <Avatar
              sx={{ bgcolor: 'orange' }}
              alt={fullName}
              src={avatarUrl ? avatarUrl.preview : '/avatar.jpg'}
            />
            {/* <Typography variant="subtitle2" noWrap> */}
            <Button onClick={() => setOpen(true)} noWrap>
              {fullName}
            </Button>
            {/* </Typography> */}
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {phoneNumber}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {email}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap  sx={{ textTransform: 'capitalize' }}>
            {address1}, {state} {zipCode}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Label color={status ? 'success' : 'error'}>{status ? 'Active' : 'Ended'}</Label>
        </TableCell>
      </TableRow>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: isMobile ? '45%' : '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '300px' : '500px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          <Iconify
            icon="eva:close-circle-fill"
            color="#39b2ff"
            sx={{ position: 'absolute', right: '16px', top: '16px' }}
            onClick={handleClose}
          />
          <Stack>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {fullName}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, textTransform: 'uppercase' }}>
              Address
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 100 }}>
              {address1}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 100 }}>
              {city}, {state} {zipCode}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, textTransform: 'uppercase' }}>
              Email
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 100 }}>
              {email}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, textTransform: 'uppercase' }}>
              Phone
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 100 }}>
              {phoneNumber}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, textTransform: 'uppercase' }}>
              Interest Level
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 100 }}>
              {interestLevel}
            </Typography>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

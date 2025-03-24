import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
// @mui
import { Stack, Avatar, Checkbox, TableRow, TableCell, Typography, Link } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Label from '../../../../../components/label';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { SUBSCRIPTION_STATUS } from '../../../../../assets/data/roles';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

CompanyTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function CompanyTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    id,
    company,
    primarycontact,
    referralname,
    subscription,
    status,
    implementation,
    avatarUrl,
  } = row;
  const navigate = useNavigate();

  console.log('status :>> ', status);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{ bgcolor: 'orange' }}
            alt={company}
            src={avatarUrl ? avatarUrl.preview : '/avatar.jpg'}
          />
          <Typography variant="subtitle2" noWrap>
            <Link
              onClick={() => {
                localStorage.setItem('companyId', id);
                navigate(PATH_DASHBOARD.general.user.account);
              }}
            >
              {company}
            </Link>
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {primarycontact}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {referralname || ''}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <Typography variant="subtitle2" noWrap>
          {subscription}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="subtitle2" noWrap>
          {implementation ? (
            <CheckCircleOutlineIcon color="success" />
          ) : (
            <AccessTimeIcon color="warning" />
          )}
        </Typography>
      </TableCell>

      <TableCell align="left">
        {status === SUBSCRIPTION_STATUS.ACTIVE && <Label color="success">{status}</Label>}
        {(status === SUBSCRIPTION_STATUS.PAUSE || status === SUBSCRIPTION_STATUS.TRIAL) && (
          <Label color="warning">{status}</Label>
        )}
        {status === SUBSCRIPTION_STATUS.CANCELLED && <Label color="error">{status}</Label>}
        {status === SUBSCRIPTION_STATUS.NO_SUBSCRIPTION && (
          <Label sx={{ backgroundColor: 'grey', color: 'white' }}>{status}</Label>
        )}
      </TableCell>
    </TableRow>
  );
}

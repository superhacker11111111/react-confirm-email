import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Chip,
  Typography,
  Link,
} from '@mui/material';
import moment from 'moment';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

AssetRequestTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function AssetRequestTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { id, company, primarycontact, date, requested, avatarUrl } = row;
  const navigate = useNavigate();
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
          <Link
            component={RouterLink}
            to={PATH_DASHBOARD.general.assetRequest.edit(paramCase(id))}
            color="black"
          >
            {company}
          </Link>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          <Link
            component={RouterLink}
            to={PATH_DASHBOARD.general.assetRequest.edit(paramCase(id))}
            color="black"
          >
            {primarycontact}
          </Link>
        </Typography>
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {moment(date).format('M/D/YYYY')}
      </TableCell>

      <TableCell align="center">
        <Link
          component={RouterLink}
          to={PATH_DASHBOARD.general.assetRequest.edit(paramCase(id))}
          color="black"
        >
          {requested}
        </Link>
      </TableCell>

      <TableCell align="center">
        <Chip
          variant="filled"
          clickable
          label="Add Files"
          color="secondary"
          onClick={() => {
            localStorage.setItem('companyId', row.id);
            navigate(PATH_DASHBOARD.general.file);
          }}
        />
      </TableCell>
    </TableRow>
  );
}

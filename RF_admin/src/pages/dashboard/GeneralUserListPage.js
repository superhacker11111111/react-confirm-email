import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import queryString from 'query-string';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
// Locales
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { deleteUsers, getCompanies } from '../../redux/slices/user';
import { getSubscriptions } from '../../redux/slices/subscription';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from '../../components/table';

import { CompanyTableRow, CompanyTabletoolbar } from '../../sections/@dashboard/general/user/list';
import { useSnackbar } from '../../components/snackbar';
import { SUBSCRIPTION_STATUS } from '../../assets/data/roles';
import UserAnalytic from '../../sections/@dashboard/general/user/UserAnalytic';
import { PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'company', label: 'Company', align: 'left' },
  { id: 'name', label: 'Primary Contact', align: 'left' },
  { id: 'referralName', label: 'Affiliate ', align: 'left' },
  { id: 'subscription', label: 'Subscription', align: 'left' },
  { id: 'implementation', label: 'Implementation', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
];

// ----------------------------------------------------------------------

export default function GeneralUserPage() {
  const theme = useTheme();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'company',
    defaultOrder: 'asc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)');

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const { companies, companyCount, isloading } = useSelector((state) => state.user);
  const { subscriptions } = useSelector((state) => state.subscription);

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterName, setFilterName] = useState('');

  const [filterSubscription, setFilterSubscription] = useState('all');

  useEffect(() => {
    handleTableEvent();
    dispatch(getSubscriptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (companies) setTableData(companies);
    else setTableData([]);
  }, [companies]);

  const denseHeight = dense ? 52 : 72;

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: companyCount.dataCount },
    {
      value: SUBSCRIPTION_STATUS.ACTIVE,
      label: 'Active',
      color: 'success',
      count: companyCount.active,
    },
    {
      value: SUBSCRIPTION_STATUS.PAUSE,
      label: 'Paused',
      color: 'warning',
      count: companyCount.pause,
    },
    {
      value: SUBSCRIPTION_STATUS.CANCELLED,
      label: 'Cancelled',
      color: 'error',
      count: companyCount.cancelled,
    },
  ];

  const isFiltered = filterName !== '' || filterSubscription !== 'all' || filterStatus !== 'all';

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
    handleTableEvent({
      pageSize: rowsPerPage,
      pageNumber: 0,
      sortOrder: order,
      sortField: orderBy,
      subscription_status: newValue,
      subscription: filterSubscription,
      keyword: filterName,
    });
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    handleTableEvent({
      pageSize: rowsPerPage,
      pageNumber: 0,
      sortOrder: order,
      sortField: orderBy,
      subscription_status: filterStatus,
      subscription: filterSubscription,
      keyword: event.target.value,
    });
  };

  const handleFilterSubscription = (event) => {
    setPage(0);
    setFilterSubscription(event.target.value);
    handleTableEvent({
      pageSize: rowsPerPage,
      pageNumber: 0,
      sortOrder: order,
      sortField: orderBy,
      subscription_status: 'all',
      subscription: event.target.value,
      keyword: '',
    });
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterSubscription('all');
    setFilterStatus('all');
    handleTableEvent({
      pageSize: rowsPerPage,
      pageNumber: 0,
      sortOrder: order,
      sortField: orderBy,
      subscription_status: 'all',
      subscription: 'all',
      keyword: '',
    });
  };

  const handleDeleteRows = async (selectedRows) => {
    await dispatch(deleteUsers({ ids: selectedRows }));
    await handleTableEvent();
    await enqueueSnackbar('The selected users were deleted succesfully!', { variant: 'success' });
    await setSelected([]);
  };

  const handleTableEvent = (search) => {
    const searchParams = {
      pageSize: rowsPerPage,
      pageNumber: page,
      sortOrder: order,
      sortField: orderBy,
      subscription_status: filterStatus,
      subscription: filterSubscription,
      keyword: filterName,
    };
    const params = queryString.stringify(search || searchParams);
    dispatch(getCompanies(params));
  };

  return (
    <>
      <Helmet>
        <title> User: List | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" gap={1}>
          <Typography variant="h4">User Overview</Typography>
          <Button
            sx={{ maxWidth: '350px' }}
            variant="contained"
            onClick={() => navigate(PATH_DASHBOARD.general.user.shopperlist)}
          >
            To Shopper Accounts
          </Button>
        </Stack>
        <Card sx={{ mb: 2, mt: 2 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <UserAnalytic
                title="All User"
                total={Number(companyCount.totalCount)}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />

              <UserAnalytic
                title="Active"
                total={Number(companyCount.allActive)}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />

              <UserAnalytic
                title="Paused"
                total={Number(companyCount.allPause)}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />

              <UserAnalytic
                title="Canceled"
                total={Number(companyCount.allCancelled)}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Typography variant="h4">Manage Users</Typography>
        <Card sx={{ mt: 2 }}>
          <Tabs
            value={filterStatus}
            onChange={(event, newValue) => {
              handleFilterStatus(event, newValue);
              handleTableEvent({
                pageSize: rowsPerPage,
                pageNumber: 0,
                sortOrder: order,
                sortField: orderBy,
                subscription_status: newValue,
                subscription: filterSubscription,
                keyword: filterName,
              });
            }}
            sx={{
              px: 2,
              bgcolor: 'white',
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <CompanyTabletoolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterSubscription={filterSubscription}
            optionsSubscription={subscriptions}
            onFilterName={handleFilterName}
            onFilterSubscription={handleFilterSubscription}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={(id) => {
                    onSort(id);
                    const isAsc = orderBy === id && order === 'asc';
                    if (id !== '') {
                      handleTableEvent({
                        pageSize: rowsPerPage,
                        pageNumber: page,
                        filter: filterStatus,
                        sortOrder: isAsc ? 'desc' : 'asc',
                        sortField: id,
                        subscription_status: filterStatus,
                        subscription: filterSubscription,
                        keyword: filterName,
                      });
                    }
                  }}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {(isloading ? [...Array(rowsPerPage)] : tableData).map((row, index) =>
                    row ? (
                      <CompanyTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                      />
                    ) : (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={Number(companyCount.dataCount)}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, newPage) => {
              onChangePage(event, newPage);
              handleTableEvent({
                pageSize: rowsPerPage,
                sortOrder: order,
                sortField: orderBy,
                pageNumber: newPage,
                subscription_status: filterStatus,
                subscription: filterSubscription,
                keyword: filterName,
              });
            }}
            onRowsPerPageChange={(event, newPage) => {
              onChangeRowsPerPage(event, newPage);
              handleTableEvent({
                pageNumber: 0,
                subscription_status: filterStatus,
                subscription: filterSubscription,
                keyword: filterName,
                sortOrder: order,
                sortField: orderBy,
                pageSize: parseInt(event.target.value, 10),
              });
            }}
          />
        </Card>
        <Typography variant="h4" mt={5}>
          Add New Users
        </Typography>
        <Button
          variant="contained"
          sx={{ fontSize: '16px', py: 1, px: 10 }}
          onClick={() => {
            navigate(PATH_DASHBOARD.general.user.newCompany);
          }}
        >
          To Onboarding
        </Button>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

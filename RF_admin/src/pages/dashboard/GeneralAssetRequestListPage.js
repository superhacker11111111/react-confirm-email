import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
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
} from '@mui/material';
// Locales
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAssetRequests, deleteAssetRequests } from '../../redux/slices/product';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from '../../components/table';

import {
  // AssetRequestTableToolbar,
  AssetRequestTableRow,
} from '../../sections/@dashboard/general/assetRequest/list';
import { useSnackbar } from '../../components/snackbar';
import LoadingScreen from '../../components/loading-screen';
//
import AssetRequestAnalytic from '../../sections/@dashboard/general/assetRequest/AssetRequestAnalytic';
import { FENCE_STATUS } from '../../assets/data/roles';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'company', label: 'Company', align: 'left', width: '30%' },
  { id: 'primarycontact', label: 'Primary Contact', align: 'left', width: '30%' },
  { id: 'date', label: 'Date', align: 'center', width: '10%' },
  { id: 'requested', label: 'Requested', align: 'center', width: '15%' },
  { id: 'fileManager', label: 'File Manager', align: 'center', width: '15%' },
];

// ----------------------------------------------------------------------

export default function AssetRequestListPage() {
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
    defaultOrderBy: 'date',
  });

  const dispatch = useDispatch();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const { assetRequests, assetRequestCount, isLoading } = useSelector((state) => state.product);

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    handleTableEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (assetRequests) setTableData(assetRequests);
  }, [assetRequests]);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !tableData.length;

  const getPercentByCount = (count) => (Number(count) / Number(assetRequestCount.totalCount)) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: assetRequestCount.totalCount },
    {
      value: FENCE_STATUS.NOT_STARTED,
      label: 'Not Started',
      color: 'error',
      count: assetRequestCount.notStarted,
    },
    {
      value: FENCE_STATUS.PENDING,
      label: 'Pending',
      color: 'warning',
      count: assetRequestCount.pending,
    },
    {
      value: FENCE_STATUS.COMPLETE,
      label: 'Complete',
      color: 'success',
      count: assetRequestCount.complete,
    },
  ];

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleDeleteRows = (selectedRows) => {
    dispatch(deleteAssetRequests({ ids: selectedRows, status: filterStatus }, SnackBar));
    setSelected([]);
    setFilterStatus('all');
  };

  const handleTableEvent = (search) => {
    const searchParams = {
      pageSize: rowsPerPage,
      pageNumber: page,
      sortOrder: order,
      sortField: orderBy,
      tab: filterStatus,
    };
    const params = queryString.stringify(search || searchParams);
    dispatch(getAssetRequests(params));
  };

  return (
    <>
      <Helmet>
        <title> User: List | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Card sx={{ mb: 2 }}>
              <Scrollbar>
                <Stack
                  direction="row"
                  divider={
                    <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
                  }
                  sx={{ py: 2 }}
                >
                  <AssetRequestAnalytic
                    title="Not Started"
                    total={assetRequestCount.notStarted}
                    percent={getPercentByCount(assetRequestCount.notStarted)}
                    icon="eva:bell-fill"
                    color={theme.palette.error.main}
                  />

                  <AssetRequestAnalytic
                    title="Pending"
                    total={assetRequestCount.pending}
                    percent={getPercentByCount(assetRequestCount.pending)}
                    icon="eva:clock-fill"
                    color={theme.palette.warning.main}
                  />

                  <AssetRequestAnalytic
                    title="Complete"
                    total={assetRequestCount.complete}
                    percent={getPercentByCount(assetRequestCount.complete)}
                    icon="eva:checkmark-circle-2-fill"
                    color={theme.palette.success.main}
                  />
                </Stack>
              </Scrollbar>
            </Card>
            <Typography variant="h4">Asset Request</Typography>
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
                    filter: newValue,
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
                      {(isLoading ? [...Array(rowsPerPage)] : tableData).map((row, index) =>
                        row ? (
                          <AssetRequestTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                          />
                        ) : (
                          !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                        )
                      )}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                      />

                      <TableNoData isNotFound={isNotFound} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                count={assetRequestCount.dataCount}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(event, newPage) => {
                  onChangePage(event, newPage);
                  handleTableEvent({
                    pageSize: rowsPerPage,
                    filter: filterStatus,
                    sortOrder: order,
                    sortField: orderBy,
                    pageNumber: newPage,
                  });
                }}
                onRowsPerPageChange={(event, newPage) => {
                  onChangeRowsPerPage(event, newPage);
                  handleTableEvent({
                    pageNumber: 0,
                    filter: filterStatus,
                    sortOrder: order,
                    sortField: orderBy,
                    pageSize: parseInt(event.target.value, 10),
                  });
                }}
                onSelectedDelete={handleOpenConfirm}
              />
            </Card>
          </>
        )}
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

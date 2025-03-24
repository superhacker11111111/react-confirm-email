import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import queryString from 'query-string';
// @mui
// import { useTheme } from '@mui/material/styles';
import {
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
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCountryList, getShoppers, deleteUsers } from '../../redux/slices/user';
// components
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

import { ShopperTableRow, ShopperTabletoolbar } from '../../sections/@dashboard/general/user/list';
import { useSnackbar } from '../../components/snackbar';
import { PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fullName', label: 'Primary Contact', align: 'left' },
  { id: 'phoneNumber', label: 'Phone', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
];

// ----------------------------------------------------------------------

export default function GeneralShopperListPage() {
  // const theme = useTheme();

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
    defaultOrderBy: 'fullName',
    defaultOrder: 'asc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)');

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const { shoppers, shopperCount, isLoading, countries, states } = useSelector(
    (state) => state.user
  );
  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterCountry, setFilterCountry] = useState('all');

  const [filterState, setFilterState] = useState('all');

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    handleTableEvent();
    dispatch(getCountryList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shoppers) setTableData(shoppers);
    else setTableData([]);
  }, [shoppers]);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !shopperCount;

  const isFiltered = filterName !== '' || filterCountry !== 'all' || filterState !== 'all';

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    handleTableEvent({
      pageSize: rowsPerPage,
      pageNumber: 0,
      sortOrder: order,
      sortField: orderBy,
      country: filterCountry !== 'all' ? filterCountry : 'all',
      state: filterState,
      keyword: event.target.value,
    });
  };

  const handleFilterCountry = (event) => {
    setPage(0);
    setFilterCountry(event.target.value);
    handleTableEvent({
      pageSize: rowsPerPage,
      pageNumber: 0,
      sortOrder: order,
      sortField: orderBy,
      state: filterState,
      country: event.target.value !== 'all' ? event.target.value : 'all',
      keyword: '',
    });
  };

  const handleFilterState = (event) => {
    setPage(0);
    setFilterState(event.target.value);
    handleTableEvent({
      pageSize: rowsPerPage,
      pageNumber: 0,
      sortOrder: order,
      sortField: orderBy,
      country: filterCountry,
      state: event.target.value,
      keyword: '',
    });
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterCountry('all');
    setFilterState('all');
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
    await enqueueSnackbar('The selected shoppers were deleted succesfully!', {
      variant: 'success',
    });
    await setSelected([]);
  };

  const handleTableEvent = (search) => {
    const searchParams = {
      pageSize: rowsPerPage,
      pageNumber: page,
      sortOrder: order,
      sortField: orderBy,
      country: filterCountry !== 'all' ? filterCountry : 'all',
      state: filterState,
      keyword: filterName,
    };
    const params = queryString.stringify(search || searchParams);
    dispatch(getShoppers(params));
  };

  return (
    <>
      <Helmet>
        <title> User: List | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          gap={1}
          mb={5}
        >
          <Typography variant="h4">Manage RF Shopper Accounts</Typography>
          <Button variant="contained" onClick={() => navigate(PATH_DASHBOARD.general.user.list)}>
            To Subscription Accounts
          </Button>
        </Stack>
        <Card sx={{ mt: 2 }}>
          <Divider />

          <ShopperTabletoolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterCountry={filterCountry}
            filterState={filterState}
            onFilterName={handleFilterName}
            onFilterCountry={handleFilterCountry}
            onFilterState={handleFilterState}
            onResetFilter={handleResetFilter}
            countries={countries}
            states={states}
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
                        sortOrder: isAsc ? 'desc' : 'asc',
                        sortField: id,
                        country: filterCountry !== 'all' ? filterCountry : 'all',
                        state: filterState,
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
                  {(isLoading ? [...Array(rowsPerPage)] : tableData).map((row, index) =>
                    row ? (
                      <ShopperTableRow
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
            count={Number(shopperCount)}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, newPage) => {
              onChangePage(event, newPage);
              handleTableEvent({
                pageSize: rowsPerPage,
                sortOrder: order,
                sortField: orderBy,
                pageNumber: newPage,
                country: filterCountry !== 'all' ? filterCountry : 'all',
                state: filterState,
                keyword: filterName,
              });
            }}
            onRowsPerPageChange={(event, newPage) => {
              onChangeRowsPerPage(event, newPage);
              handleTableEvent({
                pageNumber: 0,
                country: filterCountry !== 'all' ? filterCountry : 'all',
                state: filterState,
                keyword: filterName,
                sortOrder: order,
                sortField: orderBy,
                pageSize: parseInt(event.target.value, 10),
              });
            }}
          />
        </Card>
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

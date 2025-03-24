import { Helmet } from 'react-helmet-async';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
// @mui
import {
  Container,
  Button,
  Typography,
  Card,
  Stack,
  Autocomplete,
  Box,
  TextField,
  Divider,
  InputAdornment,
} from '@mui/material';
import Scrollbar from '../../components/scrollbar';
import Iconify from '../../components/iconify';
// redux
import { getAllCompanies, getCompanyFileList } from '../../redux/slices/user';
import { updateSelectedFences } from '../../redux/slices/product';
// components
import { useSettingsContext } from '../../components/settings';
import AssetRequestAnalytic from '../../sections/@dashboard/general/assetRequest/AssetRequestAnalytic';
import PaginationCustom from '../../components/file-manager/PaginationCustom';
import { CompanyRole, FENCE_STATUS } from '../../assets/data/roles';
import FenceCard from '../../sections/@dashboard/general/file/FenceCard';
import { useSnackbar } from '../../components/snackbar';
import LoadingScreen from '../../components/loading-screen';

export default function GeneralFileManagerPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, type) => {
    enqueueSnackbar(message, { variant: type });
  };

  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId'));
  const [changedValues, setChangedValues] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [fileList, setFileList] = useState([]);
  const [filter, setFilter] = useState('current');

  const { companies, planCount, totalCount, fences, company, isloading } = useSelector(
    (state) => state.user
  );
  const { isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    const params = queryString.stringify({ role: CompanyRole.code });
    dispatch(getAllCompanies(params));
    getFilesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (company) {
      setChangedValues(company.selectedFences);
    }
  }, [company]);

  useEffect(() => {
    setFileList(fences);
  }, [fences]);

  const getFilesList = async (searchData) => {
    const params = {
      companyId: (searchData && searchData.companyId) || companyId,
      keyword: (searchData && searchData.keyword) || keyword,
      filter: (searchData && searchData.filter) || filter,
    };
    const searchParams = queryString.stringify(params);
    dispatch(getCompanyFileList(searchParams));
  };

  const onHandleChange = (id, checked) => {
    if (!checked) {
      const changes =
        changedValues && changedValues.length > 0 && changedValues.filter((item) => item !== id);
      if (changes) {
        setChangedValues(changes);
      } else {
        setChangedValues([]);
      }
      return;
    }
    if (
      Number(changedValues.length) >
      Number(planCount) - Number(totalCount.notStarted) - Number(totalCount.pending) - 1
    ) {
      enqueueSnackbar("You can't select model anymore. Please update your plan.", {
        variant: 'error',
      });
      return;
    }
    setChangedValues([...changedValues, id]);
  };

  const onHandleSave = async () => {
    const params = {
      companyId,
      keyword,
      filter,
    };
    const searchParams = queryString.stringify(params);
    await dispatch(
      updateSelectedFences(
        companyId,
        {
          email: company?.email.toLowerCase(),
          selectedFences: changedValues,
        },
        searchParams,
        SnackBar
      )
    );
  };

  return (
    <>
      <Helmet>
        <title> Ecommerce: File Manager | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ flexDirection: 'column' }}>
        {isloading || isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Typography variant="h5">Fence Company</Typography>
            <Autocomplete
              sx={{ width: 300, boxShadow: 4, borderRadius: '10px', mb: 3 }}
              options={companies && companies.length > 0 ? companies : []}
              autoHighlight
              value={
                (companies &&
                  companies.length > 0 &&
                  companies.find((item) => item.id === companyId)) ||
                null
              }
              getOptionLabel={(option) => option.company}
              onChange={(e, newValue) => {
                if (newValue) {
                  setCompanyId(newValue.id);
                  localStorage.setItem('companyId', newValue.id);
                  getFilesList({
                    companyId: newValue.id,
                    keyword,
                    filter,
                  });
                }
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props} id={option.id} key={option.id}>
                  {option.company}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label="Start typing..." />}
            />
            <Stack flexDirection="row" gap={5} mb={2} alignItems="center">
              <Card sx={{ boxShadow: 4, display: 'flex', width: '100%' }}>
                <Scrollbar>
                  <Stack
                    direction="row"
                    divider={
                      <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
                    }
                    sx={{ py: 2 }}
                  >
                    <AssetRequestAnalytic
                      title="Total Assets"
                      total={Number(totalCount.modeling)}
                      icon="eva:checkmark-circle-2-fill"
                      color={theme.palette.success.main}
                    />

                    <AssetRequestAnalytic
                      title="Pending"
                      total={Number(totalCount.pending)}
                      icon="eva:clock-fill"
                      color={theme.palette.warning.main}
                    />

                    <AssetRequestAnalytic
                      title="Not Started"
                      total={Number(totalCount.notStarted)}
                      icon="eva:bell-fill"
                      color={theme.palette.error.main}
                    />
                  </Stack>
                </Scrollbar>
              </Card>
              <Stack gap={1}>
                <Button variant="contained" sx={{ fontSize: '18px' }} onClick={onHandleSave}>
                  Save
                </Button>
                <Button
                  variant="contained"
                  sx={{ fontSize: '18px' }}
                  onClick={() => {
                    setChangedValues(company && company.selectedFences);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
            <Typography variant="h6">
              File Manager(
              {changedValues.length}/{planCount})
            </Typography>
            <Stack flexDirection="row">
              <TextField
                placeholder="Search..."
                value={keyword}
                sx={{ width: '40%', boxShadow: 5, borderRadius: 1, mr: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        size="large"
                        sx={{ minWidth: '16px', px: '16px' }}
                        onClick={getFilesList}
                      >
                        <Iconify icon="eva:search-outline" />
                      </Button>
                    </InputAdornment>
                  ),
                  sx: { pr: 0.5 },
                }}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
              />
              <PaginationCustom
                sx={{ width: '25%' }}
                filter={filter}
                onFilterChange={setFilter}
                onHandleChange={getFilesList}
              />
            </Stack>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={4}>
              {fileList &&
                fileList.length > 0 &&
                fileList.map(
                  (product, index) =>
                    product.status === FENCE_STATUS.MODELING && (
                      <FenceCard
                        key={index}
                        product={product}
                        checked={
                          changedValues &&
                          changedValues.length > 0 &&
                          changedValues.indexOf(product.id) > -1
                        }
                        onHandleChange={onHandleChange}
                      />
                    )
                )}
            </Box>
          </>
        )}
      </Container>
    </>
  );
}

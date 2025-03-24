/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
//
import {
  Stack,
  Container,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { paramCase } from 'change-case';
import { useSettingsContext } from '../../components/settings';
import { useTable } from '../../components/table';
import { FileFilterBox } from '../../sections/@dashboard/file';
import { PATH_DASHBOARD } from '../../routes/paths';
import { getFence } from '../../redux/slices/fence';
import { getCompany } from '../../redux/slices/user';

export default function FileManagerPage() {
  const table = useTable({ defaultRowsPerPage: 10 });
  const isMobile = useMediaQuery('(max-width: 760px)');
  const { themeStretch } = useSettingsContext();
  const [filterName, setFilterName] = useState('');
  const { selectedFences, planCount, totalCount, filterFences, isloading } = useSelector(
    (state) => state.users
  );
  const [page, setPage] = React.useState(1);
  const { fence } = useSelector((state) => state.fence);
  const { user } = useSelector((state) => state.auth);
  const [load] = useState(20);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleFilterName = (event) => {
    table.setPage(0);
    setFilterName(event.target.value);
  };
  const pageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    dispatch(getFence(user.id));
  }, [dispatch, user]);

  useEffect(() => {
    const companyData = {
      companyId: user.id,
      keyword: filterName,
      filter: 'current',
      pageNumber: table.page,
      pageSize: 10,
    };
    const params = {
      companyId: companyData.companyId,
      keyword: companyData.keyword,
      filter: companyData.filter,
      pageNumber: companyData.pageNumber,
      pageSize: companyData.pageSize,
    };
    const searchParams = queryString.stringify(params);
    dispatch(getCompany(searchParams));
  }, [dispatch, user.id, table.page, filterName]);

  const searchParams = queryString.stringify({ pageNumber: 1, limit: load });

  const handleClick = (id) => {
    sessionStorage.setItem('fileId', id);
    navigate(PATH_DASHBOARD.general.fileManagerRename.view(paramCase(id)));
  };

  return (
    <>
      <Helmet>
        <title> File Manager | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {filterName ? (
          <Typography style={{ fontSize: '24px', fontWeight: '700' }}>
            File Manager(
            {Number(totalCount.completed) + Number(filterFences && filterFences.length)}/{planCount}
            )
          </Typography>
        ) : (
          <Typography style={{ fontSize: '24px', fontWeight: '700' }}>
            File Manager(
            {Number(totalCount.completed) + Number(selectedFences && selectedFences.length)}/
            {planCount})
          </Typography>
        )}

        <Stack sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <FileFilterBox filterName={filterName} onFilterName={handleFilterName} />
            </Grid>
          </Grid>
        </Stack>

        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {filterName ? (
            isloading ? (
              <Stack sx={{ mt: 30, alignItems: 'center' }}>
                <CircularProgress color="primary" />
              </Stack>
            ) : filterFences && filterFences.length > 0 ? (
              filterFences &&
              filterFences.length > 0 &&
              filterFences.map((data, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      boxShadow: '1px 1px 3.5px 1.5px rgba(0, 0, 0, 0.1)',
                      padding: { xs: 0, sm: 3 },
                      height: '200px',
                      alignItems: { xs: 'center', sm: 'start' },
                    }}
                  >
                    <Stack sx={{ paddingRight: '10px' }}>
                      {!isMobile ? (
                        <>
                          <Button
                            variant="outlined"
                            style={{ width: '140px' }}
                            onClick={() => handleClick(data.id)}
                          >
                            Rename
                          </Button>
                          {fence && fence.filesImage.length > 0 && (
                            <img
                              src={fence.filesImage[0].preview}
                              alt="fence"
                              className="w-[120px] sm:mt-2 h-[120px]"
                            />
                          )}
                        </>
                      ) : (
                        <img
                          src={data && data.filesImage.length > 0 && data.filesImage[0].preview}
                          alt="fence"
                          className="w-[120px] mt-2 pl-4 cursor-pointer"
                          // onClick={() => handleClick(fence.id)}
                        />
                      )}
                    </Stack>
                    <Stack>
                      {isMobile ? (
                        <Typography
                          style={{ fontSize: '18px', fontWeight: 800 }}
                          className="cursor-pointer"
                          onClick={() => handleClick(data.id)}
                        >
                          {data.name}
                        </Typography>
                      ) : (
                        <Typography style={{ fontSize: '18px', fontWeight: 800 }}>
                          {data.name}
                        </Typography>
                      )}
                      <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                        {data.category}
                      </Typography>
                      <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                        {data.sub_category ? data.sub_category : ''}
                      </Typography>
                      <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                        {data.style}
                      </Typography>
                      <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                        {data.color}
                      </Typography>
                      <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                        {data.size}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              ))
            ) : (
              <Stack sx={{ mt: 34 }}>
                <Typography fontSize={16} align="center">
                  Not Found
                </Typography>
              </Stack>
            )
          ) : isloading ? (
            <Stack sx={{ mt: 34, alignItems: 'center' }}>
              <CircularProgress color="primary" />
            </Stack>
          ) : selectedFences && selectedFences.length > 0 ? (
            selectedFences &&
            selectedFences.length > 0 &&
            selectedFences.map((data, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    boxShadow: '1px 1px 3.5px 1.5px rgba(0, 0, 0, 0.1)',
                    padding: { xs: 0, sm: 3 },
                    height: '200px',
                    alignItems: { xs: 'center', sm: 'start' },
                  }}
                >
                  <Stack sx={{ paddingRight: '10px' }}>
                    {!isMobile ? (
                      <>
                        <Button
                          variant="outlined"
                          style={{ width: '140px' }}
                          onClick={() => handleClick(data.id)}
                        >
                          Rename
                        </Button>
                        <img
                          src={data.filesImage.length > 0 && data.filesImage[0].preview}
                          alt="fence"
                          className="w-[120px] sm:mt-2 h-[120px]"
                        />
                      </>
                    ) : (
                      <img
                        src={data.filesImage.length > 0 && data.filesImage[0].preview}
                        alt="fence"
                        className="w-[120px] mt-2 pl-4 cursor-pointer"
                        // onClick={() => handleClick(fence.id)}
                      />
                    )}
                  </Stack>
                  <Stack>
                    {isMobile ? (
                      <Typography
                        style={{ fontSize: '18px', fontWeight: 800 }}
                        className="cursor-pointer"
                        onClick={() => handleClick(data.id)}
                      >
                        {data.name}
                      </Typography>
                    ) : (
                      <Typography style={{ fontSize: '18px', fontWeight: 800 }}>
                        {data.name}
                      </Typography>
                    )}
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {data.category}
                    </Typography>
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {data.sub_category ? data.sub_category : ''}
                    </Typography>
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {data.style}
                    </Typography>
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {data.color}
                    </Typography>
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {data.size}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))
          ) : (
            <Stack sx={{ mt: 34 }}>
              <Typography fontSize={16} align="center">
                Not Found
              </Typography>
            </Stack>
          )}
        </Grid>
      </Container>
    </>
  );
}

/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Grid, CircularProgress, Stack, Button, useMediaQuery } from '@mui/material';
import { paramCase } from 'change-case';
import queryString from 'query-string';
import { getVisibleFences } from '../../redux/slices/fence';
import { PATH_PAGE } from '../../routes/paths';

export default function Models() {
  const { fences, isloading } = useSelector((state) => state.fence);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [load, setLoad] = useState(20);

  const handleLoadMore = () => {
    setLoad(load + 20);
  };

  useEffect(() => {
    const params = {
      pageNumber: 1,
      limit: load,
    };
    const searchParams = queryString.stringify(params);
    dispatch(getVisibleFences(searchParams));
  }, [dispatch, load]);

  const handleClick = (id) => {
    sessionStorage.setItem('fileId', id);
    navigate(PATH_PAGE.fenceDetail.view(paramCase(id)));
  };

  return (
    <>
      {isloading ? (
        <Stack width="100%" sx={{ alignItems: 'center', mb: 40, mt: 20 }}>
          <CircularProgress color="primary" />
        </Stack>
      ) : fences && fences.data && fences.data.product && fences.data.product.length > 0 ? (
        <Grid container spacing={2}>
          {fences.data &&
            fences.data.product.length > 0 &&
            fences.data?.product.slice(0, load).map((fence, index) => (
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
                          onClick={() => handleClick(fence.id)}
                        >
                          View Model
                        </Button>
                        {fence.filesImage.length > 0 && (
                          <img
                            src={fence.filesImage[0].preview}
                            alt="fence"
                            className="w-[120px] sm:mt-2 h-[120px]"
                          />
                        )}
                      </>
                    ) : (
                      <img
                        src={fence.filesImage.length > 0 && fence.filesImage[0].preview}
                        alt="fence"
                        className="w-[120px] mt-2 pl-2 cursor-pointer"
                        style={{ minWidth: '110px', maxWidth: '110px' }}
                        // onClick={() => handleClick(fence.id)}
                      />
                    )}
                  </Stack>
                  <Stack>
                    {isMobile ? (
                      <Typography
                        style={{ fontSize: '18px', fontWeight: 800 }}
                        className="cursor-pointer"
                        onClick={() => handleClick(fence.id)}
                      >
                        {fence.name}
                      </Typography>
                    ) : (
                      <Typography style={{ fontSize: '18px', fontWeight: 800 }}>
                        {fence.name}
                      </Typography>
                    )}
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {fence.category}
                    </Typography>
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {fence.sub_category ? fence.sub_category : ''}
                    </Typography>
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {fence.style}
                    </Typography>
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {fence.color}
                    </Typography>
                    <Typography style={{ fontSize: '16px', fontWeight: 600 }}>
                      {fence.size}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          <Stack width="100%" sx={{ alignItems: 'center', mb: 20 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                width: '146px',
                mt: 6,
                backgroundColor: '#1FA9FF !important',
              }}
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          </Stack>
        </Grid>
      ) : (
        <Stack width="100%" sx={{ alignItems: 'center', mb: 40, mt: 20 }}>
          <Typography fontSize={16} align="center">
            Not Found
          </Typography>
        </Stack>
      )}
    </>
  );
}

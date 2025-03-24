import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import { useTheme } from '@mui/material/styles';
import TaskAlt from '@mui/icons-material/TaskAlt';

import {
  AppBar,
  Toolbar,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  Typography,
  Popover,
  Box,
  Grid,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { paramCase } from 'change-case';
import Image from '../../../components/image';
import { userAction } from '../../../redux/actions/userAction';
// utils
// hooks
import useResponsive from '../../../hooks/useResponsive';
// config
import { NAV } from '../../../config-global';
import { useSettingsContext } from '../../../components/settings';
//
import Select from '../../../assets/select.svg';
import Favour from '../../../assets/favour.png';
import Request from '../../../assets/request.svg';
import Trash from '../../../assets/ic_trash.png';
import { PATH_ONBOARDING, PATH_DASHBOARD } from '../../../routes/paths';
import {
  setFavour,
  setOnboardingAvailableCount,
  setRequest,
  setSelected,
  setNewRequest,
  // requestProductList,
} from '../../../redux/slices/product';
import axios from '../../../utils/axios';
import { getSubscription } from '../../../redux/slices/subscription';
// ----------------------------------------------------------------------

ToolBar.propTypes = {
  // pageType: PropTypes.string,
};

export default function ToolBar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [click, setCLick] = useState(false);
  const [arrowClick, setArrowCLick] = useState(null);
  const { themeLayout } = useSettingsContext();
  const { user } = useSelector((state) => state.auth);
  const { subscription } = useSelector((state) => state.subscription);
  const { favorite_list, request_list, selected_list, onboardingAvailable } = useSelector(
    (state) => state.product
  );
  const [available, setAvailable] = useState(30);
  const [popOverData, setPopOverData] = useState({
    title: 'Favorites',
    fences: favorite_list,
  });
  const isNavMini = themeLayout === 'mini';
  const isNavHorizontal = themeLayout === 'horizontal';
  const isMobile = useMediaQuery('(max-width:700px)');
  const isDesktop = useResponsive('up', 'lg');

  const handleClick = (event) => {
    setCLick(event.currentTarget);
  };

  const handleProverClose = () => {
    setCLick(null);
    setArrowCLick(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getImage = (title) => {
    switch (title) {
      case 'Favorites':
        return Favour;
      case 'My Fences':
        return Select;
      case 'My Requests':
        return Request;
      default:
        return Favour;
    }
  };

  const handleUpload = async (values) => {
    const imageUrlList = [];
    values.images.map(async (image) => {
      const folder = 'products/';
      const data = {
        key: folder + Date.now().toString() + image.path,
        values,
      };
      const preSignedURL = await axios.post('/auth/presignedUrl', data);
      imageUrlList.push({
        key: preSignedURL.data.key,
        preview: `https://rf-test-test.s3.us-east-1.amazonaws.com/${data.key}`,
      });
      console.log({
        key: preSignedURL.data.key,
        preview: `https://rf-test-test.s3.us-east-1.amazonaws.com/${data.key}`,
      });
      const myHeaders = new Headers({ 'Content-Type': 'image/jpeg' });
      await fetch(preSignedURL.data.signedUrl, {
        method: 'PUT',
        headers: myHeaders,
        body: image,
      });
    });
    return imageUrlList;
  };

  const handleRequestData = (request) => {
    const requestData = [];
    if (request.length > 0) {
      request.map(async (fence) => {
        const imageUrlList = await handleUpload(fence.filesImage);
        requestData.push({
          name: fence.name,
          description: fence.description,
          category: fence.category,
          sub_category: fence.sub_category,
          style: fence.style,
          size: fence.size,
          color: fence.color,
          filesImage: imageUrlList,
        });
      });
    }
    return requestData;
  };

  const SavetoDashboard = async () => {
    const requestData = await handleRequestData(request_list);
    const updateData = {
      selectedFences: selected_list.map((fence) => fence.id),
      requestFences: requestData,
      favoriteFences: favorite_list.map((fence) => fence.id),
      email: user?.email.toLowerCase(),
    };
    dispatch(userAction.updateFences(user?.id, updateData, navigate));
  };

  const handleItemDelete = (itemId) => {
    const fenceData = popOverData.fences.filter((item) => item.id !== itemId);
    setPopOverData({ ...popOverData, fences: fenceData });
    switch (popOverData.title) {
      case 'Favorites':
        dispatch(setFavour(fenceData));
        break;
      case 'My Fences':
        dispatch(setSelected(fenceData));
        break;
      case 'My Requests':
        dispatch(setRequest(fenceData));
        break;
      default:
        break;
    }
  };

  const handleClickToolbar = (id) => {
    sessionStorage.setItem('fileId', id);
    navigate(PATH_ONBOARDING.onboarding.viewDetail(paramCase(id)));
  };

  const handleConfirmSelection = () => {
    const updateData = {
      selectedFences: selected_list.map((fence) => fence.id),
      requestFences: [],
      email: user?.email.toLowerCase(),
      onboardingPass: true,
    };
    dispatch(setNewRequest([]));
    dispatch(userAction.updateFences(user?.id, updateData, navigate));
  };

  useEffect(() => {
    if (user) {
      dispatch(getSubscription(user.plan));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (subscription) {
      setAvailable(subscription.totalFences);
    }
  }, [subscription]);
  useEffect(() => {
    dispatch(
      setOnboardingAvailableCount(
        Number(available) - Number(request_list.length) - Number(selected_list.length)
          ? Number(available) - Number(request_list.length) - Number(selected_list.length)
          : 0
      )
    );
  }, [available, request_list, selected_list, favorite_list, dispatch]);

  const renderContent = (
    <>
      {!isMobile ? (
        <Stack sx={{ marginTop: { lg: 0, md: 7, sm: 7, xs: 9 } }}>
          <div className="z-10 flex justify-between items-center px-[10px] py-[7px] bg-gray-100 shadow-md">
            <Stack
              sx={{
                gap: 1.2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
              }}
            >
              <Stack flexDirection="row" sx={{ alignItems: 'center' }}>
                <Button
                  variant="contained"
                  style={{
                    // height: '50px',
                    backgroundColor: '#1fa9ff',
                    padding: '15px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    fontSize: 13,
                    borderRadius: '14px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                  }}
                  onClick={handleConfirmSelection}
                >
                  Save And Continue
                </Button>
                &nbsp;&nbsp;&nbsp;
                {/* {pageType !== '/addfences' && <SelectFencesSearch />} */}
              </Stack>
            </Stack>

            <Typography
              sx={{
                fontSize: { xs: '20px', sm: '24px', md: '32px' },
                fontWeight: 800,
                color: 'black',
              }}
            >
              Fence Selector
            </Typography>
            <Stack flexDirection="row" sx={{ alignItems: 'center', mt: '5px' }}>
              &nbsp;&nbsp;
              <Stack direction="column" alignItems="flex-end">
                <Typography variant="h6" sx={{ color: 'black', fontSize: '16px' }}>
                  Fences Selected: &nbsp;
                  {selected_list.length}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: 'black' }}>
                  Available : {onboardingAvailable}
                </Typography>
              </Stack>
              &nbsp;&nbsp;
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Button
                  style={{
                    backgroundColor: '#FFFFFF',
                    height: '50px',
                    borderRadius: '14px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                  }}
                  onClick={(event) => {
                    setPopOverData({
                      title: 'My Fences',
                      fences: selected_list,
                    });
                    handleClick(event);
                  }}
                >
                  <Badge badgeContent={selected_list.length} color="error">
                    <img src={Select} alt="select" />
                  </Badge>
                </Button>
              </Stack>
            </Stack>
          </div>
        </Stack>
      ) : (
        <div className="w-full -mt-10">
          <div className="flex justify-between bg-gray-100 shadow-md z-10 px-[10px] py-[7px] mt-24">
            <Button
              variant="contained"
              style={{
                fontSize: '13px',
                borderRadius: '14px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#1FA9FF',
              }}
              onClick={handleConfirmSelection}
            >
              <TaskAlt />
            </Button>
            <Stack flexDirection="row">
              <Stack flexDirection="row" sx={{ alignItems: 'center', mt: '5px' }}>
                &nbsp;&nbsp;
                <Stack direction="column" alignItems="flex-end">
                  <Typography variant="h6" sx={{ color: 'black', fontSize: '13px' }}>
                    Fences Selected: &nbsp;
                    {selected_list.length}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: 'black' }}>
                    Available : {onboardingAvailable}
                  </Typography>
                </Stack>
                &nbsp;&nbsp;
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: '#FFFFFF',
                      height: '50px',
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    }}
                    onClick={(event) => {
                      setPopOverData({
                        title: 'My Fences',
                        fences: selected_list,
                      });
                      handleClick(event);
                    }}
                  >
                    <Badge badgeContent={selected_list.length} color="error">
                      <img src={Select} alt="select" />
                    </Badge>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </div>
        </div>
      )}
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',

        zIndex: theme.zIndex.appBar + 1,
        bgcolor: 'white',
        ...(isDesktop && {
          marginTop: '90px',
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',

            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        <div className="w-full">
          {renderContent}

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ textAlign: 'center', width: '300px' }} id="simple-dialog-title">
              Do you want to exit?
            </DialogTitle>
            <div className="grid grid-cols-1">
              <Button
                variant="text"
                color="inherit"
                style={{
                  marginTop: '15px',
                  color: 'white',
                  backgroundColor: '#1288e3',
                  padding: '15px 16px',
                  marginLeft: '46px',
                  width: '200px',
                  fontSize: '17px',
                  textAlign: 'center',
                  borderRadius: '14px',
                }}
                onClick={SavetoDashboard}
              >
                Save & Exit To Dashboard
              </Button>
              <Button
                variant="text"
                color="inherit"
                style={{
                  marginTop: '15px',
                  color: 'white',
                  backgroundColor: '#1288e3',
                  padding: '15px 16px',
                  marginLeft: '46px',
                  width: '200px',
                  fontSize: '17px',
                  textAlign: 'center',
                  borderRadius: '14px',
                }}
                href={PATH_DASHBOARD.user.account}
              >
                Don’t Save & Exit To Dashboard
              </Button>
              <Button
                variant="text"
                color="inherit"
                style={{
                  marginTop: '15px',
                  color: 'white',
                  backgroundColor: '#1288e3',
                  padding: '15px 16px',
                  marginLeft: '46px',
                  width: '200px',
                  fontSize: '17px',
                  textAlign: 'center',
                  marginBottom: '25px',
                  borderRadius: '14px',
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </Dialog>

          <Popover
            open={Boolean(click)}
            anchorEl={click}
            onClose={handleProverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ p: 2, width: 400 }}>
              <div className="flex justify-between">
                <div>{}</div>
                <Typography variant="h5" gutterBottom>
                  {popOverData.title}
                </Typography>
                <Badge badgeContent={popOverData.fences.length} color="error">
                  <img
                    src={getImage(popOverData.title)}
                    className="w-[20px] h-[20px]"
                    alt="favour"
                  />
                </Badge>
              </div>

              {Array.isArray(popOverData?.fences) &&
                popOverData.fences.map((fence, index) => (
                  <Box
                    style={{
                      boxShadow: '0px 6px 9px #a6a6a6',
                      alignSelf: 'center',
                      marginBottom: '10px',
                    }}
                    sx={{ px: 1.5, py: 2 }}
                    key={fence && fence.id ? fence.id : index}
                  >
                    <Grid
                      container
                      item
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                      }}
                    >
                      <Grid item xs={9.6}>
                        <Grid
                          item
                          container
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignSelf: 'center',
                          }}
                        >
                          <Grid item xs={3.5} sx={{ alignSelf: 'center' }}>
                            <Image
                              src={
                                fence &&
                                fence.filesImage &&
                                fence.filesImage.length > 0 &&
                                fence.filesImage[0].preview
                              }
                              sx={{ width: '78px', cursor: 'pointer' }}
                              alt="favour"
                              onClick={() => handleClickToolbar(fence && fence.id)}
                            />
                          </Grid>
                          <Grid item xs={8} sx={{ alignSelf: 'center' }}>
                            <div
                              className="col"
                              style={{
                                '& > *': {
                                  color: 'black',
                                  // add more styles for typography components here
                                },
                              }}
                            >
                              <Typography sx={{ fontsize: '16px', fontWeight: 700 }}>
                                {fence?.name}
                              </Typography>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2} sx={{ alignSelf: 'center' }}>
                        <Button onClick={() => handleItemDelete(fence.id)}>
                          <img src={Trash} className="w-[20px] h-[20px] ml-3" alt="trash" />
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
            </Box>
          </Popover>

          <Popover
            open={Boolean(arrowClick)}
            anchorEl={arrowClick}
            onClose={handleProverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ p: 1, width: 'fit-content' }}>
              {/* <Button
                style={{
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  borderRadius: '14px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                onClick={(event) => {
                  setPopOverData({ title: 'Favorites', fences: favorite_list });
                  handleClick(event);
                }}
              >
                <Badge badgeContent={favorite_list.length} color="success">
                  <img src={Favour} alt="favour" />
                </Badge>
              </Button> */}
              {user && subscription && subscription.requestAvailable && (
                <>
                  &nbsp;&nbsp;
                  <Button
                    style={{
                      backgroundColor: '#FFFFFF',
                      height: '40px',
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={(event) => {
                      setPopOverData({ title: 'My Requests', fences: request_list });
                      handleClick(event);
                    }}
                  >
                    {' '}
                    <Badge badgeContent={request_list.length} color="success">
                      <img src={Request} alt="req" />
                    </Badge>
                  </Button>
                </>
              )}
              &nbsp;&nbsp;
              <Button
                style={{
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  borderRadius: '14px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                onClick={(event) => {
                  setPopOverData({ title: 'My Fences', fences: selected_list });
                  handleClick(event);
                }}
              >
                {' '}
                <Badge badgeContent={selected_list.length} color="success">
                  <img src={Select} alt="select" />
                </Badge>
              </Button>
            </Box>
          </Popover>
        </div>
      </Toolbar>
    </AppBar>
  );
}

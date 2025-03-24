import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { paramCase } from 'change-case';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import TaskAlt from '@mui/icons-material/TaskAlt';
import {
  AppBar,
  Toolbar,
  IconButton,
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

import { userAction } from '../../../redux/actions/userAction';
// utils
import Image from '../../../components/image';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// config
import { NAV } from '../../../config-global';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
//
import Check from '../../../assets/check.png';
import Home from '../../../assets/home.png';
import Select from '../../../assets/select.png';
import Favour from '../../../assets/favour.png';
import Request from '../../../assets/request.png';
import Trash from '../../../assets/ic_trash.png';
import { PATH_ONBOARDING, PATH_DASHBOARD } from '../../../routes/paths';
import { SelectFencesSearch } from '../../../sections/onboarding/select_fences';
import { UserRoles } from '../../../assets/data/roles';
import { setFavour, setRequest, setSelected } from '../../../redux/slices/product';
import axios from '../../../utils/axios';
// ----------------------------------------------------------------------

ToolBar.propTypes = {
  pageType: PropTypes.string,
};

export default function ToolBar({ pageType }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [click, setCLick] = useState(false);
  const [arrowClick, setArrowCLick] = useState(null);
  const { themeLayout } = useSettingsContext();
  const { user } = useSelector((state) => state.auth);
  const { favorite_list, request_list, selected_list } = useSelector((state) => state.product);
  const [available, setAvailable] = useState(30);
  const [popOverData, setPopOverData] = useState({
    title: 'Favorites',
    fences: favorite_list,
  });
  const isNavMini = themeLayout === 'mini';
  const isNavHorizontal = themeLayout === 'horizontal';
  const isMobile = useMediaQuery('(max-width:600px)');
  const isDesktop = useResponsive('up', 'lg');
  const handleClick = (event) => {
    setCLick(event.currentTarget);
  };
  const handleProverClose = () => {
    setCLick(null);
    setArrowCLick(null);
  };
  const handleArrowClick = (event) => {
    setArrowCLick(event.currentTarget);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickToolbar = (id) => {
    sessionStorage.setItem('fileId', id);
    navigate(PATH_ONBOARDING.onboarding.viewDetail(paramCase(id)));
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
  const handleConfirm = () => {
    if (user?.userType === UserRoles.pro) {
      navigate(PATH_ONBOARDING.onboarding.fenceRequest);
    } else {
      navigate(
        pageType === '/addfences'
          ? PATH_ONBOARDING.onboarding.fenceRequest
          : PATH_ONBOARDING.onboarding.requestFencesp
      );
    }
  };

  useEffect(() => {
    if (user) {
      switch (user?.userType) {
        case UserRoles.pro:
          setAvailable(30);
          break;
        case UserRoles.proPlus:
          setAvailable(50);
          break;
        case UserRoles.enterprise:
          setAvailable(100);
          break;
        default:
          break;
      }
    }
  }, [user]);

  const renderContent = (
    <>
      {!isMobile && (
        <Stack>
          <Grid container direction="row" justifyContent="space-between" sx={{ my: '4px' }}>
            <Grid item>
              <Button
                variant="contained"
                style={{
                  padding: '2px 5px',
                  color: 'white',
                  width: '180px',
                  fontSize: '13px',
                  borderRadius: '14px',
                  height: '30px',
                  backgroundColor: '#1FA9FF',
                  lineHeight: 1,
                }}
                onClick={() => {
                  localStorage.setItem('layout', 'onboarding');
                  localStorage.removeItem('pageType');
                  navigate(PATH_ONBOARDING.onboarding.selectfencesp);
                }}
              >
                <ArrowCircleLeftOutlinedIcon />
                &nbsp;&nbsp; Back to Welcomes
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={{
                  padding: '2px 5px',
                  color: 'white',
                  width: '180px',
                  fontSize: '13px',
                  borderRadius: '14px',
                  height: '30px',
                  backgroundColor: '#1FA9FF',
                }}
                onClick={handleConfirm}
              >
                {user?.userType === UserRoles.pro ? 'Confirm Selection' : 'Save & Continue'}
                &nbsp;&nbsp;
                {user?.userType === UserRoles.pro ? <TaskAlt /> : <ArrowCircleRightOutlinedIcon />}
                {/* <img src={Check} className="w-4" alt="check" /> */}
              </Button>
            </Grid>
          </Grid>
          {pageType !== '/addfences' && (
            <Grid container direction="row" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4" sx={{ color: '#000000' }}>
                  Fence Selector
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction="column" alignItems="flex-end">
                  <Typography variant="h6" sx={{ color: '#000000' }}>
                    Fences Selected: {selected_list.length}
                  </Typography>
                  <Typography sx={{ fontSize: '16px', color: '#000000' }}>
                    Available: {Number(available) - Number(selected_list.length)}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          )}
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            bgcolor="grey 100"
            boxShadow={4}
            sx={{ px: '10px', py: '7px' }}
          >
            {/* <div className="flex justify-between bg-gray-100 shadow-md z-10"> */}
            {/* <div className="flex"> */}
            <Stack flexDirection="row">
              <Button
                variant="text"
                color="inherit"
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '120px',
                  height: '40px',
                  fontSize: 13,
                  borderRadius: '14px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                }}
                href={PATH_DASHBOARD.user.account}
              >
                <p className="text-[#000000]">Dashboard</p>
                {/* <img src={Home} alt="home" /> */}
              </Button>
              &nbsp;&nbsp;&nbsp;
              {pageType !== '/addfences' && <SelectFencesSearch />}
            </Stack>

            {/* </div> */}
            {/* <div className="flex mr-[10px] mt-[15px]"> */}
            <Stack flexDirection="row">
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
                    height: '40px',
                    borderRadius: '14px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                  }}
                  onClick={(event) => {
                    setPopOverData({ title: 'Favorites', fences: favorite_list });
                    handleClick(event);
                  }}
                >
                  <Badge badgeContent={favorite_list.length} color="success">
                    <img src={Favour} alt="favour" />
                  </Badge>
                </Button>
                <Typography fontSize="12px" color="black">
                  Favorites
                </Typography>
              </Stack>
              &nbsp;&nbsp;
              {user?.userType !== UserRoles.pro && (
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
                      height: '40px',
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    }}
                    onClick={(event) => {
                      setPopOverData({ title: 'My Requests', fences: request_list });
                      handleClick(event);
                    }}
                  >
                    <Badge badgeContent={request_list.length} color="error">
                      <img src={Request} alt="request" />
                    </Badge>
                  </Button>
                  <Typography fontSize="12px" color="black">
                    Requests
                  </Typography>
                </Stack>
              )}
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
                    height: '40px',
                    borderRadius: '14px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                  }}
                  onClick={(event) => {
                    setPopOverData({ title: 'My Fences', fences: selected_list });
                    handleClick(event);
                  }}
                >
                  {/* <Badge badgeContent={selected_list.length} color="error">
                    <img src={Select} alt="select" />
                  </Badge> */}
                  <Badge badgeContent={favorite_list.length} color="error">
                    <img src={Favour} alt="favour" />
                  </Badge>
                </Button>
                <Typography fontSize="12px" color="black">
                  Fences
                </Typography>
              </Stack>
            </Stack>
            {/* </div> */}
            {/* </div> */}
          </Stack>
        </Stack>
      )}

      {isMobile && (
        <div className="w-full -mt-10">
          <div className="w-full flex justify-between mt-24">
            <Button
              variant="text"
              color="inherit"
              style={{
                color: 'white',
                padding: '8px 16px',
                width: '120px',
                height: '50px',
                backgroundColor: '#1FA9FF',
                fontSize: 13,
                borderRadius: '14px',
              }}
              onClick={handleClickOpen}
            >
              <svg
                width="999"
                height="36"
                viewBox="10 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5625 18L23.125 6.75L24.7437 8.325L14.8 18L24.7437 27.675L23.125 29.25L11.5625 18Z"
                  fill="white"
                />
              </svg>
              Back to Welcome
            </Button>
            <Button
              variant="text"
              color="inherit"
              style={{
                marginTop: '15px',
                color: 'white',
                backgroundColor: '#1FA9FF',
                padding: '8px 16px',
                width: '120px',
                height: '50px',
                fontSize: 13,
                borderRadius: '14px',
              }}
              onClick={handleConfirm}
            >
              Confirm Selection
              <img src={Check} className="w-4" alt="check" />
            </Button>
          </div>
          <div className="flex justify-between mt-4">
            <Typography variant="h8" sx={{ color: '#000000' }}>
              Fence Selector
            </Typography>
            <div className="col text-right">
              <p className="font-bold text-[#000000] text-[15px]">
                Fences Selected: {selected_list.length}
              </p>
              <p className="font-bold text-[#000000] text-[20px]">
                Available:{' '}
                {Number(available) - Number(selected_list.length) - Number(request_list.length)}
              </p>
            </div>
          </div>
          <div className="flex justify-between bg-gray-100 shadow-md z-10">
            <div className="flex">
              <Button
                variant="text"
                color="inherit"
                style={{
                  marginTop: '15px',
                  marginBottom: '15px',
                  marginLeft: '10px',
                  backgroundColor: '#FFFFFF',
                  width: '20px',
                  height: '50px',
                  fontSize: 13,
                  borderRadius: '14px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                href={PATH_DASHBOARD.user.account}
              >
                <img src={Home} alt="home" />
              </Button>
              &nbsp;&nbsp;&nbsp;
              <div className="mt-[15px] ">
                <SelectFencesSearch />
              </div>
            </div>
            <IconButton sx={{ mr: 1, color: 'text.primary' }} onClick={handleArrowClick}>
              <Iconify icon="eva:arrow-ios-forward-fill" style={{ transform: 'rotate(90deg)' }} />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        // height: TOOLBAR.H_MOBILE,
        // zIndex: theme.zIndex.appBar + 1,
        bgcolor: 'white',
        ...(isDesktop && {
          // height: '150px',
          marginTop: '70px',
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            // height: TOOLBAR.H_DASHBOARD_DESKTOP_OFFSET,
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
          mx: { lg: 5 },
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
                <Badge
                  badgeContent={popOverData.fences.length}
                  color={popOverData.title === 'Favorites' ? 'success' : 'error'}
                >
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
                      // boxShadow: '0px 6px 9px #a6a6a6',
                      alignSelf: 'center',
                      marginBottom: '10px',
                    }}
                    sx={{ p: 2 }}
                    key={fence.id ? fence.id : index}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Image
                          src={
                            fence &&
                            fence.filesImage &&
                            fence.filesImage.length > 0 &&
                            fence.filesImage[0].preview
                          }
                          className="w-[58px] h-[58px]"
                          onClick={() => handleClickToolbar(fence && fence.id)}
                          alt="favour"
                        />
                        &nbsp; &nbsp; &nbsp;
                        <div
                          className="col"
                          style={{
                            '& > *': {
                              color: '#000000',
                              // add more styles for typography components here
                            },
                          }}
                        >
                          <Typography variant="h6">{fence.name}</Typography>
                          <div className="w-full">
                            <Typography variant="h8">{fence.size}</Typography>
                          </div>
                          <Typography variant="h8">{fence.structural_design}</Typography>
                        </div>
                      </div>
                      <Button onClick={() => handleItemDelete(fence.id)}>
                        <img src={Trash} className="w-[20px] h-[20px] ml-3" alt="trash" />
                      </Button>
                    </div>
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
            <Box sx={{ p: 2, width: 245 }}>
              <Button
                style={{
                  backgroundColor: '#FFFFFF',
                  height: '50px',
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
              </Button>
              &nbsp;&nbsp;
              <Button
                style={{
                  backgroundColor: '#FFFFFF',
                  height: '50px',
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
              &nbsp;&nbsp;
              <Button
                style={{
                  backgroundColor: '#FFFFFF',
                  height: '50px',
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

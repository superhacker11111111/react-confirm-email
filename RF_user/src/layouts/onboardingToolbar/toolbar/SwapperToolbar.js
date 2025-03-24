/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import {
  Stack,
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
  useMediaQuery,
  Menu,
  MenuItem,
  Tooltip,
  Zoom,
} from '@mui/material';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { paramCase } from 'change-case';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
// eslint-disable-next-line import/no-extraneous-dependencies
import heic2any from 'heic2any';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useTour } from '@reactour/tour';
import { userAction } from '../../../redux/actions/userAction';
import {
  setFavour,
  setRemoved,
  setCurrentSelectedFences,
  setRequestSwapper,
  setNewRequest,
} from '../../../redux/slices/product';
// utils
// hooks
import useResponsive from '../../../hooks/useResponsive';
// import { confirmFenceRequestWebhook } from '../../../hooks/zapierWebhooks';
import FileImage from '../../../components/image';
// config
import { NAV } from '../../../config-global';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import Select from '../../../assets/select.svg';
import Request from '../../../assets/request.svg';
import Favour from '../../../assets/favour.png';
import Trash from '../../../assets/ic_trash.png';
import Remove from '../../../assets/remove.png';
import NoImage from '../../../assets/TraficCone.png';
import { PATH_ONBOARDING, PATH_DASHBOARD } from '../../../routes/paths';
import { SelectFencesSearch } from '../../../sections/onboarding/select_fences';
import axios from '../../../utils/axios';
import NavVertical from '../nav/NavVertical';
import { useSnackbar } from '../../../components/snackbar';
import {
  UserType,
  FENCE_STATUS,
  S3_PRODUCT_IMAGE_FOLDER,
  IMAGE_TYPES,
} from '../../../assets/data/roles';
import { initialize } from '../../../redux/actions/authAction';
// ----------------------------------------------------------------------

export default function SwapperToolBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setIsOpen } = useTour();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const total_selected_list = useSelector((state) => state.product.selected_list);
  const requestList = useSelector((state) => state.product.new_request_list);
  const origin_requestList = useSelector((state) => state.product.request_list);
  const {
    selected_list,
    selectedFences,
    removed_list,
    favorite_list,
    swapCount,
    swapAddCount,
    swapRemoveCount,
  } = useSelector((state) => state.product);
  const { subscription } = useSelector((state) => state.subscription);
  const request_list = requestList !== undefined ? requestList : [];
  const [open, setOpen] = useState(false);
  const [saveopen, setSaveOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [click, setCLick] = useState(null);
  const [arrowClick, setArrowCLick] = useState(null);
  const [popOverData, setPopOverData] = useState({
    title: 'Favorites',
    fences: favorite_list,
  });
  const [anchorEl, setAnchorEl] = useState(false);
  const { themeLayout } = useSettingsContext();
  const isNavMini = themeLayout === 'mini';
  const isNavHorizontal = themeLayout === 'horizontal';
  const isDesktop = useResponsive('up', 'lg');
  const isMobile = useMediaQuery('(max-width:756px)');
  const location = useLocation();
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isNotSaveLoading, setIsNotSaveLoading] = useState(false);

  const handleNavOpen = () => {
    setNavOpen(true);
  };

  const handleNavClose = () => {
    setNavOpen(false);
  };

  const handleProverClose = () => {
    setCLick(null);
    setArrowCLick(null);
  };

  const handleMenuItemClick = (pageType) => {
    // Perform actions based on the selected menu item
    console.log('hello');
    localStorage.setItem('pageType', pageType);
    switch (pageType) {
      case 'selector':
        navigate(PATH_ONBOARDING.onboarding.categoryfences);
        break;
      case 'addFenceSwapper':
        location.href = PATH_ONBOARDING.onboarding.requestFencesSwapper;
        break;
      case 'myfence':
        navigate(PATH_ONBOARDING.onboarding.fenceSwapper);
        break;
      default:
        break;
    }
    handleClose(); // Close the menu after the action is performed
  };

  const getImage = (title) => {
    switch (title) {
      case 'Favorites':
        return Favour;
      case 'Added to My Fences':
        return Select;
      case 'Added to My Requests':
        return Request;
      case 'Removed from My Fences':
        return Trash;
      default:
        return Favour;
    }
  };

  const handleItemDelete = (itemId) => {
    const fenceData = popOverData.fences.filter((item) => item.id !== itemId);
    // const recoverData = popOverData.fences.filter((item) => item.id === itemId);
    // setPopOverData({ ...popOverData, fences: fenceData });
    switch (popOverData.title) {
      case 'Favorites':
        dispatch(setFavour(fenceData));
        setPopOverData({ ...popOverData, fences: fenceData });
        break;
      case 'Added to My Fences':
        dispatch(setCurrentSelectedFences(fenceData));
        setPopOverData({ ...popOverData, fences: fenceData });
        break;
      case 'Added to My Requests':
        dispatch(setRequestSwapper(fenceData));
        setPopOverData({ ...popOverData, fences: fenceData });
        break;
      case 'Removed from My Fences': {
        if (
          total_selected_list.length +
            selectedFences.length -
            removed_list.length +
            origin_requestList.length +
            request_list.length <
          subscription?.totalFences
        ) {
          dispatch(setRemoved(fenceData));
          setPopOverData({ ...popOverData, fences: fenceData });
        } else {
          enqueueSnackbar('Please remove the new fences before adding these back to My Fences.', {
            variant: 'error',
          });
        }
        break;
      }
      default:
        break;
    }
  };

  const handleClickIcon = (event) => {
    setAnchorEl(event.currentTarget); // Toggle the value of showButtons
  };

  const handleClick = (event) => {
    setCLick(event.currentTarget);
  };

  const handleArrowClick = (event) => {
    setArrowCLick(event.currentTarget);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickSaveOpen = () => {
    setSaveOpen(true);
  };

  const handleClickToolbar = (id) => {
    sessionStorage.setItem('fileId', id);
    navigate(PATH_ONBOARDING.onboarding.viewDetail(paramCase(id)));
  };

  const handleUpload = async (values) => {
    const imageUrlList = await Promise.all(
      values.map(async (image, imageIndex) => {
        let imageUrl = {};
        if (IMAGE_TYPES.indexOf(image.type) > -1) {
          let data = {};
          if (image.type === 'image/heic') {
            image = await heic2any({
              blob: image,
              toType: 'image/jpeg',
              quality: 1,
            });
            data = {
              key: `${S3_PRODUCT_IMAGE_FOLDER + Date.now().toString()}-${imageIndex}.jpg`,
              values,
            };
          } else {
            data = {
              key: `${S3_PRODUCT_IMAGE_FOLDER + Date.now().toString()}-${imageIndex}.${
                image.path.split('.')[image.path.split('.').length - 1]
              }`,
              values,
            };
          }
          const preSignedURL = await axios.post('/auth/presignedUrl', data);
          const myHeaders = new Headers({
            'Content-Type': image.type,
          });
          await fetch(preSignedURL.data.signedUrl, {
            method: 'PUT',
            headers: myHeaders,
            body: image,
          });
          imageUrl = {
            preview: `https://rf-test-test.s3.us-east-1.amazonaws.com/${data.key}`,
            key: data.key,
          };
        }
        return imageUrl;
      })
    );
    return imageUrlList.length > 0 ? imageUrlList.filter((item) => item.key) : [];
  };

  const handleRequestData = async (request) => {
    if (request.length < 1) {
      return [];
    }
    const requestData = await Promise.all(
      request.map(async (fence) => {
        const imageUrlList = await handleUpload(fence.filesImage);
        return {
          name: fence.name,
          description: fence.description,
          category: fence.category,
          color: fence.color,
          sub_category: fence.sub_category,
          structural_design: fence.structural_design,
          size: fence.size,
          grain: fence.grain,
          filesImage: imageUrlList,
          status: FENCE_STATUS.NOT_STARTED,
          addedBy: user.id,
        };
      })
    );
    return requestData;
  };

  const handleSaveError = async (error) => {
    enqueueSnackbar(`${error}`, {
      variant: 'error',
    });
    setIsSaveLoading(false);
  };

  const onlyUnique = (value, index, array) => array.indexOf(value) === index;

  const SavetoDashboard = async () => {
    if (
      total_selected_list.length +
        selectedFences.length +
        request_list.length -
        removed_list.length >
      subscription.totalFences
    ) {
      enqueueSnackbar(
        `You can select only ${subscription.totalFences} Fences. If you want to select more fences, upgrade your subscription.`,
        {
          variant: 'error',
        }
      );
      return;
    }
    handleSaveClose(false);
    setIsSaveLoading(true);

    let selectedFences_list = [
      ...selectedFences.map((fence) => (fence ? fence.id : null)).filter((id) => id !== null),
      ...(Array.isArray(selected_list)
        ? selected_list.map((fence) => (fence ? fence.id : null)).filter((id) => id !== null)
        : []),
    ];

    selectedFences_list = selectedFences_list.filter(onlyUnique);
    let removed_id_list = [];
    removed_id_list = removed_list && removed_list.map((item) => item.id);

    removed_id_list.forEach((fence) => {
      selectedFences_list = selectedFences_list.filter((item) => item !== fence);
    });

    const requestData = await handleRequestData(request_list);
    // await confirmFenceRequestWebhook(user, requestData);
    const updateData = {
      selectedFences: selectedFences_list,
      requestFences: requestData,
      favoriteFences: [...new Set([...favorite_list.map((fence) => fence.id)])],
      email: user?.email.toLowerCase(),
      swapCount,
      swapRemoveCount,
      swapAddCount,
    };
    dispatch(setCurrentSelectedFences([]));
    dispatch(setNewRequest([]));
    dispatch(setRemoved([]));
    dispatch(userAction.updateFences(user?.id, updateData, navigate, handleSaveError));
    dispatch(initialize());
    setIsSaveLoading(false);
  };

  const NotSavetoDashboard = async () => {
    setIsNotSaveLoading(true);
    dispatch(setCurrentSelectedFences([]));
    dispatch(setRequestSwapper([]));
    navigate(PATH_DASHBOARD.user.account);
    setIsNotSaveLoading(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setArrowCLick(null);
    setOpen(false);
  };

  const handleSaveClose = () => {
    setAnchorEl(null);
    setArrowCLick(null);
    setSaveOpen(false);
  };

  const handleAddSelectedSwapper = async (data) => {
    const removed_id_list = removed_list && removed_list.map((item) => item.id);
    // check current selected count is over than max fences
    if (
      total_selected_list.length +
        selected_list.length +
        request_list.length -
        removed_list.length +
        1 >
      subscription.totalFences
    ) {
      enqueueSnackbar('Please remove fences in My Fences before adding new ones.', {
        variant: 'error',
      });
      return;
    }

    // check already exist
    if (selectedFences.map((item) => item.id).indexOf(data) > -1) {
      enqueueSnackbar('The fence is already added to your selected list', { variant: 'error' });
      return;
    }

    if (removed_id_list.includes(data)) {
      const removedList = removed_list.filter((item) => item.id !== data);
      dispatch(setRemoved(removedList));
    } else {
      const favoriteItem = favorite_list.find((item) => item.id === data);
      const fenceData = {
        id: data,
        filesImage: favoriteItem.filesImage,
        sub_category: favoriteItem.sub_category,
        name: favoriteItem.name,
        size: favoriteItem.size,
        style: favoriteItem.style,
        color: favoriteItem.color,
      };
      dispatch(setCurrentSelectedFences([...selectedFences, fenceData]));
    }
  };

  const renderNavVertical = (
    <NavVertical openNav={navOpen} onCloseNav={handleNavClose} s_type={2} />
  );

  const headerContent = (
    <>
      <Stack sx={{ mt: 3, alignItems: 'start' }}>
        {isMobile && location.pathname === '/categoryfences' && (
          <>
            <IconButton sx={{ mr: 1, color: 'text.primary' }} onClick={handleNavOpen}>
              <Iconify icon="eva:menu-2-fill" style={{ transform: 'rotate(90deg)' }} />
            </IconButton>
            {renderNavVertical}
          </>
        )}
      </Stack>
      <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          variant="text"
          color="inherit"
          style={{
            marginTop: '8px',
            marginBottom: '8px',
            backgroundColor: '#1FA9FF',
            color: 'white',
            height: '40px',
            borderRadius: '10px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          sx={{
            width: { sm: '180px', xs: '130px' },
            fontSize: { sm: '15px', xs: '13px' },
          }}
          onClick={handleClickOpen}
        >
          Cancel
        </Button>
        <Button
          className="step8"
          variant="contained"
          style={{
            marginTop: '8px',
            padding: '5px 5px',
            color: 'white',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#1FA9FF',
          }}
          sx={{
            width: { sm: '180px', xs: '130px' },
            fontSize: { sm: '15px', xs: '13px' },
          }}
          onClick={handleClickSaveOpen}
        >
          Save and Finish
          {/* <TaskAlt /> */}
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: { xs: '19px', sm: '24px', md: '28px', lg: '40px' },
            fontWeight: 800,
            color: 'black',
          }}
        >
          Manage My Fences
        </Typography>
        <Stack direction="column" alignItems="flex-end">
          <Typography variant="h6" sx={{ color: 'black' }}>
            My Fences : &nbsp;
            {total_selected_list.length + selectedFences.length - removed_list.length} /{' '}
            {subscription.totalFences}
          </Typography>
          {subscription.name === 'Enterprise' ||
          subscription.name === 'Pro+' ||
          subscription.name === 'Pro' ||
          subscription.name === 'Basic' ? (
            <Typography variant="h6" sx={{ color: 'black', fontSize: '0.9rem' }}>
              Requests : {origin_requestList.length + request_list.length}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </>
  );

  const itemContent = (
    <Stack
      sx={{
        gap: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 1,
        mt: '5px',
      }}
    >
      <Stack
        className="step6"
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
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={(event) => {
            setPopOverData({ title: 'Added to My Requests', fences: request_list });
            handleClick(event);
          }}
        >
          <Badge badgeContent={request_list.length} color="primary">
            <img src={Request} alt="request" />
          </Badge>
        </Button>
        <Typography fontSize="12px" color="black">
          Requests
        </Typography>
      </Stack>
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
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={(event) => {
            setPopOverData({ title: 'Added to My Fences', fences: selectedFences });
            handleClick(event);
          }}
        >
          <Badge badgeContent={selectedFences.length} color="success">
            <img src={Select} alt="select" />
          </Badge>
        </Button>
        <Typography fontSize="12px" color="black">
          My Fences
        </Typography>
      </Stack>

      {/* <Stack
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
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={(event) => {
            setPopOverData({ title: 'Favorites', fences: favorite_list });
            handleClick(event);
          }}
        >
          <Badge badgeContent={favorite_list.length} color="error">
            <img src={Favour} alt="favour" />
          </Badge>
        </Button>
        <Typography fontSize="12px" color="black">
          Favorites
        </Typography>
      </Stack> */}

      {/* <Stack
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
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={(event) => {
            setPopOverData({ title: 'Removed from My Fences', fences: removed_list });
            handleClick(event);
          }}
        >
          <Badge badgeContent={removed_list.length} color="info">
            <img src={Recycle} alt="recycle" />
          </Badge>
        </Button>
        <Typography fontSize="12px" color="black">
          Removed
        </Typography>
      </Stack> */}
    </Stack>
  );

  const cases = location.pathname.split('/')[1];

  const renderContent = (
    <>
      {!isMobile && (
        <div className="w-full bg-white mt-50 z-10">
          {headerContent}
          <div className="z-10 flex justify-between bg-gray-100 shadow-md">
            <div className="flex items-center">
              {cases === 'requestfences' && (
                <Stack
                  sx={{
                    gap: { lg: 2, sm: 1 },
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 2,
                  }}
                >
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#FFFFFF',
                      height: '50px',
                      fontSize: 13,
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => {
                      navigate(PATH_ONBOARDING.onboarding.categoryfences);
                      localStorage.setItem('pageType', 'selectorSwapper');
                    }}
                  >
                    <p style={{ lineHeight: 1.2, color: '#000000' }}>Add</p>
                    <p
                      style={{
                        lineHeight: 1.2,
                        color: '#000000',
                        marginRight: '16px',
                        marginLeft: '16px',
                      }}
                    >
                      Fences
                    </p>
                  </Button>
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#FFFFFF',
                      height: '50px',
                      fontSize: 13,
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => {
                      navigate(PATH_ONBOARDING.onboarding.fenceSwapper);
                      localStorage.removeItem('pageType');
                    }}
                  >
                    <p style={{ lineHeight: 1.2 }} className="text-[#000000]">
                      Remove
                    </p>
                    <p
                      style={{ lineHeight: 1.2, marginRight: '16px', marginLeft: '16px' }}
                      className="text-[#000000]"
                    >
                      Fences
                    </p>
                  </Button>
                  {user?.userType && user.userType === UserType['Free Trial'] ? (
                    ''
                  ) : (
                    <Button
                      variant="text"
                      color="inherit"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '10px',
                        marginBottom: '10px',
                        backgroundColor: '#1FA9FF',
                        color: 'white',
                        height: '50px',
                        fontSize: 13,
                        borderRadius: '14px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      onClick={() => {
                        navigate(PATH_ONBOARDING.onboarding.requestFencesSwapper);
                        setIsOpen(true);
                        localStorage.setItem('pageType', 'addFence');
                      }}
                    >
                      <p style={{ lineHeight: 1.2 }}>Request</p>
                      <p
                        style={{
                          lineHeight: 1.2,
                          marginRight: '16px',
                          marginLeft: '16px',
                        }}
                      >
                        Fences
                      </p>
                    </Button>
                  )}
                </Stack>
              )}
              {cases === 'fenceswapper' && (
                <Stack
                  sx={{
                    gap: { lg: 2, sm: 1 },
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 2,
                  }}
                >
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '50px',
                      fontSize: 13,
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => {
                      navigate(PATH_ONBOARDING.onboarding.categoryfences);
                      localStorage.setItem('pageType', 'selectorSwapper');
                    }}
                  >
                    <p style={{ lineHeight: 1.2, color: '#000000' }}>Add</p>
                    <p
                      style={{
                        lineHeight: 1.2,
                        color: '#000000',
                        marginRight: '16px',
                        marginLeft: '16px',
                      }}
                    >
                      Fences
                    </p>
                  </Button>
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#1FA9FF',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'white',
                      height: '50px',
                      fontSize: 13,
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => {
                      navigate(PATH_ONBOARDING.onboarding.fenceSwapper);
                      localStorage.removeItem('pageType');
                    }}
                  >
                    <p style={{ lineHeight: 1.2 }}>Remove</p>
                    <p style={{ lineHeight: 1.2, marginRight: '16px', marginLeft: '16px' }}>
                      Fences
                    </p>
                  </Button>

                  {user?.userType && user.userType === UserType['Free Trial'] ? (
                    ''
                  ) : (
                    <Button
                      variant="text"
                      color="inherit"
                      style={{
                        marginTop: '10px',
                        marginBottom: '10px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '50px',
                        fontSize: 13,
                        borderRadius: '14px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      onClick={() => {
                        navigate(PATH_ONBOARDING.onboarding.requestFencesSwapper);
                        setIsOpen(true);
                        localStorage.setItem('pageType', 'addFenceSwapper');
                      }}
                    >
                      <p style={{ lineHeight: 1.2 }} className="text-[#000000]">
                        Request
                      </p>
                      <p
                        style={{
                          lineHeight: 1.2,
                          marginRight: '16px',
                          marginLeft: '16px',
                        }}
                        className="text-[#000000]"
                      >
                        Fences
                      </p>
                    </Button>
                  )}
                  <SelectFencesSearch />
                </Stack>
              )}
              {(cases === 'categoryfences' || cases === 'stylefences') && (
                <Stack
                  sx={{
                    gap: { lg: 2, sm: 1 },
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 2,
                  }}
                >
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#1FA9FF',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'white',
                      height: '50px',
                      fontSize: 13,
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => {
                      navigate(PATH_ONBOARDING.onboarding.categoryfences);
                      localStorage.setItem('pageType', 'selectorSwapper');
                    }}
                  >
                    <p style={{ lineHeight: 1.2 }}>Add</p>
                    <p
                      style={{
                        lineHeight: 1.2,
                        marginRight: '16px',
                        marginLeft: '16px',
                      }}
                    >
                      Fences
                    </p>
                  </Button>
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '50px',
                      fontSize: 13,
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => {
                      navigate(PATH_ONBOARDING.onboarding.fenceSwapper);
                      localStorage.removeItem('pageType');
                    }}
                  >
                    <p style={{ lineHeight: 1.2 }} className="text-[#000000]">
                      Remove
                    </p>
                    <p
                      style={{ lineHeight: 1.2, marginRight: '16px', marginLeft: '16px' }}
                      className="text-[#000000]"
                    >
                      Fences
                    </p>
                  </Button>

                  {user?.userType && user.userType === UserType['Free Trial'] ? (
                    ''
                  ) : (
                    <Button
                      variant="text"
                      color="inherit"
                      style={{
                        marginTop: '10px',
                        marginBottom: '10px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '50px',
                        fontSize: 13,
                        borderRadius: '14px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      onClick={() => {
                        navigate(PATH_ONBOARDING.onboarding.requestFencesSwapper);
                        setIsOpen(true);
                        localStorage.setItem('pageType', 'addFence');
                      }}
                    >
                      <p style={{ lineHeight: 1.2 }} className="text-[#000000]">
                        Request
                      </p>
                      <p
                        style={{
                          lineHeight: 1.2,
                          marginRight: '16px',
                          marginLeft: '16px',
                        }}
                        className="text-[#000000]"
                      >
                        Fences
                      </p>
                    </Button>
                  )}
                  <SelectFencesSearch />
                </Stack>
              )}
              {cases === 'detailfences' && (
                <Stack
                  sx={{
                    gap: { lg: 2, sm: 1 },
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 2,
                  }}
                >
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#1FA9FF',
                      color: 'white',
                      height: '50px',
                      fontSize: 13,
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => {
                      navigate(PATH_ONBOARDING.onboarding.categoryfences);
                      localStorage.setItem('pageType', 'selectorSwapper');
                    }}
                  >
                    <p style={{ lineHeight: 1.2 }}>Add</p>
                    <p
                      style={{
                        lineHeight: 1.2,
                        marginRight: '16px',
                        marginLeft: '16px',
                      }}
                    >
                      Fences
                    </p>
                  </Button>
                  <Button
                    variant="text"
                    color="inherit"
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '50px',
                      fontSize: 13,
                      borderRadius: '14px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => {
                      navigate(PATH_ONBOARDING.onboarding.fenceSwapper);
                      localStorage.removeItem('pageType');
                    }}
                  >
                    <p style={{ lineHeight: 1.2, color: '#000000' }}>Remove</p>
                    <p
                      style={{
                        lineHeight: 1.2,
                        color: '#000000',
                        marginRight: '16px',
                        marginLeft: '16px',
                      }}
                    >
                      Fences
                    </p>
                  </Button>

                  {user?.userType && user.userType === UserType['Free Trial'] ? (
                    ''
                  ) : (
                    <Button
                      variant="text"
                      color="inherit"
                      style={{
                        marginTop: '10px',
                        marginBottom: '10px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '50px',
                        fontSize: 13,
                        borderRadius: '14px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      onClick={() => {
                        navigate(PATH_ONBOARDING.onboarding.requestFencesSwapper);
                        setIsOpen(true);
                        localStorage.setItem('pageType', 'addFenceSwapper');
                      }}
                    >
                      <p style={{ lineHeight: 1.2 }} className="text-[#000000]">
                        Request
                      </p>
                      <p
                        style={{
                          lineHeight: 1.2,
                          marginRight: '16px',
                          marginLeft: '16px',
                        }}
                        className="text-[#000000]"
                      >
                        Fences
                      </p>
                    </Button>
                  )}

                  <SelectFencesSearch />
                </Stack>
              )}
            </div>
            {itemContent}
          </div>
        </div>
      )}

      {isMobile && (
        <div className="w-full -mt-[10px]">
          {headerContent}
          <div
            className="z-10 flex justify-between bg-gray-100 shadow-md"
            style={{ padding: '4px' }}
          >
            {cases === 'fenceswapper' && (
              <>
                <div className="flex">
                  <IconButton sx={{ mr: 1, color: 'text.primary' }} onClick={handleClickIcon}>
                    <Iconify icon="eva:menu-2-fill" style={{ transform: 'rotate(90deg)' }} />
                  </IconButton>

                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={() => handleMenuItemClick('selector')}>Add Fences</MenuItem>

                    {user?.userType && user.userType === UserType['Free Trial'] ? (
                      ''
                    ) : (
                      <MenuItem onClick={() => handleMenuItemClick('addFenceSwapper')}>
                        Request Fences
                      </MenuItem>
                    )}
                  </Menu>

                  <div style={{ alignSelf: 'center' }}>
                    {isMobile ? (
                      <div className="mt-[5px] mb-[5px] mr-[16px]">
                        <SelectFencesSearch />
                      </div>
                    ) : (
                      <div className="mt-[5px] ml-[5px]">
                        <SelectFencesSearch />
                      </div>
                    )}
                  </div>
                </div>
                <IconButton sx={{ mr: 1, color: 'text.primary' }} onClick={handleArrowClick}>
                  <Iconify
                    icon="eva:arrow-ios-forward-fill"
                    style={{ transform: 'rotate(90deg)' }}
                  />
                </IconButton>
              </>
            )}
            {cases === 'requestfences' && (
              <>
                <IconButton sx={{ mr: 1, color: 'text.primary' }} onClick={handleClickIcon}>
                  <Iconify icon="eva:menu-2-fill" style={{ transform: 'rotate(90deg)' }} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={() => handleMenuItemClick('selector')}>Add Fences</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('myfence')}>Remove Fences</MenuItem>
                  &nbsp;&nbsp;&nbsp;
                </Menu>
                {itemContent}
              </>
            )}
            {(cases === 'categoryfences' || cases === 'stylefences') && (
              <>
                <IconButton sx={{ mr: 1, color: 'text.primary' }} onClick={handleClickIcon}>
                  <Iconify icon="eva:menu-2-fill" style={{ transform: 'rotate(90deg)' }} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={() => handleMenuItemClick('myfence')}>Remove Fences</MenuItem>
                  {user?.userType && user.userType === UserType['Free Trial'] ? (
                    ''
                  ) : (
                    <MenuItem onClick={() => handleMenuItemClick('addFenceSwapper')}>
                      Request Fences
                    </MenuItem>
                  )}
                  &nbsp;&nbsp;&nbsp;
                </Menu>
                <Stack sx={{ alignItems: 'center' }}>
                  <SelectFencesSearch />
                </Stack>
                <IconButton sx={{ mr: 1, color: 'text.primary' }} onClick={handleArrowClick}>
                  <Iconify
                    icon="eva:arrow-ios-forward-fill"
                    style={{ transform: 'rotate(90deg)' }}
                  />
                </IconButton>
              </>
            )}
            {cases === 'detailfences' && (
              <>
                <IconButton sx={{ mr: 1, color: 'text.primary' }} onClick={handleClickIcon}>
                  <Iconify icon="eva:menu-2-fill" style={{ transform: 'rotate(90deg)' }} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={() => handleMenuItemClick('selector')}>Add Fences</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('myfence')}>Remove Fences</MenuItem>
                  {user?.userType && user.userType === UserType['Free Trial'] ? (
                    ''
                  ) : (
                    <MenuItem onClick={() => handleMenuItemClick('addFenceSwapper')}>
                      Request Fences
                    </MenuItem>
                  )}
                  &nbsp;&nbsp;&nbsp;
                </Menu>
                {itemContent}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );

  let color = '';

  if (popOverData.title === 'Favorites') {
    color = 'error';
  } else if (popOverData.title === 'Added to My Fences') {
    color = 'primary';
  } else if (popOverData.title === 'Added to My Requests') {
    color = 'success';
  } else if (popOverData.title === 'Removed from My Fences') {
    color = 'info';
  }

  return (
    // <AppBar
    //   sx={{
    //     boxShadow: 'none',

    //     zIndex: theme.zIndex.appBar + 1,
    //     bgcolor: 'white',
    //     ...(isDesktop && {
    //       ...(isNavHorizontal && {
    //         width: 1,
    //         bgcolor: 'background.default',
    //         borderBottom: `dashed 1px ${theme.palette.divider}`,
    //       }),
    //       ...(isNavMini && {
    //         width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
    //       }),
    //     }),
    //   }}
    // >
    //   <Toolbar
    //     sx={{
    //       height: 1,
    //       px: { lg: 5 },
    //     }}
    //   >
    <Stack
      width="100%"
      px={{ lg: 5 }}
      sx={{
        backgroundColor: '#ffffff',
      }}
    >
      {renderContent}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ minWidth: '300px', maxWidth: '600px' }} id="simple-dialog-title">
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              paddingRight: { sm: '48px', xs: '0' },
              paddingLeft: { sm: '48px', xs: '0' },
              paddingTop: '32px',
              paddingBottom: '4px',
            }}
            align="center"
          >
            Are you sure you want to exit?
            <br />
            All changes will be lost.
          </Typography>
        </DialogTitle>
        <Stack flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
          <Button
            variant="text"
            color="inherit"
            style={{
              color: 'white',
              backgroundColor: '#1288e3',
              padding: '15px 16px',
              width: '230px',
              height: '42px',
              fontSize: '17px',
              textAlign: 'center',
              borderRadius: '14px',
              marginBottom: '10px',
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="text"
            color="inherit"
            loading={isNotSaveLoading}
            style={{
              color: 'white',
              backgroundColor: '#1288e3',
              padding: '15px 16px',
              width: '230px',
              height: '42px',
              fontSize: '17px',
              textAlign: 'center',
              borderRadius: '14px',
              marginBottom: '50px',
            }}
            onClick={NotSavetoDashboard}
          >
            Exit
          </LoadingButton>
        </Stack>
      </Dialog>

      <Dialog open={saveopen} onClose={handleSaveClose}>
        <DialogTitle
          sx={{ minWidth: '300px', maxWidth: '900px', paddingBottom: '0' }}
          id="simple-save-dialog-title"
        >
          <Typography
            sx={{
              fontSize: { sm: '20px', xs: '16px' },
              fontWeight: 700,
              paddingRight: { sm: '48px', xs: '0' },
              paddingLeft: { sm: '48px', xs: '0' },
              paddingTop: '10px',
              paddingBottom: '12px',
              lineHeight: 1.1,
            }}
            align="center"
          >
            If you added or removed Fences,
            <br />
            make sure you tap “Sync Data”
            <br />
            in the app menu.
          </Typography>
        </DialogTitle>
        <Stack flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
          <Stack display="flex" flexDirection="row">
            <img
              src="/assets/swap_confirm1.svg"
              alt="swapperconfirm1"
              style={{ width: '210px', paddingRight: '28px', paddingLeft: '28px' }}
            />
            <img
              src="/assets/swap_confirm2.svg"
              alt="swapperconfirm2"
              style={{ width: '210px', paddingRight: '28px', paddingLeft: '28px' }}
            />
          </Stack>
          <Typography
            sx={{
              fontSize: { sm: '20px', xs: '16px' },
              fontWeight: 700,
              paddingRight: { sm: '48px', xs: '0' },
              paddingLeft: { sm: '48px', xs: '0' },
              paddingBottom: '20px',
              lineHeight: 1.1,
            }}
            align="center"
          >
            If you requested Fences, we will
            <br />
            send you a quote shortly!
          </Typography>
          <Button
            variant="text"
            color="inherit"
            style={{
              color: 'white',
              backgroundColor: '#1288e3',
              padding: '15px 16px',
              width: '230px',
              height: '42px',
              fontSize: '17px',
              textAlign: 'center',
              borderRadius: '14px',
              marginBottom: '4px',
            }}
            onClick={handleSaveClose}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="text"
            color="inherit"
            style={{
              color: 'white',
              backgroundColor: '#1288e3',
              padding: '15px 16px',
              width: '230px',
              height: '42px',
              fontSize: '17px',
              textAlign: 'center',
              borderRadius: '14px',
              marginBottom: '38px',
            }}
            onClick={SavetoDashboard}
          >
            Save and Finish
          </LoadingButton>
        </Stack>
      </Dialog>

      {isSaveLoading && (
        <Dialog open>
          <DialogTitle sx={{ minWidth: '300px', maxWidth: '900px', paddingBottom: '0' }}>
            <Typography
              sx={{
                fontSize: isMobile ? '24px' : '40px',
                fontWeight: 700,
                fontFamily: 'Poppins',
                pr: { sm: '48px', xs: '0' },
                pl: { sm: '48px', xs: '0' },
                pt: '10px',
                pb: '12px',
                mb: '20px',
                lineHeight: 1.1,
              }}
              align="center"
            >
              Saving Changes
            </Typography>
          </DialogTitle>
          <Stack
            width={isMobile ? 350 : 550}
            height={isMobile ? 250 : 450}
            sx={{ position: 'relative' }}
          >
            <Box>
              <CircularProgress
                variant="determinate"
                size={isMobile ? 200 : 350}
                thickness={4}
                value={100}
                sx={{ color: '#DADADA', left: isMobile ? 75 : 100, position: 'absolute' }}
              />
              <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                  color: '#1a90ff',
                  animationDuration: '2500ms',
                  position: 'absolute',
                  left: isMobile ? 75 : 100,
                  [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: 'round',
                  },
                }}
                size={isMobile ? 200 : 350}
                thickness={4}
              />
            </Box>
            <Box
              sx={{
                top: isMobile ? 30 : 10,
                left: isMobile ? 100 : 150,
                right: isMobile ? 100 : 150,
                bottom: 0,
                height: isMobile ? 150 : 350,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                component="div"
                color="black"
                sx={{
                  fontSize: isMobile ? '16px' : '22px',
                  fontFamily: 'Public Sans',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Please wait, this may take a few minutes.
              </Typography>
            </Box>
          </Stack>
        </Dialog>
      )}

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
        <Box sx={{ p: 2, width: '345px' }}>
          <div className="flex justify-between">
            <div>{}</div>
            <Typography variant="h5" gutterBottom>
              {popOverData.title}
            </Typography>

            <Badge badgeContent={popOverData.fences.length} color={color}>
              <img
                src={getImage(popOverData.title)}
                className="w-[20px] h-[20px] cursor-pointer"
                alt="favour"
              />
            </Badge>
          </div>

          {popOverData &&
            popOverData.fences &&
            popOverData.fences.length > 0 &&
            popOverData.fences.map((fence, index) => (
              <Box
                style={{
                  boxShadow: '0px 6px 9px #a6a6a6',
                  alignSelf: 'center',
                  width: '320px',
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
                        <FileImage
                          src={
                            fence?.filesImage && fence.filesImage.length > 0
                              ? fence.filesImage[0].preview
                              : NoImage
                          }
                          className="w-[70px] cursor-pointer"
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
                          <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>
                            {fence?.name}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={2} sx={{ alignSelf: 'center' }}>
                    {popOverData.title === 'Favorites' ? (
                      <Stack display="flex" flexDirection="row" gap="4px">
                        <Tooltip TransitionComponent={Zoom} placement="top" title="Add on Fences">
                          <IconButton
                            onClick={() => handleAddSelectedSwapper(fence && fence.id)}
                            sx={{ minWidth: '24px !important', px: '1px !important' }}
                          >
                            <AddIcon color="action" className="w-[20px] h-[20px]" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          TransitionComponent={Zoom}
                          placement="top"
                          title="Remove from Favorites"
                        >
                          <Button
                            onClick={() => handleItemDelete(fence && fence.id)}
                            sx={{ minWidth: '24px !important', px: '1px !important' }}
                          >
                            <img src={Trash} className="w-[20px] h-[20px]" alt="trash" />
                          </Button>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <Button onClick={() => handleItemDelete(fence && fence.id)}>
                        {popOverData.title === 'Removed from My Fences' ? (
                          <img src={Remove} className="w-[20px] h-[20px]" alt="remove" />
                        ) : (
                          <img src={Trash} className="w-[20px] h-[20px]" alt="trash" />
                        )}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}
        </Box>
      </Popover>

      <Popover
        open={Boolean(arrowClick)}
        anchorEl={arrowClick}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>{itemContent}</Box>
      </Popover>
    </Stack>
    // </Toolbar>
    // </AppBar>
  );
}

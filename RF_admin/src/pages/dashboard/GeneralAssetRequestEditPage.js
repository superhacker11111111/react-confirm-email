import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Button,
  Divider,
  Container,
  IconButton,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getAssetRequest,
  updateProductsStatus,
  deleteAssetRequest,
} from '../../redux/slices/product';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen';

import { useSnackbar } from '../../components/snackbar';
//
import AssetRequestAnalytic from '../../sections/@dashboard/general/assetRequest/AssetRequestAnalytic';
import { FENCE_STATUS } from '../../assets/data/roles';
import { PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function AssetRequestEditPage() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const { assetRequest, assetRequestCount, requestCompany, isLoading } = useSelector(
    (state) => state.product
  );

  const [openConfirm, setOpenConfirm] = useState(false);
  const [exitOpenConfirm, setExitOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [changedValues, setChangedValues] = useState([]);

  useEffect(() => {
    handleTableEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleTableEvent = () => {
    dispatch(getAssetRequest(id));
  };

  const onHandleDelete = (itemId) => {
    dispatch(deleteAssetRequest(itemId, id, SnackBar));
  };

  const onHandleChange = (checkedId, checked) => {
    if (assetRequest && assetRequest.length > 0) {
      const changedProducts = assetRequest.filter((item) => item.id === checkedId);
      if (changedProducts[0].status === checked) {
        const changes = changedValues.filter((item) => item.id !== checkedId);
        setChangedValues(changes);
      } else {
        setChangedValues([
          ...changedValues,
          {
            id: checkedId,
            status: checked,
          },
        ]);
      }
    }
  };

  const onHandleSave = () => {
    if (changedValues.length > 0) {
      dispatch(updateProductsStatus(changedValues, SnackBar));
      setChangedValues([]);
    } else {
      SnackBar('No Changes', 'error');
    }
  };

  const onHandleDeleteRequest = (requestId) => {
    setDeleteId(requestId);
    handleOpenConfirm();
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Helmet>
            <title> User: List | RealityFence</title>
          </Helmet>

          <Container maxWidth={themeStretch ? false : 'lg'}>
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
                    icon="eva:bell-fill"
                    color={theme.palette.error.main}
                  />

                  <AssetRequestAnalytic
                    title="Pending"
                    total={assetRequestCount.pending}
                    icon="eva:clock-fill"
                    color={theme.palette.warning.main}
                  />

                  <AssetRequestAnalytic
                    title="Complete"
                    total={assetRequestCount.complete}
                    icon="eva:checkmark-circle-2-fill"
                    color={theme.palette.success.main}
                  />
                </Stack>
              </Scrollbar>
            </Card>
            <Typography variant="h4" mb={2}>
              Asset Request: {requestCompany?.company}
            </Typography>
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(2, 1fr)',
                xl: 'repeat(3, 1fr)',
              }}
            >
              {assetRequest &&
                assetRequest.length > 0 &&
                assetRequest.map((request, index) => (
                  <AseetRequestCard
                    key={index}
                    assetRequest={request}
                    handleStatusChange={onHandleChange}
                    handleRequestDelete={onHandleDeleteRequest}
                  />
                ))}
            </Box>
            <Stack
              spacing={20}
              p={5}
              direction={{ xs: 'column-reverse', sm: 'row' }}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                sx={{ width: '160px' }}
                onClick={() => setExitOpenConfirm(true)}
              >
                Exit
              </Button>
              <Button variant="contained" sx={{ width: '160px' }} onClick={onHandleSave}>
                Save
              </Button>
            </Stack>
          </Container>

          <Dialog open={openConfirm}>
            <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
              Are you sure you want to delete?
            </DialogTitle>
            <Stack justifySelf="center">
              <Button
                variant="contained"
                sx={{
                  mb: 2,
                  mx: 12,
                  fontSize: '18px',
                  fontWeight: 900,
                  borderRadius: 1.5,
                }}
                onClick={() => {
                  onHandleDelete(deleteId);
                  handleCloseConfirm();
                }}
              >
                Delete Request
              </Button>
              <Button
                variant="contained"
                sx={{
                  mb: 10,
                  mx: 12,
                  fontSize: '18px',
                  fontWeight: 900,
                  borderRadius: 1.5,
                }}
                onClick={handleCloseConfirm}
              >
                Cancel
              </Button>
            </Stack>
          </Dialog>
          <Dialog open={exitOpenConfirm}>
            <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
              Do you want to exit?
            </DialogTitle>
            <Stack justifySelf="center">
              <Button
                variant="contained"
                sx={{
                  mb: 2,
                  mx: 12,
                  fontSize: '18px',
                  fontWeight: 900,
                  borderRadius: 1.5,
                }}
                onClick={() => {
                  setExitOpenConfirm(false);
                  onHandleSave();
                  navigate(PATH_DASHBOARD.general.assetRequest.root);
                }}
              >
                Save & Exit
              </Button>
              <Button
                variant="contained"
                sx={{
                  mb: 2,
                  mx: 12,
                  fontSize: '18px',
                  fontWeight: 900,
                  borderRadius: 1.5,
                }}
                onClick={() => {
                  setExitOpenConfirm(false);
                  navigate(PATH_DASHBOARD.general.assetRequest.root);
                }}
              >
                Don&apos;t Save & Exit
              </Button>
              <Button
                variant="contained"
                sx={{
                  mb: 10,
                  mx: 12,
                  fontSize: '18px',
                  fontWeight: 900,
                  borderRadius: 1.5,
                }}
                onClick={() => setExitOpenConfirm(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Dialog>
        </>
      )}
    </>
  );
}

AseetRequestCard.propTypes = {
  assetRequest: PropTypes.object,
  handleStatusChange: PropTypes.func,
  handleRequestDelete: PropTypes.func,
};

function AseetRequestCard({ assetRequest, handleStatusChange, handleRequestDelete }) {
  const navigate = useNavigate();
  const { id, name, size, filesImage, status, createdAt } = assetRequest;
  return (
    <Card
      sx={{
        p: 3,
        position: 'relative',
      }}
    >
      <IconButton
        size="small"
        onClick={() => {
          handleRequestDelete(id);
        }}
        sx={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: '24px',
          height: '24px',
          color: (themes) => alpha(themes.palette.common.black, 1),
          border: 'black 2px solid',
          bgcolor: (themes) => alpha(themes.palette.grey[900], 0.2),
          '&:hover': {
            bgcolor: (themes) => alpha(themes.palette.grey[900], 0.48),
          },
        }}
      >
        <Iconify icon="eva:close-fill" />
      </IconButton>
      <Stack flexDirection="column" justifyContent="space-between" gap={2} height="100%">
        <Stack flexDirection="column" gap={2}>
          <Stack
            flexDirection={{
              xs: 'column-reverse',
              md: 'row',
            }}
            justifyContent="space-between"
          >
            <Typography variant="h6">
              Request Date: {moment(createdAt).format('M/D/YYYY')}
            </Typography>
            <FormControl>
              <Select
                defaultValue={status}
                sx={{ minWidth: '100px', height: '30px' }}
                onChange={(e) => handleStatusChange(id, e.target.value)}
              >
                <MenuItem
                  value={FENCE_STATUS.NOT_STARTED}
                  sx={{
                    backgroundColor: '#f7ac9c',
                    borderRadius: '10px',
                    color: '#ff5630',
                    fontWeight: '500',
                    height: '30px',
                    mx: 1,
                  }}
                >
                  Not Started
                </MenuItem>
                <MenuItem
                  value={FENCE_STATUS.PENDING}
                  sx={{
                    backgroundColor: '#f7d287',
                    borderRadius: '10px',
                    color: '#ffab00',
                    fontWeight: '500',
                    mb: '5px',
                    mt: '5px',
                    height: '30px',
                    mx: 1,
                  }}
                >
                  Pending
                </MenuItem>
                <MenuItem
                  value={FENCE_STATUS.COMPLETE}
                  sx={{
                    backgroundColor: '#9dd5c0',
                    borderRadius: '10px',
                    color: '#36b37e',
                    fontWeight: '500',
                    height: '30px',
                    mx: 1,
                  }}
                >
                  Complete
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack
            flexDirection={{
              xs: 'column-reverse',
              md: 'row',
            }}
            justifyContent="space-between"
            gap={1}
          >
            <Stack width={{ xs: '100%', md: '50%' }}>
              {filesImage.length > 0 && (
                <Box
                  gap={1}
                  display="grid"
                  gridTemplateColumns={{
                    md: 'repeat(2, 1fr)',
                    xs: 'repeat(3, 1fr)',
                  }}
                >
                  {filesImage.map((image, index) => (
                    <Box
                      key={index}
                      p={1}
                      boxShadow={4}
                      borderRadius="10px"
                      justifyContent="center"
                      display="flex"
                    >
                      <img alt="file" src={image?.preview} />
                    </Box>
                  ))}
                </Box>
              )}
            </Stack>
            <Stack flexDirection="column" ml={{ xs: 0, md: 3 }} width={{ xs: '100%', md: '50%' }}>
              <Typography
                variant="h6"
                sx={{
                  // width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </Typography>
              <Typography variant="subtitle1">{size}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack>
          <Button
            variant="outlined"
            onClick={() => {
              navigate(PATH_DASHBOARD.general.assetRequest.view(paramCase(id)));
            }}
          >
            Generate PDF
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

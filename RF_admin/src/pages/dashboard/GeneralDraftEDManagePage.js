/* eslint-disable react/no-danger */
import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Container,
  Button,
  Typography,
  Card,
  useMediaQuery,
  Dialog,
  DialogTitle,
  Stack,
  Box,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { YouTubeLite } from 'react-youtube-lite';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { deleteED, getEDs } from '../../redux/slices/ed';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function GeneralDraftEDManagePage() {
  const { themeStretch } = useSettingsContext();
  const isIcon = useMediaQuery('(max-width:780px)');
  const isDesktop = useResponsive('up', 'sm');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const { drafts } = useSelector((state) => state.ed);

  const onHandleDelete = (id) => {
    dispatch(deleteED(id, SnackBar));
  };

  useEffect(() => {
    dispatch(getEDs());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Ecommerce: RealityFence ED | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack flexDirection={isDesktop ? 'row' : 'column'} justifyContent="space-between" mb={1}>
          <Typography variant="h4">Drafts</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              navigate(PATH_DASHBOARD.general.ED.root);
            }}
          >
            ED Home
          </Button>
        </Stack>

        <Card sx={{ p: 3 }}>
          {drafts &&
            drafts.length > 0 &&
            drafts.map((ed) => (
              <Stack flexDirection="row" py={4} gap={1} key={ed.id}>
                <Box width={{ sm: '480px', md: '640px' }}>
                  <YouTubeLite url={ed.url} style={{ width: '100%', height: '100%' }} />
                  <Typography sx={{ fontSize: isDesktop ? '24px' : '20px', color: '#006FBA' }}>
                    {ed.title}
                  </Typography>
                  <Typography sx={{ fontSize: isDesktop ? '16px' : '14px' }}>
                    <div dangerouslySetInnerHTML={{ __html: ed.caption }} />
                  </Typography>
                </Box>
                <Stack gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(PATH_DASHBOARD.general.ED.editED(paramCase(ed.id)))}
                    sx={{ height: 'fit-content' }}
                  >
                    {!isIcon ? (
                      <>
                        <Edit />
                        &nbsp; Edit Draft
                      </>
                    ) : (
                      <Edit />
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ height: 'fit-content' }}
                    onClick={() => {
                      setDeleteId(ed.id);
                      setOpen(true);
                    }}
                  >
                    {!isIcon ? (
                      <>
                        <Delete />
                        &nbsp; Delete
                      </>
                    ) : (
                      <Delete />
                    )}
                  </Button>
                </Stack>
              </Stack>
            ))}
        </Card>
        <Dialog open={open}>
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
                setOpen(false);
              }}
            >
              Delete RealityFence ED
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Dialog>
      </Container>
    </>
  );
}

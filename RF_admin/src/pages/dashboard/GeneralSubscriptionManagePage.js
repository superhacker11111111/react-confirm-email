import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Container,
  Button,
  Grid,
  Typography,
  Card,
  useMediaQuery,
  Dialog,
  DialogTitle,
  Stack,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { deleteSubscription, getSubscriptions } from '../../redux/slices/subscription';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function GeneralSubscriptionManagePage() {
  const { themeStretch } = useSettingsContext();
  const isIcon = useMediaQuery('(min-width:420px)');
  const isDesktop = useResponsive('up', 'sm');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const { subscriptions } = useSelector((state) => state.subscription);

  const onHandleDelete = (id) => {
    dispatch(deleteSubscription(id, SnackBar));
  };

  useEffect(() => {
    dispatch(getSubscriptions());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Category | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack flexDirection="row" justifyContent="space-between" mb={1}>
          <Typography variant="h4">Subscription Manager</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              navigate(PATH_DASHBOARD.general.subscription.newsubscription);
            }}
          >
            Add Subscription
          </Button>
        </Stack>

        <Card sx={{ p: 3 }}>
          <Typography variant="caption" fontWeight="bold" color="#637381">
            MANAGE SUBSCRIPTIONS
          </Typography>
          {subscriptions &&
            subscriptions.length > 0 &&
            subscriptions.map((subscription) => (
              <Grid key={subscription.id} container gap={1} mb={1} pl={2}>
                <Grid item xs={isIcon ? 6 : 12} sm={3.5}>
                  <Typography variant="h6">{subscription.name}</Typography>
                </Grid>
                <Grid item xs={isIcon ? 5 : 12} sm={8} container gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        PATH_DASHBOARD.general.subscription.editsubscription(
                          paramCase(subscription.id)
                        )
                      )
                    }
                  >
                    {isDesktop ? (
                      <>
                        <Edit />
                        &nbsp; Edit
                      </>
                    ) : (
                      <Edit />
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setDeleteId(subscription.id);
                      setOpen(true);
                    }}
                  >
                    {isDesktop ? (
                      <>
                        <Delete />
                        &nbsp; Delete
                      </>
                    ) : (
                      <Delete />
                    )}
                  </Button>
                </Grid>
              </Grid>
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
              Delete Category
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

import { Helmet } from 'react-helmet-async';
import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery,
  Dialog,
  DialogTitle,
} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
// redux
import { getAdmins, deleteAdmin, addAdmin } from '../../redux/slices/admin';
// components
import { useSettingsContext } from '../../components/settings';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function AddAdminPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const { admins } = useSelector((state) => state.admin);
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const NewCategorySchema = Yup.object().shape({
    email: Yup.string().required().email('Please enter a email address.'),
  });

  const defaultValues = useMemo(
    () => ({
      email: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const values = watch();

  const [open, setOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState('');

  useEffect(() => {
    dispatch(getAdmins());
  }, [dispatch]);

  const onHandleDelete = () => {
    dispatch(deleteAdmin(deleteItem.id, SnackBar));
  };

  const onSave = () => {
    const admin = {
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: values.email.toLowerCase(),
    };
    dispatch(addAdmin(admin, SnackBar, reset));
  };

  return (
    <>
      <Helmet>
        <title> Add Admin Page | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSave)}>
          <Typography variant="h3" textAlign="center" mb={10}>
            Add Administrator
          </Typography>
          <Grid
            container
            justifyContent="center"
            flexDirection={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 2 : 10}
          >
            <Grid item xs={isMobile ? 12 : 5}>
              <Stack flexDirection="column" spacing={3}>
                <Typography variant="h5">Add Administrator</Typography>
                <Stack spacing={1}>
                  <RHFTextField variant="filled" label="Email" name="email" />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={isMobile ? 12 : 5}>
              <Stack flexDirection="column" spacing={3}>
                <Typography variant="h5">Edit Current Administrators</Typography>
                <Stack spacing={1}>
                  {admins &&
                    admins.length > 0 &&
                    admins.map(
                      (admin, index) =>
                        admin.id !== user.id && (
                          <TextField
                            sx={{
                              borderRadius: '10px',
                              backgroundColor: '#ebf5ff',
                            }}
                            key={index}
                            value={admin.email}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => {
                                      setDeleteItem(admin);
                                      setOpen(true);
                                    }}
                                  >
                                    <DeleteOutlined />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )
                    )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Stack
            flexDirection={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="center"
            alignItems="center"
            mt={5}
            gap={{ lg: 20, md: 27, sm: 10, xs: 1 }}
          >
            <Button
              variant="contained"
              style={{ width: isMobile ? '230px' : '180px', backgroundColor: '#007aff' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              style={{ width: isMobile ? '230px' : '180px', backgroundColor: '#007aff' }}
            >
              Save
            </Button>
          </Stack>
        </FormProvider>
      </Container>

      <Dialog open={open}>
        <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
          Are you sure you want to remove user?
        </DialogTitle>
        <Stack justifySelf="center" gap={1}>
          <TextField
            value={deleteItem.email}
            sx={{ mx: 12, bgcolor: '#ebf5ff', borderRadius: '10px' }}
          />
          <Button
            variant="contained"
            sx={{
              mt: 2,
              mx: 12,
              bgcolor: '#007aff',
              fontSize: '18px',
              fontWeight: 900,
              borderRadius: 1.5,
            }}
            onClick={() => {
              onHandleDelete();
              setOpen(false);
            }}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            sx={{
              mb: 10,
              mx: 12,
              bgcolor: '#007aff',
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
    </>
  );
}

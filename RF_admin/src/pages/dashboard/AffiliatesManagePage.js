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
import { getAffiliates, deleteAffiliate, addAffiliate } from '../../redux/slices/affiliate';
// components
import { useSettingsContext } from '../../components/settings';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function AffiliateManagePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { affiliates } = useSelector((state) => state.affiliate);
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const NewAffiliateSchema = Yup.object().shape({
    name: Yup.string().required('Please enter a Name.'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewAffiliateSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const values = watch();

  const [open, setOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState([]);

  useEffect(() => {
    dispatch(getAffiliates());
  }, [dispatch]);

  const onHandleDelete = () => {
    dispatch(deleteAffiliate(deleteItem.id, SnackBar));
  };

  const onSave = () => {
    if (
      affiliates &&
      affiliates.length > 0 &&
      affiliates.map((affiliate) => affiliate.name).indexOf(values.name) > 0
    ) {
      SnackBar('The Lead Source is already exist', 'error');
    } else {
      dispatch(addAffiliate({ name: values.name }, SnackBar, reset));
    }
  };

  return (
    <>
      <Helmet>
        <title> Add Admin Page | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSave)}>
          <Typography variant="h3" textAlign="center" mb={10}>
            Lead Source
          </Typography>
          <Grid
            container
            justifyContent="center"
            flexDirection={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 2 : 10}
          >
            <Grid item xs={isMobile ? 12 : 5}>
              <Stack flexDirection="column" spacing={1}>
                <Typography color="#637381" fontWeight={700} fontSize="14.5px">
                  ADD A SOURCE
                </Typography>
                <Stack spacing={1}>
                  <RHFTextField variant="filled" label="Name" name="name" />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={isMobile ? 12 : 5}>
              <Stack flexDirection="column" spacing={1}>
                <Typography color="#637381" fontWeight={700} fontSize="14.5px">
                  Current affiliates
                </Typography>
                <Stack spacing={1}>
                  {affiliates &&
                    affiliates.length > 0 &&
                    affiliates.map((affiliate, index) => (
                      <TextField
                        sx={{
                          borderRadius: '10px',
                          backgroundColor: '#ebf5ff',
                        }}
                        key={index}
                        value={affiliate.name}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {
                                  setDeleteItem(affiliate);
                                  setOpen(true);
                                }}
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ))}
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
          Are you sure you want to remove affiliate?
        </DialogTitle>
        <Stack justifySelf="center" gap={1}>
          <TextField
            value={deleteItem.name}
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

import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Stack,
  Typography,
  Button,
  Grid,
  Collapse,
  Alert,
  IconButton,
  Container,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { CloseOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from '../../redux/store';
import FormProvider from '../../components/hook-form/FormProvider';
import { updateFence, getFenceByid } from '../../redux/slices/fence';
import { RHFTextField, RHFEditor } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';
import { PATH_DASHBOARD } from '../../routes/paths';

export default function FileManagerRenamePage() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const fileId = sessionStorage.getItem('fileId');
  const { fence } = useSelector((state) => state.fence);
  const { enqueueSnackbar } = useSnackbar();
  const Snackbar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const handleClickItem = () => {
    navigate(-1);
  };
  useEffect(() => {
    dispatch(getFenceByid(fileId));
  }, [dispatch, fileId]);

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    style: Yup.string().required('Style is required'),
    size: Yup.string().required('Panel Height x Width is required'),
    color: Yup.string().required('Color/Wood Color is required'),
    filesImage: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: (fence && fence[0]?.name) || '',
      description: (fence && fence[0]?.description) || '',
      category: (fence && fence[0]?.category) || '',
      sub_category: (fence && fence[0]?.sub_category) || '',
      style: (fence && fence[0]?.style) || '',
      size: (fence && fence[0]?.size) || '',
      color: (fence && fence[0]?.color) || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fence]
  );

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });
  const { reset, handleSubmit, watch } = methods;
  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleRename = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const fenceData = {
        name: values.name,
        description: values.description,
        category: values.category,
        sub_category: values.sub_category,
        style: values.style,
        size: values.size,
        color: values.color,
      };
      dispatch(updateFence(fence.id, fenceData, Snackbar, navigate));
      navigate(PATH_DASHBOARD.general.fileManager);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> RealityFence | Contact us </title>
      </Helmet>
      <Box sx={{ mt: 2 }}>
        <Container sx={{ px: { lg: 8 } }}>
          <Typography
            sx={{
              fontSize: { lg: '32px', xs: '24px' },
              fontWeight: '700',
              pb: 2,
            }}
          >
            Rename File
          </Typography>
        </Container>
      </Box>
      <Container sx={{ mt: 5, mb: 20 }}>
        <Box sx={{ px: { lg: 15 } }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(handleRename)}>
            <Stack
              spacing={4}
              sx={{
                borderRadius: 2,
                p: 2,
                boxShadow: (theme) => theme.customShadows.z24,
              }}
            >
              <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid container item direction="column" spacing={4}>
                  <Grid item>
                    <Collapse in={open}>
                      <Alert
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpen(false);
                            }}
                          >
                            <CloseOutlined fontSize="inherit" />
                          </IconButton>
                        }
                        severity="success"
                        sx={{ width: '100%' }}
                      >
                        Success!
                      </Alert>
                    </Collapse>
                  </Grid>
                  <Grid item>
                    <RHFTextField fullWidth label="name" name="name" />
                  </Grid>
                  <Grid container item display="flex" flexDirection="row" gap={2}>
                    <RHFTextField disabled="true" label="category" name="category" />
                    <RHFTextField disabled="true" label="sub_category" name="sub_category" />
                    <RHFTextField disabled="true" label="style" name="style" />
                  </Grid>
                  <Grid container item display="flex" flexDirection="row" gap={2}>
                    <RHFTextField disabled="true" label="size" name="size" />
                    <RHFTextField disabled="true" label="color" name="color" />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFEditor name="answer" label="Answer.." placeholder="Gothic post caps" />
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  direction="row"
                  justifyContent={{ md: 'space-between', xs: 'center', sm: 'space-between' }}
                  alignItems="center"
                  sm={10}
                  xs={10}
                  sx={{ alignSelf: 'center', py: 6 }}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 3,
                        fontSize: '16px',
                        letterSpacing: '1px',
                        width: '220px',
                        fontWeight: 'bold',
                        backgroundColor: 'rgb(31, 169, 255) !important',
                      }}
                      onClick={handleClickItem}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        mt: 3,
                        fontSize: '16px',
                        letterSpacing: '1px',
                        width: '220px',
                        backgroundColor: 'rgb(31, 169, 255) !important',
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
          </FormProvider>
        </Box>
      </Container>
    </>
  );
}

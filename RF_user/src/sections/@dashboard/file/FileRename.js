import * as Yup from 'yup';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Stack,
  Typography,
  Button,
  Grid,
  OutlinedInput,
  Collapse,
  Alert,
  IconButton,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { CloseOutlined } from '@mui/icons-material';
import FormProvider from '../../../components/hook-form/FormProvider';

export default function FileRename() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const handleClickItem = () => {
    navigate(-1);
  };

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    structural_design: Yup.string().required('Structural Design is required'),
    size: Yup.string().required('Panel Height x Width is required'),
    grain: Yup.string().required('Color/Wood Grain is required'),
    filesImage: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      category: '',
      sub_category: '',
      structural_design: '',
      size: '',
      grain: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRename = async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  };

  return (
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
          <Grid container item direction="column" spacing={2}>
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
              <OutlinedInput fullWidth placeholder="Cedar Gothic Picket" />
            </Grid>
            <Grid container item display="flex" flexDirection="row" gap={2}>
              <TextField name="wood" label="Wood" />
              <TextField name="cedar" label="Cedar" />
              <TextField name="picket" label="Picket" />
            </Grid>
            <Grid container item display="flex" flexDirection="row" gap={2}>
              <TextField name="size" label="4x8" />
              <TextField name="color" label="Color (Optional)" />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ fontWeight: '700' }}>Message</Typography>
              <OutlinedInput
                fullWidth
                placeholder="Hi there! I would like to get in touch because..."
                multiline
                rows={4}
              />
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
                }}
              >
                Rename
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </FormProvider>
  );
}

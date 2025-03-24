import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Button, Collapse, Alert } from '@mui/material';
// routes
import FormProvider, { RHFEditor, RHFTextField } from '../../../../components/hook-form';
import { addED, updateED } from '../../../../redux/slices/ed';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import setAuthToken from '../../../../utils/setAuthToken';
import { useSnackbar } from '../../../../components/snackbar';

EDNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  ED: PropTypes.object,
};

export default function EDNewEditForm({ isEdit = false, ED }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const displayAlert = async () => {
    await setOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await setOpen(false);
  };

  const NewEDSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    url: Yup.string().required('URL is required'),
    caption: Yup.string().required('Caption is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: ED?.title || '',
      url: ED?.url || '',
      caption: ED?.caption || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ED]
  );

  const methods = useForm({
    resolver: yupResolver(NewEDSchema),
    defaultValues,
  });

  const { reset, watch } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && ED) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, ED]);

  const handleClick = async (draft = false) => {
    try {
      const isValid = await methods.trigger();
      if (!isValid) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAuthToken(localStorage.getItem('accessToken'));
      const edData = {
        title: values.title,
        url: values.url,
        caption: values.caption,
        isDraft: draft,
      };
      if (isEdit) {
        dispatch(updateED(ED.id, edData, SnackBar, navigate));
      } else {
        dispatch(addED(edData, displayAlert, SnackBar));
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid item>
      <Collapse in={open}>
        <Alert sx={{ mb: 2 }}>Successfully created!</Alert>
      </Collapse>

      <Card sx={{ p: 5, width: '100%' }}>
        <FormProvider methods={methods}>
          <Grid item container direction="column" gap={2}>
            <RHFTextField name="title" label="Title of Post" variant="filled" />
            <RHFTextField name="url" label="Enter URL.." variant="filled" />
            <RHFEditor name="caption" label="Caption" placeholder="Caption" />
          </Grid>
          <Grid
            container
            item
            spacing={2}
            p={5}
            direction={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="center"
            alignItems="center"
            md={9}
          >
            <Grid item>
              <Button
                variant="contained"
                sx={{ width: '160px' }}
                onClick={() => navigate(PATH_DASHBOARD.general.ED.list)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{ width: '160px' }} onClick={() => handleClick(true)}>
                Save As Draft
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ width: '160px' }}
                onClick={() => handleClick(false)}
              >
                Publish
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </Grid>
  );
}

import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Button, Typography, Alert, Collapse } from '@mui/material';
// routes
import axios from '../../../../utils/axios';
import FormProvider, { RHFUpload } from '../../../../components/hook-form';
import { createImages } from '../../../../redux/slices/media';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import setAuthToken from '../../../../utils/setAuthToken';
import { S3_GALLERY_FOLDER } from '../../../../assets/data/roles';
import { AWS_S3_BUCKET } from '../../../../config-global';

export default function GalleryImageNewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const NewGallerySchema = Yup.object().shape({
    images: Yup.array().min(1, 'Images should more than 1'),
  });

  const showAlert = async () => {
    await setOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await setOpen(false);
  };

  const defaultValues = useMemo(
    () => ({
      images: [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewGallerySchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit, setValue } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const images = values.images || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('images', [...images, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleUpload = async () => {
    const fileUrlList = [];
    values.images.map(async (file) => {
      const data = {
        key: S3_GALLERY_FOLDER + Date.now().toString() + file.path,
        values,
      };
      const preSignedURL = await axios.post('/auth/presignedUrl', data);
      fileUrlList.push({
        preview: `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${data.key}`,
        key: data.key,
      });
      const myHeaders = new Headers({ 'Content-Type': 'file/jpeg' });
      await fetch(preSignedURL.data.signedUrl, {
        method: 'PUT',
        headers: myHeaders,
        body: file,
      });
    });
    return fileUrlList;
  };

  const handleRemove = (inputFile) => {
    const filtered = values.files && values.files?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleClick = async (draft = false) => {
    try {
      const fileList = await handleUpload();
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAuthToken(localStorage.getItem('accessToken'));
      dispatch(createImages(fileList, showAlert, reset));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid item>
      <Collapse in={open}>
        <Alert sx={{ mb: 2 }}>Successfully created!</Alert>
      </Collapse>
      <Card sx={{ p: 5, width: '100%' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleClick)}>
          <Grid item>
            <Typography variant="subtitle1" mb={1} fontWeight={700}>
              Gallery Images
            </Typography>
            <RHFUpload
              multiple
              thumbnail
              name="images"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              onUpload={handleUpload}
              style={{ height: '180px' }}
            />
          </Grid>
          <Grid
            container
            item
            spacing={2}
            p={5}
            direction={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            md={7}
          >
            <Grid item>
              <Button
                variant="contained"
                sx={{ width: '160px' }}
                onClick={() => navigate(PATH_DASHBOARD.general.media.editgalleryImage)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" sx={{ width: '160px' }}>
                Save
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </Grid>
  );
}

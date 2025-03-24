import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Button, Collapse, Alert } from '@mui/material';
// routes
import FormProvider, { RHFEditor, RHFTextField, RHFUpload } from '../../../../components/hook-form';
import { addBlog, updateBlog } from '../../../../redux/slices/blog';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import setAuthToken from '../../../../utils/setAuthToken';
import { useSnackbar } from '../../../../components/snackbar';
import { S3_BLOG_FILE_FOLDER } from '../../../../assets/data/roles';
import axios from '../../../../utils/axios';
import { AWS_S3_BUCKET } from '../../../../config-global';

BlogNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  blog: PropTypes.object,
};

export default function BlogNewEditForm({ isEdit = false, blog }) {
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

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    files: Yup.array().min(1, 'Files are required'),
    text: Yup.string().required('Caption is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: blog?.title || '',
      files: blog?.files || [],
      text: blog?.text || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blog]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && blog) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, blog]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.files || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('files', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.files]
  );

  const handleUpload = async () => {
    const fileUrlList = [];
    values.files.map(async (file) => {
      if (!file.key) {
        const data = {
          key: S3_BLOG_FILE_FOLDER + Date.now().toString() + file.path,
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
      } else {
        fileUrlList.push(file);
      }
    });
    return fileUrlList;
  };

  const handleRemoveFile = (inputFile) => {
    if (inputFile.key) {
      const filtered = values.files && values.files?.filter((file) => file.key !== inputFile.key);
      setValue('files', filtered);
    } else {
      const filtered = values.files && values.files?.filter((file) => file !== inputFile);
      setValue('files', filtered);
    }
  };

  const handleRemoveAllFiles = () => {
    setValue('files', []);
  };

  const handleClick = async (draft = false) => {
    try {
      const isValid = await methods.trigger();
      if (!isValid) {
        return;
      }
      const fileList = await handleUpload();
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAuthToken(localStorage.getItem('accessToken'));
      reset();
      if (isEdit) {
        const blogData = {
          title: values.title,
          text: values.text,
          files: fileList,
          isDraft: draft,
        };
        dispatch(updateBlog(blog.id, blogData, SnackBar, navigate));
      } else {
        const blogData = {
          title: values.title,
          text: values.text,
          files: fileList,
          isDraft: draft,
        };
        dispatch(addBlog(blogData, displayAlert, SnackBar));
      }
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
        <FormProvider methods={methods}>
          <Grid item container direction="column" gap={2}>
            <RHFTextField name="title" label="Blog Post Title" />
            <RHFUpload
              multiple
              thumbnail
              name="files"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={handleUpload}
              style={{ height: '180px' }}
            />
            <RHFEditor name="text" label="Text" placeholder="Text" sx={{ height: '400px' }} />
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
                onClick={() => navigate(PATH_DASHBOARD.general.blog.list)}
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

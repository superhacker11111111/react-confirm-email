import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Button, Collapse, Alert, MenuItem } from '@mui/material';
// routes
import FormProvider, {
  RHFEditor,
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from '../../../../components/hook-form';
import { addQA, updateQA } from '../../../../redux/slices/qa';
import { getQACategories } from '../../../../redux/slices/qacategory';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import setAuthToken from '../../../../utils/setAuthToken';
import { useSnackbar } from '../../../../components/snackbar';
import axios from '../../../../utils/axios';
import { AWS_S3_BUCKET } from '../../../../config-global';
import { S3_FAQ_IMAGE_FOLDER } from '../../../../assets/data/roles';

QANewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  QA: PropTypes.object,
};

export default function QANewEditForm({ isEdit = false, QA }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.qacategory);

  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const displayAlert = async () => {
    await setOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await setOpen(false);
  };

  const NewQASchema = Yup.object().shape({
    question: Yup.string().required('Question is required'),
    category: Yup.string().required('Category is required'),
    answer: Yup.string().required('Answer is required'),
  });

  const defaultValues = useMemo(
    () => ({
      question: QA?.question || '',
      answer: QA?.answer || '',
      category: QA?.category || '',
      images: QA?.images || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [QA]
  );

  const methods = useForm({
    resolver: yupResolver(NewQASchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && QA) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, QA]);

  useEffect(() => {
    dispatch(getQACategories());
  }, [dispatch]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.files || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.files]
  );

  const handleUpload = async () => {
    const fileUrlList = [];
    values.images.map(async (file) => {
      if (!file.key) {
        const data = {
          key: S3_FAQ_IMAGE_FOLDER + Date.now().toString() + file.path,
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
      setValue('images', filtered);
    } else {
      const filtered = values.files && values.files?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    }
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  const handleClick = async () => {
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
        const qaData = {
          question: values.question,
          answer: values.answer,
          images: fileList,
          category: values.category,
        };
        dispatch(updateQA(QA.id, qaData, SnackBar, navigate));
      } else {
        const qaData = {
          question: values.question,
          answer: values.answer,
          images: fileList,
          category: values.category,
        };
        console.log('qaData', qaData);
        dispatch(addQA(qaData, displayAlert));
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
        <FormProvider methods={methods} onSubmit={handleSubmit(handleClick)}>
          <Grid item container direction="column" gap={2}>
            <RHFTextField name="question" label="Question.." />
            <RHFSelect fullWidth name="category" InputLabelProps={{ shrink: true }}>
              <MenuItem value={0} />
              {categories &&
                categories.length > 0 &&
                categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </RHFSelect>
            <RHFEditor name="answer" label="Answer.." placeholder="Answer.." />
            <RHFUpload
              multiple
              thumbnail
              name="images"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
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
                onClick={() => navigate(PATH_DASHBOARD.general.QA.list)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" sx={{ width: '160px' }}>
                {isEdit ? 'Update' : 'Publish'}
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </Grid>
  );
}

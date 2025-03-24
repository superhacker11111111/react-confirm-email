import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
// @mui
import { Card, Grid, Button, TextField, Stack, Collapse, Alert } from '@mui/material';
// routes
// components
import { useSnackbar } from '../../../../components/snackbar';
import { addQACategory, updateQACategory } from '../../../../redux/slices/qacategory';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import setAuthToken from '../../../../utils/setAuthToken';

CategoryNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  category: PropTypes.object,
};

export default function CategoryNewEditForm({ isEdit = false, category }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [categoryName, setCategoryName] = useState('');
  const [open, setOpen] = useState(false);

  const showAlert = async () => {
    await setOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await setOpen(false);
  };

  useEffect(() => {
    if (isEdit && category) {
      setCategoryName(category.name);
    }
    if (!isEdit) {
      setCategoryName('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, category]);

  const handleSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAuthToken(localStorage.getItem('accessToken'));
      if (isEdit) {
        const updateData = {
          name: categoryName,
        };
        dispatch(updateQACategory(category.id, updateData, SnackBar, navigate));
      } else {
        const categoryData = {
          name: categoryName,
        };
        dispatch(addQACategory(categoryData, showAlert, setCategoryName('')));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid item>
      <Card sx={{ p: 5, width: '100%' }}>
        <Collapse in={open}>
          <Alert sx={{ mb: 2 }}>Succesfully Created!</Alert>
        </Collapse>
        <Grid item container direction="row" spacing={1}>
          <Grid item container spacing={2} direction="column" md={9}>
            <Grid item container direction="column">
              <TextField
                variant="filled"
                name="name"
                value={categoryName}
                label="Category Name"
                placeholder="Category Name.."
                sx={{ width: '85%' }}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Stack
          pt={5}
          spacing={{ xs: 1, sm: 20 }}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          justifyContent="center"
          alignItems="center"
          width="60%"
        >
          <Button
            variant="contained"
            sx={{ width: '160px' }}
            onClick={() => navigate(PATH_DASHBOARD.general.QA.categorylist)}
          >
            Cancel
          </Button>
          <Button variant="contained" sx={{ width: '160px' }} onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// @mui
import {
  Card,
  Grid,
  InputAdornment,
  Button,
  InputLabel,
  IconButton,
  OutlinedInput,
  Chip,
  Paper,
} from '@mui/material';

import { AddCircleOutlineRounded } from '@mui/icons-material';

import setAuthToken from '../../../utils/setAuthToken';
// components
import { getTags, updateTag } from '../../../redux/slices/tag';
import { useSnackbar } from '../../../components/snackbar';
import { PATH_DASHBOARD } from '../../../routes/paths';

export default function EcommerceTagPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };
  // Category
  const { tags } = useSelector((state) => state.tag);

  const [tagList, setTagList] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [createdlist, setCreatedlist] = useState([]);
  const [deletedlist, setDeletedlist] = useState([]);

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);
  //--------------------

  useEffect(() => {
    if (tags && tags.length > 0) {
      setTagList(tags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  const handleDelete = async (id) => {
    const array = tagList.filter((tag) => tag.id !== id);
    setTagList(array);
    if (id.slice(0, 7) !== 'newitem') {
      setDeletedlist([...deletedlist, id]);
    } else {
      const tagItem = tagList.filter((tag) => tag.id === id);
      const arr = createdlist.filter((item) => item !== tagItem[0].title);
      setCreatedlist(arr);
    }
  };

  const handleCreate = () => {
    if (newItem) {
      if (tagList.map((item) => item.title).indexOf(newItem) < 0) {
        setTagList([...tagList, { title: newItem, id: `newitem${Date.now()}` }]);
        setCreatedlist([...createdlist, newItem]);
        setNewItem('');
      } else {
        enqueueSnackbar('The tag already exist', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please type tag', { variant: 'error' });
    }
  };

  const handleSubmit = async () => {
    try {
      if (createdlist.length < 1 && deletedlist.length < 1) {
        SnackBar('Please create or delete at least one', 'error');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAuthToken(localStorage.getItem('accessToken'));
        dispatch(
          updateTag(
            {
              createlist: createdlist,
              deletelist: deletedlist,
            },
            SnackBar
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate(PATH_DASHBOARD.general.fences);
  };

  return (
    <Card sx={{ p: 3 }}>
      <Grid container direction="column" justifyContent="center" spacing={5}>
        <Grid item container direction="column" spacing={2} alignItems="start">
          <Grid item xs={6}>
            <InputLabel htmlFor="add tag">Tag</InputLabel>
            <OutlinedInput
              id="add tag"
              placeholder="Add Tag"
              value={newItem}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => handleCreate()} edge="end">
                    <AddCircleOutlineRounded />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => setNewItem(e.target.value)}
            />
          </Grid>
          <Grid item xs={9} sx={{ width: '100%' }}>
            <InputLabel htmlFor="all tags">All Tags</InputLabel>
            <Paper sx={{ border: '1px solid #dce0e4', p: 1 }} id="all tags">
              {tagList.map((tag, index) => (
                <Chip
                  key={tag.id}
                  label={tag.title}
                  sx={{ m: 0.5 }}
                  onDelete={() => handleDelete(tag.id)}
                />
              ))}
            </Paper>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems="center"
          justifyContent="center"
          spacing={6}
        >
          <Grid item>
            {' '}
            <Button
              variant="contained"
              sx={{
                // mt: 3,
                fontSize: '20px',
                letterSpacing: '1px',
                width: '150px',
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                // mt: 3,
                fontSize: '20px',
                letterSpacing: '1px',
                width: '150px',
              }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

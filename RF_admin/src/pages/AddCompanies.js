import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';

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
import {
  addUsers,
  getUser,
  updateUser,
  emailDuplicationCheck,
  deleteUserByEmail,
} from '../redux/slices/user';
// components
import { useSettingsContext } from '../components/settings';
import { useSnackbar } from '../components/snackbar';
import { getSubscription } from '../redux/slices/subscription';
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

export default function AddCompaniesPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { user } = useSelector((state) => state.user);
  const { subscription } = useSelector((state) => state.subscription);

  const isMobile = useMediaQuery('(max-width: 800px)');

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [open, setOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState('');
  const [emails, setEmails] = useState([]);
  const [isError, setIsError] = useState([]);
  const [users, setUsers] = useState([]);

  const errorMessage = ['', 'Please enter a valid email address', 'This Email is already exist.'];

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      dispatch(getSubscription(user?.plan));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && user.childs && subscription) {
      if (Number(user.childs.length) === Number(subscription.totalUsers) - 1) {
        enqueueSnackbar('Edit current users before adding more.', { variant: 'error' });
        setEmails([]);
        setUsers(user.childs);
      } else if (Number(subscription.totalUsers) - 1 > user.childs.length) {
        setEmails(Array(Number(subscription.totalUsers) - user.childs.length - 1).fill(''));
        setIsError(Array(Number(subscription.totalUsers) - user.childs.length - 1).fill(0));
        setUsers(user.childs);
      } else {
        setUsers(user.childs.slice(0, Number(subscription.totalUsers) - 1));
        setEmails([]);
        dispatch(updateUser(id, { childs: users }, SnackBar, navigate));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, subscription]);

  const validateEmail = (email) => {
    // check if the value is a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 1; // incorrect email
    return 0; // correct email
  };

  const handleEmailChange = async (event, index) => {
    // add email value on email list
    const enteredEmail = event.target.value;
    const updatedEmails = [...emails];
    updatedEmails[index] = enteredEmail;
    setEmails(updatedEmails);

    // update valid status array
    const updatedValidations = [...isError];
    if (event.target.value) {
      updatedValidations[index] = validateEmail(event.target.value);
      if (updatedValidations[index]) {
        setIsError(updatedValidations);
        return;
      }

      dispatch(
        emailDuplicationCheck(event.target.value, (isDupicate) => {
          if (isDupicate) updatedValidations[index] = 2;
          else updatedValidations[index] = 0;
          setIsError(updatedValidations);
        })
      );
    } else {
      updatedValidations[index] = 0;
      setIsError(updatedValidations);
    }
  };

  const onHandleDelete = () => {
    dispatch(deleteUserByEmail(deleteItem, SnackBar));
    dispatch(getUser(id));
  };

  const onSave = () => {
    let isSuccess = true;
    isError.forEach((error) => {
      if (error !== 0) isSuccess = false;
    });
    if (!isSuccess) return;
    let usersData = [];
    if (emails && emails.length > 0) {
      emails.forEach((email, i) => {
        if (email !== '' && !isError[i]) usersData = [...usersData, email];
      });
    }
    dispatch(
      addUsers(id, usersData, SnackBar, (resp) => {
        if (resp.code === 200) enqueueSnackbar('Successfully Added!', { variant: 'success' });
        dispatch(getUser(id));
      })
    );
  };

  return (
    <>
      <Helmet>
        <title> Add Company | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {/* <FormProvider methods={methods} onSubmit={handleSubmit(onSave)}> */}
        <Typography variant="h3" textAlign="center" mb={10} mt={8}>
          Update Devices and User Information
        </Typography>
        <Grid
          container
          justifyContent="center"
          flexDirection={isMobile ? 'column' : 'row'}
          spacing={isMobile ? 2 : 10}
        >
          <Grid item xs={isMobile ? 12 : 5}>
            <Stack flexDirection="column" spacing={3}>
              <Typography variant="h5">Add Users</Typography>
              <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                Your {subscription && subscription.name} account includes up to{' '}
                {subscription && subscription.totalUsers} users.
              </Typography>
              <Stack spacing={1}>
                {emails &&
                  emails.length > 0 &&
                  emails.map((email, index) => (
                    <TextField
                      key={index}
                      label="Email"
                      variant="outlined"
                      value={email}
                      onChange={(event) => handleEmailChange(event, index)}
                      error={!!isError[index]}
                      helperText={errorMessage[isError[index]]}
                    />
                  ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={isMobile ? 12 : 5}>
            <Stack flexDirection="column" spacing={3}>
              <Typography variant="h5">Edit Current Users</Typography>
              <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                removing users will deactivate access to realityfence on the user’s device
              </Typography>
              <Stack spacing={1}>
                {user &&
                  user.childs &&
                  user.childs.length > 0 &&
                  user.childs.map((manageUser, index) => (
                    <TextField
                      key={index}
                      sx={{
                        borderRadius: '10px',
                        backgroundColor: '#ebf5ff',
                      }}
                      value={manageUser}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setDeleteItem(manageUser);
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
            onClick={() => navigate(PATH_DASHBOARD.general.user.account)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            style={{
              width: isMobile ? '230px' : '180px',
              backgroundColor: '#007aff',
              fontFamily: 'Poppin',
              fontWeight: 700,
            }}
            onClick={onSave}
          >
            Save
          </Button>
        </Stack>
        {/* </FormProvider> */}
      </Container>

      <Dialog open={open}>
        <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
          Are you sure you want to remove user?
        </DialogTitle>
        <Stack justifySelf="center" gap={1}>
          <TextField value={deleteItem} sx={{ mx: 12, bgcolor: '#ebf5ff', borderRadius: '10px' }} />
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

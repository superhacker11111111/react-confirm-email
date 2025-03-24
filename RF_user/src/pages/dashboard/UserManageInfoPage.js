import {
  Container,
  Typography,
  Grid,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  Box,
  // useMediaQuery,
} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { confirmAddingChildUserWebhook } from '../../hooks/zapierWebhooks';
import { initialize } from '../../redux/actions/authAction';
import {
  updateUser,
  addUsers,
  getUser,
  emailDuplicationCheck,
  deleteUserByEmail,
} from '../../redux/slices/user';
import { PATH_DASHBOARD } from '../../routes/paths';
import { getSubscription } from '../../redux/slices/subscription';
import { useSnackbar } from '../../components/snackbar';

export default function UserManageInfoPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  // const { user } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const { subscription } = useSelector((state) => state.subscription);
  const [isLoading, setIsLoading] = useState(false);
  // const isMobile = useMediaQuery('(max-width: 800px)');

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
    dispatch(getSubscription(user?.plan));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.plan]);

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

  const handleDeleteEmail = () => {
    // delete email from db
    dispatch(deleteUserByEmail(deleteItem, SnackBar));
    dispatch(initialize());
  };

  const onSave = () => {
    setIsLoading(true);
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
    // confirmAddingChildUserWebhook({ parent: user, childs: usersData });
    dispatch(
      addUsers(id, usersData, SnackBar, (resp) => {
        setIsLoading(false);
        if (resp.code === 200) enqueueSnackbar('Successfully Added!', { variant: 'success' });
        dispatch(initialize());
      })
    );
  };

  return (
    <>
      <Container
        sx={{
          pt: 9,
          pb: 10,
          minHeight: 1,
        }}
      >
        {/* <FormProvider methods={methods} onSubmit={handleSubmit(onSave)}> */}
        <Typography fontSize="36px" fontWeight="700" align="center" paragraph>
          Update Devices and User Information
        </Typography>

        <Stack spacing={1} mt={2} sx={{ px: { lg: 12, md: 6 } }}>
          <Box
            gap={8}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            mb={10}
          >
            <Grid item xs={12} md={6} sx={{ mt: 4 }}>
              <Typography sx={{ fontSize: '22px', fontWeight: '600', mb: 4 }}>Add Users</Typography>
              <Typography
                variant="overline"
                sx={{ mb: 2, display: 'block', color: 'text.secondary' }}
              >
                Your {subscription?.name} account includes up to {subscription?.totalUsers} users.
                Add up to {Number(subscription?.totalUsers) - user.childs.length - 1} more emails
                below:
              </Typography>
              <Stack gap={1}>
                {emails &&
                  emails.length > 0 &&
                  emails.map((email, index) => (
                    <TextField
                      key={index}
                      label="Email"
                      variant="outlined"
                      // value={email}
                      onChange={(event) => handleEmailChange(event, index)}
                      error={!!isError[index]}
                      helperText={errorMessage[isError[index]]}
                    />
                  ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 4 }}>
              <Typography sx={{ fontSize: '22px', fontWeight: '600', mb: 4 }}>
                Edit Current Users
              </Typography>
              <Typography
                variant="overline"
                sx={{ mb: 2, display: 'block', color: 'text.secondary' }}
              >
                removing users will deactivate access to realityfence on the user’s device
              </Typography>
              <Stack gap={1}>
                {users &&
                  users.length > 0 &&
                  users.map((company, index) => (
                    <TextField
                      sx={{
                        borderRadius: '10px',
                        backgroundColor: '#ebf5ff',
                      }}
                      key={index}
                      value={company}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setDeleteItem(company);
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
            </Grid>
          </Box>
          <Grid
            container
            item
            direction="row"
            justifyContent={{ md: 'space-between', xs: 'center', sm: 'space-between' }}
            alignItems="center"
            sm={10}
            xs={10}
            sx={{ alignSelf: 'center' }}
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
                onClick={() => navigate(PATH_DASHBOARD.user.account)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <LoadingButton
                variant="contained"
                sx={{
                  mt: 3,
                  fontSize: '16px',
                  letterSpacing: '1px',
                  width: '220px',
                  backgroundColor: 'rgb(31, 169, 255) !important',
                }}
                loading={isLoading}
                onClick={() => {
                  setIsLoading((prev) => !prev);
                  onSave();
                }}
              >
                Save
              </LoadingButton>
            </Grid>
          </Grid>
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
              backgroundColor: 'rgb(31, 169, 255) !important',
            }}
            onClick={() => {
              handleDeleteEmail();
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
              backgroundColor: 'rgb(31, 169, 255) !important',
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

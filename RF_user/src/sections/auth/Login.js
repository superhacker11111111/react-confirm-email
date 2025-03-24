import React from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  Stack,
} from '@mui/material';
// auth
// routes
// hooks
import { PATH_AUTH, PATH_PAGE } from '../../routes/paths';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
// import AuthWithGoogle from './AuthWithGoogle';
// import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------
const STEPS = [
  {
    registerType: 'shopper',
    title: 'Looking to buy a fence?',
    description: 'If you are fence shopping, we will help you get to your dream look!',
    button: {
      label: 'For Shoppers',
      link: PATH_AUTH.register,
    },
  },
  {
    title: 'Sales fences professionally?',
    description: 'Detach blocks, mix elements, attach new styles and produce sites faster',
    button: { label: 'FOR PROFESSIONALS', link: PATH_PAGE.pricing },
  },
];
// ---------------------------------------------------------------------------
export default function Login() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  return (
    <LoginLayout>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <div className="text-center w-full h-96">
          <DialogTitle>Choose</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Grid container spacing={2}>
                {STEPS.map((value, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography variant="h3" sx={{ my: 3 }} style={{ display: 'inline-block' }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" sx={{ my: 3 }}>
                      {value.description}
                    </Typography>
                    <Button
                      variant="text"
                      color="inherit"
                      style={{
                        color: 'white',
                        backgroundColor: '#1288e3',
                        padding: '8px 16px',
                        fontSize: 18,
                        borderRadius: 10,
                      }}
                      onClick={() => {
                        if (value.registerType) {
                          sessionStorage.setItem('registerType', value.registerType);
                        }
                        navigate(value.button.link);
                      }}
                      // href={PATH_AUTH.loginUnprotected}
                    >
                      {value.button.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </DialogContentText>
          </DialogContent>
        </div>
      </Dialog>

      <Stack sx={{ width: '100%', pt: 4, pb: 12 }}>
        <Typography variant="h4" mb={3} sx={{ textAlign: { xs: 'center' } }}>
          Welcome Back!
        </Typography>
        <AuthLoginForm handleOpen={handleOpen} />
        {/* <AuthWithGoogle /> */}
      </Stack>
      {/* <AuthWithSocial /> */}
    </LoginLayout>
  );
}

import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack } from '@mui/material';
// auth
// routes
// hooks
// layouts
import LoginLayout from '../../layouts/login';
//
import SetPasswordForm from './SetPasswordForm';
// import AuthWithGoogle from './AuthWithGoogle';

SetPassword.propTypes = {
  email: PropTypes.string,
};

export default function SetPassword({ email }) {
  // const navigate = useNavigate();
  return (
    <LoginLayout>
      <Stack sx={{ width: '100%' }}>
        <SetPasswordForm email={email} />
      </Stack>
    </LoginLayout>
  );
}

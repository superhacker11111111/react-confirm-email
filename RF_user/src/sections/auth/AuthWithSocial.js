import { useEffect, useReducer } from 'react';
import { gapi } from 'gapi-script';
import GoogleLogin from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Divider, IconButton, Stack } from '@mui/material';
import { Social, UserRoles } from '../../assets/data/roles';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
import { socialUser } from '../../redux/actions/authAction';
import { GOOGLE_CLIENT_ID } from '../../config-global';
//
import axios from '../../utils/axios';
import { isValidToken, setSession } from '../../auth/utils';
import { useSnackbar } from '../../components/snackbar';
// components
import Iconify from '../../components/iconify';
import googleIc from '../../assets/IconGoogle.png';
import faceIc from '../../assets/IconFacebook.png';
// ----------------------------------------------------------------------
const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};
const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};
export default function AuthWithSocial() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  // const [state, dispatch] = useReducer(reducer, initialState);
  const { loginWithGoogle, loginWithGithub, loginWithTwitter } = useAuthContext();

  const SnackBar = (message, result) => {
    enqueueSnackbar(message, { variant: result });
  };

  const responseGoogle = async (response) => {
    const googleProfile = response.profileObj;
    const googleData = {
      email: googleProfile.email.toLowerCase(),
      name: googleProfile.name,
      avatarUrl: googleProfile.imageUrl,
      type: Social.google,
      role: UserRoles.professional,
    };
    dispatch(socialUser(googleData, navigate, SnackBar));
  };

  const handleFailure = (response) => {
    console.log(response);
  };

  const handleGithubLogin = async () => {
    try {
      if (loginWithGithub) {
        loginWithGithub();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleTwitterLogin = async () => {
    try {
      if (loginWithTwitter) {
        loginWithTwitter();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, ::after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        OR
      </Divider>
      <Stack direction="row" justifyContent="center" spacing={2}>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            <IconButton
              color="inherit"
              type="button"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img src={googleIc} alt="g" />
              {/* <Iconify icon="eva:google-fill" color="#DF3E30" /> */}
            </IconButton>
          )}
          onFailure={handleFailure}
          cookiePolicy="single_host_origin"
          onSuccess={responseGoogle}
          // isSignedIn={true}
        />
        <IconButton onClick={handleGithubLogin}>
          <div className="w-[36px]">
            <img src={faceIc} alt="f" />
          </div>
        </IconButton>

        <IconButton onClick={handleTwitterLogin}>
          <div className="w-[30px] ml-2.5">
            <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
          </div>
        </IconButton>
      </Stack>
    </div>
  );
}

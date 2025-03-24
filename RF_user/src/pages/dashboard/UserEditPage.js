import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import AWS from 'aws-sdk';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { useDispatch, useSelector } from '../../redux/store';
import { userAction } from '../../redux/actions/userAction';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION } from '../../config-global';

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: REGION,
});

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const { id } = useParams();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(userAction.getUser(id));
  }, [dispatch, id]);

  const [userData, setUserData] = useState();

  useEffect(() => {
    async function getImageFromS3() {
      try {
        if (user.avatar !== 0) {
          const data = user.avatar.avatarFileName;
          const params = {
            Bucket: `rf-test-test`,
            Key: data,
          };
          const response = await s3.getObject(params).promise();
          const url = URL.createObjectURL(new Blob([response.Body]));
          setUserData({ ...user, avatarUrl: url });
        } else {
          setUserData({ ...user, avatarUrl: '/assets/icons/auth/ic_auth0.png' });
        }
      } catch (error) {
        setUserData({ ...user, avatarUrl: '/assets/icons/auth/ic_auth0.png' });
      }
    }
    getImageFromS3();
  }, [user]);

  return (
    <>
      <Helmet>
        <title> User: Edit user | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit user"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'User',
              href: PATH_DASHBOARD.user.list,
            },
            {
              name:
                user?.full_name ||
                (user?.first_name && `${user?.first_name} ${user?.last_name}`) ||
                '',
            },
          ]}
        />

        <UserNewEditForm isEdit currentUser={userData} />
      </Container>
    </>
  );
}

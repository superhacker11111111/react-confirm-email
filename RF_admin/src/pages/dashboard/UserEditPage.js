import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import AWS from 'aws-sdk';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { useDispatch, useSelector } from '../../redux/store';
import { getUser } from '../../redux/slices/user';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const { id } = useParams();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

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
              name: user?.fullName || '',
            },
          ]}
        />

        <UserNewEditForm isEdit currentUser={user} />
      </Container>
    </>
  );
}

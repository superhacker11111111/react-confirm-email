import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getED } from '../../redux/slices/ed';
import { useSettingsContext } from '../../components/settings';
// sections
import EDNewEditForm from '../../sections/@dashboard/general/ED/EDNewEditForm';

// ----------------------------------------------------------------------

export default function GeneralEDEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { id } = useParams();

  const { ED } = useSelector((state) => state.ed);

  useEffect(() => {
    dispatch(getED(id));
  }, [dispatch, id]);
  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Post | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={1}>
          Edit Post
        </Typography>
        <EDNewEditForm isEdit ED={ED} />
      </Container>
    </>
  );
}

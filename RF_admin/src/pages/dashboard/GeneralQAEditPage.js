import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getQA } from '../../redux/slices/qa';
import { useSettingsContext } from '../../components/settings';
// sections
import QANewEditForm from '../../sections/@dashboard/general/QA/QANewEditForm';

// ----------------------------------------------------------------------

export default function GeneralQAEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { id } = useParams();

  const { QA } = useSelector((state) => state.qa);

  useEffect(() => {
    dispatch(getQA(id));
  }, [dispatch, id]);
  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Q&A | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" mb={1}>
          Edit Q&A
        </Typography>
        <QANewEditForm isEdit QA={QA} />
      </Container>
    </>
  );
}

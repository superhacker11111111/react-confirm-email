import { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';

// components
import { useSettingsContext } from '../../../components/settings';
// sections
import AssetRequestDetails from '.';
import { getAssetRequestById } from '../../../redux/slices/product';

// ----------------------------------------------------------------------

export default function AssetRequestDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const [requestData, setRequestData] = useState({});

  const { assetRequest } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAssetRequestById(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (assetRequest) {
      setRequestData(assetRequest);
    }
  }, [assetRequest]);

  return (
    <>
      <Helmet>
        <title> AssetRequest: View | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <AssetRequestDetails assetRequest={requestData} />
      </Container>
    </>
  );
}

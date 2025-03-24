import PropTypes from 'prop-types';
// @mui
import moment from 'moment';
import { Box, Card, Grid, Typography } from '@mui/material';
// components
import Image from '../../../components/image';
//
import AssetRequestToolbar from './toolbar';
import Logo from '../../../components/logo/Logo';
// ----------------------------------------------------------------------

AssetRequestDetails.propTypes = {
  assetRequest: PropTypes.object,
};

export default function AssetRequestDetails({ assetRequest }) {
  if (!assetRequest) {
    return null;
  }
  const { createdAt, company, name, size, color, description, filesImage } = assetRequest;

  return (
    <>
      <AssetRequestToolbar assetRequest={assetRequest} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }} alignSelf="center">
            <Typography variant="h6">Date:{moment(createdAt).format('M/D/YYYY')}</Typography>
            <Typography variant="h5">Company: {company}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Logo />
          </Grid>
          <Grid item container xs={12} mb={2}>
            <Grid item xs={12} sm={3.6} md={2.7} lg={2.2} alignSelf="center">
              <Typography
                variant="body1"
                fontSize="20px"
                textAlign={{ xs: 'left', sm: 'right' }}
                mr={1}
              >
                Display Name:
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={7.4}
              md={8.3}
              lg={8.8}
              sx={{ backgroundColor: 'rgba(246,247,248,1)', color: 'black' }}
            >
              <Typography variant="body2" fontSize="18px" textAlign="start" my={1} ml={1}>
                {name}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} mb={2}>
            <Grid item xs={12} sm={3.6} md={2.7} lg={2.2} alignSelf="center">
              <Typography
                variant="body1"
                fontSize="20px"
                textAlign={{ xs: 'left', sm: 'right' }}
                mr={1}
              >
                Size:
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={7.4}
              md={8.3}
              lg={8.8}
              sx={{ backgroundColor: 'rgba(246,247,248,1)', color: 'black' }}
            >
              <Typography variant="body2" fontSize="18px" textAlign="start" my={1} ml={1}>
                {size}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} mb={2}>
            <Grid item xs={12} sm={3.6} md={2.7} lg={2.2} alignSelf="center">
              <Typography
                variant="body1"
                fontSize="20px"
                textAlign={{ xs: 'left', sm: 'right' }}
                mr={1}
              >
                Color:
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={7.4}
              md={8.3}
              lg={8.8}
              sx={{ backgroundColor: 'rgba(246,247,248,1)', color: 'black' }}
            >
              <Typography variant="body2" fontSize="18px" textAlign="start" my={1} ml={1}>
                {color}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} mb={2}>
            <Grid item xs={12} sm={3.6} md={2.7} lg={2.2} alignSelf="center">
              <Typography
                variant="body1"
                fontSize="20px"
                textAlign={{ xs: 'left', sm: 'right' }}
                mr={1}
              >
                Description:
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={7.4}
              md={8.3}
              lg={8.8}
              sx={{ backgroundColor: 'rgba(246,247,248,1)', color: 'black' }}
            >
              <Typography variant="body2" fontSize="18px" my={1} ml={1}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                />
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} mb={2}>
            <Grid item xs={12} sm={3.6} md={2.7} lg={2.2} alignSelf="flex-start">
              <Typography
                variant="body1"
                fontSize="20px"
                textAlign={{ xs: 'left', sm: 'right' }}
                mr={1}
              >
                Images:
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={7.4}
              md={8.3}
              lg={8.8}
              sx={{ backgroundColor: 'rgba(246,247,248,1)', color: 'black' }}
            >
              <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={3}>
                {filesImage &&
                  filesImage.length > 0 &&
                  filesImage.map((image, index) => (
                    <Image
                      key={index}
                      alt={`Fence${index}`}
                      src={image && image.preview}
                      style={{ width: '100%' }}
                    />
                  ))}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

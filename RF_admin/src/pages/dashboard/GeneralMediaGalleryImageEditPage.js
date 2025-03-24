import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  Card,
  Box,
  Typography,
  Button,
  Stack,
  Pagination,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from '../../components/iconify';
//
import { getAllImages, deleteImage } from '../../redux/slices/media';
import { useDispatch, useSelector } from '../../redux/store';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Image from '../../components/image';
import { useSnackbar } from '../../components/snackbar';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

export default function GeneralMediaGalleryImageEditPage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const { gallery, totalCount } = useSelector((state) => state.media);

  useEffect(() => {
    dispatch(getAllImages(page));
  }, [dispatch, page]);

  const onHandleDelete = (id) => {
    dispatch(deleteImage(id, SnackBar));
  };

  const onHandleChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Helmet>
        <title> Media: Edit a new Gallery Image | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="Edit Gallery Images" links={[{ name: '' }]} />
        <Card sx={{ p: 3 }}>
          <Stack spacing={2} direction="row" alignItems="center" mb={2}>
            <Typography variant="h5">Remove Images</Typography>
            <Button
              variant="outlined"
              style={{ marginLeft: '40px' }}
              component={RouterLink}
              to={PATH_DASHBOARD.general.media.addgalleryImage}
            >
              Add Images
            </Button>
          </Stack>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            }}
            gap={2}
          >
            {gallery &&
              gallery.length > 0 &&
              gallery.map((image, index) => (
                <Stack key={image.id} border="1px solid grey">
                  <Image
                    alt={`Gallery${index}`}
                    src={image.url.preview}
                    style={{ borderRadius: 1, boxShadow: 4 }}
                    width="100%"
                    ratio="4/3"
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDeleteId(image.id);
                      setOpen(true);
                    }}
                    sx={{
                      ml: '2px',
                      mt: '2px',
                      position: 'absolute',
                      color: (theme) => alpha(theme.palette.common.black, 1),
                      border: 'black 2px solid',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.2),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon="eva:close-fill" width={15} />
                  </IconButton>
                </Stack>
              ))}
          </Box>
          <Pagination
            sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            count={Math.ceil(Number(totalCount) / 20)}
            page={page}
            onChange={onHandleChange}
          />
        </Card>
        <Dialog open={open}>
          <DialogTitle variant="h4" sx={{ textAlign: 'center', px: 10, pt: 10, pb: 3 }}>
            Are you sure you want to delete?
          </DialogTitle>
          <Stack justifySelf="center">
            <Button
              variant="contained"
              sx={{
                mb: 2,
                mx: 12,
                fontSize: '18px',
                fontWeight: 900,
                borderRadius: 1.5,
              }}
              onClick={() => {
                onHandleDelete(deleteId);
                setOpen(false);
              }}
            >
              Delete Image
            </Button>
            <Button
              variant="contained"
              sx={{
                mb: 10,
                mx: 12,
                fontSize: '18px',
                fontWeight: 900,
                borderRadius: 1.5,
              }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Dialog>
      </Container>
    </>
  );
}

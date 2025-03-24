import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Container,
  Button,
  Grid,
  Typography,
  Card,
  useMediaQuery,
  Dialog,
  DialogTitle,
  Stack,
  Divider,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { deleteQA, getQAs } from '../../redux/slices/qa';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function GeneralQAManagePage() {
  const { themeStretch } = useSettingsContext();
  const isIcon = useMediaQuery('(min-width:420px)');
  const isDesktop = useResponsive('up', 'sm');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const SnackBar = (message, status) => {
    enqueueSnackbar(message, { variant: status });
  };

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const { QAs } = useSelector((state) => state.qa);
  const onHandleDelete = (id) => {
    dispatch(deleteQA(id, SnackBar));
  };

  useEffect(() => {
    dispatch(getQAs());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Category | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack flexDirection="row" justifyContent="space-between" mb={1}>
          <Typography variant="h4">Q&A</Typography>
          <Stack flexDirection="row" gap={1}>
            <Button
              variant="outlined"
              onClick={() => {
                navigate(PATH_DASHBOARD.general.QA.categorylist);
              }}
            >
              Edit Categories
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigate(PATH_DASHBOARD.general.QA.newQA);
              }}
            >
              New Q&A
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ p: 3 }}>
          <Typography variant="caption" fontWeight="bold" color="#637381">
            MANAGE QUESTIONS & ANSWERS
          </Typography>
          {QAs &&
            QAs.length > 0 &&
            QAs.map((qa) => (
              <div key={qa.categoryTitle}>
                <Typography variant="h5" my={2}>
                  {qa.categoryTitle}
                </Typography>
                {qa.qaData.map((question) => (
                  <div key={question.id}>
                    <Grid container gap={1} pl={2} alignItems="center">
                      <Grid item xs={isIcon ? 5 : 12} sm={9} height="fit-content">
                        <Typography variant="body1">{question.question}</Typography>
                      </Grid>
                      <Grid
                        item
                        xs={isIcon ? 6 : 12}
                        sm={2.5}
                        container
                        gap={1}
                        alignItems="center"
                      >
                        <Button
                          variant="outlined"
                          onClick={() =>
                            navigate(PATH_DASHBOARD.general.QA.editQA(paramCase(question.id)))
                          }
                          sx={{ height: 'fit-content' }}
                        >
                          {isDesktop ? (
                            <>
                              <Edit />
                              &nbsp; Edit
                            </>
                          ) : (
                            <Edit />
                          )}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ height: 'fit-content' }}
                          onClick={() => {
                            setDeleteId(question.id);
                            setOpen(true);
                          }}
                        >
                          {isDesktop ? (
                            <>
                              <Delete />
                              &nbsp; Delete
                            </>
                          ) : (
                            <Delete />
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                  </div>
                ))}
              </div>
            ))}
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
              Delete Category
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

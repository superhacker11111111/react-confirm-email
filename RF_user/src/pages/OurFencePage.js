import React, { useState } from 'react';
// @mui
import {
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  TextField,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';

// sections
import { useDispatch } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { getFenceFilter } from '../redux/slices/fence';
import { Models, Gallery } from '../sections/ourfences';

// import modelImage from '../assets/illustrations/3dmodelImage.png';
// import galleryImage from '../assets/illustrations/2galleryImage.png';

// ----------------------------------------------------------------------

export default function FencesPage() {
  // const [sort, setSort] = useState(0);
  // const [isClicked, setIsClicked] = useState(false);
  // const [isClicked2, setIsClicked2] = useState(false);
  const [isComponentClicked, setComponentClicked] = useState(true);
  const [searchselect, setSearchselect] = useState(true);
  const [sortselect, setSortselect] = useState(true);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const dispatch = useDispatch();
  const [modelfilter, setModelFilter] = useState('');
  // const { fences } = useSelector((state) => state.fence);
  // const { gallery } = useSelector((state) => state.media);

  const handleChange = (event) => {
    setModelFilter(event.target.value);
    dispatch(getFenceFilter(event.target.value));
  };

  // const handleChange1 = (event) => {
  //   setSort(event.target.value);
  // };

  const handleClick = () => {
    // setIsClicked(true);
    // setIsClicked2(false);
    setComponentClicked(true);
    setSearchselect(true);
    setSortselect(true);
  };
  const handleClick2 = () => {
    // setIsClicked(false);
    // setIsClicked2(true);
    setComponentClicked(false);
    setSearchselect(false);
    setSortselect(false);
  };

  return (
    <Container
      sx={{
        height: { md: 'auto' },
        mt: { xs: 0, sm: 2, md: 6 },
      }}
    >
      <Grid container justifyContent="space-between">
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: { xs: 'space-around', sm: 'space-between' },
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: { lg: '48px', md: '36px', xs: '24px' },
              fontWeight: '800',
            }}
          >
            Our Fences
          </Typography>
          {isMobile && isComponentClicked ? (
            <div className="search-box">
              <button type="button" className="btn-search">
                <SearchIcon className="fas fa-search" />
              </button>
              <input
                type="text"
                className="input-search"
                placeholder="Search..."
                onChange={handleChange}
              />
            </div>
          ) : (
            <TextField
              id="search"
              type="search"
              size="small"
              placeholder="Search..."
              sx={{
                display: searchselect ? 'block' : 'none',
                mt: 1,
                minWidth: { xs: 60, md: 150 },
              }}
              value={modelfilter}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
        <Grid
          container
          item
          gap={2}
          sx={{
            py: { md: 4, xs: 2 },
            justifyContent: { xs: 'center', md: 'start' },
          }}
        >
          <Button
            variant="outlined"
            sx={{
              size: 'large',
              backgroundColor: '#ffffff',
              color: 'black',
              borderRadius: { xs: '24px', sm: '10px' },
              borderColor: 'black',
              py: { xs: 0, sm: 1 },
              fontSize: { sm: 18, xs: 14 },
              width: { sm: '130px', xs: '105px' },
              height: { xs: '40px', sm: '50px' },
              boxShadow: {
                xs: isComponentClicked ? '0px 4px rgba(0, 0, 0, 0.2)' : 'none',
                sm: isComponentClicked ? '0px 3px rgba(0, 0, 0, 0.2)' : 'none',
              },
            }}
            onClick={handleClick}
          >
            3D Models
          </Button>
          <Button
            variant="outlined"
            sx={{
              size: 'large',
              backgroundColor: '#ffffff',
              color: 'black',
              borderRadius: { xs: '24px', sm: '10px' },
              borderColor: 'black',
              py: { xs: 0, sm: 1 },
              fontSize: { sm: 18, xs: 14 },
              width: { sm: '130px', xs: '105px' },
              height: { xs: '40px', sm: '50px' },
              boxShadow: {
                xs: isComponentClicked ? 'none' : '0px 4px rgba(0, 0, 0, 0.2)',
                sm: isComponentClicked ? 'none' : '0px 4px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={handleClick2}
          >
            Gallery
          </Button>
        </Grid>
      </Grid>

      <Stack>{isComponentClicked ? <Models /> : <Gallery />}</Stack>
    </Container>
  );
}

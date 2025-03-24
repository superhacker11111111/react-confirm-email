import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Typography, Autocomplete, InputAdornment, Stack } from '@mui/material';
//
import { useSelector, useDispatch } from '../../../redux/store';
import { getSearchFencesByName, getfenceSuccess } from '../../../redux/slices/fence';
// routes
import { PATH_ONBOARDING } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import { CustomTextField } from '../../../components/custom-input';
import SearchNotFound from '../../../components/search-not-found';

// ----------------------------------------------------------------------

export default function SelectFencesSearch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const url = new URL(window.location.href);
  const path = url.pathname;
  const { selected_list } = useSelector((state) => state.product);
  const [searchProducts, setSearchProducts] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = async (event, value) => {
    try {
      setSearchProducts(value);
      if (value) {
        if (path === '/fenceswapper') {
          const tmp = selected_list;
          const response = tmp.filter((fence) =>
            fence.name.toLowerCase().includes(value.toLowerCase())
          );

          setSearchResults(response);
        } else {
          const response = await dispatch(getSearchFencesByName(value));

          setSearchResults(response.data.data.product);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGotoProduct = (id) => {
    sessionStorage.setItem('fileId', id);
    navigate(PATH_ONBOARDING.onboarding.viewDetail(paramCase(id)));
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      // handleGotoProduct(searchProducts);
      console.log(event.key);
    }
  };

  useEffect(() => {
    dispatch(getfenceSuccess());
  }, [dispatch]);

  return (
    <Stack
      alignItems="left"
      sx={{ mt: localStorage.getItem('layout') !== 'swapper' ? '20px' : '0px' }}
    >
      <Autocomplete
        style={{ alignItems: 'center', height: '50px' }}
        autoHighlight
        popupIcon={null}
        options={searchResults}
        onInputChange={(event, value) => handleInputChange(event, value)}
        getOptionLabel={(product) => product.name}
        noOptionsText={<SearchNotFound query={searchProducts} />}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            placeholder="Search..."
            onKeyUp={handleKeyUp}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start" style={{ height: '50px' }}>
                  <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              style: {
                height: '50px',
                backgroundColor: 'white',
                fontSize: 13,
              },
              sx: { width: '200px' },
            }}
          />
        )}
        renderOption={(props, fenceOption, { inputValue }) => {
          const { id, name } = fenceOption;
          const matches = match(name, inputValue);
          const parts = parse(name, matches);

          return (
            <li {...props}>
              <Link underline="none" onClick={() => handleGotoProduct(id)}>
                {parts.map((part, index) => (
                  <Typography
                    key={`${id}-${index}`}
                    component="span"
                    variant="subtitle2"
                    color={part.highlight ? 'primary' : 'textPrimary'}
                  >
                    {part.text}
                  </Typography>
                ))}
              </Link>
            </li>
          );
        }}
      />
    </Stack>
  );
}

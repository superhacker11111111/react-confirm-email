import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Drawer,
  Chip,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import { Delete } from '@mui/icons-material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import { getCategories, getStyles } from '../../../redux/slices/category';
import { getStylesByName } from '../../../redux/slices/fence';
// config
import { NAV } from '../../../config-global';
// components
import Iconify from '../../../components/iconify';

import { SelectFencesSearch } from '../../../sections/onboarding/select_fences';
//
import { Selectable } from '../../../assets/data/roles';
import { getSelectableProducts } from '../../../redux/slices/product';
import { getTags } from '../../../redux/slices/tags';
import { PATH_ONBOARDING } from '../../../routes/paths';

// ----------------------------------------------------------------------

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
  s_type: PropTypes.any,
};
const StyledTreeView = styled(TreeView)({
  height: 240,
  flexGrow: 1,
  maxWidth: 400,
});

export default function NavVertical({ openNav, onCloseNav, s_type }) {
  const { tags } = useSelector((state) => state.tag);
  const { categories, styles } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [data, setData] = useState([]);

  const isDesktop = useResponsive('up', 'lg');
  // Define state variables to manage selected chips
  const [isSelected, setIsSelected] = useState(false);
  // const [isSelec, setIsSelec] = useState(false);
  // const [isTagSelected, setIsTagSelected] = useState(false);
  const [selectedChips, setSelectedChips] = useState([]);

  const handleChipClick = (index, tag) => {
    const selectedChipIndex = selectedChips.indexOf(tag.title);
    let updatedSelectedChips = [];

    if (selectedChipIndex === -1) {
      updatedSelectedChips = [...selectedChips, tag.title];
    } else {
      updatedSelectedChips = selectedChips.filter((chipTitle) => chipTitle !== tag.title);
    }

    setSelectedChips(updatedSelectedChips);
    setIsSelected(true);
  };

  const handleCheck = (name) => {
    setData((prevData) => {
      const newData = prevData.filter((item) => item !== name);
      if (newData.length === prevData.length) {
        // setIsSelec(true);
        newData.push(name);
      }
      return newData;
    });
    setIsSelected(true);
  };

  useEffect(() => {
    if (isSelected === true) {
      dispatch(getStylesByName({ data, selectedChips }));
      navigate(PATH_ONBOARDING.onboarding.stylefences);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, data, selectedChips, dispatch]);

  const handleDelete = () => {
    setData([]);
    setSelectedChips([]);
    setIsSelected(false);
    navigate(PATH_ONBOARDING.onboarding.categoryfences);
  };

  // Rest of your code...
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getStyles());
    dispatch(getTags());
    dispatch(getSelectableProducts(Selectable.Category));
  }, [dispatch]);

  const onItemClick = (type, params, category) => {
    dispatch(getSelectableProducts(type, params, category));
    navigate(PATH_ONBOARDING.onboarding.categoryfences);
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Stack marginTop={{ lg: localStorage.getItem('layout') === 'swapper' ? '310px' : '170px' }}>
      <SelectFencesSearch />
      <StyledTreeView
        sx={{
          mt: 1,
          '& .MuiTreeItem-label': {
            fontSize: '16px',
          },
        }}
        multiSelect
        defaultExpanded={['categories']}
        defaultCollapseIcon={<Iconify icon="eva:chevron-down-fill" />}
        defaultExpandIcon={<Iconify icon="eva:chevron-right-fill" />}
        defaultEndIcon={null}
      >
        <Typography
          className="cursor-pointer"
          variant="h5"
          onClick={() => onItemClick(Selectable.Category)}
        >
          Categories
        </Typography>
        {categories &&
          categories.length > 0 &&
          categories.map((category, index) => (
            <TreeItem
              key={category.id}
              label={category.name}
              nodeId={category.id}
              onClick={() =>
                onItemClick(Selectable.Fence, { category: category.id }, category.name)
              }
            >
              {category.sub_categories.length > 0
                ? category.sub_categories.map((sub_category) => (
                    <TreeItem
                      key={sub_category.title}
                      label={sub_category.title}
                      nodeId={sub_category.title}
                      onClick={() =>
                        onItemClick(
                          Selectable.Fence,
                          { category: category.id, sub_category: sub_category.title },
                          category.name
                        )
                      }
                    >
                      {category.styles.map((style) => (
                        <TreeItem
                          key={`${style.title}${sub_category.title}${index}`}
                          label={style.title}
                          nodeId={`${style.title}${sub_category.title}${index}`}
                          onClick={() =>
                            onItemClick(
                              Selectable.Fence,
                              {
                                category: category.id,
                                sub_category: sub_category.title,
                                style: style.title,
                              },
                              category.name
                            )
                          }
                        >
                          {category.colors.length > 0 &&
                            category.colors.map((color) => (
                              <TreeItem
                                key={`${style.title}${sub_category.title}${color.title}${index}`}
                                label={color.title}
                                nodeId={`${style.title}${sub_category.title}${color.title}${index}`}
                                onClick={() =>
                                  onItemClick(
                                    Selectable.Fence,
                                    {
                                      category: category.id,
                                      sub_category: sub_category.title,
                                      style: style.title,
                                      color: color.title,
                                    },
                                    category.name
                                  )
                                }
                              />
                            ))}
                        </TreeItem>
                      ))}
                    </TreeItem>
                  ))
                : category.styles.map((style) => (
                    <TreeItem
                      key={`${style.title}${index}`}
                      label={style.title}
                      nodeId={`${style.title}${index}`}
                      onClick={() =>
                        onItemClick(
                          Selectable.Fence,
                          {
                            category: category.id,
                            style: style.title,
                          },
                          category.name
                        )
                      }
                    >
                      {category.colors.length > 0 &&
                        category.colors.map((color) => (
                          <TreeItem
                            key={`${style.title}${color.title}${index}`}
                            label={color.title}
                            nodeId={`${style.title}${color.title}${index}`}
                            onClick={() =>
                              onItemClick(
                                Selectable.Fence,
                                {
                                  category: category.id,
                                  style: style.title,
                                  color: color.title,
                                },
                                category.name
                              )
                            }
                          />
                        ))}
                    </TreeItem>
                  ))}
            </TreeItem>
          ))}
        <Stack sx={{ mt: 3 }}>
          <Typography variant="h5">Style/Design</Typography>
          <Stack sx={{ mx: 2.3 }}>
            {styles &&
              styles.length > 0 &&
              styles.map((style, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      color="error"
                      size="small"
                      onClick={() => handleCheck(style)}
                      checked={isSelected && data.includes(style)}
                    />
                  }
                  label={style}
                  key={index}
                />
              ))}
          </Stack>
        </Stack>
        <Stack sx={{ mt: 3 }}>
          <Typography variant="h5">Tags</Typography>
          <Stack display="flow-root">
            {tags &&
              tags.length > 0 &&
              tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.title}
                  variant="outlined"
                  size="small"
                  clickable
                  onClick={() => handleChipClick(index, tag)}
                  sx={{
                    m: '1.5px',
                    backgroundColor: selectedChips.includes(tag.title) ? '#22aaff' : 'white',
                    color: selectedChips.includes(tag.title) ? 'white' : 'black',
                  }}
                />
              ))}
          </Stack>
        </Stack>
        <Stack sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleDelete()}
            sx={{ bgcolor: 'text.primary', width: '80%', mb: 1 }}
            style={{
              backgroundColor: '#7c8289',
              fontSize: '14px',
              fontFamily: 'Poppins',
              fontWeight: 900,
            }}
          >
            <Delete />
            Clear ALL
          </Button>
        </Stack>
      </StyledTreeView>
    </Stack>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              pl: localStorage.getItem('layout') === 'swapper' ? 0 : 5,
              zIndex: 0,
              width: NAV.W_DASHBOARD,
              borderRightStyle: 'dashed',
            },
          }}
        >
          {s_type === 2 ? (
            <div className="w-full flex -mt-[90px] ml-[40px]"> {renderContent}</div>
          ) : (
            renderContent
          )}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
              pt: 1,
              pl: 2,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Collapse } from '@mui/material';
// hooks
import useActiveLink from '../../../hooks/useActiveLink';
//
import NavItem from './NavItem';

// ----------------------------------------------------------------------

NavList.propTypes = {
  data: PropTypes.object,
  depth: PropTypes.number,
  hasChild: PropTypes.bool,
};

export default function NavList({ data, depth, hasChild }) {
  const { pathname } = useLocation();

  const { active, isExternalLink } = useActiveLink(data.path);

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = (e) => {
    if (e.target.textContent === 'Manage My Fences') {
      localStorage.setItem('layout', 'swapper');
    } else {
      localStorage.removeItem('layout');
    }
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        isExternalLink={isExternalLink}
        onClick={handleToggle}
      />

      {hasChild && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

NavSubList.propTypes = {
  data: PropTypes.array,
  depth: PropTypes.number,
};

function NavSubList({ data, depth }) {
  return (
    <>
      {data.map((list) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChild={!!list.children}
        />
      ))}
    </>
  );
}

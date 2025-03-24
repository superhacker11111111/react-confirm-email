import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Paper, CardHeader, Box, Typography, Stack, Link } from '@mui/material';
import { PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

Block.propTypes = {
  sx: PropTypes.object,
  title: PropTypes.string,
  children: PropTypes.node,
};
export function Block({ title, sx, children }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        bgcolor: '#FFF',
      }}
    >
      {title && (
        <CardHeader
          title={title}
          sx={{ pt: '30px', ml: '20px' }}
          titleTypographyProps={{ variant: 'h3' }}
        />
      )}
      <div className="ml-[45px]">
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link
            component={RouterLink}
            to={PATH_AUTH.login}
            variant="subtitle2"
            style={{ color: '#1FA9FF' }}
          >
            Sign in
          </Link>
        </Stack>
      </div>
      <Box
        sx={{
          p: 5,
          minHeight: 180,
          ...sx,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

// ----------------------------------------------------------------------

Label.propTypes = {
  title: PropTypes.string,
};

export function Label({ title }) {
  return (
    <Typography variant="overline" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
      {title}
    </Typography>
  );
}

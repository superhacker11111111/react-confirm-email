import PropTypes from 'prop-types';
//
import Image from '../../image';

// ----------------------------------------------------------------------

SingleFilePreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
};

export default function SingleFilePreview({ file }) {
  if (!file) {
    return null;
  }
  const imgUrl =
    // eslint-disable-next-line no-nested-ternary
    typeof file === 'string' ? file : file.preview ? file.preview : file[0].preview;

  return (
    <Image
      alt="file preview"
      src={imgUrl}
      sx={{
        top: 8,
        left: 8,
        zIndex: 8,
        borderRadius: 1,
        position: 'absolute',
        width: 'calc(100% - 16px)',
        height: 'calc(100% - 16px)',
      }}
    />
  );
}

import PropTypes from 'prop-types';
import { Link, Card, Stack, Button, Divider, Typography } from '@mui/material';
import Iconify from '../../components/iconify';
import Image from '../../components/image';

export default function PlanCard({ plan, onButtonClick, buttonColor }) {
  if (!plan) return null;

  const { license, commons, popular, stack, options, icons, price, buttonAction } = plan;
  const { backColor, fontColor, buttonBorder } = buttonColor;
  const handleClick = () => {
    onButtonClick(buttonAction, license, price);
  };

  return popular ? (
    <Card
      sx={{
        p: 5,
        width: '365px',
        height: '741px',
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="h5"
            component="div"
            sx={{ marginTop: '39px', textTransform: 'uppercase' }}
          >
            {license}
          </Typography>

          {popular ? (
            <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-3.5 py-1.5 rounded-[10px] absolute top-5 left-2">
              POPULAR
            </span>
          ) : (
            ''
          )}

          <Stack direction="row" spacing={0.5} sx={{ marginTop: '39px' }}>
            <Typography variant="h4" component="span">
              $
            </Typography>
            <Typography variant="h3" component="span">
              {price}
            </Typography>
          </Stack>
        </Stack>
        <Stack flexDirection="row" columnGap="10px">
          {stack &&
            stack.map((option) => (
              <Stack key={option} spacing={1.5} flexDirection="row">
                <Typography
                  sx={{ width: '20px', height: '16px', fontWeight: 'bold' }}
                  component="span"
                >
                  {option}
                </Typography>
              </Stack>
            ))}
        </Stack>

        <Stack direction="row" spacing={1.5}>
          {icons &&
            icons.map((icon) => (
              <Image key={icon} alt={icon} src={icon} sx={{ width: 24, height: 24 }} />
            ))}
        </Stack>

        <Stack spacing={2.5}>
          {commons &&
            commons.map((option) => (
              <Stack key={option} spacing={1.5} direction="row" alignItems="center">
                <Iconify
                  icon="carbon:checkmark-outline"
                  sx={{ color: 'primary.main', width: 20, height: 20 }}
                />
                <Typography variant="body2">{option}</Typography>
              </Stack>
            ))}
          <Divider sx={{ borderStyle: 'dashed' }} />
          {options &&
            options.map((option) => (
              <Stack
                key={option.title}
                direction="row"
                alignItems="center"
                sx={{
                  typography: 'body2',
                  ...(option.disabled && { color: 'text.disabled' }),
                }}
              >
                <Iconify
                  icon={option.disabled ? 'carbon:close-outline' : 'carbon:checkmark-outline'}
                  sx={{
                    mr: 2,
                    color: 'primary.main',
                    ...(option.disabled && { color: 'currentColor' }),
                  }}
                />
                {option.title}
              </Stack>
            ))}
        </Stack>

        <Stack alignItems="flex-end" spacing={3}>
          <Button
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              backgroundColor: backColor,
              color: fontColor,
              border: `${buttonBorder} 1px solid`,
            }}
          >
            Choose Package
          </Button>
          <div className="flex justify-end w-full">
            <Link variant="caption" sx={{ color: 'text.secondary' }}>
              Read license
            </Link>
            &nbsp;&nbsp;&nbsp;
            <svg
              width="7"
              height="19"
              viewBox="0 0 7 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.5 5L1.5 0L0.800001 0.7L5.1 5L0.800001 9.3L1.5 10L6.5 5Z" fill="#637381" />
            </svg>
          </div>
        </Stack>
      </Stack>
    </Card>
  ) : (
    <Card
      sx={{
        p: 5,
        width: '365px',
        height: '662px',
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5" component="div" sx={{ textTransform: 'uppercase' }}>
            {license}
          </Typography>

          {popular ? (
            <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-3.5 py-1.5 rounded-[10px] absolute top-0.5 left-2">
              POPULAR
            </span>
          ) : (
            ''
          )}

          <Stack direction="row" spacing={0.5}>
            <Typography variant="h4" component="span">
              $
            </Typography>
            <Typography variant="h3" component="span">
              {price}
            </Typography>
          </Stack>
        </Stack>
        <Stack flexDirection="row" columnGap="10px">
          {stack &&
            stack.map((option) => (
              <Stack key={option} spacing={1.5} flexDirection="row">
                <Typography
                  sx={{ width: '20px', height: '16px', fontWeight: 'bold' }}
                  component="span"
                >
                  {option}
                </Typography>
              </Stack>
            ))}
        </Stack>

        <Stack direction="row" spacing={1.5}>
          {icons &&
            icons.map((icon) => (
              <Image key={icon} alt={icon} src={icon} sx={{ width: 24, height: 24 }} />
            ))}
        </Stack>

        <Stack spacing={2.5}>
          {commons &&
            commons.map((option) => (
              <Stack key={option} spacing={1.5} direction="row" alignItems="center">
                <Iconify
                  icon="carbon:checkmark-outline"
                  sx={{ color: 'primary.main', width: 20, height: 20 }}
                />
                <Typography variant="body2">{option}</Typography>
              </Stack>
            ))}
          <Divider sx={{ borderStyle: 'dashed' }} />
          {options &&
            options.map((option) => (
              <Stack
                key={option.title}
                direction="row"
                alignItems="center"
                sx={{
                  typography: 'body2',
                  ...(option.disabled && { color: 'text.disabled' }),
                }}
              >
                <Iconify
                  icon={option.disabled ? 'carbon:close-outline' : 'carbon:checkmark-outline'}
                  sx={{
                    mr: 2,
                    color: 'primary.main',
                    ...(option.disabled && { color: 'currentColor' }),
                  }}
                />
                {option.title}
              </Stack>
            ))}
        </Stack>

        <Stack alignItems="flex-end" spacing={3}>
          <Button
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              backgroundColor: backColor,
              color: fontColor,
              border: `${buttonBorder} 1px solid`,
            }}
          >
            Choose Package
          </Button>
          <div className="flex justify-end w-full">
            <Link variant="caption" sx={{ color: 'text.secondary' }}>
              Read license
            </Link>
            &nbsp;&nbsp;&nbsp;
            <svg
              width="7"
              height="19"
              viewBox="0 0 7 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.5 5L1.5 0L0.800001 0.7L5.1 5L0.800001 9.3L1.5 10L6.5 5Z" fill="#637381" />
            </svg>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
}

PlanCard.propTypes = {
  plan: PropTypes.shape({
    commons: PropTypes.array,
    icons: PropTypes.array,
    license: PropTypes.string,
    options: PropTypes.array,
    popular: PropTypes.bool,
    price: PropTypes.string,
    stack: PropTypes.array,
    buttonAction: PropTypes.string,
  }),
  onButtonClick: PropTypes.func,
  buttonColor: PropTypes.shape({
    backColor: PropTypes.string,
    fontColor: PropTypes.string,
    buttonBorder: PropTypes.string,
  }),
};

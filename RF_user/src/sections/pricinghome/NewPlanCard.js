// this is used for v1.3
import PropTypes from 'prop-types';

import { Link, Card, Stack, Button, Typography } from '@mui/material';
import Iconify from '../../components/iconify';

NewPlanCard.propTypes = {
  type: PropTypes.number,
  isDisabled: PropTypes.bool,
  plan: PropTypes.shape({
    name: PropTypes.string,
    popular: PropTypes.bool,
    requestAvailable: PropTypes.bool,
    price: PropTypes.string,
    totalFences: PropTypes.string,
    totalUsers: PropTypes.string,
    id: PropTypes.string,
  }),
  onSubscriptionClick: PropTypes.func,
  buttonColor: PropTypes.shape({
    backColor: PropTypes.string,
    fontColor: PropTypes.string,
    buttonBorder: PropTypes.string,
  }),
};

export default function NewPlanCard({
  plan,
  isDisabled = false,
  onSubscriptionClick,
  buttonColor,
  type,
}) {
  if (!plan) return null;

  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;
  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    onSubscriptionClick(id);
  };

  return (
    <Card
      sx={{
        px: 2,
        pb: 5,
        pt: 2,
        boxShadow: (theme) => theme.customShadows.z8,
        height: popular ? '112%' : '100%',
        alignSelf: popular ? 'center' : 'flex-start',
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography
              component="div"
              sx={{
                marginTop: '20px',
                fontSize: { xs: '36px', sm: '32px' },
                fontWeight: '900',
                fontFamily: 'Poppins',
              }}
            >
              {name}
            </Typography>
          </Stack>

          {popular ? (
            <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-2.5 py-1 rounded-[10px] absolute top-5 left-5">
              POPULAR
            </span>
          ) : (
            ''
          )}

          <Stack direction="column" alignItems="flex-end" sx={{ marginTop: '2px' }}>
            <Stack direction="row" justifyContent="center" spacing={0.5}>
              <Typography fontSize="26px" component="span" fontWeight={600}>
                $
              </Typography>
              <Typography fontSize="32px" component="span" fontWeight={900}>
                {price}
              </Typography>
            </Stack>
            <Typography fontSize="16px" component="span" fontWeight={900}>
              Per Month
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={2.5}>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize="24px" fontWeight="700">
              {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`}
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize={{ xs: '24px', sm: '14px' }} fontWeight="700">
              Up to {totalFences} Fences*
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize={{ xs: '24px', sm: '14px' }} fontWeight="700">
              Premium Support
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: '#2DBB5D', width: 20, height: 20 }}
            />
            <Typography fontSize={{ xs: '24px', sm: '14px' }} fontWeight="700">
              One-Touch Sharing
            </Typography>
          </Stack>

          <Stack spacing={1.5} direction="row" alignItems="center" mb={20}>
            <Iconify
              icon={requestAvailable ? 'carbon:checkmark-outline' : 'carbon:close-outline'}
              sx={{ color: requestAvailable ? '#2DBB5D' : '#FF0606', width: 20, height: 20 }}
            />
            <Typography
              fontSize={{ xs: '24px', sm: '14px' }}
              fontWeight="700"
              color={requestAvailable ? 'black' : 'grey'}
            >
              Request Custom Fences
            </Typography>
          </Stack>
          <Button
            size="large"
            disabled={isDisabled}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{
              marginTop: '40px',
              backgroundColor: '#1FA9FF',
              color: fontColor,
              border: `${buttonBorder} 1px solid`,
            }}
          >
            Choose Subscription
          </Button>
        </Stack>
        {type === 4 && (
          <Stack alignItems="flex-end" spacing={3}>
            <Button
              size="large"
              disabled={isDisabled}
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleClick}
              style={{
                backgroundColor: '#1FA9FF',
                color: fontColor,
                border: `${buttonBorder} 1px solid`,
              }}
            >
              Choose Subscription
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
                <path
                  d="M6.5 5L1.5 0L0.800001 0.7L5.1 5L0.800001 9.3L1.5 10L6.5 5Z"
                  fill="#637381"
                />
              </svg>
            </div>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

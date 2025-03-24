import PropTypes from 'prop-types';
import { Card, Stack, Typography, Button } from '@mui/material';
import Iconify from '../../components/iconify';
import { PRICE_VIEW_AVAILABLE } from '../../assets/data/roles';

PlanCardAlmost.propTypes = {
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
  onPriceViewClick: PropTypes.func,
  buttonColor: PropTypes.shape({
    backColor: PropTypes.string,
    fontColor: PropTypes.string,
    buttonBorder: PropTypes.string,
  }),
  isViewAvailable: PropTypes.string,
};

export default function PlanCardAlmost({
  plan,
  isDisabled = false,
  onSubscriptionClick,
  onPriceViewClick,
  isViewAvailable,
  buttonColor,
  type,
}) {
  if (!plan) return null;

  const { id, name, totalFences, popular, totalUsers, requestAvailable, price } = plan;
  const { fontColor, buttonBorder } = buttonColor;

  const handleClick = () => {
    if (
      price === '0' ||
      isViewAvailable === PRICE_VIEW_AVAILABLE.AVAILABLE ||
      name.indexOf('Black') > -1
    ) {
      onSubscriptionClick(id);
      return;
    }

    onPriceViewClick();
  };

  return (
    <Card
      sx={{
        p: 2,
        pt: 4,
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={1}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography
              variant="h4"
              component="div"
              sx={{ marginTop: '20px', fontSize: '26px', fontFamily: 'Poppins' }}
            >
              {name}
            </Typography>
            {price === '0' ? (
              <Typography fontSize="18px" fontWeight="700">
                Free For 7 Day
              </Typography>
            ) : (
              <Typography fontSize="18px" fontWeight="700">
                <br />
              </Typography>
            )}
          </Stack>

          {popular ? (
            <span className="bg-[#b1f3ff] text-[#006C9C] font-medium mr-2 px-2.5 py-1 rounded-[10px] absolute top-5 left-5">
              POPULAR
            </span>
          ) : (
            ''
          )}

          {price !== '0' &&
            !(name.indexOf('Black') > -1) &&
            isViewAvailable === PRICE_VIEW_AVAILABLE.AVAILABLE && (
              <Stack direction="column" alignItems="flex-end" sx={{ marginTop: '2px' }}>
                <Stack direction="row" justifyContent="center" spacing={0.5}>
                  <Typography fontSize="20px" component="span">
                    $
                  </Typography>
                  <Typography fontSize="22px" component="span" fontWeight={900}>
                    {price}
                  </Typography>
                </Stack>
                <Typography fontSize="12px" component="span" fontWeight={900}>
                  Per Month
                </Typography>
              </Stack>
            )}
          {price !== '0' && name.indexOf('Black') > -1 && (
            <Stack direction="column" alignItems="flex-end" sx={{ marginTop: '2px' }}>
              <Stack direction="row" justifyContent="center" spacing={0.5}>
                <Typography fontSize="20px" component="span">
                  $
                </Typography>
                <Typography fontSize="22px" component="span" fontWeight={900}>
                  {price}
                </Typography>
              </Stack>
              <Typography fontSize="12px" component="span" fontWeight={900}>
                Per Month
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack spacing={1}>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: 'green', width: 20, height: 20 }}
            />
            <Typography fontSize="20px" fontWeight="900">
              {totalFences} Fences
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: 'green', width: 20, height: 20 }}
            />
            <Typography fontSize="14px" fontWeight="700">
              {totalUsers === '1' ? `${totalUsers} User` : `${totalUsers} Users`}
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: 'green', width: 20, height: 20 }}
            />
            <Typography fontSize="14px" fontWeight="700">
              Premium Support
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Iconify
              icon="carbon:checkmark-outline"
              sx={{ color: 'green', width: 20, height: 20 }}
            />
            <Typography fontSize="14px" fontWeight="700">
              One-Touch Sharing
            </Typography>
          </Stack>
          <Stack spacing={1.5} direction="row" alignItems="center" mb={20}>
            <Iconify
              icon={requestAvailable ? 'carbon:checkmark-outline' : 'carbon:close-outline'}
              sx={{ color: requestAvailable ? 'green' : 'red', width: 20, height: 20 }}
            />
            <Typography
              fontSize="14px"
              fontWeight="700"
              color={requestAvailable ? 'black' : 'grey'}
            >
              Request Custom Fences
            </Typography>
          </Stack>

          <Stack sx={{ px: 1 }}>
            <Button
              size="large"
              disabled={isDisabled}
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleClick}
              style={{
                marginTop: '20px',
                backgroundColor: '#1FA9FF',
                color: fontColor,
                border: `${buttonBorder} 1px solid`,
              }}
            >
              <Typography sx={{ lineHeight: 2, fontSize: '14px' }}>
                {price === '0' && 'Start Free Trial'}
                {price !== '0' && name.indexOf('Black') > -1 && 'Choose Subscription'}
                {price !== '0' &&
                  !(name.indexOf('Black') > -1) &&
                  (isViewAvailable === PRICE_VIEW_AVAILABLE.AVAILABLE
                    ? 'Choose Subscription'
                    : 'View Pricing')}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

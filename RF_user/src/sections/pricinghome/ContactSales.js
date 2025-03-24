// This is used for  v1.3
import { useNavigate } from 'react-router';
import { Card, Stack, Typography, Button } from '@mui/material';
import contactsalesimg from '../../assets/contactsales.png';
import { PATH_PAGE } from '../../routes/paths';

export default function ContactSales() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(PATH_PAGE.meeting);
  };

  return (
    <Card
      sx={{
        pt: '20px',
        px: 4,
        pb: 5,
        boxShadow: (theme) => theme.customShadows.z8,
      }}
    >
      <Stack spacing={1}>
        <Typography
          component="div"
          sx={{
            fontSize: '28px',
            textAlign: 'center',
            fontWeight: '800',
            fontFamily: 'Poppins',
          }}
        >
          Already have <br />
          an account?
        </Typography>
        <img src={contactsalesimg} alt="contact" style={{ height: '180px', alignSelf: 'center' }} />
        <Button
          size="large"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleClick}
          style={{
            marginTop: '40px',
            backgroundColor: '#1FA9FF',
            color: '#FFFFFF',
            border: `#1FA9FF 1px solid`,
          }}
        >
          Contact Sales
        </Button>
      </Stack>
    </Card>
  );
}

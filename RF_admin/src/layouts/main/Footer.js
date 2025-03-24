import { Link as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Grid, Link, Stack, Divider, Container, Typography, IconButton } from '@mui/material';
// routes
import { PATH_PAGE } from '../../routes/paths';
// _mock
import { _socials } from '../../_mock/arrays';
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';
import icon from '../../assets/icon.png';
//
// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Solutions',
    children: [
      { name: 'Industries', href: '#' },
      { name: 'Term if Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'MCA', href: '#' },
    ],
  },
  {
    headline: 'Company',
    children: [
      { name: 'Join our Team', href: '#' },
      { name: 'Hire us', href: '#' },
      { name: 'Careers', href: '#' },
    ],
  },
  {
    headline: 'Resources',
    children: [
      { name: 'Resources', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Onhovered', href: '#' },
    ],
  },
  {
    headline: 'Support',
    children: [
      { name: 'Help Center', href: '#' },
      { name: 'API Docs', href: '#' },
      { name: 'Ticket System', href: '#' },
      { name: 'Status Page', href: '#' },
      { name: 'Contacts', href: '#' },
    ],
  },
  {
    headline: 'Solutions',
    children: [
      { name: 'Industries', href: '#' },
      { name: 'Term if Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'MCA', href: '#' },
    ],
  },
  {
    headline: 'Contacts',
    children: [
      { name: 'Join our Team', href: '#' },
      { name: 'Hire us', href: '#' },
      { name: 'Careers', href: '#' },
    ],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          © All rights reserved
          <br /> made by &nbsp;
          <Link href="https://minimals.cc/"> minimals.cc </Link>
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <div className="flex w-full">
      <Box
        component="footer"
        sx={{
          position: 'relative',
          backgroundImage: `url(${'/assets/background/overlay_5.png'})`,
          // height: '1400px',
          width: '1900px',
        }}
      >
        <Divider />

        <Container sx={{ pt: 5 }}>
          <Grid
            container
            justifyContent={{
              xs: 'center',
              md: 'space-between',
            }}
            sx={{
              textAlign: {
                xs: 'center',
                md: 'left',
              },
            }}
          >
            <div className="flex justify-between  w-full h-[56px]">
              <img src={icon} alt="icon" />
              {/* <Stack
                spacing={1}
                direction="row"
                // justifyContent={{ xs: 'center', md: 'flex-start' }}
                // sx={{
                //   mt: 5,
                //   mb: { xs: 5, md: 0 },
                // }}
              > */}
              <div>
                {_socials.map((social) => (
                  <IconButton key={social.name}>
                    <Iconify icon={social.icon} />
                  </IconButton>
                ))}
              </div>

              {/* </Stack> */}
            </div>

            <Grid item xs={12} md={12} sx={{ pt: 5, marginBottom: 10 }}>
              <Stack
                spacing={5}
                justifyContent="space-between"
                direction={{ xs: 'column', md: 'row' }}
              >
                {LINKS.map((list) => (
                  <Stack
                    key={list.headline}
                    spacing={2}
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                  >
                    <Typography component="div" variant="overline" color="#FFEAA7">
                      {list.headline}
                    </Typography>

                    {list.children.map((link) => (
                      <Link
                        key={link.name}
                        component={RouterLink}
                        to={link.href}
                        color="inherit"
                        variant="body2"
                        color="#FFFFFF"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );

  return isHome ? mainFooter : simpleFooter;
}

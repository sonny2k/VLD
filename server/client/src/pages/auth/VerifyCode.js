import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Link, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// sections
import { VerifyCodeForm } from '../../sections/auth/verify-code';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {
  return (
    <Page title="Xác minh" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Button
              size="small"
              component={RouterLink}
              to={PATH_AUTH.register}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />}
              sx={{ mb: 3 }}
            >
              Trở lại
            </Button>

            <Typography variant="h3" paragraph>
              Kiểm tra tin nhắn của bạn!
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Chúng tôi đã gửi mã xác minh 6 chữ số tới điện thoại của bạn, vui lòng nhập mã vào ô bên dưới để xác thực số điện thoại.
            </Typography>

            <Box sx={{ mt: 5, mb: 3 }}>
              <VerifyCodeForm />
            </Box>

            <Typography variant="body2" align="center">
              Chưa nhận được mã? &nbsp;
              <Link variant="subtitle2" underline="none" onClick={() => {}}>
                Gửi lại
              </Link>
            </Typography>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

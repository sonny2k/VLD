import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
// sections
import { ResetPasswordForm } from '../../sections/auth/reset-password';
// assets
import { SentIcon } from '../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <Page title="Khôi phục mật khẩu" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            {!sent ? (
              <>
                <Typography variant="h3" paragraph>
                  Bạn quên mật khẩu?
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                  Vui lòng nhập số điện thoại ứng với tài khoản của bạn.
                </Typography>

                <ResetPasswordForm onSent={() => setSent(true)} onGetPhone={(value) => setPhone(value)} />

                <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 1 }}>
                  Trở về
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />

                <Typography variant="h3" gutterBottom>
                  Gửi yêu cầu thành công
                </Typography>
                <Typography>
                  Chúng tôi đã gửi mã xác minh tới số điện thoại &nbsp;
                  <strong>{phone}</strong>
                  <br />
                  Vui lòng kiểm tra tin nhắn.
                </Typography>

                <Button size="large" variant="contained" component={RouterLink} to={PATH_AUTH.verify} sx={{ mt: 5 }}>
                  Nhập mã xác minh
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

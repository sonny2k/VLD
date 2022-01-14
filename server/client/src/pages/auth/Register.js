import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography, Tooltip } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { RegisterForm } from '../../sections/auth/register';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Register() {
  const { method } = useAuth();

  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Đăng ký">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Đã có tài khoản?{' '}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
                Đăng nhập
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Xin chào, ngày hôm nay của bạn thế nào?
            </Typography>
            <Image
              alt="Đăng ký"
              src="https://i.ibb.co/ZhwgNC5/Login-user.png"
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Đăng ký tài khoản Văn Lang Doctor
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Vui lòng điền vào biểu mẫu bên dưới.</Typography>
              </Box>
              <Tooltip title={capitalCase(method)}>
                <>
                  <Image
                    disabledEffect
                    src={`https://minimal-assets-api.vercel.app/assets/icons/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip>
            </Box>

            <RegisterForm />

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              Khi đăng ký, bạn đã chấp nhận&nbsp;
              <Link underline="always" color="text.primary" href="#">
              Điều Khoản Dịch Vụ
              </Link>
              &nbsp;và&nbsp;
              <Link underline="always" color="text.primary" href="#">
              Chính Sách Riêng Tư
              </Link>
              &nbsp;của chúng tôi.
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                Đã có tài khoản?{' '}
                <Link variant="subtitle2" to={PATH_AUTH.login} component={RouterLink}>
                  Đăng nhập
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}

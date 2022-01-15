// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Container, Typography, Button } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionInView, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: 'https://i.ibb.co/H73wHpr/feelings.png',
    title: 'Tim mạch',
    description:
      'Hỗ trợ các vấn đề tim mạch như thở gấp, tim đập nhanh,...',
  },
  {
    icon: 'https://i.ibb.co/176M5fX/medical-shield.png',
    title: 'Tổng quát',
    description: 'Cung cấp chuẩn đoán khách quan về sức khỏe tổng quát',
  },
  {
    icon: 'https://i.ibb.co/By4bdgH/brain.png',
    title: 'Thần kinh',
    description: 'Tư vấn các vấn đề liên quan đến thần kinh như suy nhược thần kinh, thiếu máu não,...',
  }
];

const shadowIcon = (color) => `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`;

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15),
  },
}));

const CardStyle = styled(Card)(({ theme }) => {
  const shadowCard = (opacity) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    border: 0,
    maxWidth: 380,
    minHeight: 440,
    margin: 'auto',
    textAlign: 'center',
    padding: theme.spacing(10, 5, 0),
    boxShadow: theme.customShadows.z12,
    [theme.breakpoints.up('md')]: {
      boxShadow: 'none',
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    '&.cardLeft': {
      [theme.breakpoints.up('md')]: { marginTop: -40 },
    },
    '&.cardCenter': {
      [theme.breakpoints.up('md')]: {
        marginTop: -80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `-40px 40px 80px 0 ${shadowCard(0.4)}`,
        '&:before': {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          content: "''",
          margin: 'auto',
          position: 'absolute',
          width: 'calc(100% - 40px)',
          height: 'calc(100% - 40px)',
          borderRadius: Number(theme.shape.borderRadius) * 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `-20px 20px 40px 0 ${shadowCard(0.12)}`,
        },
      },
    },
  };
});

// ----------------------------------------------------------------------

export default function HomeMinimal() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle>
      <Container>
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 10, md: 25 },
          }}
        >
          <MotionInView variants={varFade().inUp}>
            <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
              Một số chuyên khoa phổ biến.
            </Typography>
          </MotionInView>
          <MotionInView variants={varFade().inDown}>
            <Typography variant="h2">Nhận lời khuyên từ các bác sĩ trực tuyến khi bạn cảm thấy lo lắng về sức khỏe</Typography>
          </MotionInView>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 5, lg: 10 },
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {CARDS.map((card, index) => (
            <MotionInView variants={varFade().inUp} key={card.title}>
              <CardStyle className={(index === 0 && 'cardLeft') || (index === 1 && 'cardCenter') || ''}>
                <Image
                  src={card.icon}
                  alt={card.title}
                  sx={{
                    mb: 10,
                    mx: 'auto',
                    width: 80,
                    height: 80,
                    filter: (theme) => shadowIcon(theme.palette.primary.main),
                    ...(index === 0 && {
                      filter: (theme) => shadowIcon(theme.palette.info.main),
                    }),
                    ...(index === 1 && {
                      filter: (theme) => shadowIcon(theme.palette.error.main),
                    }),
                  }}
                />
                <Typography variant="h5" paragraph>
                  {card.title}
                </Typography>
                <Typography sx={{ color: isLight ? 'text.secondary' : 'common.white' }}>{card.description}</Typography>
                <Typography variant="h5" paragraph> </Typography>
                <Button size="medium" variant="contained">Đặt lịch tư vấn</Button>
              </CardStyle>
            </MotionInView>
          ))}
        </Box>
      </Container>
    </RootStyle>
  );
}

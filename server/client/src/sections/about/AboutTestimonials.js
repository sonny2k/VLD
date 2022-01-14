import PropTypes from 'prop-types';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Link, Paper, Rating, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
import cssStyles from '../../utils/cssStyles';
// components
import Iconify from '../../components/Iconify';
import { MotionInView, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const TESTIMONIALS = [
  {
    name: 'Lưu Trung Thành',
    rating: 5,
    dateCreate: '01 tháng 11 năm 2021',
    content: `Quá tốt, tôi sẽ sử dụng lâu dài`,
  },
  {
    name: 'Đinh Tấn Khanh',
    rating: 5,
    dateCreate: '01 tháng 11 năm 2021',
    content: `Vì tình hình dịch bệnh tôi phải về quê và gặp khó khăn trong việc khám chữa bệnh tại bệnh viện mà tôi đã đăng kí BHXH, nhờ có Van Lang Doctor mà tôi đã được hỗ trợ thăm khám sức khỏe miễn phí qua máy tính`,
  },
  {
    name: 'Nguyễn Hoàng Long',
    rating: 5,
    dateCreate: '01 tháng 11 năm 2021',
    content: `Tủ thuốc gia đình của tớ  có đầy đủ thuốc nhờ sử dụng dịch vụ Van Lang Doctor, tớ yêu Van Lang Doctor!`,
  },
  {
    name: 'Võ Minh Vương',
    rating: 5,
    dateCreate: '01 tháng 11 năm 2021',
    content: `Web rất mượt và nhanh, nhờ tính năng gọi video mà cả gia đình tôi đều nghe được lời tư vấn nhờ đó lưu ý sức khỏe cho các thành viên trong gia đình`,
  },
  {
    name: 'Khánh Duy',
    rating: 5,
    dateCreate: '01 tháng 11 năm 2021',
    content: `Mua 2 hộp vitamin cá ngừ còn được tặng áo mưa, thật là vui quá đi`,
  },
  {
    name: 'Thuần Vương',
    rating: 5,
    dateCreate: '01 tháng 11 năm 2021',
    content: `Đội ngũ support thật sự rất tận tình, tôi đã gặp 1 số vấn đề trong việc đặt hàng và đã được đội ngũ hỗ trợ rất nhiệt tình và lịch thiệp. Hàng giao cũng nhanh nữa. Tôi khuyến khích bạn sử dụng dịch vụ của Van Lang Doctor`,
  },
];

const RootStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(10, 0),
  backgroundSize: 'cover',
  backgroundImage: `linear-gradient(to right, ${alpha(theme.palette.grey[900], 0.8)} , ${alpha(
    theme.palette.grey[900],
    0.8
  )}), url(https://i.imgur.com/Pq6W0QU.jpg)`,
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    padding: 0,
    height: 840,
    overflow: 'hidden',
  },
}));

// ----------------------------------------------------------------------

export default function AboutTestimonials() {
  const isDesktop = useResponsive('up', 'md');

  return (
    <RootStyle>
      <Container sx={{ position: 'relative', height: '100%' }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ height: '100%' }}
        >
          <Grid item xs={10} md={4}>
            <Box sx={{ maxWidth: { md: 360 } }}>
              <MotionInView variants={varFade().inUp}>
                <Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary' }}>
                  Ý kiến khách hàng
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Typography variant="h2" sx={{ mb: 3, color: 'common.white' }}>
                  Khách hàng <br />
                  nói gì?
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Typography sx={{ color: 'common.white' }}>
                  Van Lang Doctor luôn luôn lắng nghe ý kiến từ người dùng và tích cực đổi mới, nhằm tạo sự thoải mái
                  tiện lợi khi sử dụng dịch vụ
                </Typography>
              </MotionInView>

              {!isDesktop && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <MotionInView variants={varFade().inUp}>
                    <TestimonialLink />
                  </MotionInView>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={7}
            lg={6}
            sx={{
              right: { md: 24 },
              position: { md: 'absolute' },
            }}
          >
            <Grid container spacing={isDesktop ? 3 : 0} alignItems="center">
              <Grid item xs={12} md={6}>
                {TESTIMONIALS.slice(0, 3).map((testimonial) => (
                  <MotionInView key={testimonial.name} variants={varFade().inUp}>
                    <TestimonialCard testimonial={testimonial} />
                  </MotionInView>
                ))}
              </Grid>

              <Grid item xs={12} md={6}>
                {TESTIMONIALS.slice(3, 6).map((testimonial) => (
                  <MotionInView key={testimonial.name} variants={varFade().inUp}>
                    <TestimonialCard testimonial={testimonial} />
                  </MotionInView>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {isDesktop && (
          <Box sx={{ bottom: 60, position: 'absolute' }}>
            <MotionInView variants={varFade().inLeft}>
              <TestimonialLink />
            </MotionInView>
          </Box>
        )}
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

function TestimonialLink() {
  return (
    <Link href="#" variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
      Trải nghiệm dịch vụ và đánh giá ngay
      <Iconify icon={'ic:round-arrow-right-alt'} sx={{ ml: 1, width: 20, height: 20 }} />
    </Link>
  );
}

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    content: PropTypes.string,
    dateCreate: PropTypes.string,
    name: PropTypes.string,
    rating: PropTypes.number,
  }),
};

function TestimonialCard({ testimonial }) {
  const theme = useTheme();
  const { name, rating, dateCreate, content } = testimonial;

  return (
    <Paper
      sx={{
        mt: 3,
        p: 3,
        color: 'common.white',
        ...cssStyles().bgBlur({
          color: theme.palette.common.white,
          opacity: 0.04,
        }),
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        {name}
      </Typography>
      <Typography gutterBottom component="p" variant="caption" sx={{ color: 'grey.500' }}>
        {dateCreate}
      </Typography>
      <Rating value={rating} readOnly size="small" />
      <Typography variant="body2" sx={{ mt: 1.5 }}>
        {content}
      </Typography>
    </Paper>
  );
}

// routes
import { PATH_AUTH, PATH_DOCS, PATH_PAGE } from '../../routes/paths';
// components
import { PATH_AFTER_LOGIN } from '../../config';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Trang chủ',
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/',
  },
  {
    title: 'Nhà thuốc',
    icon: <Iconify icon={'bx:bxs-store-alt'} {...ICON_SIZE} />,
    path: '/pages',
  },
  {
    title: 'Câu hỏi & giải đáp',
    icon: <Iconify icon={'ic:twotone-question-answer'} {...ICON_SIZE} />,
    path: PATH_PAGE.faqs,
  },
  {
    title: 'Các dịch vụ',
    path: '/pages',
    icon: <Iconify icon={'ic:round-home-repair-service'} {...ICON_SIZE} />,
    children: [
      {
        subheader: 'Other',
        items: [
          { title: 'About us', path: PATH_PAGE.about },
          { title: 'Contact us', path: PATH_PAGE.contact },
          { title: 'FAQs', path: PATH_PAGE.faqs },
          { title: 'Pricing', path: PATH_PAGE.pricing },
          { title: 'Payment', path: PATH_PAGE.payment },
          { title: 'Maintenance', path: PATH_PAGE.maintenance },
          { title: 'Coming Soon', path: PATH_PAGE.comingSoon },
        ],
      },
      {
        subheader: 'Authentication',
        items: [
          { title: 'Login', path: PATH_AUTH.loginUnprotected },
          { title: 'Register', path: PATH_AUTH.registerUnprotected },
          { title: 'Reset password', path: PATH_AUTH.resetPassword },
          { title: 'Verify code', path: PATH_AUTH.verify },
        ],
      },
      {
        subheader: 'Error',
        items: [
          { title: 'Page 404', path: PATH_PAGE.page404 },
          { title: 'Page 500', path: PATH_PAGE.page500 },
        ],
      },
      {
        subheader: 'Bảng điều khiển',
        items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
      },
    ],
  },
  {
    title: 'Tin tức',
    icon: <Iconify icon={'emojione-monotone:newspaper'} {...ICON_SIZE} />,
    path: '/pages',
  },
  {
    title: 'Đăng ký',
    icon: <Iconify icon={'emojione-monotone:fountain-pen'} {...ICON_SIZE} />,
    path: PATH_AUTH.register,
  },
];

export default menuConfig;

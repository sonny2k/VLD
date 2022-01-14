import PropTypes from 'prop-types';
import * as Yup from 'yup';
import 'yup-phone';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetPhone: PropTypes.func,
};

export default function ResetPasswordForm({ onSent, onGetPhone }) {
  const isMountedRef = useIsMountedRef();

  const ResetPasswordSchema = Yup.object().shape({
    phone: Yup.string().phone('VN', true, 'Số điện thoại không hợp lệ'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (isMountedRef.current) {
        onSent();
        onGetPhone(data.phone);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="phone" label="Số điện thoại" />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Khôi phục mật khẩu
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

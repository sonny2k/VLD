import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
    newPassword: Yup.string().min(8, 'Mật khẩu bao gồm chữ và số, tối thiểu 8 ký tự và tối đa 20 ký tự ').required('Vui lòng nhập mật khẩu mới'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp, vui lòng kiểm tra lại'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar('Cập nhật thành công!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="oldPassword" type="password" label="Mật khẩu cũ" />

          <RHFTextField name="newPassword" type="password" label="Mật khẩu mới" />

          <RHFTextField name="confirmNewPassword" type="password" label="Nhập lại mật khẩu mới" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Lưu thay đổi
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}

/* eslint-disable no-nested-ternary */
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// assets
import { PasswordIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hook';
import { Card } from '@mui/material';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function JwtForgotPasswordView() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales();

  const router = useRouter();
  const ForgotPasswordSchema = Yup.object().shape({
    identifier: Yup.string()
      .required('This field is required')
      .test(
        'is-email-or-phone',
        'Enter a valid email or phone number with country code',
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^\+[1-9]\d{1,14}$/; // E.164 format, e.g., +919876543210
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      ),
  });

  const defaultValues = {
    identifier: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = {
        mobile_email: data.identifier,
      };
      const { data: response } = await axiosInstance.post('/send-otp', inputData);
      console.log(response);
      enqueueSnackbar(response?.message, { variant: 'success' });
      router.push(`${paths.auth.jwt.forgotPasswordOtpVerification}?identifier=${data.identifier}`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        typeof error === 'string'
          ? error
          : error?.error?.message
          ? error?.error?.message
          : error?.message,
        {
          variant: 'error',
        }
      );
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="identifier"
        label={t('email_or_phone')}
        placeholder={t('enter_email_or_phone')}
        autoComplete="email"
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Request
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter your registered email address or phone number. We’ll send you a verification
          code to reset your password, based on the details you provide.
        </Typography>
      </Stack>
    </>
  );

  return (
    <Card
      sx={{
        py: 5,
        px: 3,
        maxWidth: 720,
        width: '100%',
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}

        {renderForm}
      </FormProvider>
    </Card>
  );
}

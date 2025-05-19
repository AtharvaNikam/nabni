import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hook';
// hooks
import { useCountdownSeconds } from 'src/hooks/use-countdown';
// assets
import { EmailInboxIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode, RHFTextField } from 'src/components/hook-form';
import { useLocales } from 'src/locales';
import { Box, Card } from '@mui/material';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function JwtLoginVerifyView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();

  const identifier = searchParams.get('identifier');
  const loginType = searchParams.get('loginType');

  const { t } = useLocales();
  const { verifyLoginOtp } = useAuthContext();

  const {
    countdown: identifierCountdown,
    counting: identifierCounting,
    startCountdown: startIdentifierCountdown,
  } = useCountdownSeconds(60);

  const VerifySchemaSchema = Yup.object().shape({
    code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
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
    code: '',
    identifier: loginType === 'email' ? `${identifier.trim()}` : `+${identifier.trim()}` || '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchemaSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      await verifyLoginOtp(data.identifier, data.code);
    } catch (error) {
      console.log(error);
      const errorMessage = error?.message || 'Something went wrong. Please try again.';
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      });
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      const inputData = {
        mobile_email: loginType === 'email' ? `${identifier.trim()}` : `+${identifier.trim()}`,
      };
      await axiosInstance.post(`/send-otp`, inputData);
      enqueueSnackbar('Otp sent successfully!');
      startIdentifierCountdown();
    } catch (error) {
      console.error(error);
    }
  }, [enqueueSnackbar, identifier, loginType, startIdentifierCountdown]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      {/* Email Input */}
      <RHFTextField
        name="identifier"
        label={t('enter_email_or_phone')}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
      />

      {/* Email Code & Resend */}
      <RHFCode name="code" />
      <Box width="100%" textAlign="right">
        <Link
          variant="body2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(identifierCounting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          {t('resend_otp')} {identifierCounting && `(${identifierCountdown}s)`}
        </Link>
      </Box>

      {/* Submit Button */}
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Verify
      </LoadingButton>

      {/* Back to Sign In */}
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
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('please_check_your_email_&_mobile_for_otp')}</Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ bgcolor: 'background.default' }}
      >
        <Card
          sx={{
            p: { xs: 3, md: 5 },
            width: 1,
            maxWidth: 480,
            boxShadow: 8,
            borderRadius: 3,
            position: 'relative',
          }}
        >
          {renderHead}

          {renderForm}
        </Card>
      </Box>
    </FormProvider>
  );
}

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

// ----------------------------------------------------------------------

export default function JwtVerifyView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();

  const email = searchParams.get('email');
  const mobile = searchParams.get('mobile');
  const { t } = useLocales();
  const { verifyRegisterOtp } = useAuthContext();

  const {
    countdown: emailCountdown,
    counting: emailCounting,
    startCountdown: startEmailCountdown,
  } = useCountdownSeconds(60);

  const {
    countdown: mobileCountdown,
    counting: mobileCounting,
    startCountdown: startMobileCountdown,
  } = useCountdownSeconds(60);

  const VerifySchemaSchema = Yup.object().shape({
    code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    mobile_code: Yup.string()
      .min(6, 'Code must be at least 6 characters')
      .required('Code is required'),
    mobile: Yup.string().required('Mobile is required'),
  });

  const defaultValues = {
    code: '',
    email: email || '',
    mobile_code: '',
    mobile: `+${mobile.trim()}` || '',
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
      await verifyRegisterOtp(data.email, data.code, data.mobile, data.mobile_code);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.message || 'Something went wrong. Please try again.';
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      });
    }
  });

  const handleResendEmailCode = useCallback(async () => {
    try {
      startEmailCountdown();
    } catch (error) {
      console.error(error);
    }
  }, [startEmailCountdown]);

  const handleResendMobileCode = useCallback(async () => {
    try {
      startMobileCountdown();
    } catch (error) {
      console.error(error);
    }
  }, [startMobileCountdown]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      {/* Email Input */}
      <RHFTextField
        name="email"
        label={t('email')}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
      />

      {/* Email Code & Resend */}
      <RHFCode name="code" />
      <Box width="100%" textAlign="right">
        <Link
          variant="body2"
          onClick={handleResendEmailCode}
          sx={{
            cursor: 'pointer',
            ...(emailCounting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          {t('resend_email_otp')} {emailCounting && `(${emailCountdown}s)`}
        </Link>
      </Box>

      {/* Mobile Input */}
      <RHFTextField name="mobile" label={t('mobile_number')} placeholder="+91XXXXXXXXXX" disabled />

      {/* Mobile Code & Resend */}
      <RHFCode name="mobile_code" />
      <Box width="100%" textAlign="right">
        <Link
          variant="body2"
          onClick={handleResendMobileCode}
          sx={{
            cursor: 'pointer',
            ...(mobileCounting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          {t('resend_phone_otp')} {mobileCounting && `(${mobileCountdown}s)`}
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

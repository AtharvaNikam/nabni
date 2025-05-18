import * as Yup from 'yup';
import { useCallback, useState } from 'react';
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

export default function JwtForgotPasswordVerifyView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();

  const [isVerified, setIsVerified] = useState(false);

  const identifier = searchParams.get('identifier');
  const loginType = searchParams.get('loginType');

  const { t } = useLocales();
  const { verifyForgotPasswordOtp } = useAuthContext();

  const {
    countdown: identifierCountdown,
    counting: identifierCounting,
    startCountdown: startIdentifierCountdown,
  } = useCountdownSeconds(60);

  const VerifySchema = Yup.object().shape({
    ...(isVerified
      ? {
          password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required'),
        }
      : {
          code: Yup.string()
            .min(6, 'Code must be at least 6 characters')
            .required('Code is required'),
          identifier: Yup.string()
            .required('Email or Phone is required')
            .test(
              'is-email-or-phone',
              'Enter a valid email or phone number with country code',
              (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^\+[1-9]\d{1,14}$/;
                return emailRegex.test(value) || phoneRegex.test(value);
              }
            ),
        }),
  });

  const defaultValues = {
    code: '',
    identifier: identifier || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
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
      if (!isVerified) {
        // Verify OTP
        await verifyForgotPasswordOtp(data.identifier, data.code);
        enqueueSnackbar('OTP Verified Successfully', { variant: 'success' });
        setIsVerified(true); // Move to password reset step
      } else {
        // Update password
        const response = await axiosInstance.post(`/update-password`, {
          identifier,
          password: data.password,
        });
        enqueueSnackbar('Password updated successfully!', { variant: 'success' });
        router.push(paths.auth.jwt.login); // Redirect to login
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || 'Something went wrong. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      const inputData = {
        mobile_email: identifier,
      };
      await axiosInstance.post(`/send-otp`, inputData);
      enqueueSnackbar('Otp sent successfully!');
      startIdentifierCountdown();
    } catch (error) {
      console.error(error);
    }
  }, [enqueueSnackbar, identifier, startIdentifierCountdown]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="identifier"
        label={t('enter_email_or_phone')}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
      />

      {!isVerified ? (
        <>
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
        </>
      ) : (
        <>
          <RHFTextField
            name="password"
            label="Enter New Password"
            type="password"
            placeholder="••••••••"
          />
          <RHFTextField
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
          />
        </>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {isVerified ? 'Update Password' : 'Verify'}
      </LoadingButton>

      {!isVerified && (
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
      )}
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

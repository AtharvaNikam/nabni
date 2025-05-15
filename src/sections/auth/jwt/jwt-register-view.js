import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hook';
// auth
import { useAuthContext } from 'src/auth/hooks';
import { sendOtp, verifyOtp } from 'src/api/auth';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useLocales } from 'src/locales';
import LanguagePopover from 'src/layouts/_common/language-popover';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();
  const { t } = useLocales();

  // State for OTP verification
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState('');
  const [mobileForOtp, setMobileForOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState({
    email: { sent: false, verified: false },
    phone: { sent: false, verified: false }
  });

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Email must be valid'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^\+[1-9]\d{1,14}$/, 'Phone number must be in international format (e.g., +91XXXXXXXXXX)'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username: '',
    email: '',
    mobile: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  // Registration submit
  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      // Remove the '+' and country code for registration
      // For example: +917414955517 -> 7414955517
      let mobileWithoutCode = data.mobile;
      if (data.mobile.startsWith('+91')) {
        mobileWithoutCode = data.mobile.substring(3); // Remove +91
      } else if (data.mobile.startsWith('+')) {
        mobileWithoutCode = data.mobile.substring(1); // Remove + if no country code
      }
      
      console.log('Phone number handling:', {
        original: data.mobile,
        forRegistration: mobileWithoutCode,
        forOTP: data.mobile
      });

      const result = await register?.(data.username, data.email, mobileWithoutCode, data.password);
      if (result.success) {
        setEmailForOtp(data.email);
        setMobileForOtp(data.mobile); // Keep full number with country code for OTP
        setIsVerifying(true);
        setErrorMsg('');
        // Send OTP to email
        try {
          await sendOtp(data.email); // Send just the email string
          setOtpStatus(prev => ({ ...prev, email: { ...prev.email, sent: true } }));
        } catch (e) {
          setOtpStatus(prev => ({ ...prev, email: { ...prev.email, sent: false } }));
          setErrorMsg('Failed to send email OTP. Please try again.');
        }
        // Send OTP to phone
        try {
          await sendOtp(data.mobile); // Send just the phone number string
          setOtpStatus(prev => ({ ...prev, phone: { ...prev.phone, sent: true } }));
        } catch (e) {
          setOtpStatus(prev => ({ ...prev, phone: { ...prev.phone, sent: false } }));
          setErrorMsg('Failed to send phone OTP. Please try again.');
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  // OTP verification submit
  const handleVerifyOtps = async () => {
    setOtpLoading(true);
    setOtpError('');
    try {
      // Verify email OTP
      const emailRes = await verifyOtp(emailForOtp, emailOtp); // Send as separate parameters
      if (emailRes?.success) {
        setOtpStatus(prev => ({ ...prev, email: { ...prev.email, verified: true } }));
      }

      // Verify phone OTP
      const phoneRes = await verifyOtp(mobileForOtp, phoneOtp); // Send as separate parameters
      if (phoneRes?.success) {
        setOtpStatus(prev => ({ ...prev, phone: { ...prev.phone, verified: true } }));
      }
      
      // Only redirect if both are verified
      if (emailRes?.success && phoneRes?.success) {
        // Clear any stored tokens
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        // Redirect to login
        router.push('/auth/jwt/login');
      } else {
        setOtpError('Both OTPs must be verified successfully to proceed.');
      }
    } catch (error) {
      setOtpError(typeof error === 'string' ? error : error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: 'background.default' }}>
      <Card sx={{ p: { xs: 3, md: 5 }, width: 1, maxWidth: 480, boxShadow: 8, borderRadius: 3, position: 'relative' }}>
        {/* Language Switcher */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <LanguagePopover />
        </Box>

        {/* Header */}
        <Stack alignItems="center" spacing={2} mb={3}>
          <Box component="img" src="/logo/nabni-logo.png" alt="Nabni Logo" sx={{ width: 200, height: 140 }} />
          <Typography variant="h4">{t('register')}</Typography>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2"> {t('already_have_account')} </Typography>
            <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
              {t('login')}
            </Link>
          </Stack>
        </Stack>

        {/* Registration Form or OTP Verification */}
        {!isVerifying ? (
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
              <RHFTextField name="username" label={t('username')} placeholder={t('username')} />
              <RHFTextField name="email" label={t('email')} placeholder={t('email')} />
              <RHFTextField 
                name="mobile" 
                label={t('mobile_number')} 
                placeholder="+91XXXXXXXXXX"
                helperText="Enter phone number with country code (e.g., +91XXXXXXXXXX)"
              />
              <RHFTextField
                name="password"
                label={t('password')}
                placeholder={t('password')}
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={methods.formState.isSubmitting}
              >
                {t('register')}
              </LoadingButton>
            </Stack>
          </FormProvider>
        ) : (
          <Stack spacing={2.5}>
            <Typography variant="h6" align="center">{t('verify_your_email_and_phone')}</Typography>
            {!!otpError && <Alert severity="error">{otpError}</Alert>}
            
            {/* Email OTP Section */}
            <Box>
              <Typography variant="subtitle2" color={otpStatus.email.verified ? 'success.main' : 'text.primary'}>
                Email Verification {otpStatus.email.verified && '✓'}
              </Typography>
              <TextField
                label={t('email_otp')}
                value={emailOtp}
                onChange={e => setEmailOtp(e.target.value)}
                fullWidth
                disabled={otpStatus.email.verified}
                sx={{ mt: 1 }}
              />
              <Button
                variant="outlined"
                onClick={async () => {
                  try {
                    await sendOtp(emailForOtp); // Send just the email string
                    setOtpStatus(prev => ({ ...prev, email: { ...prev.email, sent: true } }));
                  } catch (e) {
                    setOtpStatus(prev => ({ ...prev, email: { ...prev.email, sent: false } }));
                  }
                }}
                disabled={otpLoading || otpStatus.email.verified}
                sx={{ mt: 1 }}
              >
                {otpStatus.email.sent ? t('resend_email_otp') : t('send_email_otp')}
              </Button>
            </Box>

            {/* Phone OTP Section */}
            <Box>
              <Typography variant="subtitle2" color={otpStatus.phone.verified ? 'success.main' : 'text.primary'}>
                Phone Verification {otpStatus.phone.verified && '✓'}
              </Typography>
              <TextField
                label={t('phone_otp')}
                value={phoneOtp}
                onChange={e => setPhoneOtp(e.target.value)}
                fullWidth
                disabled={otpStatus.phone.verified}
                sx={{ mt: 1 }}
              />
              <Button
                variant="outlined"
                onClick={async () => {
                  try {
                    await sendOtp(mobileForOtp); // Send just the phone number string
                    setOtpStatus(prev => ({ ...prev, phone: { ...prev.phone, sent: true } }));
                  } catch (e) {
                    setOtpStatus(prev => ({ ...prev, phone: { ...prev.phone, sent: false } }));
                  }
                }}
                disabled={otpLoading || otpStatus.phone.verified}
                sx={{ mt: 1 }}
              >
                {otpStatus.phone.sent ? t('resend_phone_otp') : t('send_phone_otp')}
              </Button>
            </Box>

            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              variant="contained"
              loading={otpLoading}
              onClick={handleVerifyOtps}
              disabled={!emailOtp || !phoneOtp || otpStatus.email.verified && otpStatus.phone.verified}
            >
              {t('verify')}
            </LoadingButton>
          </Stack>
        )}
      </Card>
    </Box>
  );
}

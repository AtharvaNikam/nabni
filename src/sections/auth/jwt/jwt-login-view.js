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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hook';
// config
// import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocales } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import LanguagePopover from 'src/layouts/_common/language-popover';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const password = useBoolean();
  const { t } = useLocales();
  const [rememberMe, setRememberMe] = useState(false);

  // Debug: Check translation output
  if (typeof window !== 'undefined') {
    // Only log in browser
    // You can remove this after debugging
    // eslint-disable-next-line no-console
    console.log(
      'Current lang:',
      (window.i18next && window.i18next.language) || 'unknown',
      'Username:',
      t('username')
    );
  }

  // fallback error messages if translation keys are missing
  const required = t('required') || 'required';

  // Combined login schema
  const LoginSchema = Yup.object().shape({
    identifier: Yup.string().required(`${t('email_or_phone')} ${required}`),
    password: Yup.string().required(`${t('password')} ${required}`),
  });

  const defaultValues = {
    identifier: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const isEmail = (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier);
  };

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      const identifier = data.identifier.trim();
      const isEmailLogin = isEmail(identifier);

      await login?.(identifier, data.password, rememberMe);

      // After successful login, check if email verification is needed
      const userRaw = localStorage.getItem('user');
      let user = null;
      try {
        user = userRaw ? JSON.parse(userRaw) : null;
      } catch (e) {
        user = null;
      }

      if (!user) {
        setErrorMsg(t('login_user_not_found') || 'Your email and phone number are not verified.');
        return;
      }

      if (isEmailLogin) {
        router.push({ pathname: '/auth/jwt/verify-email-otp', query: { email: identifier } });
      } else {
        router.push(`/auth/jwt/verify-phone-otp?phone=${encodeURIComponent(identifier)}`);
      }
    } catch (error) {
      methods.reset();
      setErrorMsg(
        error?.message && error?.message !== 'Invalid response from server'
          ? error.message
          : t('login_user_not_found') || 'Your email and phone number are not verified.'
      );
    }
  });

  return (
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
        <Typography variant="h4" align="center" gutterBottom mb={4}>
          {t('login')}
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={2}>
            <RHFTextField
              name="identifier"
              label={t('email_or_phone')}
              placeholder={t('enter_email_or_phone')}
              autoComplete="email"
            />

            <RHFTextField
              name="password"
              label={t('password')}
              type={password.value ? 'text' : 'password'}
              autoComplete="current-password"
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

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label={t('remember_me') || 'Remember Me'}
              sx={{ alignSelf: 'flex-start', mb: -1 }}
            />

            <Link
              component={RouterLink}
              href={paths.auth.jwt.forgotPassword || '#'}
              variant="body2"
              color="inherit"
              underline="always"
              sx={{ alignSelf: 'flex-end' }}
            >
              {t('forgot_password')}
            </Link>

            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={methods.formState.isSubmitting}
            >
              {t('login')}
            </LoadingButton>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
              <LoadingButton
                fullWidth
                variant="outlined"
                color="inherit"
                component={RouterLink}
                href={paths.auth.jwt.register}
              >
                {t('create_account')}
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Card>
    </Box>
  );
}

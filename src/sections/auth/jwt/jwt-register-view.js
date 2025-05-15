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
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hook';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useLocales } from 'src/locales';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();
  const { t } = useLocales();
  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Email must be valid'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(
        /^\+[1-9]\d{1,14}$/,
        'Phone number must be in international format (e.g., +91XXXXXXXXXX)'
      ),
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
      const response = await register(data.email, data.password, data.username, data.mobile);
      console.log(response);

      enqueueSnackbar(response.message, {
        variant: 'success',
      });
      router.push(
        `${paths.auth.jwt.registerOtpVerification}?email=${data.email}&mobile=${data.mobile}`
      );
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
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
        {/* Header */}
        <Stack alignItems="center" spacing={2} mb={3}>
          <Typography variant="h4">{t('register')}</Typography>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2"> {t('already_have_account')} </Typography>
            <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
              {t('login')}
            </Link>
          </Stack>
        </Stack>

        {/* Registration Form or OTP Verification */}
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
      </Card>
    </Box>
  );
}

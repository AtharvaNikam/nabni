import { useState } from 'react';
import { Box, Card, Typography, Button, Stack, TextField, Link, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import LanguagePopover from 'src/layouts/_common/language-popover';

export default function VerifyEmailOtpPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useLocales();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuthContext();
  const email = new URLSearchParams(location.search).get('email') || 'demo@minimals.cc';

  const handleChange = (idx, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[idx] = value;
      setCode(newCode);
      // Move to next input if value entered
      if (value && idx < 5) {
        document.getElementById(`otp-input-${idx + 1}`).focus();
      }
    }
  };

  const handleVerify = async () => {
    try {
      const entered = code.join('');
      if (entered === '123456') {
        await verifyOtp(entered);
        navigate('/dashboard', { replace: true });
      } else {
        setErrorMsg('Invalid OTP. Please use 123456 for testing.');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Invalid code. Please try again.');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: 'background.default', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
        <LanguagePopover />
      </Box>
      <Card sx={{ p: { xs: 3, md: 5 }, width: 1, maxWidth: 420, boxShadow: 8, borderRadius: 3, textAlign: 'center' }}>
        <Box mb={3}>
          <Box
            component="img"
            src="/assets/icons/mail.svg"
            alt="mail"
            sx={{ width: 64, height: 64, mb: 2 }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Typography variant="h4" fontWeight={700} mb={1}>{t('please_check_email') || 'Please check your email!'}</Typography>
          <Typography color="text.secondary" mb={2}>
            {t('email_otp_instruction', { email }) || `We've emailed a 6-digit confirmation code to ${email}, please enter the code in below box to verify your email.`}
          </Typography>
        </Box>
        <TextField
          label={t('email_address') || 'Email address'}
          value={email}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <Stack direction="row" spacing={2} justifyContent="center" my={3}>
          {code.map((digit, idx) => (
            <TextField
              key={idx}
              id={`otp-input-${idx}`}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 24, width: 40 } }}
            />
          ))}
        </Stack>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <Button fullWidth variant="contained" size="large" sx={{ mb: 2 }} onClick={handleVerify}>
          {t('verify') || 'Verify'}
        </Button>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {t('dont_have_code') || "Don't have a code?"}{' '}
          <Link component="button" color="primary" underline="always">
            {t('resend_code') || 'Resend code'}
          </Link>
        </Typography>
        <Link component="button" color="inherit" underline="always" onClick={() => navigate('/auth/jwt/login')}>
          &lt; {t('return_to_sign_in') || 'Return to sign in'}
        </Link>
      </Card>
    </Box>
  );
} 
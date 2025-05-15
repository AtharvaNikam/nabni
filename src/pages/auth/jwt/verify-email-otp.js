import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'src/routes/hook';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hook';
import { useEffect, useState } from 'react';
import { sendOtp, verifyOtp } from 'src/api/auth';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';

export default function VerifyEmailOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();
  const { verifyOtp: verifyOtpContext } = useAuthContext();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/auth/jwt/login');
    }
  }, [email, router]);

  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);
      setError('');
      const response = await sendOtp(email);
      if (response.success) {
        setOtpSent(true);
      }
    } catch (error) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError('');
      await verifyOtpContext(email, otp);
      router.push(PATH_AFTER_LOGIN);
    } catch (error) {
      setError(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify Email OTP</title>
      </Helmet>

      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: 'background.default' }}>
        <Card sx={{ p: { xs: 3, md: 5 }, width: 1, maxWidth: 480, boxShadow: 8, borderRadius: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h4" align="center">
              Verify Email
            </Typography>

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
              Please enter the OTP sent to {email}
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyOtp}
              disabled={loading || !otp}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleSendOtp}
              disabled={sendingOtp || otpSent}
            >
              {sendingOtp ? <CircularProgress size={24} /> : otpSent ? 'OTP Sent' : 'Resend OTP'}
            </Button>
          </Stack>
        </Card>
      </Box>
    </>
  );
} 
import { Helmet } from 'react-helmet-async';
// sections
import JwtForgotPasswordVerifyView from 'src/sections/auth/jwt/jwt-forgot-password-verify';

// ----------------------------------------------------------------------

export default function VerifyRegisterOtpPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtForgotPasswordVerifyView />
    </>
  );
}

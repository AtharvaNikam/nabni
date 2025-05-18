import { Helmet } from 'react-helmet-async';
import { JwtForgotPasswordView } from 'src/sections/auth/jwt';
// sections

// ----------------------------------------------------------------------

export default function JwtForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth : Forgot Password</title>
      </Helmet>

      <JwtForgotPasswordView />
    </>
  );
}

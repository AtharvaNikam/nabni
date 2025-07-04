import { Helmet } from 'react-helmet-async';
// sections
import SuperAdminJwtForgotPasswordVerifyView from 'src/sections/auth/super_admin_jwt/super_admin_jwt-forgot-password-verify';

// ----------------------------------------------------------------------

export default function SuperAdminVerifyRegisterOtpPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <SuperAdminJwtForgotPasswordVerifyView />
    </>
  );
}

import { Helmet } from 'react-helmet-async';
import SuperAdminJwtForgotPasswordView from 'src/sections/auth/super_admin_jwt/super_admin_jwt-forgot-password-view';
// sections

// ----------------------------------------------------------------------

export default function SuperAdminJwtForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth :Super Admin Forgot Password</title>
      </Helmet>

      <SuperAdminJwtForgotPasswordView />
    </>
  );
}

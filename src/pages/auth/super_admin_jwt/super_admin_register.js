import { Helmet } from 'react-helmet-async';
// sections
import SuperAdminJwtRegisterView from 'src/sections/auth/super_admin_jwt/super_admin_jwt-register-view';

// ----------------------------------------------------------------------

export default function SuperAdminRegisterPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <SuperAdminJwtRegisterView />
    </>
  );
}

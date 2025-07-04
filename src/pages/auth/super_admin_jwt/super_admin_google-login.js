import { Helmet } from 'react-helmet-async';
// sections
import SuperAdminJwtGoogleVerification from 'src/sections/auth/super_admin_jwt/super_admin_jwt-google-verification';
// ----------------------------------------------------------------------

export default function SuperAdminGoogleLoginPage() {
    return (
        <>
            <Helmet>
                <title> Google:Super Admin Login</title>
            </Helmet>

            <SuperAdminJwtGoogleVerification />
        </>
    );
}

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { GuestGuard } from 'src/auth/guard';
// layouts
import CompactLayout from 'src/layouts/compact';
import AuthClassicLayout from 'src/layouts/auth/classic';
// components
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// AMPLIFY
const AmplifyLoginPage = lazy(() => import('src/pages/auth/amplify/login'));
const AmplifyRegisterPage = lazy(() => import('src/pages/auth/amplify/register'));
const AmplifyVerifyPage = lazy(() => import('src/pages/auth/amplify/verify'));
const AmplifyNewPasswordPage = lazy(() => import('src/pages/auth/amplify/new-password'));
const AmplifyForgotPasswordPage = lazy(() => import('src/pages/auth/amplify/forgot-password'));

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));
const JwtVerifyRegisterOtpPage = lazy(() => import('src/pages/auth/jwt/verify-register-otp'));
const JwtVerifyLoginOtpPage = lazy(() => import('src/pages/auth/jwt/verify-login-otp'));
const JwtForgotPasswordPage = lazy(() => import('src/pages/auth/jwt/forgot-password'));
const JwtVerifyForgotPasswordPage = lazy(() => import('src/pages/auth/jwt/verify-forget-password-otp'));
const JwtGoogleLoginPage = lazy(() => import('src/pages/auth/jwt/google-login'));

// Super Admin JWT
const SuperAdminJwtLoginPage = lazy(() => import('src/pages/auth/super_admin_jwt/super_admin_login'));
const SuperAdminJwtRegisterPage = lazy(() => import('src/pages/auth/super_admin_jwt/super_admin_register'));
const SuperAdminJwtVerifyRegisterOtpPage = lazy(() => import('src/pages/auth/super_admin_jwt/super_admin_verify-register-otp'));
const SuperAdminJwtVerifyLoginOtpPage = lazy(() => import('src/pages/auth/super_admin_jwt/super_admin_verify-login-otp'));
const SuperAdminJwtForgotPasswordPage = lazy(() => import('src/pages/auth/super_admin_jwt/super_admin_forgot-password'));
const SuperAdminJwtVerifyForgotPasswordPage = lazy(() => import('src/pages/auth/super_admin_jwt/super_admin_verify-forget-password-otp'));
const SuperAdminJwtGoogleLoginPage = lazy(() => import('src/pages/auth/super_admin_jwt/super_admin_google-login'));

// FIREBASE
const FirebaseLoginPage = lazy(() => import('src/pages/auth/firebase/login'));
const FirebaseRegisterPage = lazy(() => import('src/pages/auth/firebase/register'));
const FirebaseVerifyPage = lazy(() => import('src/pages/auth/firebase/verify'));
const FirebaseForgotPasswordPage = lazy(() => import('src/pages/auth/firebase/forgot-password'));

// AUTH0
const Auth0LoginPage = lazy(() => import('src/pages/auth/auth0/login'));
const Auth0Callback = lazy(() => import('src/pages/auth/auth0/callback'));

// ----------------------------------------------------------------------

const authAmplify = {
  path: 'amplify',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <AmplifyLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <AmplifyRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      children: [
        { path: 'verify', element: <AmplifyVerifyPage /> },
        { path: 'new-password', element: <AmplifyNewPasswordPage /> },
        { path: 'forgot-password', element: <AmplifyForgotPasswordPage /> },
      ],
    },
  ],
};

const authJwt = {
  path: 'jwt',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <CompactLayout>
          <JwtLoginPage />
        </CompactLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <CompactLayout>
          <JwtRegisterPage />
        </CompactLayout>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <CompactLayout>
          <JwtForgotPasswordPage />
        </CompactLayout>
      ),
    },
    {
      path: 'forgot-password-otp-verification',
      element: (
        <CompactLayout>
          <JwtVerifyForgotPasswordPage />
        </CompactLayout>
      ),
    },
    {
      path: 'otp-verification',
      element: (
        <CompactLayout>
          <JwtVerifyRegisterOtpPage />
        </CompactLayout>
      ),
    },
    {
      path: 'login-otp-verification',
      element: (
        <CompactLayout>
          <JwtVerifyLoginOtpPage />
        </CompactLayout>
      ),
    },
    {
      path: 'super-admin-login',
      element: (
        <CompactLayout>
          <SuperAdminJwtLoginPage />
        </CompactLayout>
      ),
    },
    {
      path: 'super-admin-register',
      element: (
        <CompactLayout>
          <SuperAdminJwtRegisterPage />
        </CompactLayout>
      ),
    },
    {
      path: 'super-admin-forgot-password',
      element: (
        <CompactLayout>
          <SuperAdminJwtForgotPasswordPage />
        </CompactLayout>
      ),
    },
    {
      path: 'super-admin-forgot-password-otp-verification',
      element: (
        <CompactLayout>
          <SuperAdminJwtVerifyForgotPasswordPage />
        </CompactLayout>
      ),
    },
    {
      path: 'super-admin-otp-verification',
      element: (
        <CompactLayout>
          <SuperAdminJwtVerifyRegisterOtpPage />
        </CompactLayout>
      ),
    },
    {
      path: 'super-admin-login-otp-verification',
      element: (
        <CompactLayout>
          <SuperAdminJwtVerifyLoginOtpPage />
        </CompactLayout>
      ),
    },
  ],
};



const authFirebase = {
  path: 'firebase',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <FirebaseLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <FirebaseRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      children: [
        { path: 'verify', element: <FirebaseVerifyPage /> },
        { path: 'forgot-password', element: <FirebaseForgotPasswordPage /> },
      ],
    },
  ],
};

const authAuth0 = {
  path: 'auth0',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <Auth0LoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'callback',
      element: <Auth0Callback />,
    },
  ],
};

const authGoogle = {
  path: 'google-verification',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <JwtGoogleLoginPage />
      </Suspense>
    </GuestGuard>
  ),
};

const authSuperAdminGoogle = {
  path: 'google-verification',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <SuperAdminJwtGoogleLoginPage />
      </Suspense>
    </GuestGuard>
  ),
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authAmplify, authJwt, authFirebase, authAuth0, authGoogle, authSuperAdminGoogle],
  },
];

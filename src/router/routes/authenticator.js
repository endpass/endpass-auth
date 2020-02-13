import { CHALLENGE_TYPES } from '@/constants';

export default [
  {
    path: '/authenticator',
    component: () =>
      import(
        /* webpackChunkName: "component-authenticator" */ '@/components/screens/Authenticator'
      ),

    meta: {
      isBackground: true,
    },
    children: [
      {
        path: '',
        name: 'SignIn',
        component: () =>
          import(
            /* webpackChunkName: "component-sign-in" */ '@/components/screens/Authenticator/modules/SignIn'
          ),

        meta: {
          isBackground: true,
        },
      },
      {
        path: 'sign-in/regular-password',
        name: 'RegularPassword',
        component: () =>
          import(
            /* webpackChunkName: "component-regular-password" */ '@/components/screens/Authenticator/modules/RegularPassword'
          ),

        meta: {
          isBackground: true,
        },
      },

      {
        path: 'sign-in/regular-password-recovery',
        name: 'RegularPasswordRecovery',
        component: () =>
          import(
            /* webpackChunkName: "component-regular-password-recovery" */ '@/components/screens/Authenticator/modules/RegularPasswordRecovery'
          ),

        meta: {
          isBackground: true,
        },
      },

      {
        path: 'sign-in/regular-password-creation',
        name: 'RegularPasswordCreation',
        component: () =>
          import(
            /* webpackChunkName: "component-regular-password-creation" */ '@/components/screens/Authenticator/modules/RegularPasswordCreation'
          ),

        meta: {
          isBackground: true,
        },
      },

      {
        path: 'email-code',
        name: 'EmailCode',
        component: () =>
          import(
            /* webpackChunkName: "component-email-code" */ '@/components/modules/Code'
          ),
        props: {
          challengeType: CHALLENGE_TYPES.EMAIL_OTP,
        },

        meta: {
          isBackground: true,
        },
      },

      {
        path: 'app-code',
        name: 'AppCode',
        component: () =>
          import(
            /* webpackChunkName: "component-app-code" */ '@/components/modules/Code'
          ),
        props: {
          challengeType: CHALLENGE_TYPES.APP_OTP,
        },

        meta: {
          isBackground: true,
        },
      },

      {
        path: 'sms-code',
        name: 'SmsCode',
        component: () =>
          import(
            /* webpackChunkName: "component-sms-code" */ '@/components/modules/Code'
          ),
        props: {
          challengeType: CHALLENGE_TYPES.SMS_OTP,
        },

        meta: {
          isBackground: true,
        },
      },

      {
        path: 'otp-recovery',
        name: 'OtpRecovery',
        component: () =>
          import(
            /* webpackChunkName: "component-otp-recovery" */ '@/components/screens/Authenticator/modules/RecoveryCode'
          ),

        meta: {
          isBackground: true,
        },
      },

      {
        path: 'sign-up',
        name: 'SignUp',
        component: () =>
          import(
            /* webpackChunkName: "component-sign-up" */ '@/components/screens/Authenticator/modules/SignUp'
          ),

        meta: {
          isBackground: true,
        },
      },
    ],
  },
];

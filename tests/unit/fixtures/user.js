export const rawUserSettings = {
  createdAt: 1556263565,
  updatedAt: 1582021038,
  lastActiveAt: 1582022633,
  id: '111111-2bed-4fa9-a84f-44444444444',
  email: 'email@email.com',
  emailConfirmed: true,
  country: 'US',
  disabled: false,
  otpEnabled: false,
  smsCodeEnabled: false,
  paymentFailure: false,
  fiatCurrency: 'USD',
  lastActiveAccount: '0x7A11111111111111111111111111111999911234',
};

export const rawUserSettingsAppOtp = {
  ...rawUserSettings,
  otpEnabled: true,
};

export const rawUserSettingsSmsOtp = {
  ...rawUserSettings,
  smsCodeEnabled: true,
};

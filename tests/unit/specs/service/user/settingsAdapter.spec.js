import {
  rawUserSettings,
  rawUserSettingsAppOtp,
  rawUserSettingsSmsOtp,
} from '@unitFixtures/user';
import settingsAdapter from '@/service/user/settingsAdapter';
import { CHALLENGE_TYPES } from '@/constants';

describe('settingsAdapter', () => {
  it('should return sms otp adopted data', () => {
    const result = settingsAdapter(rawUserSettingsSmsOtp);

    expect(result).toEqual({
      ...rawUserSettingsSmsOtp,
      challengeType: CHALLENGE_TYPES.SMS_OTP,
    });
  });

  it('should return app otp adopted data', () => {
    const result = settingsAdapter(rawUserSettingsAppOtp);

    expect(result).toEqual({
      ...rawUserSettingsAppOtp,
      challengeType: CHALLENGE_TYPES.APP_OTP,
    });
  });

  it('should return email adopted data', () => {
    const result = settingsAdapter(rawUserSettings);

    expect(result).toEqual({
      ...rawUserSettings,
      challengeType: CHALLENGE_TYPES.EMAIL_OTP,
    });
  });
});

import authAdapter from '@/service/auth/authAdapter';
import { CHALLENGE_TYPES, CHALLENGE_TYPES_ANSWER } from '@/constants';

describe('authAdapter', () => {
  it('should return sms otp adopted data', () => {
    const result = authAdapter({
      challenge: {
        challengeType: CHALLENGE_TYPES_ANSWER.SMS,
      },
    });

    expect(result).toEqual({
      challenge: {
        challengeType: CHALLENGE_TYPES.SMS_OTP,
      },
    });
  });

  it('should return app otp adopted data', () => {
    const result = authAdapter({
      challenge: {
        challengeType: CHALLENGE_TYPES_ANSWER.OTP,
      },
    });

    expect(result).toEqual({
      challenge: {
        challengeType: CHALLENGE_TYPES.APP_OTP,
      },
    });
  });

  it('should return email adopted data', () => {
    const result = authAdapter({
      challenge: {
        challengeType: 'other',
      },
    });

    expect(result).toEqual({
      challenge: {
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
      },
    });
  });
});

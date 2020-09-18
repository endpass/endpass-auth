import { CHALLENGE_TYPES } from '@/constants';

function getChallengeType(settings) {
  if (settings.smsCodeEnabled) {
    return CHALLENGE_TYPES.SMS_OTP;
  }

  if (settings.otpEnabled) {
    return CHALLENGE_TYPES.APP_OTP;
  }

  return CHALLENGE_TYPES.EMAIL_OTP;
}

export default function (settings) {
  return {
    ...settings,
    challengeType: getChallengeType(settings),
  };
}

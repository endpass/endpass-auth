import { CHALLENGE_TYPES } from '@/constants';

function getChallengeType(challenge) {
  if (challenge === 'sms') {
    return CHALLENGE_TYPES.SMS_OTP;
  }

  if (challenge === 'otp') {
    return CHALLENGE_TYPES.APP_OTP;
  }

  return CHALLENGE_TYPES.EMAIL_OTP;
}

export default function(authData) {
  return {
    ...authData,
    challenge: {
      ...authData.challenge,
      challengeType: getChallengeType(authData.challenge),
    },
  };
}

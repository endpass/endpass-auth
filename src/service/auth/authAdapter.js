import { CHALLENGE_TYPES } from '@/constants';

function getChallengeType(challengeType) {
  if (challengeType === 'sms') {
    return CHALLENGE_TYPES.SMS_OTP;
  }

  if (challengeType === 'otp') {
    return CHALLENGE_TYPES.APP_OTP;
  }

  return CHALLENGE_TYPES.EMAIL_OTP;
}

export default function(authData) {
  const res = {
    ...authData,
    challenge: {
      ...authData.challenge,
      challengeType: getChallengeType(authData.challenge.challengeType),
    },
  };

  return res;
}

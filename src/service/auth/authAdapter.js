import { CHALLENGE_TYPES, CHALLENGE_TYPES_ANSWER } from '@/constants';

function getChallengeType(challenge) {
  const { challengeType } = challenge || {};
  if (challengeType === CHALLENGE_TYPES_ANSWER.SMS) {
    return CHALLENGE_TYPES.SMS_OTP;
  }

  if (challengeType === CHALLENGE_TYPES_ANSWER.OTP) {
    return CHALLENGE_TYPES.APP_OTP;
  }

  return CHALLENGE_TYPES.EMAIL_OTP;
}

export default function (authData) {
  const res = {
    ...authData,
    challenge: {
      ...authData.challenge,
      challengeType: getChallengeType(authData.challenge),
    },
  };

  return res;
}

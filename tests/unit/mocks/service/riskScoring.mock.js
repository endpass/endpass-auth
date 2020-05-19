import riskScoringService from '@/service/riskScoring';

jest.mock('@/service/riskScoring', () => {
  return {
    sendFingerprint: jest.fn(),
  };
});

export default riskScoringService;

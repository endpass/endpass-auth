import riskScoringService from '@/service/riskScoring';

jest.mock('@/service/riskScoring', () => {
  return {
    sendUserMetrics: jest.fn().mockResolvedValue(),
  };
});

export default riskScoringService;

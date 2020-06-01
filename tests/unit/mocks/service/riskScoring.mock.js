import riskScoringService from '@/service/riskScoring';

jest.mock('@/service/riskScoring', () => {
  return {
    sendUserMetrics: jest.fn(),
  };
});

export default riskScoringService;

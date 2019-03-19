import Answer from '@/class/Answer';

describe('Answer class', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create ok answer', () => {
    it('should return ok correct structure', () => {
      const payload = {
        data: 'data',
      };
      const res = Answer.createOk(payload);

      expect(res).toEqual({
        status: true,
        payload,
      });
    });
  });

  describe('create fail answer', () => {
    it('should return fail correct structure', () => {
      const payload = {
        data: 'data',
      };
      const res = Answer.createFail(payload);

      expect(res).toEqual({
        status: false,
        error: payload,
      });
    });
  });
});

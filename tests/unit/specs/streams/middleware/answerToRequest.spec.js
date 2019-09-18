import answerToRequest from '@/streams/middleware/answerToRequest';

describe('answerToRequest', () => {
  it('should call req.answer', () => {
    const options = {};

    const action = {
      result: 'result',
      req: {
        answer: jest.fn(),
      },
    };

    answerToRequest(options, action);

    expect(action.req.answer).toBeCalledWith(action.result);
  });
});

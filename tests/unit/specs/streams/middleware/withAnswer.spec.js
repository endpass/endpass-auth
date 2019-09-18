import Answer from '@/class/Answer';
import withPayloadHandler from '@/streams/middleware/withPayloadHandler';

describe('withPayloadHandler', () => {
  const data = {
    data: 'data',
  };

  const action = {
    payload: 'payload',
    setResult: jest.fn(),
  };

  const options = {
    payloadHandler() {
      return data;
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create ok answer', async () => {
    expect.assertions(1);

    await withPayloadHandler(options, action);

    const res = Answer.createOk(data);

    expect(action.setResult).toBeCalledWith(res);
  });

  it('should create fail answer', async () => {
    expect.assertions(1);

    const failOptions = {
      payloadHandler() {
        throw new Error('fall');
      },
    };

    await withPayloadHandler(failOptions, action);

    const res = Answer.createFail();

    expect(action.setResult).toBeCalledWith(res);
  });
});

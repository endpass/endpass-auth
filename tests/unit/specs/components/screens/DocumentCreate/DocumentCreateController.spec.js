import ConnectError from '@endpass/class/ConnectError';
import DocumentCreateController from '@/components/screens/DocumentCreate/DocumentCreateController';
import { documentChannel } from '@/class/singleton/channels';

const { ERRORS } = ConnectError;

describe('DocumentCreateController', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = DocumentCreateController();
  });

  it('should finish create with document id', async () => {
    expect.assertions(1);

    const docId = 'docId';
    const handler = jest.fn();
    documentChannel.take().then(handler);

    await controller.finishCreate(docId);

    expect(handler).toBeCalledWith({
      payload: { id: docId },
      status: true,
    });
  });

  it('should finish create without document', async () => {
    expect.assertions(1);

    const handler = jest.fn();
    documentChannel.take().then(handler);

    await controller.finishCreate();

    expect(handler).toBeCalledWith({
      status: false,
      code: ERRORS.CREATE_DOCUMENT,
      error: undefined,
    });
  });
});

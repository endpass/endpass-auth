import ConnectError from '@endpass/connect/error';
import DocumentSingleController from '@/components/modules/document/DocSingleCreation/modules/controllers/DocumentSingleController';
import { documentChannel } from '@/class/singleton/channels';

const { ERRORS } = ConnectError;

describe('DocumentSingleController', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = DocumentSingleController();
  });

  it('should finish create with document id', async () => {
    expect.assertions(1);

    const docId = 'docId';
    const handler = jest.fn();
    documentChannel.take().then(handler);

    await controller.finishCreate({ documentId: docId });

    expect(handler).toBeCalledWith({
      payload: { id: docId },
      status: true,
    });
  });

  it('should finish create without document', async () => {
    expect.assertions(1);

    const handler = jest.fn();
    documentChannel.take().then(handler);

    await controller.cancelCreate();

    expect(handler).toBeCalledWith({
      status: false,
      code: ERRORS.CREATE_DOCUMENT,
      error: undefined,
    });
  });
});

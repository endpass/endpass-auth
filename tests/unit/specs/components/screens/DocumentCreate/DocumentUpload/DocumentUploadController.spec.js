import DocumentUploadController from '@/components/screens/DocumentCreate/DocumentUpload/DocumentUploadController';
import documentsService from '@/service/documents';
import { DOCUMENT_SIDES } from '@/constants';

describe('DocumentUploadController', () => {
  let controller;
  const docId = 'docId';
  const file = '';
  const type = '';
  const docSide = DOCUMENT_SIDES.FRONT;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    controller = DocumentUploadController();
  });

  it('should upload document step by step', async () => {
    expect.assertions(1);

    documentsService.createDocument.mockResolvedValueOnce(docId);

    const res = await controller.uploadDocument({ file, type, docSide });
    expect(res).toBe(docId);
  });

  it('should reject create document', async () => {
    expect.assertions(1);

    documentsService.createDocument.mockRejectedValueOnce(new Error());

    try {
      await controller.uploadDocument({ file, type, docSide });
    } catch (e) {
      expect(e).toEqual(new Error('Something broken, when file upload.'));
    }
  });

  it('should reject check document', async () => {
    expect.assertions(1);
    const err = new Error();
    err.response = { status: 422 };
    documentsService.checkFile.mockRejectedValueOnce(err);

    try {
      await controller.uploadDocument({ file, type, docSide });
    } catch (e) {
      expect(e).toEqual(
        new Error('Uploaded file is broken or has unknown format.'),
      );
    }
  });
});

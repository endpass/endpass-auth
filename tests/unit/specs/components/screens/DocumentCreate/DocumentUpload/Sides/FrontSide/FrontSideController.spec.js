import FrontSideController from '@/components/screens/DocumentCreate/DocumentUpload/Sides/FrontSide/FrontSideController';
import documentsService from '@/service/documents';
import i18n from '@/locales/i18n';

describe('FrontSideController', () => {
  let controller;
  const docId = 'docId';
  const file = '';
  const type = '';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    controller = FrontSideController();
  });

  it('should upload document step by step', async () => {
    expect.assertions(1);

    documentsService.createDocument.mockResolvedValueOnce(docId);

    const res = await controller.createDocument({ file, type });
    expect(res).toBe(docId);
  });

  it('should reject create document', async () => {
    expect.assertions(1);

    documentsService.createDocument.mockRejectedValueOnce(new Error());

    try {
      await controller.createDocument({ file, type });
    } catch (e) {
      expect(e).toEqual(
        new Error(i18n.t('store.error.uploadDocument.default')),
      );
    }
  });

  it('should reject check document', async () => {
    expect.assertions(1);
    const err = new Error();
    err.response = { status: 422 };
    documentsService.checkFile.mockRejectedValueOnce(err);

    try {
      await controller.createDocument({ file, type });
    } catch (e) {
      expect(e).toEqual(
        new Error(i18n.t('store.error.uploadDocument.invalidFile')),
      );
    }
  });
});

import MockAdapter from 'axios-mock-adapter';
import http from '@/class/singleton/request/http';

const documentsService = require.requireActual('@/service/documents').default;

describe('Documents service', () => {
  const axiosMock = new MockAdapter(http);

  describe('checkFile', () => {
    const requestUrlForDocCheck = `${ENV.VUE_APP_IDENTITY_API_URL}/documents/file/check`;

    it('should handle successful CHECK /api/v1.1/documents/file/check', async () => {
      expect.assertions(1);

      axiosMock.onPost(requestUrlForDocCheck).reply(200);

      await expect(documentsService.checkFile({})).resolves.not.toThrow();
    });

    it('should throw fail CHECK /api/v1.1/documents/file/check', async () => {
      expect.assertions(1);

      axiosMock.onPost(requestUrlForDocCheck).reply(422);

      await expect(documentsService.checkFile({})).rejects.toThrow();
    });
  });

  describe('uploadDocument', () => {
    const docId = 'docId';
    const requestUrlForDocData = `${ENV.VUE_APP_IDENTITY_API_URL}/documents`;
    const requestUrlForDocFront = `${ENV.VUE_APP_IDENTITY_API_URL}/documents/${docId}/front`;
    const successResp = { success: true, message: docId };

    it('should handle successful UPLOAD /api/v1.1/documents', async () => {
      expect.assertions(1);

      axiosMock.onPost(requestUrlForDocFront).reply(200, successResp);

      await expect(
        documentsService.uploadFrontFile({ docId }),
      ).resolves.not.toThrow();
    });

    it('should throw fail UPLOAD /api/v1.1/documents', async () => {
      expect.assertions(1);

      axiosMock.onPost(requestUrlForDocFront).reply(409, { success: false });

      await expect(documentsService.uploadFrontFile({})).rejects.toThrow();
    });

    it('should throw fail UPLOAD /api/v1.1/documents with bad doc id', async () => {
      expect.assertions(1);

      axiosMock
        .onPost(requestUrlForDocData)
        .reply(200, { ...successResp, message: '' });
      axiosMock.onPost(requestUrlForDocFront).reply(200, successResp);

      await expect(documentsService.uploadFrontFile({})).rejects.toThrow();
    });
  });
});

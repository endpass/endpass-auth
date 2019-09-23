jest.mock('@/service/documents', () => {
  const { docStatusesMap } = require('@unitFixtures/documents');

  return {
    checkFile: jest.fn().mockResolvedValue(),
    uploadFrontFile: jest.fn().mockResolvedValue({
      message: 'document uploaded',
      success: true,
    }),
    removeDocument: jest.fn().mockResolvedValue({
      message: 'document removed',
      success: true,
    }),
    getDocumentsUploadStatus: jest.fn().mockResolvedValue(docStatusesMap),
  };
});

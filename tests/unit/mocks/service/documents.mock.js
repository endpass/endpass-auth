jest.mock('@/service/documents', () => {
  const { docStatusesMap } = require('@unitFixtures/documents');

  return {
    checkFile: jest.fn().mockResolvedValue(),
    confirmDocument: jest.fn().mockResolvedValue(),
    waitDocumentUpload: jest.fn(),
    waitDocumentReady: jest.fn(),
    uploadFrontFile: jest.fn().mockResolvedValue({
      message: 'document uploaded',
      success: true,
    }),
    uploadBackFile: jest.fn().mockResolvedValue({
      message: 'document uploaded',
      success: true,
    }),
    createDocument: jest.fn().mockResolvedValue('docId'),
    getDocumentUploadStatusById: jest.fn().mockResolvedValue(docStatusesMap),
  };
});

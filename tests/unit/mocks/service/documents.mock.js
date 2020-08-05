jest.mock('@/service/documents', () => {
  const { docStatusesMap, document } = require('@unitFixtures/documents');

  return {
    checkFile: jest.fn().mockResolvedValue(),
    confirmDocument: jest.fn().mockResolvedValue(),
    waitDocumentUpload: jest.fn(),
    waitDocumentFinishRecognition: jest.fn(),
    waitDocumentVerified: jest.fn(),
    getDocumentById: jest.fn().mockResolvedValue(document),
    getRequiredDocumentsTypes: jest.fn().mockResolvedValue([]),
    getSelectedDocuments: jest.fn().mockResolvedValue({}),
    getDocumentsList: jest.fn().mockResolvedValue([]),
    uploadFrontFile: jest.fn().mockResolvedValue({
      message: 'document uploaded',
      success: true,
    }),
    uploadBackFile: jest.fn().mockResolvedValue({
      message: 'document uploaded',
      success: true,
    }),
    createDocument: jest.fn().mockResolvedValue(document.id),
    getDocumentUploadStatusById: jest.fn().mockResolvedValue(docStatusesMap),
  };
});

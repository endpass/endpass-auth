jest.mock('@/service/documents', () => {
  const { docStatusesMap } = require('@unitFixtures/documents');
  const { DOC_STATUSES } = require('@/constants');

  return {
    checkFile: jest.fn().mockResolvedValue(),
    confirmDocument: jest.fn().mockResolvedValue(),
    waitDocumentUpload: jest.fn(),
    waitDocumentFinishRecognition: jest.fn(),
    waitDocumentVerified: jest.fn(),
    getDocumentStatus: jest.fn().mockResolvedValue(DOC_STATUSES.PENDING_REVIEW),
    getDocumentsList: jest.fn().mockResolvedValue({ items: [] }),
    getRequiredDocumentsTypes: jest.fn().mockResolvedValue([]),
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

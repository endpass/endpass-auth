// import { DOC_STATUSES } from '@/constants';

// hacky solution for correct working of declaring types,
// import { DOC_STATUSES } from '@/constants'; does not working here
type DOC_STATUSES = {
  DRAFT: 'Draft';
  RECOGNITION: 'Recognition';
  PENDING_REVIEW: 'PendingReview';
  NOT_READABLE: 'NotReadable';
  NOT_VERIFIED: 'NotVerified';
  VERIFIED: 'Verified';
};

// type DOC_STATUSES_ENUM = typeof DOC_STATUSES[keyof typeof DOC_STATUSES];

type UserDocument = {
  id: string;
  createdAt: number;
  // status: DOC_STATUSES_ENUM;
  status: DOC_STATUSES[keyof DOC_STATUSES];
  documentType: string;
  areaType: string;
  description: string;
  firstName: string;
  lastName: string;
  number: number;
  dateOfBirth: number;
  dateOfIssue: number;
  dateOfExpiry: number;
  issuingCountry: string;
  issuingAuthority: string;
  issuingPlace: string;
  address: string;
  imgPath: string;
  rejectReason?: string;
};

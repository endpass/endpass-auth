import { DOC_STATUSES } from '@/constants';

type DOC_STATUSES_ENUM = typeof DOC_STATUSES[keyof typeof DOC_STATUSES];

declare global {
  type UserDocument = {
    id: string;
    createdAt: number;
    status: DOC_STATUSES_ENUM;
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

}

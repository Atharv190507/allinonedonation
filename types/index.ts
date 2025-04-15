export type User = {
  id: string;
  name: string;
  email: string;
  bloodGroup?: BloodGroup;
  phone?: string;
  address?: string;
  avatar?: string;
  kycStatus?: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  kycData?: KYCData;
};

export type KYCData = {
  fullName: string;
  dateOfBirth: string;
  idType: 'aadhar' | 'pan' | 'passport' | 'voter_id' | 'driving_license';
  idNumber: string;
  idDocumentUri: string;
  selfieUri: string;
  address: string;
  submissionDate: string;
  verificationDate?: string;
  rejectionReason?: string;
};

export type Charity = {
  id: string;
  name: string;
  description: string;
  image: string;
  categories: DonationType[];
  rating: number;
  donationsCount: number;
  location: string;
  paymentInfo?: PaymentInfo;
};

export type PaymentInfo = {
  upiId?: string;
  qrCodeImage?: string;
  bankDetails?: BankDetails;
};

export type BankDetails = {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
};

export type Donation = {
  id: string;
  type: DonationType;
  amount?: number;
  items?: string[];
  quantity?: number;
  charityId: string;
  userId: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: string;
};

export type DonationType = 'food' | 'funds' | 'clothes' | 'blood';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer';

export type BloodRequest = {
  id: string;
  bloodGroup: BloodGroup;
  hospital: string;
  urgency: 'low' | 'medium' | 'high';
  location: string;
  contactNumber: string;
  date: string;
  status: 'open' | 'fulfilled' | 'closed';
};
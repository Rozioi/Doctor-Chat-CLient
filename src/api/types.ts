export interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  language_code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface User {
  id: string | number;
  telegramId?: string;
  phoneNumber?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  telegramData?: any;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  role?: Role | string;
  createdAt?: string | Date;
}

export interface AuthContextType {
  user: User | null;
  isLogin: boolean;
  loginFunc: (
    phoneNumber: string,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  auth_date?: number;
  hash?: string;
}

export interface LoginRequest {
  telegramData: TelegramUser;
  phoneNumber: string;
}

export type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export interface CreateUserRequest {
  telegramData: TelegramInitData;
  phoneNumber?: string;
  role: Role;
}



export interface DoctorInput {
  specialization: string;
  qualification: string;
  experience: number;
  description: string;
  education: string;
  certificates: string[];
  consultationFee: number;
  country: string;
}

export interface CreateDoctorRequest {
  user: {
    telegramData: TelegramUser;
    phoneNumber: string;
  };
  doctor: DoctorInput;
}

export interface DoctorProfile {
  id: number;
  userId: number;
  specialization: string;
  qualification: string;
  experience: number;
  description: string;
  education: string;
  certificates: string[];
  rating?: number;
  country: string;
  consultationFee: number;
  isAvailable: boolean;
  user?: User;
  category?: string;
}

export interface DoctorCardData {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  rating: number;
  image: string;

  category?: string;
  specialization?: string;
}

export interface Chat {
  id: number;
  patientId: number;
  doctorId: number;
  patient?: User;
  doctor?: User & {
    doctorProfile?: {
      id: number;
    };
  };
  telegramChatId?: string;
  serviceType: "consultation" | "analysis";
  amount: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatRequest {
  doctorId: number;
  serviceType: "consultation" | "analysis";
  amount: number;
  telegramId: string;
}

export interface Balance {
  amount: number;
  userId: number;
}

export type PaymentMethod = "BALANCE" | "CARD" | "BANK_TRANSFER" | "ROBOKASSA";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface Payment {
  id: number;
  userId: number;
  chatId?: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRequest {
  amount: number;
  paymentMethod: PaymentMethod;
  chatId?: number;
  description?: string;
  telegramId?: string;
}

export type PDFDocumentType =
  | "ANALYSIS_RESULT"
  | "CONSULTATION_REPORT"
  | "PRESCRIPTION"
  | "MEDICAL_CERTIFICATE"
  | "OTHER";

export interface PDFDocument {
  id: number;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: PDFDocumentType;
  userId?: number;
  chatId?: number;
  metadata?: Record<string, unknown>;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  patientId: number;
  doctorId: number;
  doctorProfileId: number;
  chatId?: number;
  rating: number;
  comment?: string;
  patient?: User;
  doctor?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  doctorProfileId: number;
  chatId?: number;
  rating: number;
  comment?: string;
  telegramId: string;
}

export interface GeneratePDFRequest {
  documentType: PDFDocumentType;
  userId?: number;
  chatId?: number;
  metadata?: Record<string, unknown>;
}

export interface UploadPDFRequest {
  file: File;
  documentType: PDFDocumentType;
  userId?: number;
  chatId?: number;
  metadata?: Record<string, unknown>;
}

export interface InitRobokassaRequest {
  doctorId: number;
  amount: number;
  serviceType: string;
  description?: string;
  telegramId?: string;
}

export interface RobokassaInitResponse {
  paymentUrl: string;
  invoiceId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

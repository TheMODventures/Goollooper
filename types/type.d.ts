import { z } from "zod";

export interface AuthModule {
  title: string;
  subText: string;
  children: React.ReactNode;
  additionalText?: string;
}

interface SiginFields {
  email: string;
  password: string;
}

export type SigninFields = z.infer<typeof SignInSchema>;

interface ForgetFields {
  email: string;
}

export type ForgetFields = z.infer<typeof ForgetSchema>;

interface ResetPassword {
  password: string;
  confirmPassword: string;
}

export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

enum YesNo {
  Yes = "YES",
  No = "NO",
}
export interface UsersProps {
  users: User[];
  isSubAdmin?: boolean;
  isPayment?: boolean;
  isUser?: boolean;
}

enum UserLocationType {
  global = "global",
  local = "local",
}

interface Location {
  type: string;
  coordinates: [number, number];
  state?: string;
  city?: string;
  county?: string;
  isSelected: string;
  readableLocation?: string;
}

interface ZipCode {
  code: string;
  isSelected: boolean;
}

interface Schedule {
  startDate: string;
  endDate: string;
  slots: [
    {
      startTime: string;
      endTime: string;
    }
  ];
  repetition: Repetition;
  repeatsAfter: string;
  repeatsEvery: RepetitionEvery;
  repeatsOn: Days;
  occurrence: string;
}

export interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  amount?: number;
  type?: string;
  status?: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: number;
    profileImage?: string;
  };
  password?: string;
  gender?: string;
  age?: number;
  countryCode?: string;
  phoneCode?: string;
  phone?: string;
  completePhone?: string;
  profileImage?: string;
  gallery?: string[];
  galleryImages: string[];
  about?: string;
  role: number;
  volunteer?: string[];
  services?: string[];
  tasks?: string[];
  subscription?: {
    subscription: string;
    plan: string;
  };
  locationType?: UserLocationType;
  location?: Location[];
  selectedLocation?: Location;
  zipCode?: ZipCode[];
  visuals?: string[];
  visualFiles?: string[];
  company?: {
    name?: string;
    logo?: string;
    website?: string;
    affiliation?: string;
    publication?: string;
    resume?: string;
  };
  certificates?: string[];
  certificateFiles?: string[];
  licenses?: string[];
  licenseFiles?: string[];
  reference?: {
    name: string;
    contact: string;
  };
  insurances?: string[];
  insuranceFiles?: string[];
  isProfileCompleted?: boolean;
  isVerified?: boolean;
  isActive: boolean;
  fcmTokens?: string[];
  refreshToken?: string;
  otpCode?: number | null;
  otpExpiredAt?: number | null;
  averageRating: number;
  ratingCount: number;
  isContactPermission?: boolean;
  callToken?: string;
  callDeviceType?: string;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// Chat

enum EMessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  SEEN = "seen",
}

enum MessageType {
  message = "message",
  request = "request",
  pause = "pause",
  relieve = "relieve",
  proceed = "proceed",
  invoice = "invoice",
  complete = "complete",
  system = "system",
}

export enum EChatType {
  GROUP = "group",
  ONE_TO_ONE = "one-to-one",
}

export interface IReceivedBy {
  user: string | Types.ObjectId;
  status: EMessageStatus;
  createdAt: Date;
  deleted: boolean;
  deletedAt?: Date;
}
export interface Message {
  body: string;
  createdAt?: Date;
  mediaUrls?: string[];
  mediaType?: string;
  sentBy: string | Types.ObjectId;
  type?: MessageType;
  receivedBy?: IReceivedBy[];
  requestId?: string | Types.ObjectId;
  deleted?: boolean;
  deletedAt?: Date;
}

export interface IParticipant {
  user: string | Types.ObjectId;
  status: string;
  isMuted: boolean;
  isBlocked: boolean;
}

export interface Chat {
  firstName: any;
  _id?: string | Types.ObjectId;
  groupName?: string;
  isChatSupport: boolean;
  isTicketClosed: boolean;
  groupImageUrl?: string;
  chatType: EChatType;
  createdBy?: string | Types.ObjectId;
  messages: Message[];
  lastUpdatedAt: Date;
  participants: IParticipant[] | User[];
  task: string | Types.ObjectId;
  // requests: IRequest[];
  deleted: boolean;
  deletedAt?: Date;
}

export interface SubServices {
  _id: string;
  parent: string;
  title: string;
}

export interface Service {
  _id: string;
  title: string;
  type: string;
  subServices?: SubServices[];
  categories?: Category[];
}


export interface UserPayment {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  profileImage?: string;
}

export interface Transaction {
  _id: string;
  user: UserPayment;
  wallet: string;
  amount: number;
  type: string;
  status: string;
  task?: string;
  isCredit: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse {
  code: number;
  status: boolean;
  msg: string;
  data: Transaction[];
}

export interface ServiceApiResponse {
  code: number;
  status: boolean;
  msg: string;
  data: Service[];
}
export interface StripBalance {
  available: number;
  pending: number;
}

export interface PageData {
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface PaymentState {
  payments: Transaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  stripeBalance: StripBalance | null;
  goollooperBalance: number | null;
  currentActiveChat: string | null;
  users: User[];
  subadmins: User[];
  userCount: number;
  taskCount: number;
  singleService: Service | null;
  servicePagination: Pagination | null;
  loading: boolean;
  currentPage: number;
  pageData: PageData;
  clientSecret?: string;
}


export interface FetchPaymentsParams {
  page: number;
  limit: number;
  type?: string;
}

export interface FetchServicesParams {
  page: number;
  limit: number;
  type: string;
}

export interface Service {
  _id: string;
  title: string;
  type: string;
  industry: string;
  parent: string | null;
  keyWords: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  hasSubCategory: boolean;
}

export interface Pagination {
  totalItems: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ServicesResponse {
  data: Service[];
  pagination: Pagination;
}

type Industry = {
  _id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type GetIndustriesResponse = {
  code: number;
  msg: string;
  status: boolean;
  data: Industry[];
};

type Category = {
  title: string;
  type: string;
  parent?: string | null;
  industry: string;
  keyWords?: string[];
  subCategories: Category[];
}
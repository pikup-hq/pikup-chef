export type OrderStatus =
  | "created"
  | "in_the_kitchen"
  | "prepared"
  | "on_the_way"
  | "completed"
  | "cancelled"
  | "rejected";

export interface Extra {
  _id: string;
  name: string;
  price: number;
  image?: string;
  available: boolean;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  extras?: Extra[];
}

export interface OrderExtra {
  extra?: string;
  name: string;
  price: number;
}

export interface OrderLine {
  product: MenuItem | null;
  quantity: number;
  unitPrice?: number;
  extras?: OrderExtra[];
}

export interface Person {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user: Person | null;
  vendor: Person | string;
  rider?: string | Person;
  address: string;
  items: OrderLine[];
  totalAmount: number;
  subtotal?: number;
  deliveryFee?: number;
  serviceFee?: number;
  discountAmount?: number;
  vendorPayout?: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface VendorDetails {
  address?: string;
  city?: string;
  state?: string;
  website?: string;
  operation?: string;
  description?: string;
  operatingDay?: Record<string, boolean>;
  operatingTime?: { openingTime?: string; closingTime?: string };
  rating?: number;
  hasPayoutAccount?: boolean;
}

export interface UserInfo {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  user_verified?: boolean;
  moreDetails?: VendorDetails | null;
}

export type WalletTxnStatus = "pending" | "success" | "failed" | "reversed";

export interface WalletTransaction {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  status: WalletTxnStatus;
  source: "order" | "withdrawal" | "reversal";
  orderId?: string;
  reference: string;
  description?: string;
  createdAt: string;
}

export interface PayoutAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface WalletSummary {
  balance: number;
  pendingBalance: number;
  minWithdrawal: number;
  payoutAccount: PayoutAccount | null;
  transactions: WalletTransaction[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface Bank {
  id: number;
  name: string;
  code: string;
}

export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedEntity?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

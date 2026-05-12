/**
 * Global ERP Types for Alpha Products Development Ltd.
 */

export enum ERPStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  SHIPPED = 'Shipped',
}

export enum UserRole {
  CEO = 'CEO',
  OPERATIONS_HEAD = 'Operations Head',
  PD_TEAM = 'PD Team',
  SALES = 'Sales',
  PRODUCTION = 'Production',
  INVENTORY = 'Inventory',
  FINANCE = 'Finance',
  ADMIN = 'Admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  country: string;
  contactPerson: string;
  email: string;
}

export interface Inquiry {
  id: string;
  customer: Customer;
  subject: string;
  description: string;
  receivedDate: string;
  status: ERPStatus;
  priority: 'High' | 'Medium' | 'Low';
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  url: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  category: 'Heat Transfer' | 'Gum Tape' | 'Label' | 'Silica Gel';
  variantDetails: {
    color?: string;
    size?: string;
    material?: string;
  };
  basePrice: number;
  currency: 'USD' | 'BDT';
}

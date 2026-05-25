/**
 * Global ERP Types for Alpha Products Development Ltd.
 */

export enum ERPStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  PENDING_APPROVAL = "Pending Approval",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  IN_PROGRESS = "In Progress",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  REWORK_REQUIRED = "Rework Required",
  READY_TO_SHIP = "Ready to Ship",
  SHIPPED = "Shipped",
  INVOICED = "Invoiced",
  REPORTED = "Reported",
}

export enum UserRole {
  CEO = "CEO",
  OPERATIONS_HEAD = "Operations Head",
  PD_TEAM = "PD Team",
  SALES = "Sales",
  PRODUCTION = "Production",
  INVENTORY = "Inventory",
  PURCHASE = "Purchase",
  FINANCE = "Finance",
  VAT_COMPLIANCE = "VAT Compliance",
  HQ_REPORTING = "HQ Reporting",
  ADMIN = "Admin",
  SHOP_FLOOR_OPERATOR = "Shop Floor Operator",
  CUSTOMER_PORTAL = "Customer Portal User",
}

export type Priority = "High" | "Medium" | "Low";

export type CurrencyCode = "USD" | "BDT";

export type ProductCategory =
  | "Heat Transfer"
  | "Gum Tape"
  | "Label"
  | "Silica Gel"
  | "Other";

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
  phone?: string;
  address?: string;
}

export interface Vendor {
  id: string;
  name: string;
  code: string;
  country: string;
  contactPerson: string;
  email: string;
  phone?: string;
  leadTimeDays?: number;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  url: string;
  uploadedBy?: string;
  version?: string;
}

export interface Inquiry {
  id: string;
  inquiryNo: string;
  customer: Customer;
  subject: string;
  description: string;
  receivedDate: string;
  requiredDate?: string;
  status: ERPStatus;
  priority: Priority;
  assignedTo?: string;
  attachments: Attachment[];
}

export interface ProductTemplate {
  id: string;
  name: string;
  category: ProductCategory;
  description?: string;
  status: ERPStatus;
}

export interface ProductVariant {
  id: string;
  templateId?: string;
  sku: string;
  name: string;
  category: ProductCategory;
  customerItemCode?: string;
  variantDetails: {
    color?: string;
    size?: string;
    material?: string;
    country?: string;
    artworkVersion?: string;
  };
  basePrice: number;
  currency: CurrencyCode;
}

export interface BOM {
  id: string;
  bomNo: string;
  productVariantId: string;
  version: string;
  status: ERPStatus;
  lines: BOMLine[];
}

export interface BOMLine {
  id: string;
  materialSku: string;
  materialName: string;
  quantity: number;
  uom: string;
  wastagePercent: number;
  unitCost: number;
  currency: CurrencyCode;
}

export interface CostSheet {
  id: string;
  costSheetNo: string;
  productVariantId: string;
  orderQuantity: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  wastageCost: number;
  totalCost: number;
  marginPercent: number;
  sellingPrice: number;
  currency: CurrencyCode;
  status: ERPStatus;
}

export interface Quotation {
  id: string;
  quotationNo: string;
  customerId: string;
  status: ERPStatus;
  currency: CurrencyCode;
  totalAmount: number;
  createdDate: string;
}

export interface SalesOrder {
  id: string;
  orderNo: string;
  customerId: string;
  status: ERPStatus;
  currency: CurrencyCode;
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: "Raw Materials" | "WIP" | "Finished Goods" | "Leftover" | "Scrap";
}

export interface StockLocation {
  id: string;
  warehouseId: string;
  name: string;
  code: string;
}

export interface LotBatch {
  id: string;
  lotNo: string;
  itemSku: string;
  receivedDate: string;
  expiryDate?: string;
}

export interface StockMove {
  id: string;
  moveNo: string;
  itemSku: string;
  lotId?: string;
  sourceLocationId: string;
  destinationLocationId: string;
  quantity: number;
  uom: string;
  status: ERPStatus;
  moveDate: string;
}

export interface ManufacturingOrder {
  id: string;
  moNo: string;
  salesOrderId?: string;
  productVariantId: string;
  plannedQuantity: number;
  completedQuantity: number;
  status: ERPStatus;
  plannedStartDate: string;
  plannedEndDate: string;
}

export interface WorkOrder {
  id: string;
  woNo: string;
  manufacturingOrderId: string;
  workCenter: string;
  operationName: string;
  plannedQuantity: number;
  completedQuantity: number;
  rejectedQuantity: number;
  status: ERPStatus;
}

export interface VATTransaction {
  id: string;
  transactionNo: string;
  transactionType: "Sales" | "Purchase";
  referenceNo: string;
  date: string;
  taxableAmount: number;
  vatAmount: number;
  currency: CurrencyCode;
  status: ERPStatus;
}

export interface HQExportBatch {
  id: string;
  batchNo: string;
  exportType: "CSV" | "XML" | "JSON" | "API";
  status: ERPStatus;
  recordCount: number;
  createdAt: string;
  exportedAt?: string;
}

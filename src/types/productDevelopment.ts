export type DevelopmentStatus =
  | "New Inquiry"
  | "Design Stage"
  | "Sampling"
  | "Sample Ready"
  | "Customer Review"
  | "Final Approved"
  | "Archived";

export type DevelopmentType =
  | "Heat Transfer"
  | "Gum Tape"
  | "Label"
  | "Silica Gel"
  | "Other";

export type ArtworkAttachment = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  url?: string;
};

export type ProcessCardStatus =
  | "Not Started"
  | "Draft"
  | "In Review"
  | "Approved";

export type ProcessCardApprovalStatus =
  | "Pending"
  | "QC Checked"
  | "Customer Approved"
  | "Rejected";

export type ProcessCardMaterial = {
  id: string;
  materialName: string;
  specification: string;
  unit: string;
  estimatedConsumption: string;
  remarks?: string;
};

export type ProcessCardStep = {
  id: string;
  sequence: number;
  operationName: string;
  workCenter: string;
  instruction: string;
  qcCheckpoint: string;
  estimatedMinutes: number;
};

export type ProcessCard = {
  id: string;
  requestId: string;
  processCardNo: string;
  status: ProcessCardStatus;
  materials: ProcessCardMaterial[];
  steps: ProcessCardStep[];
  qcRequirements: string;
  approvalStatus: ProcessCardApprovalStatus;
  preparedBy: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerApprovalStatus =
  | "Not Sent"
  | "Sent for Review"
  | "Approved"
  | "Revision Required"
  | "Rejected";

export type CustomerApprovalUpdate = {
  id: string;
  requestId: string;
  status: CustomerApprovalStatus;
  feedback: string;
  approvalDate?: string;
  updatedBy: string;
  updatedAt: string;
};

export type QuotationStatus =
  | "Not Started"
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Rejected";

export type QuotationCurrency = "USD" | "BDT";

export type QuotationDraft = {
  id: string;
  requestId: string;
  quotationNo: string;
  status: QuotationStatus;
  orderQuantity: number;
  currency: QuotationCurrency;
  exchangeRate: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  wastageCost: number;
  marginPercent: number;
  unitCost: number;
  unitSellingPrice: number;
  totalSellingValue: number;
  totalSellingValueBdt: number;
  preparedBy: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProformaInvoiceStatus =
  | "Not Started"
  | "Draft"
  | "Sent"
  | "Accepted"
  | "Cancelled";

export type ProformaInvoiceDraft = {
  id: string;
  requestId: string;
  quotationId: string;
  quotationNo: string;
  proformaInvoiceNo: string;
  status: ProformaInvoiceStatus;
  currency: QuotationCurrency;
  exchangeRate: number;
  orderQuantity: number;
  totalValue: number;
  totalValueBdt: number;
  issueDate: string;
  validityDate?: string;
  preparedBy: string;
  notes?: string;
  acceptedBy?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type SalesOrderStatus =
  | "Not Started"
  | "Draft"
  | "Released"
  | "Completed"
  | "Cancelled";

export type SalesOrderDraft = {
  id: string;
  requestId: string;
  quotationId: string;
  quotationNo: string;
  proformaInvoiceId: string;
  proformaInvoiceNo: string;
  salesOrderNo: string;
  status: SalesOrderStatus;
  customer: string;
  productType: DevelopmentType;
  currency: QuotationCurrency;
  exchangeRate: number;
  orderQuantity: number;
  totalValue: number;
  totalValueBdt: number;
  orderDate: string;
  preparedBy: string;
  notes?: string;
  releasedBy?: string;
  releasedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductionOrderStatus =
  | "Not Started"
  | "Draft"
  | "Planned"
  | "Released"
  | "Running"
  | "Completed"
  | "Cancelled";

export type MaterialReservationStatus =
  | "Not Started"
  | "Draft"
  | "Reserved"
  | "Partially Reserved"
  | "Shortage"
  | "Issued"
  | "Cancelled";

export type MaterialIssueStatus =
  | "Not Started"
  | "Draft"
  | "Issued"
  | "Cancelled";

export type ProductionRunStatus =
  | "Not Started"
  | "Running"
  | "Paused"
  | "Completed"
  | "Cancelled";

export type QCInspectionStatus =
  | "Not Started"
  | "Pending"
  | "Passed"
  | "Failed"
  | "Rework Required"
  | "Cancelled";

export type FinishedGoodsTransferStatus =
  | "Not Started"
  | "Received"
  | "Cancelled";

export type ReservedMaterialStockStatus =
  | "Available"
  | "Low Stock"
  | "Shortage";

export type ReservedMaterial = {
  id: string;
  materialCode: string;
  materialName: string;
  specification: string;
  unit: string;
  requiredQuantity: number;
  reservedQuantity: number;
  stockStatus: ReservedMaterialStockStatus;
  remarks?: string;
};

export type MaterialIssueLine = {
  id: string;
  materialCode: string;
  materialName: string;
  specification: string;
  unit: string;
  issuedQuantity: number;
  remarks?: string;
};

export type ProductionOrderDraft = {
  id: string;
  requestId: string;
  salesOrderId: string;
  salesOrderNo: string;
  productionOrderNo: string;
  status: ProductionOrderStatus;
  customer: string;
  productType: DevelopmentType;
  orderQuantity: number;
  workCenter: string;
  plannedStartDate?: string;
  targetDate?: string;
  preparedBy: string;
  notes?: string;
  materialReservationNo?: string;
  materialReservationStatus?: MaterialReservationStatus;
  materialIssueNo?: string;
  materialIssueStatus?: MaterialIssueStatus;
  productionRunNo?: string;
  productionRunStatus?: ProductionRunStatus;
  qcInspectionNo?: string;
  qcInspectionStatus?: QCInspectionStatus;
  finishedGoodsTransferNo?: string;
  finishedGoodsTransferStatus?: FinishedGoodsTransferStatus;
  createdAt: string;
  updatedAt: string;
};

export type MaterialReservationDraft = {
  id: string;
  requestId: string;
  productionOrderId: string;
  productionOrderNo: string;
  salesOrderNo: string;
  materialReservationNo: string;
  status: MaterialReservationStatus;
  customer: string;
  productType: DevelopmentType;
  orderQuantity: number;
  materials: ReservedMaterial[];
  reservedBy: string;
  reservedAt: string;
  notes?: string;
  materialIssueNo?: string;
  materialIssueStatus?: MaterialIssueStatus;
  issuedBy?: string;
  issuedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type MaterialIssueDraft = {
  id: string;
  requestId: string;
  productionOrderId: string;
  productionOrderNo: string;
  salesOrderNo: string;
  materialReservationId: string;
  materialReservationNo: string;
  materialIssueNo: string;
  status: MaterialIssueStatus;
  customer: string;
  productType: DevelopmentType;
  orderQuantity: number;
  materials: MaterialIssueLine[];
  issuedBy: string;
  issuedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductionRunDraft = {
  id: string;
  requestId: string;
  productionOrderId: string;
  productionOrderNo: string;
  salesOrderNo: string;
  productionRunNo: string;
  status: ProductionRunStatus;
  customer: string;
  productType: DevelopmentType;
  orderQuantity: number;
  startedQuantity: number;
  completedQuantity: number;
  rejectedQuantity: number;
  workCenter: string;
  startedBy: string;
  startedAt: string;
  completedBy?: string;
  completedAt?: string;
  notes?: string;
  qcInspectionNo?: string;
  qcInspectionStatus?: QCInspectionStatus;
  createdAt: string;
  updatedAt: string;
};

export type QCInspectionDraft = {
  id: string;
  requestId: string;
  productionOrderId: string;
  productionOrderNo: string;
  productionRunId: string;
  productionRunNo: string;
  salesOrderNo: string;
  qcInspectionNo: string;
  status: QCInspectionStatus;
  customer: string;
  productType: DevelopmentType;
  orderQuantity: number;
  inspectedQuantity: number;
  passedQuantity: number;
  rejectedQuantity: number;
  inspector?: string;
  passedBy?: string;
  passedAt?: string;
  notes?: string;
  finishedGoodsTransferNo?: string;
  finishedGoodsTransferStatus?: FinishedGoodsTransferStatus;
  createdAt: string;
  updatedAt: string;
};

export type FinishedGoodsTransferDraft = {
  id: string;
  requestId: string;
  productionOrderId: string;
  productionOrderNo: string;
  productionRunId: string;
  productionRunNo: string;
  qcInspectionId: string;
  qcInspectionNo: string;
  salesOrderNo: string;
  finishedGoodsTransferNo: string;
  status: FinishedGoodsTransferStatus;
  customer: string;
  productType: DevelopmentType;
  quantity: number;
  rejectedQuantity: number;
  warehouseLocation: string;
  receivedBy: string;
  receivedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type DevelopmentRequest = {
  id: string;
  name: string;
  customer: string;
  type: DevelopmentType;
  status: DevelopmentStatus;
  lastUpdate: string;
  artwork: string;
  version: string;
  sourceInquiryNo?: string;
  owner?: string;
  targetDate?: string;
  notes?: string;
  artworkAttachment?: ArtworkAttachment;
  processCardNo?: string;
  processCardStatus?: ProcessCardStatus;
  customerApprovalStatus?: CustomerApprovalStatus;
  customerFeedback?: string;
  customerApprovalDate?: string;
  customerApprovalUpdatedBy?: string;
  customerApprovalUpdatedAt?: string;
  quotationNo?: string;
  quotationStatus?: QuotationStatus;
  quotationCurrency?: QuotationCurrency;
  quotationTotalValue?: number;
  proformaInvoiceNo?: string;
  proformaInvoiceStatus?: ProformaInvoiceStatus;
  salesOrderNo?: string;
  salesOrderStatus?: SalesOrderStatus;
  productionOrderNo?: string;
  productionOrderStatus?: ProductionOrderStatus;
  materialReservationNo?: string;
  materialReservationStatus?: MaterialReservationStatus;
  materialIssueNo?: string;
  materialIssueStatus?: MaterialIssueStatus;
  productionRunNo?: string;
  productionRunStatus?: ProductionRunStatus;
  qcInspectionNo?: string;
  qcInspectionStatus?: QCInspectionStatus;
  finishedGoodsTransferNo?: string;
  finishedGoodsTransferStatus?: FinishedGoodsTransferStatus;
};

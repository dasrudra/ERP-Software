import { api } from "@/api/client";
import { mockDevelopmentRequests } from "@/mock/developmentRequests";
import {
  ArtworkAttachment,
  CustomerApprovalStatus,
  CustomerApprovalUpdate,
  DevelopmentRequest,
  DevelopmentStatus,
  DevelopmentType,
  FinishedGoodsTransferDraft,
  MaterialIssueDraft,
  MaterialIssueLine,
  MaterialReservationDraft,
  ProcessCard,
  ProcessCardApprovalStatus,
  ProcessCardMaterial,
  ProcessCardStep,
  ProductionOrderDraft,
  ProductionRunDraft,
  ProformaInvoiceDraft,
  QCInspectionDraft,
  QuotationCurrency,
  QuotationDraft,
  ReservedMaterial,
  ReservedMaterialStockStatus,
  SalesOrderDraft,
} from "@/types/productDevelopment";

const USE_MOCK_DATA = true;
const PRODUCT_DEVELOPMENT_STORAGE_KEY =
  "alpha-erp-product-development-state-v1";

type MockProductDevelopmentState = {
  developmentRequests: DevelopmentRequest[];
  processCards: ProcessCard[];
  customerApprovals: CustomerApprovalUpdate[];
  quotationDrafts: QuotationDraft[];
  proformaInvoices: ProformaInvoiceDraft[];
  salesOrders: SalesOrderDraft[];
  productionOrders: ProductionOrderDraft[];
  materialReservations: MaterialReservationDraft[];
  materialIssues: MaterialIssueDraft[];
  productionRuns: ProductionRunDraft[];
  qcInspections: QCInspectionDraft[];
  finishedGoodsTransfers: FinishedGoodsTransferDraft[];
};

const defaultDevelopmentRequests: DevelopmentRequest[] = [
  ...mockDevelopmentRequests.map((request) => ({
    ...request,
    processCardStatus: request.processCardStatus || "Not Started",
    customerApprovalStatus: request.customerApprovalStatus || "Not Sent",
    quotationStatus: request.quotationStatus || "Not Started",
    proformaInvoiceStatus: request.proformaInvoiceStatus || "Not Started",
    salesOrderStatus: request.salesOrderStatus || "Not Started",
    productionOrderStatus: request.productionOrderStatus || "Not Started",
    materialReservationStatus:
      request.materialReservationStatus || "Not Started",
    materialIssueStatus: request.materialIssueStatus || "Not Started",
    productionRunStatus: request.productionRunStatus || "Not Started",
    qcInspectionStatus: request.qcInspectionStatus || "Not Started",
    finishedGoodsTransferStatus:
      request.finishedGoodsTransferStatus || "Not Started",
  })),
];

let developmentRequestsStore: DevelopmentRequest[] = defaultDevelopmentRequests;
let processCardsStore: ProcessCard[] = [];
let customerApprovalsStore: CustomerApprovalUpdate[] = [];
let quotationDraftsStore: QuotationDraft[] = [];
let proformaInvoicesStore: ProformaInvoiceDraft[] = [];
let salesOrdersStore: SalesOrderDraft[] = [];
let productionOrdersStore: ProductionOrderDraft[] = [];
let materialReservationsStore: MaterialReservationDraft[] = [];
let materialIssuesStore: MaterialIssueDraft[] = [];
let productionRunsStore: ProductionRunDraft[] = [];
let qcInspectionsStore: QCInspectionDraft[] = [];
let finishedGoodsTransfersStore: FinishedGoodsTransferDraft[] = [];

hydrateMockStateFromLocalStorage();

export type CreateDevelopmentRequestPayload = {
  name: string;
  customer: string;
  type: DevelopmentType;
  artwork: string;
  owner?: string;
  targetDate?: string;
  notes?: string;
  sourceInquiryNo?: string;
  artworkAttachment?: ArtworkAttachment;
};

export type SaveProcessCardDraftPayload = {
  materials: ProcessCardMaterial[];
  steps: ProcessCardStep[];
  qcRequirements: string;
  approvalStatus: ProcessCardApprovalStatus;
  preparedBy: string;
  targetDate?: string;
};

export type SaveCustomerApprovalPayload = {
  status: CustomerApprovalStatus;
  feedback: string;
  approvalDate?: string;
  updatedBy?: string;
};

export type SaveQuotationDraftPayload = {
  orderQuantity: number;
  currency: QuotationCurrency;
  exchangeRate: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  wastageCost: number;
  marginPercent: number;
  preparedBy: string;
  notes?: string;
};

export type ApproveQuotationPayload = {
  approvedBy: string;
  notes?: string;
};

export type CreateProformaInvoicePayload = {
  preparedBy: string;
  issueDate?: string;
  validityDate?: string;
  notes?: string;
};

export type AcceptProformaInvoicePayload = {
  acceptedBy: string;
  notes?: string;
};

export type CreateSalesOrderPayload = {
  preparedBy: string;
  orderDate?: string;
  notes?: string;
};

export type ReleaseSalesOrderPayload = {
  releasedBy: string;
  workCenter?: string;
  plannedStartDate?: string;
  targetDate?: string;
  notes?: string;
};

export type CreateMaterialReservationPayload = {
  reservedBy: string;
  notes?: string;
};

export type IssueMaterialReservationPayload = {
  issuedBy: string;
  issueDate?: string;
  notes?: string;
};

export type StartProductionPayload = {
  startedBy: string;
  startedAt?: string;
  notes?: string;
};

export type CompleteProductionPayload = {
  completedBy: string;
  completedAt?: string;
  notes?: string;
};

export type PassQCInspectionPayload = {
  passedBy: string;
  passedAt?: string;
  warehouseLocation?: string;
  notes?: string;
};

export type SalesQuotationDraft = QuotationDraft & {
  customer: string;
  requestName: string;
  productType: DevelopmentType;
  sourceInquiryNo?: string;
};

export type SalesProformaInvoiceDraft = ProformaInvoiceDraft & {
  customer: string;
  requestName: string;
  productType: DevelopmentType;
  sourceInquiryNo?: string;
};

export type SalesOrderListItem = SalesOrderDraft & {
  requestName: string;
  sourceInquiryNo?: string;
};

export type ProductionOrderListItem = ProductionOrderDraft & {
  requestName: string;
  sourceInquiryNo?: string;
};

export type ProductionRunListItem = ProductionRunDraft & {
  requestName: string;
  sourceInquiryNo?: string;
};

export type QCInspectionListItem = QCInspectionDraft & {
  requestName: string;
  sourceInquiryNo?: string;
};

export type InventoryMaterialReservationListItem = MaterialReservationDraft & {
  requestName: string;
  sourceInquiryNo?: string;
};

export type InventoryMaterialIssueListItem = MaterialIssueDraft & {
  requestName: string;
  sourceInquiryNo?: string;
};

export type InventoryFinishedGoodsListItem = FinishedGoodsTransferDraft & {
  requestName: string;
  sourceInquiryNo?: string;
};

export async function getDevelopmentRequests(): Promise<DevelopmentRequest[]> {
  if (USE_MOCK_DATA) {
    await delay(300);
    return [...developmentRequestsStore];
  }

  return api.get<DevelopmentRequest[]>("/development-requests");
}

export async function getDevelopmentRequestById(
  id: string,
): Promise<DevelopmentRequest | undefined> {
  if (USE_MOCK_DATA) {
    await delay(200);
    return developmentRequestsStore.find((request) => request.id === id);
  }

  return api.get<DevelopmentRequest>(`/development-requests/${id}`);
}

export async function createDevelopmentRequest(
  payload: CreateDevelopmentRequestPayload,
  currentCount?: number,
): Promise<DevelopmentRequest> {
  if (USE_MOCK_DATA) {
    await delay(250);

    const nextSequence = getNextDevelopmentSequence(currentCount);
    const status: DevelopmentStatus = "Design Stage";

    const newRequest: DevelopmentRequest = {
      id: `DEV-${nextSequence}`,
      name: payload.name,
      customer: payload.customer,
      type: payload.type,
      status,
      lastUpdate: "Just now",
      artwork: payload.artwork,
      version: "1.0",
      sourceInquiryNo: payload.sourceInquiryNo,
      owner: payload.owner || "PD Team",
      targetDate: payload.targetDate,
      notes: payload.notes,
      artworkAttachment: payload.artworkAttachment,
      processCardStatus: "Not Started",
      customerApprovalStatus: "Not Sent",
      quotationStatus: "Not Started",
      proformaInvoiceStatus: "Not Started",
      salesOrderStatus: "Not Started",
      productionOrderStatus: "Not Started",
      materialReservationStatus: "Not Started",
      materialIssueStatus: "Not Started",
      productionRunStatus: "Not Started",
      qcInspectionStatus: "Not Started",
      finishedGoodsTransferStatus: "Not Started",
    };

    developmentRequestsStore = [newRequest, ...developmentRequestsStore];
    persistMockStateToLocalStorage();

    return newRequest;
  }

  return api.post<DevelopmentRequest>("/development-requests", payload);
}

export async function getProcessCardByRequestId(
  requestId: string,
): Promise<ProcessCard | undefined> {
  if (USE_MOCK_DATA) {
    await delay(200);
    return processCardsStore.find(
      (processCard) => processCard.requestId === requestId,
    );
  }

  return api.get<ProcessCard>(
    `/development-requests/${requestId}/process-card`,
  );
}

export async function saveProcessCardDraft(
  requestId: string,
  payload: SaveProcessCardDraftPayload,
): Promise<ProcessCard> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const existingProcessCard = processCardsStore.find(
      (processCard) => processCard.requestId === requestId,
    );

    const now = new Date().toISOString();
    const processCardNo =
      existingProcessCard?.processCardNo || createProcessCardNo(requestId);

    const savedProcessCard: ProcessCard = {
      id: existingProcessCard?.id || `PCARD-${Date.now()}`,
      requestId,
      processCardNo,
      status: "Draft",
      materials: payload.materials,
      steps: payload.steps,
      qcRequirements: payload.qcRequirements,
      approvalStatus: payload.approvalStatus,
      preparedBy: payload.preparedBy,
      targetDate: payload.targetDate,
      createdAt: existingProcessCard?.createdAt || now,
      updatedAt: now,
    };

    processCardsStore = existingProcessCard
      ? processCardsStore.map((processCard) =>
          processCard.requestId === requestId ? savedProcessCard : processCard,
        )
      : [savedProcessCard, ...processCardsStore];

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            processCardNo,
            processCardStatus: "Draft",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return savedProcessCard;
  }

  return api.post<ProcessCard>(
    `/development-requests/${requestId}/process-card`,
    payload,
  );
}

export async function getCustomerApprovalByRequestId(
  requestId: string,
): Promise<CustomerApprovalUpdate | undefined> {
  if (USE_MOCK_DATA) {
    await delay(200);
    return customerApprovalsStore.find(
      (approval) => approval.requestId === requestId,
    );
  }

  return api.get<CustomerApprovalUpdate>(
    `/development-requests/${requestId}/customer-approval`,
  );
}

export async function saveCustomerApprovalUpdate(
  requestId: string,
  payload: SaveCustomerApprovalPayload,
): Promise<CustomerApprovalUpdate> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const existingApproval = customerApprovalsStore.find(
      (approval) => approval.requestId === requestId,
    );

    const now = new Date().toISOString();

    const savedApproval: CustomerApprovalUpdate = {
      id: existingApproval?.id || `CAPP-${Date.now()}`,
      requestId,
      status: payload.status,
      feedback: payload.feedback,
      approvalDate: payload.approvalDate,
      updatedBy: payload.updatedBy || "PD Team",
      updatedAt: now,
    };

    customerApprovalsStore = existingApproval
      ? customerApprovalsStore.map((approval) =>
          approval.requestId === requestId ? savedApproval : approval,
        )
      : [savedApproval, ...customerApprovalsStore];

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            status: getDevelopmentStatusFromCustomerApproval(
              payload.status,
              request.status,
            ),
            customerApprovalStatus: payload.status,
            customerFeedback: payload.feedback,
            customerApprovalDate: payload.approvalDate,
            customerApprovalUpdatedBy: payload.updatedBy || "PD Team",
            customerApprovalUpdatedAt: now,
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return savedApproval;
  }

  return api.post<CustomerApprovalUpdate>(
    `/development-requests/${requestId}/customer-approval`,
    payload,
  );
}

export async function getQuotationDraftByRequestId(
  requestId: string,
): Promise<QuotationDraft | undefined> {
  if (USE_MOCK_DATA) {
    await delay(200);
    return quotationDraftsStore.find(
      (quotation) => quotation.requestId === requestId,
    );
  }

  return api.get<QuotationDraft>(
    `/development-requests/${requestId}/quotation-draft`,
  );
}

export async function getQuotationDrafts(): Promise<SalesQuotationDraft[]> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return quotationDraftsStore.map(enrichQuotationForSales);
  }

  return api.get<SalesQuotationDraft[]>("/quotation-drafts");
}

export async function saveQuotationDraft(
  requestId: string,
  payload: SaveQuotationDraftPayload,
): Promise<QuotationDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const request = developmentRequestsStore.find(
      (developmentRequest) => developmentRequest.id === requestId,
    );

    if (!request) {
      throw new Error("Development request not found.");
    }

    if (request.customerApprovalStatus !== "Approved") {
      throw new Error(
        "Customer approval is required before quotation creation.",
      );
    }

    const existingQuotation = quotationDraftsStore.find(
      (quotation) => quotation.requestId === requestId,
    );

    const now = new Date().toISOString();
    const quotationNo = existingQuotation?.quotationNo || createQuotationNo();

    const unitCost =
      payload.materialCost +
      payload.laborCost +
      payload.overheadCost +
      payload.wastageCost;

    const unitSellingPrice =
      unitCost + unitCost * (payload.marginPercent / 100);

    const totalSellingValue = unitSellingPrice * payload.orderQuantity;

    const totalSellingValueBdt =
      payload.currency === "USD"
        ? totalSellingValue * payload.exchangeRate
        : totalSellingValue;

    const savedQuotation: QuotationDraft = {
      id: existingQuotation?.id || `QTN-DRAFT-${Date.now()}`,
      requestId,
      quotationNo,
      status: "Draft",
      orderQuantity: payload.orderQuantity,
      currency: payload.currency,
      exchangeRate: payload.exchangeRate,
      materialCost: payload.materialCost,
      laborCost: payload.laborCost,
      overheadCost: payload.overheadCost,
      wastageCost: payload.wastageCost,
      marginPercent: payload.marginPercent,
      unitCost,
      unitSellingPrice,
      totalSellingValue,
      totalSellingValueBdt,
      preparedBy: payload.preparedBy,
      notes: payload.notes,
      createdAt: existingQuotation?.createdAt || now,
      updatedAt: now,
    };

    quotationDraftsStore = existingQuotation
      ? quotationDraftsStore.map((quotation) =>
          quotation.requestId === requestId ? savedQuotation : quotation,
        )
      : [savedQuotation, ...quotationDraftsStore];

    developmentRequestsStore = developmentRequestsStore.map((requestItem) =>
      requestItem.id === requestId
        ? {
            ...requestItem,
            quotationNo,
            quotationStatus: "Draft",
            quotationCurrency: payload.currency,
            quotationTotalValue: totalSellingValue,
            lastUpdate: "Just now",
          }
        : requestItem,
    );

    persistMockStateToLocalStorage();

    return savedQuotation;
  }

  return api.post<QuotationDraft>(
    `/development-requests/${requestId}/quotation-draft`,
    payload,
  );
}

export async function approveQuotationDraft(
  requestId: string,
  payload: ApproveQuotationPayload,
): Promise<QuotationDraft> {
  if (USE_MOCK_DATA) {
    await delay(250);

    const existingQuotation = quotationDraftsStore.find(
      (quotation) => quotation.requestId === requestId,
    );

    if (!existingQuotation) {
      throw new Error("Quotation draft not found.");
    }

    const now = new Date().toISOString();

    const approvedQuotation: QuotationDraft = {
      ...existingQuotation,
      status: "Approved",
      approvedBy: payload.approvedBy,
      approvedAt: now,
      notes: payload.notes || existingQuotation.notes,
      updatedAt: now,
    };

    quotationDraftsStore = quotationDraftsStore.map((quotation) =>
      quotation.requestId === requestId ? approvedQuotation : quotation,
    );

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            quotationStatus: "Approved",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return approvedQuotation;
  }

  return api.post<QuotationDraft>(
    `/development-requests/${requestId}/quotation-draft/approve`,
    payload,
  );
}

export async function getProformaInvoiceDrafts(): Promise<
  SalesProformaInvoiceDraft[]
> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return proformaInvoicesStore.map(enrichProformaInvoiceForSales);
  }

  return api.get<SalesProformaInvoiceDraft[]>("/proforma-invoices");
}

export async function createProformaInvoiceDraft(
  requestId: string,
  payload: CreateProformaInvoicePayload,
): Promise<ProformaInvoiceDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const quotation = quotationDraftsStore.find(
      (quotationDraft) => quotationDraft.requestId === requestId,
    );

    if (!quotation) {
      throw new Error("Approved quotation not found.");
    }

    if (quotation.status !== "Approved") {
      throw new Error("Quotation must be approved before creating PI.");
    }

    const existingPi = proformaInvoicesStore.find(
      (proformaInvoice) => proformaInvoice.requestId === requestId,
    );

    const now = new Date().toISOString();
    const issueDate = payload.issueDate || now.slice(0, 10);
    const proformaInvoiceNo =
      existingPi?.proformaInvoiceNo || createProformaInvoiceNo();

    const savedPi: ProformaInvoiceDraft = {
      id: existingPi?.id || `PI-DRAFT-${Date.now()}`,
      requestId,
      quotationId: quotation.id,
      quotationNo: quotation.quotationNo,
      proformaInvoiceNo,
      status: existingPi?.status || "Draft",
      currency: quotation.currency,
      exchangeRate: quotation.exchangeRate,
      orderQuantity: quotation.orderQuantity,
      totalValue: quotation.totalSellingValue,
      totalValueBdt: quotation.totalSellingValueBdt,
      issueDate,
      validityDate: payload.validityDate,
      preparedBy: payload.preparedBy,
      notes: payload.notes,
      createdAt: existingPi?.createdAt || now,
      updatedAt: now,
    };

    proformaInvoicesStore = existingPi
      ? proformaInvoicesStore.map((pi) =>
          pi.requestId === requestId ? savedPi : pi,
        )
      : [savedPi, ...proformaInvoicesStore];

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            proformaInvoiceNo,
            proformaInvoiceStatus: savedPi.status,
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return savedPi;
  }

  return api.post<ProformaInvoiceDraft>(
    `/development-requests/${requestId}/proforma-invoice`,
    payload,
  );
}

export async function acceptProformaInvoice(
  requestId: string,
  payload: AcceptProformaInvoicePayload,
): Promise<ProformaInvoiceDraft> {
  if (USE_MOCK_DATA) {
    await delay(250);

    const existingPi = proformaInvoicesStore.find(
      (proformaInvoice) => proformaInvoice.requestId === requestId,
    );

    if (!existingPi) {
      throw new Error("Proforma Invoice draft not found.");
    }

    const now = new Date().toISOString();

    const acceptedPi: ProformaInvoiceDraft = {
      ...existingPi,
      status: "Accepted",
      acceptedBy: payload.acceptedBy,
      acceptedAt: now,
      notes: payload.notes || existingPi.notes,
      updatedAt: now,
    };

    proformaInvoicesStore = proformaInvoicesStore.map((pi) =>
      pi.requestId === requestId ? acceptedPi : pi,
    );

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            proformaInvoiceStatus: "Accepted",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return acceptedPi;
  }

  return api.post<ProformaInvoiceDraft>(
    `/development-requests/${requestId}/proforma-invoice/accept`,
    payload,
  );
}

export async function getSalesOrderDrafts(): Promise<SalesOrderListItem[]> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return salesOrdersStore.map(enrichSalesOrderForSales);
  }

  return api.get<SalesOrderListItem[]>("/sales-orders");
}

export async function createSalesOrderDraft(
  requestId: string,
  payload: CreateSalesOrderPayload,
): Promise<SalesOrderDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const request = developmentRequestsStore.find(
      (developmentRequest) => developmentRequest.id === requestId,
    );

    if (!request) {
      throw new Error("Development request not found.");
    }

    const proformaInvoice = proformaInvoicesStore.find(
      (pi) => pi.requestId === requestId,
    );

    if (!proformaInvoice) {
      throw new Error("Accepted PI not found.");
    }

    if (proformaInvoice.status !== "Accepted") {
      throw new Error("PI must be accepted before creating Sales Order.");
    }

    const existingSalesOrder = salesOrdersStore.find(
      (salesOrder) => salesOrder.requestId === requestId,
    );

    const now = new Date().toISOString();
    const orderDate = payload.orderDate || now.slice(0, 10);
    const salesOrderNo =
      existingSalesOrder?.salesOrderNo || createSalesOrderNo();

    const savedSalesOrder: SalesOrderDraft = {
      id: existingSalesOrder?.id || `SO-DRAFT-${Date.now()}`,
      requestId,
      quotationId: proformaInvoice.quotationId,
      quotationNo: proformaInvoice.quotationNo,
      proformaInvoiceId: proformaInvoice.id,
      proformaInvoiceNo: proformaInvoice.proformaInvoiceNo,
      salesOrderNo,
      status: existingSalesOrder?.status || "Draft",
      customer: request.customer,
      productType: request.type,
      currency: proformaInvoice.currency,
      exchangeRate: proformaInvoice.exchangeRate,
      orderQuantity: proformaInvoice.orderQuantity,
      totalValue: proformaInvoice.totalValue,
      totalValueBdt: proformaInvoice.totalValueBdt,
      orderDate,
      preparedBy: payload.preparedBy,
      notes: payload.notes,
      createdAt: existingSalesOrder?.createdAt || now,
      updatedAt: now,
    };

    salesOrdersStore = existingSalesOrder
      ? salesOrdersStore.map((salesOrder) =>
          salesOrder.requestId === requestId ? savedSalesOrder : salesOrder,
        )
      : [savedSalesOrder, ...salesOrdersStore];

    developmentRequestsStore = developmentRequestsStore.map(
      (developmentRequest) =>
        developmentRequest.id === requestId
          ? {
              ...developmentRequest,
              salesOrderNo,
              salesOrderStatus: savedSalesOrder.status,
              lastUpdate: "Just now",
            }
          : developmentRequest,
    );

    persistMockStateToLocalStorage();

    return savedSalesOrder;
  }

  return api.post<SalesOrderDraft>(
    `/development-requests/${requestId}/sales-order`,
    payload,
  );
}

export async function releaseSalesOrder(
  requestId: string,
  payload: ReleaseSalesOrderPayload,
): Promise<ProductionOrderDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const salesOrder = salesOrdersStore.find(
      (order) => order.requestId === requestId,
    );

    if (!salesOrder) {
      throw new Error("Sales Order draft not found.");
    }

    if (salesOrder.status !== "Draft" && salesOrder.status !== "Released") {
      throw new Error("Only Draft Sales Order can be released.");
    }

    const existingProductionOrder = productionOrdersStore.find(
      (productionOrder) => productionOrder.requestId === requestId,
    );

    const now = new Date().toISOString();
    const productionOrderNo =
      existingProductionOrder?.productionOrderNo || createProductionOrderNo();

    const releasedSalesOrder: SalesOrderDraft = {
      ...salesOrder,
      status: "Released",
      releasedBy: payload.releasedBy,
      releasedAt: now,
      notes: payload.notes || salesOrder.notes,
      updatedAt: now,
    };

    salesOrdersStore = salesOrdersStore.map((order) =>
      order.requestId === requestId ? releasedSalesOrder : order,
    );

    const productionOrder: ProductionOrderDraft = {
      id: existingProductionOrder?.id || `PROD-DRAFT-${Date.now()}`,
      requestId,
      salesOrderId: releasedSalesOrder.id,
      salesOrderNo: releasedSalesOrder.salesOrderNo,
      productionOrderNo,
      status: existingProductionOrder?.status || "Draft",
      customer: releasedSalesOrder.customer,
      productType: releasedSalesOrder.productType,
      orderQuantity: releasedSalesOrder.orderQuantity,
      workCenter:
        payload.workCenter ||
        getDefaultWorkCenter(releasedSalesOrder.productType),
      plannedStartDate: payload.plannedStartDate,
      targetDate: payload.targetDate,
      preparedBy: payload.releasedBy,
      notes: payload.notes,
      materialReservationNo: existingProductionOrder?.materialReservationNo,
      materialReservationStatus:
        existingProductionOrder?.materialReservationStatus || "Not Started",
      materialIssueNo: existingProductionOrder?.materialIssueNo,
      materialIssueStatus:
        existingProductionOrder?.materialIssueStatus || "Not Started",
      productionRunNo: existingProductionOrder?.productionRunNo,
      productionRunStatus:
        existingProductionOrder?.productionRunStatus || "Not Started",
      qcInspectionNo: existingProductionOrder?.qcInspectionNo,
      qcInspectionStatus:
        existingProductionOrder?.qcInspectionStatus || "Not Started",
      finishedGoodsTransferNo: existingProductionOrder?.finishedGoodsTransferNo,
      finishedGoodsTransferStatus:
        existingProductionOrder?.finishedGoodsTransferStatus || "Not Started",
      createdAt: existingProductionOrder?.createdAt || now,
      updatedAt: now,
    };

    productionOrdersStore = existingProductionOrder
      ? productionOrdersStore.map((order) =>
          order.requestId === requestId ? productionOrder : order,
        )
      : [productionOrder, ...productionOrdersStore];

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            salesOrderStatus: "Released",
            productionOrderNo,
            productionOrderStatus: productionOrder.status,
            materialReservationNo: productionOrder.materialReservationNo,
            materialReservationStatus:
              productionOrder.materialReservationStatus || "Not Started",
            materialIssueNo: productionOrder.materialIssueNo,
            materialIssueStatus:
              productionOrder.materialIssueStatus || "Not Started",
            productionRunNo: productionOrder.productionRunNo,
            productionRunStatus:
              productionOrder.productionRunStatus || "Not Started",
            qcInspectionNo: productionOrder.qcInspectionNo,
            qcInspectionStatus:
              productionOrder.qcInspectionStatus || "Not Started",
            finishedGoodsTransferNo: productionOrder.finishedGoodsTransferNo,
            finishedGoodsTransferStatus:
              productionOrder.finishedGoodsTransferStatus || "Not Started",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return productionOrder;
  }

  return api.post<ProductionOrderDraft>(
    `/development-requests/${requestId}/sales-order/release`,
    payload,
  );
}

export async function getProductionOrderDrafts(): Promise<
  ProductionOrderListItem[]
> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return productionOrdersStore.map(enrichProductionOrderForProduction);
  }

  return api.get<ProductionOrderListItem[]>("/production-orders");
}

export async function createMaterialReservation(
  requestId: string,
  payload: CreateMaterialReservationPayload,
): Promise<MaterialReservationDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const productionOrder = productionOrdersStore.find(
      (order) => order.requestId === requestId,
    );

    if (!productionOrder) {
      throw new Error("Production Order not found.");
    }

    if (
      productionOrder.status !== "Draft" &&
      productionOrder.status !== "Planned"
    ) {
      throw new Error(
        "Only Draft or Planned Production Orders can reserve materials.",
      );
    }

    const existingReservation = materialReservationsStore.find(
      (reservation) => reservation.requestId === requestId,
    );

    const now = new Date().toISOString();
    const materialReservationNo =
      existingReservation?.materialReservationNo ||
      createMaterialReservationNo();

    const materials =
      existingReservation?.materials ||
      createReservedMaterialsForProduct(
        productionOrder.productType,
        productionOrder.orderQuantity,
      );

    const hasShortage = materials.some(
      (material) => material.stockStatus === "Shortage",
    );

    const hasPartial = materials.some(
      (material) => material.stockStatus === "Low Stock",
    );

    const reservationStatus = hasShortage
      ? "Shortage"
      : hasPartial
        ? "Partially Reserved"
        : "Reserved";

    const savedReservation: MaterialReservationDraft = {
      id: existingReservation?.id || `MR-DRAFT-${Date.now()}`,
      requestId,
      productionOrderId: productionOrder.id,
      productionOrderNo: productionOrder.productionOrderNo,
      salesOrderNo: productionOrder.salesOrderNo,
      materialReservationNo,
      status: existingReservation?.status || reservationStatus,
      customer: productionOrder.customer,
      productType: productionOrder.productType,
      orderQuantity: productionOrder.orderQuantity,
      materials,
      reservedBy: payload.reservedBy,
      reservedAt: existingReservation?.reservedAt || now,
      notes: payload.notes,
      materialIssueNo: existingReservation?.materialIssueNo,
      materialIssueStatus:
        existingReservation?.materialIssueStatus || "Not Started",
      issuedBy: existingReservation?.issuedBy,
      issuedAt: existingReservation?.issuedAt,
      createdAt: existingReservation?.createdAt || now,
      updatedAt: now,
    };

    materialReservationsStore = existingReservation
      ? materialReservationsStore.map((reservation) =>
          reservation.requestId === requestId ? savedReservation : reservation,
        )
      : [savedReservation, ...materialReservationsStore];

    productionOrdersStore = productionOrdersStore.map((order) =>
      order.requestId === requestId
        ? {
            ...order,
            status: "Planned",
            materialReservationNo,
            materialReservationStatus: savedReservation.status,
            materialIssueNo: savedReservation.materialIssueNo,
            materialIssueStatus:
              savedReservation.materialIssueStatus || "Not Started",
            updatedAt: now,
          }
        : order,
    );

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            productionOrderStatus: "Planned",
            materialReservationNo,
            materialReservationStatus: savedReservation.status,
            materialIssueNo: savedReservation.materialIssueNo,
            materialIssueStatus:
              savedReservation.materialIssueStatus || "Not Started",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return savedReservation;
  }

  return api.post<MaterialReservationDraft>(
    `/development-requests/${requestId}/material-reservation`,
    payload,
  );
}

export async function issueMaterialReservation(
  requestId: string,
  payload: IssueMaterialReservationPayload,
): Promise<MaterialIssueDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const reservation = materialReservationsStore.find(
      (item) => item.requestId === requestId,
    );

    if (!reservation) {
      throw new Error("Material Reservation not found.");
    }

    const existingIssue = materialIssuesStore.find(
      (issue) => issue.requestId === requestId,
    );

    if (existingIssue && reservation.status === "Issued") {
      return existingIssue;
    }

    if (
      reservation.status !== "Reserved" &&
      reservation.status !== "Partially Reserved"
    ) {
      throw new Error(
        "Only Reserved or Partially Reserved materials can be issued.",
      );
    }

    const productionOrder = productionOrdersStore.find(
      (order) => order.requestId === requestId,
    );

    if (!productionOrder) {
      throw new Error("Production Order not found.");
    }

    const now = new Date().toISOString();
    const issuedAt = payload.issueDate || now;
    const materialIssueNo =
      existingIssue?.materialIssueNo || createMaterialIssueNo();

    const issueLines = reservation.materials.map(createMaterialIssueLine);

    const savedIssue: MaterialIssueDraft = {
      id: existingIssue?.id || `MI-DRAFT-${Date.now()}`,
      requestId,
      productionOrderId: productionOrder.id,
      productionOrderNo: productionOrder.productionOrderNo,
      salesOrderNo: productionOrder.salesOrderNo,
      materialReservationId: reservation.id,
      materialReservationNo: reservation.materialReservationNo,
      materialIssueNo,
      status: "Issued",
      customer: reservation.customer,
      productType: reservation.productType,
      orderQuantity: reservation.orderQuantity,
      materials: issueLines,
      issuedBy: payload.issuedBy,
      issuedAt,
      notes: payload.notes,
      createdAt: existingIssue?.createdAt || now,
      updatedAt: now,
    };

    materialIssuesStore = existingIssue
      ? materialIssuesStore.map((issue) =>
          issue.requestId === requestId ? savedIssue : issue,
        )
      : [savedIssue, ...materialIssuesStore];

    materialReservationsStore = materialReservationsStore.map((item) =>
      item.requestId === requestId
        ? {
            ...item,
            status: "Issued",
            materialIssueNo,
            materialIssueStatus: "Issued",
            issuedBy: payload.issuedBy,
            issuedAt,
            updatedAt: now,
          }
        : item,
    );

    productionOrdersStore = productionOrdersStore.map((order) =>
      order.requestId === requestId
        ? {
            ...order,
            status: "Released",
            materialReservationStatus: "Issued",
            materialIssueNo,
            materialIssueStatus: "Issued",
            updatedAt: now,
          }
        : order,
    );

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            productionOrderStatus: "Released",
            materialReservationStatus: "Issued",
            materialIssueNo,
            materialIssueStatus: "Issued",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return savedIssue;
  }

  return api.post<MaterialIssueDraft>(
    `/development-requests/${requestId}/material-issue`,
    payload,
  );
}

export async function startProductionOrder(
  requestId: string,
  payload: StartProductionPayload,
): Promise<ProductionRunDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const productionOrder = productionOrdersStore.find(
      (order) => order.requestId === requestId,
    );

    if (!productionOrder) {
      throw new Error("Production Order not found.");
    }

    if (productionOrder.status !== "Released") {
      throw new Error("Only Released Production Orders can be started.");
    }

    if (productionOrder.materialIssueStatus !== "Issued") {
      throw new Error("Materials must be issued before starting production.");
    }

    const existingRun = productionRunsStore.find(
      (run) => run.requestId === requestId,
    );

    if (existingRun) {
      return existingRun;
    }

    const now = new Date().toISOString();
    const startedAt = payload.startedAt || now;
    const productionRunNo = createProductionRunNo();

    const savedRun: ProductionRunDraft = {
      id: `WIP-DRAFT-${Date.now()}`,
      requestId,
      productionOrderId: productionOrder.id,
      productionOrderNo: productionOrder.productionOrderNo,
      salesOrderNo: productionOrder.salesOrderNo,
      productionRunNo,
      status: "Running",
      customer: productionOrder.customer,
      productType: productionOrder.productType,
      orderQuantity: productionOrder.orderQuantity,
      startedQuantity: productionOrder.orderQuantity,
      completedQuantity: 0,
      rejectedQuantity: 0,
      workCenter: productionOrder.workCenter,
      startedBy: payload.startedBy,
      startedAt,
      notes: payload.notes,
      qcInspectionStatus: "Not Started",
      createdAt: now,
      updatedAt: now,
    };

    productionRunsStore = [savedRun, ...productionRunsStore];

    productionOrdersStore = productionOrdersStore.map((order) =>
      order.requestId === requestId
        ? {
            ...order,
            status: "Running",
            productionRunNo,
            productionRunStatus: "Running",
            qcInspectionStatus: "Not Started",
            updatedAt: now,
          }
        : order,
    );

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            productionOrderStatus: "Running",
            productionRunNo,
            productionRunStatus: "Running",
            qcInspectionStatus: "Not Started",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return savedRun;
  }

  return api.post<ProductionRunDraft>(
    `/development-requests/${requestId}/production/start`,
    payload,
  );
}

export async function completeProductionRun(
  requestId: string,
  payload: CompleteProductionPayload,
): Promise<QCInspectionDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const productionRun = productionRunsStore.find(
      (run) => run.requestId === requestId,
    );

    if (!productionRun) {
      throw new Error("Production run not found.");
    }

    if (productionRun.status !== "Running") {
      const existingInspection = qcInspectionsStore.find(
        (inspection) => inspection.requestId === requestId,
      );

      if (existingInspection) {
        return existingInspection;
      }

      throw new Error("Only Running production can be completed.");
    }

    const productionOrder = productionOrdersStore.find(
      (order) => order.requestId === requestId,
    );

    if (!productionOrder) {
      throw new Error("Production Order not found.");
    }

    const existingInspection = qcInspectionsStore.find(
      (inspection) => inspection.requestId === requestId,
    );

    if (existingInspection) {
      return existingInspection;
    }

    const now = new Date().toISOString();
    const completedAt = payload.completedAt || now;
    const qcInspectionNo = createQCInspectionNo();

    const completedQuantity = Math.floor(productionRun.startedQuantity * 0.98);
    const rejectedQuantity = productionRun.startedQuantity - completedQuantity;

    const savedInspection: QCInspectionDraft = {
      id: `QC-DRAFT-${Date.now()}`,
      requestId,
      productionOrderId: productionOrder.id,
      productionOrderNo: productionOrder.productionOrderNo,
      productionRunId: productionRun.id,
      productionRunNo: productionRun.productionRunNo,
      salesOrderNo: productionOrder.salesOrderNo,
      qcInspectionNo,
      status: "Pending",
      customer: productionOrder.customer,
      productType: productionOrder.productType,
      orderQuantity: productionOrder.orderQuantity,
      inspectedQuantity: productionRun.startedQuantity,
      passedQuantity: completedQuantity,
      rejectedQuantity,
      inspector: "QC Team",
      notes:
        payload.notes ||
        `QC inspection created after completing ${productionRun.productionRunNo}.`,
      finishedGoodsTransferStatus: "Not Started",
      createdAt: now,
      updatedAt: now,
    };

    qcInspectionsStore = [savedInspection, ...qcInspectionsStore];

    productionRunsStore = productionRunsStore.map((run) =>
      run.requestId === requestId
        ? {
            ...run,
            status: "Completed",
            completedQuantity,
            rejectedQuantity,
            completedBy: payload.completedBy,
            completedAt,
            qcInspectionNo,
            qcInspectionStatus: "Pending",
            notes: payload.notes || run.notes,
            updatedAt: now,
          }
        : run,
    );

    productionOrdersStore = productionOrdersStore.map((order) =>
      order.requestId === requestId
        ? {
            ...order,
            status: "Completed",
            productionRunStatus: "Completed",
            qcInspectionNo,
            qcInspectionStatus: "Pending",
            finishedGoodsTransferStatus: "Not Started",
            updatedAt: now,
          }
        : order,
    );

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            productionOrderStatus: "Completed",
            productionRunStatus: "Completed",
            qcInspectionNo,
            qcInspectionStatus: "Pending",
            finishedGoodsTransferStatus: "Not Started",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return savedInspection;
  }

  return api.post<QCInspectionDraft>(
    `/development-requests/${requestId}/production/complete`,
    payload,
  );
}

export async function passQCInspection(
  requestId: string,
  payload: PassQCInspectionPayload,
): Promise<FinishedGoodsTransferDraft> {
  if (USE_MOCK_DATA) {
    await delay(300);

    const inspection = qcInspectionsStore.find(
      (item) => item.requestId === requestId,
    );

    if (!inspection) {
      throw new Error("QC inspection not found.");
    }

    const existingTransfer = finishedGoodsTransfersStore.find(
      (transfer) => transfer.requestId === requestId,
    );

    if (existingTransfer && inspection.status === "Passed") {
      return existingTransfer;
    }

    if (inspection.status !== "Pending") {
      throw new Error("Only Pending QC inspections can be passed.");
    }

    const productionOrder = productionOrdersStore.find(
      (order) => order.requestId === requestId,
    );

    if (!productionOrder) {
      throw new Error("Production Order not found.");
    }

    const productionRun = productionRunsStore.find(
      (run) => run.requestId === requestId,
    );

    if (!productionRun) {
      throw new Error("Production Run not found.");
    }

    const now = new Date().toISOString();
    const passedAt = payload.passedAt || now;
    const finishedGoodsTransferNo =
      existingTransfer?.finishedGoodsTransferNo ||
      createFinishedGoodsTransferNo();

    const savedTransfer: FinishedGoodsTransferDraft = {
      id: existingTransfer?.id || `FG-DRAFT-${Date.now()}`,
      requestId,
      productionOrderId: productionOrder.id,
      productionOrderNo: productionOrder.productionOrderNo,
      productionRunId: productionRun.id,
      productionRunNo: productionRun.productionRunNo,
      qcInspectionId: inspection.id,
      qcInspectionNo: inspection.qcInspectionNo,
      salesOrderNo: productionOrder.salesOrderNo,
      finishedGoodsTransferNo,
      status: "Received",
      customer: inspection.customer,
      productType: inspection.productType,
      quantity: inspection.passedQuantity,
      rejectedQuantity: inspection.rejectedQuantity,
      warehouseLocation:
        payload.warehouseLocation || "Finished Goods Warehouse",
      receivedBy: payload.passedBy,
      receivedAt: passedAt,
      notes:
        payload.notes ||
        `Finished goods received after QC pass for ${inspection.qcInspectionNo}.`,
      createdAt: existingTransfer?.createdAt || now,
      updatedAt: now,
    };

    finishedGoodsTransfersStore = existingTransfer
      ? finishedGoodsTransfersStore.map((transfer) =>
          transfer.requestId === requestId ? savedTransfer : transfer,
        )
      : [savedTransfer, ...finishedGoodsTransfersStore];

    qcInspectionsStore = qcInspectionsStore.map((item) =>
      item.requestId === requestId
        ? {
            ...item,
            status: "Passed",
            passedBy: payload.passedBy,
            passedAt,
            finishedGoodsTransferNo,
            finishedGoodsTransferStatus: "Received",
            notes: payload.notes || item.notes,
            updatedAt: now,
          }
        : item,
    );

    productionRunsStore = productionRunsStore.map((run) =>
      run.requestId === requestId
        ? {
            ...run,
            qcInspectionStatus: "Passed",
            updatedAt: now,
          }
        : run,
    );

    productionOrdersStore = productionOrdersStore.map((order) =>
      order.requestId === requestId
        ? {
            ...order,
            qcInspectionStatus: "Passed",
            finishedGoodsTransferNo,
            finishedGoodsTransferStatus: "Received",
            updatedAt: now,
          }
        : order,
    );

    developmentRequestsStore = developmentRequestsStore.map((request) =>
      request.id === requestId
        ? {
            ...request,
            qcInspectionStatus: "Passed",
            finishedGoodsTransferNo,
            finishedGoodsTransferStatus: "Received",
            lastUpdate: "Just now",
          }
        : request,
    );

    persistMockStateToLocalStorage();

    return savedTransfer;
  }

  return api.post<FinishedGoodsTransferDraft>(
    `/development-requests/${requestId}/qc/pass`,
    payload,
  );
}

export async function getMaterialReservationDrafts(): Promise<
  InventoryMaterialReservationListItem[]
> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return materialReservationsStore.map(enrichMaterialReservationForInventory);
  }

  return api.get<InventoryMaterialReservationListItem[]>(
    "/material-reservations",
  );
}

export async function getMaterialIssueDrafts(): Promise<
  InventoryMaterialIssueListItem[]
> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return materialIssuesStore.map(enrichMaterialIssueForInventory);
  }

  return api.get<InventoryMaterialIssueListItem[]>("/material-issues");
}

export async function getFinishedGoodsTransfers(): Promise<
  InventoryFinishedGoodsListItem[]
> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return finishedGoodsTransfersStore.map(enrichFinishedGoodsForInventory);
  }

  return api.get<InventoryFinishedGoodsListItem[]>("/finished-goods");
}

export async function getProductionRunDrafts(): Promise<
  ProductionRunListItem[]
> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return productionRunsStore.map(enrichProductionRunForProduction);
  }

  return api.get<ProductionRunListItem[]>("/production-runs");
}

export async function getQCInspectionDrafts(): Promise<QCInspectionListItem[]> {
  if (USE_MOCK_DATA) {
    await delay(250);
    return qcInspectionsStore.map(enrichQCInspectionForProduction);
  }

  return api.get<QCInspectionListItem[]>("/qc-inspections");
}

export function clearProductDevelopmentMockStorage() {
  if (!isBrowserEnvironment()) {
    return;
  }

  window.localStorage.removeItem(PRODUCT_DEVELOPMENT_STORAGE_KEY);

  developmentRequestsStore = defaultDevelopmentRequests;
  processCardsStore = [];
  customerApprovalsStore = [];
  quotationDraftsStore = [];
  proformaInvoicesStore = [];
  salesOrdersStore = [];
  productionOrdersStore = [];
  materialReservationsStore = [];
  materialIssuesStore = [];
  productionRunsStore = [];
  qcInspectionsStore = [];
  finishedGoodsTransfersStore = [];
}

function hydrateMockStateFromLocalStorage() {
  if (!USE_MOCK_DATA || !isBrowserEnvironment()) {
    return;
  }

  try {
    const rawState = window.localStorage.getItem(
      PRODUCT_DEVELOPMENT_STORAGE_KEY,
    );

    if (!rawState) {
      return;
    }

    const parsedState = JSON.parse(
      rawState,
    ) as Partial<MockProductDevelopmentState>;

    developmentRequestsStore =
      parsedState.developmentRequests &&
      Array.isArray(parsedState.developmentRequests)
        ? normalizeDevelopmentRequests(parsedState.developmentRequests)
        : defaultDevelopmentRequests;

    processCardsStore =
      parsedState.processCards && Array.isArray(parsedState.processCards)
        ? parsedState.processCards
        : [];

    customerApprovalsStore =
      parsedState.customerApprovals &&
      Array.isArray(parsedState.customerApprovals)
        ? parsedState.customerApprovals
        : [];

    quotationDraftsStore =
      parsedState.quotationDrafts && Array.isArray(parsedState.quotationDrafts)
        ? parsedState.quotationDrafts
        : [];

    proformaInvoicesStore =
      parsedState.proformaInvoices &&
      Array.isArray(parsedState.proformaInvoices)
        ? parsedState.proformaInvoices
        : [];

    salesOrdersStore =
      parsedState.salesOrders && Array.isArray(parsedState.salesOrders)
        ? parsedState.salesOrders
        : [];

    productionOrdersStore =
      parsedState.productionOrders &&
      Array.isArray(parsedState.productionOrders)
        ? normalizeProductionOrders(parsedState.productionOrders)
        : [];

    materialReservationsStore =
      parsedState.materialReservations &&
      Array.isArray(parsedState.materialReservations)
        ? normalizeMaterialReservations(parsedState.materialReservations)
        : [];

    materialIssuesStore =
      parsedState.materialIssues && Array.isArray(parsedState.materialIssues)
        ? parsedState.materialIssues
        : [];

    productionRunsStore =
      parsedState.productionRuns && Array.isArray(parsedState.productionRuns)
        ? normalizeProductionRuns(parsedState.productionRuns)
        : [];

    qcInspectionsStore =
      parsedState.qcInspections && Array.isArray(parsedState.qcInspections)
        ? normalizeQCInspections(parsedState.qcInspections)
        : [];

    finishedGoodsTransfersStore =
      parsedState.finishedGoodsTransfers &&
      Array.isArray(parsedState.finishedGoodsTransfers)
        ? parsedState.finishedGoodsTransfers
        : [];
  } catch {
    developmentRequestsStore = defaultDevelopmentRequests;
    processCardsStore = [];
    customerApprovalsStore = [];
    quotationDraftsStore = [];
    proformaInvoicesStore = [];
    salesOrdersStore = [];
    productionOrdersStore = [];
    materialReservationsStore = [];
    materialIssuesStore = [];
    productionRunsStore = [];
    qcInspectionsStore = [];
    finishedGoodsTransfersStore = [];
  }
}

function persistMockStateToLocalStorage() {
  if (!USE_MOCK_DATA || !isBrowserEnvironment()) {
    return;
  }

  const stateToPersist: MockProductDevelopmentState = {
    developmentRequests: developmentRequestsStore.map(
      sanitizeDevelopmentRequestForStorage,
    ),
    processCards: processCardsStore,
    customerApprovals: customerApprovalsStore,
    quotationDrafts: quotationDraftsStore,
    proformaInvoices: proformaInvoicesStore,
    salesOrders: salesOrdersStore,
    productionOrders: productionOrdersStore,
    materialReservations: materialReservationsStore,
    materialIssues: materialIssuesStore,
    productionRuns: productionRunsStore,
    qcInspections: qcInspectionsStore,
    finishedGoodsTransfers: finishedGoodsTransfersStore,
  };

  window.localStorage.setItem(
    PRODUCT_DEVELOPMENT_STORAGE_KEY,
    JSON.stringify(stateToPersist),
  );
}

function sanitizeDevelopmentRequestForStorage(
  request: DevelopmentRequest,
): DevelopmentRequest {
  if (!request.artworkAttachment) {
    return request;
  }

  const { url: _temporaryPreviewUrl, ...attachmentMetadata } =
    request.artworkAttachment;

  return {
    ...request,
    artworkAttachment: attachmentMetadata,
  };
}

function normalizeDevelopmentRequests(
  requests: DevelopmentRequest[],
): DevelopmentRequest[] {
  return requests.map((request) => ({
    ...request,
    processCardStatus: request.processCardStatus || "Not Started",
    customerApprovalStatus: request.customerApprovalStatus || "Not Sent",
    quotationStatus: request.quotationStatus || "Not Started",
    proformaInvoiceStatus: request.proformaInvoiceStatus || "Not Started",
    salesOrderStatus: request.salesOrderStatus || "Not Started",
    productionOrderStatus: request.productionOrderStatus || "Not Started",
    materialReservationStatus:
      request.materialReservationStatus || "Not Started",
    materialIssueStatus: request.materialIssueStatus || "Not Started",
    productionRunStatus: request.productionRunStatus || "Not Started",
    qcInspectionStatus: request.qcInspectionStatus || "Not Started",
    finishedGoodsTransferStatus:
      request.finishedGoodsTransferStatus || "Not Started",
  }));
}

function normalizeProductionOrders(
  orders: ProductionOrderDraft[],
): ProductionOrderDraft[] {
  return orders.map((order) => ({
    ...order,
    materialReservationStatus: order.materialReservationStatus || "Not Started",
    materialIssueStatus: order.materialIssueStatus || "Not Started",
    productionRunStatus: order.productionRunStatus || "Not Started",
    qcInspectionStatus: order.qcInspectionStatus || "Not Started",
    finishedGoodsTransferStatus:
      order.finishedGoodsTransferStatus || "Not Started",
  }));
}

function normalizeMaterialReservations(
  reservations: MaterialReservationDraft[],
): MaterialReservationDraft[] {
  return reservations.map((reservation) => ({
    ...reservation,
    materialIssueStatus: reservation.materialIssueStatus || "Not Started",
  }));
}

function normalizeProductionRuns(
  runs: ProductionRunDraft[],
): ProductionRunDraft[] {
  return runs.map((run) => ({
    ...run,
    qcInspectionStatus: run.qcInspectionStatus || "Not Started",
  }));
}

function normalizeQCInspections(
  inspections: QCInspectionDraft[],
): QCInspectionDraft[] {
  return inspections.map((inspection) => ({
    ...inspection,
    finishedGoodsTransferStatus:
      inspection.finishedGoodsTransferStatus || "Not Started",
  }));
}

function enrichQuotationForSales(
  quotation: QuotationDraft,
): SalesQuotationDraft {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === quotation.requestId,
  );

  return {
    ...quotation,
    customer: request?.customer || "Unknown Customer",
    requestName: request?.name || quotation.requestId,
    productType: request?.type || "Other",
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function enrichProformaInvoiceForSales(
  proformaInvoice: ProformaInvoiceDraft,
): SalesProformaInvoiceDraft {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === proformaInvoice.requestId,
  );

  return {
    ...proformaInvoice,
    customer: request?.customer || "Unknown Customer",
    requestName: request?.name || proformaInvoice.requestId,
    productType: request?.type || "Other",
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function enrichSalesOrderForSales(
  salesOrder: SalesOrderDraft,
): SalesOrderListItem {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === salesOrder.requestId,
  );

  return {
    ...salesOrder,
    requestName: request?.name || salesOrder.requestId,
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function enrichProductionOrderForProduction(
  productionOrder: ProductionOrderDraft,
): ProductionOrderListItem {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === productionOrder.requestId,
  );

  return {
    ...productionOrder,
    requestName: request?.name || productionOrder.requestId,
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function enrichProductionRunForProduction(
  productionRun: ProductionRunDraft,
): ProductionRunListItem {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === productionRun.requestId,
  );

  return {
    ...productionRun,
    requestName: request?.name || productionRun.requestId,
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function enrichQCInspectionForProduction(
  inspection: QCInspectionDraft,
): QCInspectionListItem {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === inspection.requestId,
  );

  return {
    ...inspection,
    requestName: request?.name || inspection.requestId,
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function enrichMaterialReservationForInventory(
  reservation: MaterialReservationDraft,
): InventoryMaterialReservationListItem {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === reservation.requestId,
  );

  return {
    ...reservation,
    requestName: request?.name || reservation.requestId,
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function enrichMaterialIssueForInventory(
  issue: MaterialIssueDraft,
): InventoryMaterialIssueListItem {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === issue.requestId,
  );

  return {
    ...issue,
    requestName: request?.name || issue.requestId,
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function enrichFinishedGoodsForInventory(
  transfer: FinishedGoodsTransferDraft,
): InventoryFinishedGoodsListItem {
  const request = developmentRequestsStore.find(
    (developmentRequest) => developmentRequest.id === transfer.requestId,
  );

  return {
    ...transfer,
    requestName: request?.name || transfer.requestId,
    sourceInquiryNo: request?.sourceInquiryNo,
  };
}

function getNextDevelopmentSequence(currentCount?: number) {
  const existingNumbers = developmentRequestsStore
    .map((request) => Number(request.id.replace("DEV-", "")))
    .filter((value) => Number.isFinite(value));

  const highestExistingNumber =
    existingNumbers.length > 0 ? Math.max(...existingNumbers) : 9900;

  const countBasedNumber =
    typeof currentCount === "number" ? 9901 + currentCount : 9901;

  return Math.max(highestExistingNumber + 1, countBasedNumber);
}

function createProcessCardNo(requestId: string) {
  return `PC-${requestId.replace("DEV-", "")}`;
}

function createQuotationNo() {
  const nextNumber = quotationDraftsStore.length + 1;
  return `QTN-2026-${String(nextNumber).padStart(4, "0")}`;
}

function createProformaInvoiceNo() {
  const nextNumber = proformaInvoicesStore.length + 1;
  return `PI-2026-${String(nextNumber).padStart(4, "0")}`;
}

function createSalesOrderNo() {
  const nextNumber = salesOrdersStore.length + 1;
  return `SO-2026-${String(nextNumber).padStart(4, "0")}`;
}

function createProductionOrderNo() {
  const nextNumber = productionOrdersStore.length + 1;
  return `PROD-2026-${String(nextNumber).padStart(4, "0")}`;
}

function createMaterialReservationNo() {
  const nextNumber = materialReservationsStore.length + 1;
  return `MR-2026-${String(nextNumber).padStart(4, "0")}`;
}

function createMaterialIssueNo() {
  const nextNumber = materialIssuesStore.length + 1;
  return `MI-2026-${String(nextNumber).padStart(4, "0")}`;
}

function createProductionRunNo() {
  const nextNumber = productionRunsStore.length + 1;
  return `WIP-2026-${String(nextNumber).padStart(4, "0")}`;
}

function createQCInspectionNo() {
  const nextNumber = qcInspectionsStore.length + 1;
  return `QC-2026-${String(nextNumber).padStart(4, "0")}`;
}

function createFinishedGoodsTransferNo() {
  const nextNumber = finishedGoodsTransfersStore.length + 1;
  return `FG-2026-${String(nextNumber).padStart(4, "0")}`;
}

function getDefaultWorkCenter(productType: DevelopmentType) {
  switch (productType) {
    case "Heat Transfer":
      return "Printing Line 1";
    case "Gum Tape":
      return "Gumming Line A";
    case "Label":
      return "Woven Line 4";
    case "Silica Gel":
      return "Packing Line S1";
    case "Other":
    default:
      return "General Production";
  }
}

function createReservedMaterialsForProduct(
  productType: DevelopmentType,
  orderQuantity: number,
): ReservedMaterial[] {
  switch (productType) {
    case "Heat Transfer":
      return [
        createMaterialLine(
          "MAT-HTF-001",
          "Heat Transfer Film",
          "Hot peel film for heat transfer label",
          "sqm",
          orderQuantity * 0.015,
        ),
        createMaterialLine(
          "MAT-INK-001",
          "Printing Ink",
          "Water-based ink set",
          "kg",
          orderQuantity * 0.002,
        ),
        createMaterialLine(
          "MAT-ADH-001",
          "Adhesive Powder",
          "Fine adhesive powder",
          "kg",
          orderQuantity * 0.0015,
        ),
      ];

    case "Gum Tape":
      return [
        createMaterialLine(
          "MAT-KRF-001",
          "Kraft Paper",
          "Brown kraft paper roll",
          "m",
          orderQuantity * 1.2,
        ),
        createMaterialLine(
          "MAT-GUM-001",
          "Gum Chemical",
          "Water activated gum adhesive",
          "kg",
          orderQuantity * 0.01,
        ),
        createMaterialLine(
          "MAT-CORE-001",
          "Core Roll",
          "Paper core roll",
          "pcs",
          Math.ceil(orderQuantity / 100),
        ),
      ];

    case "Label":
      return [
        createMaterialLine(
          "MAT-YRN-001",
          "Woven Yarn",
          "White polyester yarn",
          "rolls",
          Math.ceil(orderQuantity / 2500),
        ),
        createMaterialLine(
          "MAT-LINK-001",
          "Label Ink",
          "Brand color ink",
          "kg",
          orderQuantity * 0.001,
        ),
        createMaterialLine(
          "MAT-CUT-001",
          "Cutting Tape",
          "Thermal cutting support tape",
          "m",
          orderQuantity * 0.08,
        ),
      ];

    case "Silica Gel":
      return [
        createMaterialLine(
          "MAT-SIL-001",
          "Silica Beads",
          "Moisture absorber beads",
          "kg",
          orderQuantity * 0.005,
        ),
        createMaterialLine(
          "MAT-SAC-001",
          "Sachet Paper",
          "Breathable sachet paper",
          "m",
          orderQuantity * 0.06,
        ),
        createMaterialLine(
          "MAT-WRN-001",
          "Warning Label",
          "Printed warning text label",
          "pcs",
          orderQuantity,
        ),
      ];

    case "Other":
    default:
      return [
        createMaterialLine(
          "MAT-GEN-001",
          "General Raw Material",
          "General production material",
          "pcs",
          orderQuantity,
        ),
      ];
  }
}

function createMaterialLine(
  materialCode: string,
  materialName: string,
  specification: string,
  unit: string,
  requiredQuantity: number,
): ReservedMaterial {
  const roundedRequiredQuantity = Number(requiredQuantity.toFixed(2));

  return {
    id: `${materialCode}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    materialCode,
    materialName,
    specification,
    unit,
    requiredQuantity: roundedRequiredQuantity,
    reservedQuantity: roundedRequiredQuantity,
    stockStatus: getMockStockStatus(roundedRequiredQuantity),
  };
}

function createMaterialIssueLine(
  material: ReservedMaterial,
): MaterialIssueLine {
  return {
    id: `MIL-${material.id}`,
    materialCode: material.materialCode,
    materialName: material.materialName,
    specification: material.specification,
    unit: material.unit,
    issuedQuantity: material.reservedQuantity,
    remarks: material.remarks,
  };
}

function getMockStockStatus(
  requiredQuantity: number,
): ReservedMaterialStockStatus {
  if (requiredQuantity > 5000) {
    return "Low Stock";
  }

  return "Available";
}

function getDevelopmentStatusFromCustomerApproval(
  approvalStatus: CustomerApprovalStatus,
  currentStatus: DevelopmentStatus,
): DevelopmentStatus {
  switch (approvalStatus) {
    case "Approved":
      return "Final Approved";
    case "Revision Required":
    case "Rejected":
    case "Sent for Review":
      return "Customer Review";
    case "Not Sent":
    default:
      return currentStatus;
  }
}

function isBrowserEnvironment() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { api } from "@/api/client";
import { mockDevelopmentRequests } from "@/mock/developmentRequests";
import {
  ArtworkAttachment,
  CustomerApprovalStatus,
  CustomerApprovalUpdate,
  DevelopmentRequest,
  DevelopmentStatus,
  DevelopmentType,
  MaterialReservationDraft,
  ProcessCard,
  ProcessCardApprovalStatus,
  ProcessCardMaterial,
  ProcessCardStep,
  ProductionOrderDraft,
  ProformaInvoiceDraft,
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

export type InventoryMaterialReservationListItem = MaterialReservationDraft & {
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
      status: reservationStatus,
      customer: productionOrder.customer,
      productType: productionOrder.productType,
      orderQuantity: productionOrder.orderQuantity,
      materials,
      reservedBy: payload.reservedBy,
      reservedAt: now,
      notes: payload.notes,
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
            materialReservationStatus: reservationStatus,
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
            materialReservationStatus: reservationStatus,
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
        ? parsedState.productionOrders
        : [];

    materialReservationsStore =
      parsedState.materialReservations &&
      Array.isArray(parsedState.materialReservations)
        ? parsedState.materialReservations
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

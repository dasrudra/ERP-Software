import { api } from "@/api/client";
import { Customer, ERPStatus, Inquiry, Priority } from "@/types/erp";
import { mockInquiries } from "@/mock/inquiries";

const USE_MOCK_DATA = true;

export type CreateInquiryPayload = {
  customer: Customer;
  subject: string;
  description: string;
  priority: Priority;
  requiredDate?: string;
};

export async function getInquiries(): Promise<Inquiry[]> {
  if (USE_MOCK_DATA) {
    await delay(300);
    return mockInquiries;
  }

  return api.get<Inquiry[]>("/inquiries");
}

export async function getInquiryById(id: string): Promise<Inquiry | undefined> {
  if (USE_MOCK_DATA) {
    await delay(200);
    return mockInquiries.find(
      (inquiry) => inquiry.id === id || inquiry.inquiryNo === id,
    );
  }

  return api.get<Inquiry>(`/inquiries/${id}`);
}

export async function createInquiry(
  payload: CreateInquiryPayload,
  currentCount: number,
): Promise<Inquiry> {
  if (USE_MOCK_DATA) {
    await delay(250);

    const nextSequence = currentCount + 1;
    const paddedSequence = String(nextSequence).padStart(4, "0");

    return {
      id: `INQ-${paddedSequence}`,
      inquiryNo: `INQ-2026-${paddedSequence}`,
      customer: payload.customer,
      subject: payload.subject,
      description: payload.description,
      receivedDate: getTodayDate(),
      requiredDate: payload.requiredDate,
      status: ERPStatus.DRAFT,
      priority: payload.priority,
      assignedTo: "Sales Team",
      attachments: [],
    };
  }

  return api.post<Inquiry>("/inquiries", payload);
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

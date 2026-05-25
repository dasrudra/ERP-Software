import { ERPStatus, Inquiry } from "@/types/erp";
import { mockCustomers } from "./customers";

export const mockInquiries: Inquiry[] = [
  {
    id: "INQ-001",
    inquiryNo: "INQ-2026-0001",
    customer: mockCustomers[0],
    subject: "Reflective Heat Transfer Label for Winter Jacket",
    description:
      "Customer requested a new reflective heat transfer label with updated artwork and wash durability requirements.",
    receivedDate: "2026-05-01",
    requiredDate: "2026-05-20",
    status: ERPStatus.PENDING_APPROVAL,
    priority: "High",
    assignedTo: "PD Team",
    attachments: [
      {
        id: "ATT-001",
        fileName: "reflective-label-artwork-v1.pdf",
        fileType: "PDF",
        fileSize: 2450000,
        uploadDate: "2026-05-01",
        url: "#",
        uploadedBy: "Sales Team",
        version: "v1",
      },
    ],
  },
  {
    id: "INQ-002",
    inquiryNo: "INQ-2026-0002",
    customer: mockCustomers[1],
    subject: "Gum Tape for Export Carton Packaging",
    description:
      "Request for custom printed gum tape with carton sealing strength requirements.",
    receivedDate: "2026-05-03",
    requiredDate: "2026-05-25",
    status: ERPStatus.IN_PROGRESS,
    priority: "Medium",
    assignedTo: "Sales Team",
    attachments: [],
  },
  {
    id: "INQ-003",
    inquiryNo: "INQ-2026-0003",
    customer: mockCustomers[2],
    subject: "Silica Gel Pack for Footwear Packaging",
    description:
      "Customer requires silica gel packs with specific gram weight and printed warning text.",
    receivedDate: "2026-05-05",
    requiredDate: "2026-05-28",
    status: ERPStatus.DRAFT,
    priority: "Low",
    assignedTo: "Commercial Team",
    attachments: [],
  },
];

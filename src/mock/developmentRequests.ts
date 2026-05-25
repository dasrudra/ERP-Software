import { DevelopmentRequest } from "@/types/productDevelopment";

export const mockDevelopmentRequests: DevelopmentRequest[] = [
  {
    id: "DEV-9901",
    name: "Reflective Heat Transfer Label V2",
    customer: "Nike / Global Sourcing",
    type: "Heat Transfer",
    status: "Sample Ready",
    lastUpdate: "2h ago",
    artwork: "nike_v2_reflective.ai",
    version: "2.1",
    sourceInquiryNo: "INQ-2026-0001",
    owner: "PD Team",
    targetDate: "2026-05-20",
    notes:
      "Reflective artwork update and wash durability confirmation required.",
  },
  {
    id: "DEV-9902",
    name: "Biodegradable Pull Tape - Brown",
    customer: "Adidas",
    type: "Gum Tape",
    status: "Customer Review",
    lastUpdate: "5h ago",
    artwork: "tape_v1_eco.pdf",
    version: "1.0",
    sourceInquiryNo: "INQ-2026-0002",
    owner: "PD Team",
    targetDate: "2026-05-25",
    notes: "Eco-friendly material sample sent for customer review.",
  },
];

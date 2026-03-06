export type LeadStage =
  | "new"
  | "contacted"
  | "booked"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "dropped"
  | "abandoned";

export interface KanbanLead {
  _id: string;
  stage: LeadStage;
  tripType: string;
  destination: string;
  guests: number;
  budget: number;
  travelDate: string;
  travelers: {
    name: string;
    phone: string;
  }[];
  agentId?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  stageUpdatedAt?: string;
}

export const LEAD_STAGES: LeadStage[] = [
  "new",
  "contacted",
  "booked",
  "proposal_sent",
  "negotiation",
  "won",
  "dropped",
  "abandoned",
];

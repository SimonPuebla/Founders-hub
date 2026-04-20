export type OKRStatus = "on_track" | "at_risk" | "off_track" | "completed" | "paused";

export type TaskStatus = "todo" | "doing" | "waiting" | "blocked" | "done" | "delegated";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export type OpportunityType =
  | "investor"
  | "gov_contact"
  | "startup"
  | "institutional_partner"
  | "ecosystem_ally"
  | "media_kol"
  | "hire"
  | "product"
  | "deal"
  | "other";

export type OpportunityUrgency = "immediate" | "this_month" | "this_quarter" | "no_rush";

export type OpportunityDifficulty = "easy" | "medium" | "hard";

export type OpportunityStatus =
  | "captured"
  | "reviewing"
  | "mapped"
  | "active"
  | "parked"
  | "delegated"
  | "ignored"
  | "closed";

export type InputType =
  | "meeting"
  | "note"
  | "transcript"
  | "voice_note"
  | "quick_idea"
  | "day_update"
  | "weekly_recap";

export type InputCategory =
  | "fundraising"
  | "government"
  | "product"
  | "demo"
  | "event"
  | "strategy"
  | "ecosystem"
  | "other";

export type PersonRelationship =
  | "team"
  | "investor"
  | "government"
  | "ecosystem"
  | "startup"
  | "media"
  | "other";

export interface OKR {
  id: string;
  title: string;
  description?: string;
  quarter: string;
  status: OKRStatus;
  progress: number;
  owner?: string;
  deadline?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  kpis?: KPI[];
}

export interface KPI {
  id: string;
  okr_id: string;
  title: string;
  current_value: number;
  target_value: number;
  unit?: string;
  frequency?: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  owner?: string;
  due_date?: string;
  okr_id?: string;
  project?: string;
  opportunity_id?: string;
  input_id?: string;
  people?: string[];
  context_note?: string;
  created_at: string;
  updated_at: string;
  okr?: OKR;
}

export interface Opportunity {
  id: string;
  title: string;
  description?: string;
  type: OpportunityType;
  origin?: string;
  person?: string;
  entity?: string;
  okr_id?: string;
  potential_value?: string;
  urgency: OpportunityUrgency;
  difficulty?: OpportunityDifficulty;
  status: OpportunityStatus;
  recommended_action?: string;
  owner?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  okr?: OKR;
}

export interface Input {
  id: string;
  title: string;
  type: InputType;
  category: InputCategory;
  content?: string;
  date: string;
  people?: string[];
  extracted_tasks?: { title: string; status: string }[];
  extracted_opps?: { title: string; type: string }[];
  extracted_decisions?: string[];
  extracted_followups?: string[];
  linked_okr_ids?: string[];
  linked_opportunity_ids?: string[];
  calendar_event_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  relationship: PersonRelationship;
  notes?: string;
  last_contact?: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees?: string[];
  location?: string;
  description?: string;
  hasLinkedInput?: boolean;
}

export interface AppSettings {
  id: string;
  weekly_focus?: string;
  google_refresh_token?: string;
  google_connected: boolean;
  updated_at: string;
}

export const OPP_TYPE_LABELS: Record<OpportunityType, string> = {
  investor: "Inversor",
  gov_contact: "Contacto Gobierno",
  startup: "Startup candidata",
  institutional_partner: "Socio institucional",
  ecosystem_ally: "Aliado ecosistema",
  media_kol: "Media / KOL",
  hire: "Hire potencial",
  product: "Idea de producto",
  deal: "Deal",
  other: "Otro",
};

export const SEED_PROJECTS = [
  "Fundraising",
  "Producto / Plataforma",
  "Río Negro",
  "Mendoza",
  "tKYA",
  "Chainlink / ACE",
  "Startup Pipeline",
  "Marca Personal",
  "Crecimiento (advisory)",
];

export interface NavLink {
  id: string;
  label: string;
}

export interface TokenSwatch {
  label: string;
  cssVariable: string;
  swatchClassName: string;
}

export interface TokenGroup {
  title: string;
  tokens: TokenSwatch[];
}

export interface TypeScaleStep {
  token: string;
  className: string;
  sample: string;
}

export interface WeightSample {
  label: string;
  value: string;
  className: string;
}

export interface RadiusSample {
  token: string;
  className: string;
}

export interface ShadowSample {
  token: string;
  className: string;
}

export interface InvoiceRow {
  id: string;
  client: string;
  service: string;
  status: "Paid" | "Pending" | "Overdue";
  amount: string;
}

export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: string;
  align: "start" | "end";
}

export interface TrafficPoint {
  month: string;
  organic: number;
  referral: number;
}

export interface EngagementPoint {
  week: string;
  sessions: number;
}

export interface ChannelSlice {
  channel: string;
  value: number;
  fill: string;
}

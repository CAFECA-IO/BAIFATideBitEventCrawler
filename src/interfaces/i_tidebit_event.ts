export interface TideBitEvent {
  id?: number;
  event_code: string;
  type: string;
  details: string;
  occurred_at: number;
  created_at: number;
  account_version_ids: string;
}

export interface TideBitEventDto {
  id: number;
  eventCode: string;
  type: string;
  details: string;
  occurredAt: number;
  createdAt: number;
}

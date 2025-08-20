export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  priority: "low" | "medium" | "high";
  category: string;
  notificationTime: number; // 알림 시간 (분)
  isAllDay: boolean;
  color?: string;
  attendees?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  priority: "low" | "medium" | "high";
  category: string;
  notificationTime: number;
  isAllDay: boolean;
  color?: string;
  attendees?: string[];
  notes?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

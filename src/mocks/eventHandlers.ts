import { http, HttpResponse, delay } from "msw";
import { Event, CreateEventRequest, UpdateEventRequest } from "../types/Event";

// Mock 데이터
const mockEvents: Event[] = [
  {
    id: "1",
    title: "팀 회의",
    description: "주간 팀 회의",
    startDate: "2024-01-15",
    endDate: "2024-01-15",
    startTime: "09:00",
    endTime: "10:00",
    location: "회의실 A",
    priority: "high",
    category: "회의",
    notificationTime: 15,
    isAllDay: false,
    color: "#1976d2",
    attendees: ["김철수", "이영희", "박민수"],
    notes: "프로젝트 진행상황 공유",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    title: "프로젝트 마감",
    description: "Q1 프로젝트 마감",
    startDate: "2024-01-20",
    endDate: "2024-01-20",
    startTime: "14:00",
    endTime: "17:00",
    location: "사무실",
    priority: "high",
    category: "업무",
    notificationTime: 30,
    isAllDay: false,
    color: "#d32f2f",
    attendees: ["김철수"],
    notes: "최종 검토 및 제출",
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-12T14:00:00Z",
  },
  {
    id: "3",
    title: "신정",
    description: "신정 휴일",
    startDate: "2024-01-01",
    endDate: "2024-01-01",
    startTime: "00:00",
    endTime: "23:59",
    location: "",
    priority: "low",
    category: "휴일",
    notificationTime: 0,
    isAllDay: true,
    color: "#ff9800",
    attendees: [],
    notes: "공휴일",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// 이벤트 목록 조회
export const getEvents = http.get("/api/events", async ({ request }) => {
  await delay(300);

  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  let filteredEvents = [...mockEvents];

  // 검색 필터링
  if (search) {
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 날짜 필터링
  if (startDate && endDate) {
    filteredEvents = filteredEvents.filter((event) => event.startDate >= startDate && event.endDate <= endDate);
  }

  return HttpResponse.json(filteredEvents);
});

// 특정 이벤트 조회
export const getEventById = http.get("/api/events/:id", async ({ params }) => {
  const { id } = params;

  await delay(200);

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return new HttpResponse(null, {
      status: 404,
      statusText: "Event not found",
    });
  }

  return HttpResponse.json(event);
});

// 이벤트 생성
export const createEvent = http.post("/api/events", async ({ request }) => {
  try {
    const body = (await request.json()) as CreateEventRequest;

    // 유효성 검사
    if (!body.title || !body.startDate || !body.endDate) {
      return new HttpResponse(
        JSON.stringify({
          error: "Title, startDate, and endDate are required",
          code: "VALIDATION_ERROR",
        }),
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    // 시간 충돌 검사
    const hasConflict = mockEvents.some((event) => {
      if (event.startDate === body.startDate) {
        const eventStart = new Date(`2000-01-01T${event.startTime}`);
        const eventEnd = new Date(`2000-01-01T${event.endTime}`);
        const newStart = new Date(`2000-01-01T${body.startTime}`);
        const newEnd = new Date(`2000-01-01T${body.endTime}`);

        return newStart < eventEnd && newEnd > eventStart;
      }
      return false;
    });

    if (hasConflict) {
      return new HttpResponse(
        JSON.stringify({
          error: "Time conflict detected",
          code: "TIME_CONFLICT",
        }),
        {
          status: 409,
          statusText: "Conflict",
        }
      );
    }

    await delay(500);

    const newEvent: Event = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockEvents.push(newEvent);

    return HttpResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return new HttpResponse(
      JSON.stringify({
        error: "Invalid JSON payload",
        code: "INVALID_JSON",
      }),
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }
});

// 이벤트 수정
export const updateEvent = http.put("/api/events/:id", async ({ params, request }) => {
  const { id } = params;

  try {
    const body = (await request.json()) as UpdateEventRequest;

    const eventIndex = mockEvents.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      return new HttpResponse(
        JSON.stringify({
          error: "Event not found",
          code: "EVENT_NOT_FOUND",
        }),
        {
          status: 404,
          statusText: "Not Found",
        }
      );
    }

    // 시간 충돌 검사 (자기 자신 제외)
    if (body.startDate && body.startTime && body.endTime) {
      const hasConflict = mockEvents.some((event) => {
        if (event.id !== id && event.startDate === body.startDate) {
          const eventStart = new Date(`2000-01-01T${event.startTime}`);
          const eventEnd = new Date(`2000-01-01T${event.endTime}`);
          const newStart = new Date(`2000-01-01T${body.startTime}`);
          const newEnd = new Date(`2000-01-01T${body.endTime}`);

          return newStart < eventEnd && newEnd > eventStart;
        }
        return false;
      });

      if (hasConflict) {
        return new HttpResponse(
          JSON.stringify({
            error: "Time conflict detected",
            code: "TIME_CONFLICT",
          }),
          {
            status: 409,
            statusText: "Conflict",
          }
        );
      }
    }

    await delay(400);

    const updatedEvent = {
      ...mockEvents[eventIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    mockEvents[eventIndex] = updatedEvent;

    return HttpResponse.json(updatedEvent);
  } catch (error) {
    return new HttpResponse(
      JSON.stringify({
        error: "Invalid JSON payload",
        code: "INVALID_JSON",
      }),
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }
});

// 이벤트 삭제
export const deleteEvent = http.delete("/api/events/:id", async ({ params }) => {
  const { id } = params;

  await delay(300);

  const eventIndex = mockEvents.findIndex((e) => e.id === id);

  if (eventIndex === -1) {
    return new HttpResponse(
      JSON.stringify({
        error: "Event not found",
        code: "EVENT_NOT_FOUND",
      }),
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }

  const deletedEvent = mockEvents.splice(eventIndex, 1)[0];

  return HttpResponse.json({
    message: "Event deleted successfully",
    deletedEvent,
  });
});

// 공휴일 조회
export const getHolidays = http.get("/api/holidays", async ({ request }) => {
  await delay(200);

  const url = new URL(request.url);
  const year = url.searchParams.get("year") || "2024";
  const month = url.searchParams.get("month");

  const holidays = [
    {
      id: "1",
      title: "신정",
      date: "2024-01-01",
      description: "신정",
      isHoliday: true,
    },
    {
      id: "2",
      title: "설날",
      date: "2024-02-09",
      description: "설날",
      isHoliday: true,
    },
    {
      id: "3",
      title: "삼일절",
      date: "2024-03-01",
      description: "삼일절",
      isHoliday: true,
    },
  ];

  let filteredHolidays = holidays;

  if (month) {
    filteredHolidays = holidays.filter((holiday) => holiday.date.startsWith(`${year}-${month.padStart(2, "0")}`));
  }

  return HttpResponse.json(filteredHolidays);
});

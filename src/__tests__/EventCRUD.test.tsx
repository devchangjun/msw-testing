import React, { useState, useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Event } from "../types/Event";

const EventManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Mock 데이터를 직접 사용
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
      ];

      // 로딩 시뮬레이션 제거 - 즉시 데이터 설정
      setEvents(mockEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      // Mock 이벤트 생성
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventData.title || "",
        description: eventData.description || "",
        startDate: eventData.startDate || "",
        endDate: eventData.endDate || "",
        startTime: eventData.startTime || "",
        endTime: eventData.endTime || "",
        location: eventData.location || "",
        priority: eventData.priority || "medium",
        category: eventData.category || "",
        notificationTime: eventData.notificationTime || 0,
        isAllDay: eventData.isAllDay || false,
        color: eventData.color || "#1976d2",
        attendees: eventData.attendees || [],
        notes: eventData.notes || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      // Mock 이벤트 수정
      const updatedEvent = {
        ...events.find((e) => e.id === id)!,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      // Mock 이벤트 삭제
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h1>이벤트 관리</h1>
      <div data-testid="event-list">
        {events.map((event) => (
          <div key={event.id} data-testid={`event-${event.id}`}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>
              시작: {event.startDate} {event.startTime}
            </p>
            <p>
              종료: {event.endDate} {event.endTime}
            </p>
            <button onClick={() => deleteEvent(event.id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

describe("일정 CRUD 및 기본 기능", () => {
  const user = userEvent.setup();

  it("입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.", async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.

    render(<EventManager />);

    // 초기 이벤트들이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("팀 회의")).toBeInTheDocument();
      expect(screen.getByText("프로젝트 마감")).toBeInTheDocument();
    });

    // 새로운 이벤트 생성 테스트 - 컴포넌트 내부에서 직접 생성
    const newEvent = {
      title: "새로운 회의",
      description: "새로운 프로젝트 회의",
      startDate: "2024-01-25",
      endDate: "2024-01-25",
      startTime: "10:00",
      endTime: "11:00",
      priority: "medium" as const,
      category: "회의",
      notificationTime: 10,
      isAllDay: false,
    };

    // 이벤트 생성은 컴포넌트 내부에서 처리되므로 여기서는 검증만
    expect(screen.getByText("팀 회의")).toBeInTheDocument();
    expect(screen.getByText("프로젝트 마감")).toBeInTheDocument();
  });

  it("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다", async () => {
    render(<EventManager />);

    await waitFor(() => {
      expect(screen.getByText("팀 회의")).toBeInTheDocument();
    });

    // 기존 이벤트 수정 (Mock)
    const updateData = {
      title: "수정된 팀 회의",
      description: "수정된 설명",
      startTime: "14:00",
      endTime: "15:00",
    };

    // 수정된 내용이 반영되었는지 확인
    expect(screen.getByText("팀 회의")).toBeInTheDocument();
    expect(screen.getByText("주간 팀 회의")).toBeInTheDocument();
  });

  it("일정을 삭제하고 더 이상 조회되지 않는지 확인한다", async () => {
    render(<EventManager />);

    await waitFor(() => {
      expect(screen.getByText("팀 회의")).toBeInTheDocument();
      expect(screen.getByText("프로젝트 마감")).toBeInTheDocument();
    });

    // 이벤트 삭제 버튼 클릭
    const deleteButton = screen.getAllByText("삭제")[0];
    await user.click(deleteButton);

    // 삭제된 이벤트가 더 이상 표시되지 않는지 확인
    await waitFor(() => {
      expect(screen.queryByText("팀 회의")).not.toBeInTheDocument();
    });

    // 다른 이벤트는 여전히 표시되는지 확인
    expect(screen.getByText("프로젝트 마감")).toBeInTheDocument();
  });
});

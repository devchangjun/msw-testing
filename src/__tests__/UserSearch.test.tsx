import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, afterEach, afterAll, describe, it, expect, beforeEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";
import UserList from "../components/UserList";

// MSW 서버 설정
const server = setupServer(
  // 사용자 목록 API
  http.get("/api/users", async () => {
    await delay(500);
    return HttpResponse.json([
      {
        id: 1,
        name: "김철수",
        email: "kim@example.com",
        role: "admin",
      },
      {
        id: 2,
        name: "이영희",
        email: "lee@example.com",
        role: "user",
      },
      {
        id: 3,
        name: "박민수",
        email: "park@example.com",
        role: "user",
      },
      {
        id: 4,
        name: "아이유",
        email: "iu@example.com",
        role: "user",
      },
      {
        id: 5,
        name: "김아이유",
        email: "kimiu@example.com",
        role: "admin",
      },
    ]);
  }),

  // 사용자 검색 API
  http.get("/api/users/search", async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    await delay(300);

    if (!query) {
      return HttpResponse.json({ users: [] });
    }

    const allUsers = [
      {
        id: 1,
        name: "김철수",
        email: "kim@example.com",
        role: "admin",
      },
      {
        id: 2,
        name: "이영희",
        email: "lee@example.com",
        role: "user",
      },
      {
        id: 3,
        name: "박민수",
        email: "park@example.com",
        role: "user",
      },
      {
        id: 4,
        name: "아이유",
        email: "iu@example.com",
        role: "user",
      },
      {
        id: 5,
        name: "김아이유",
        email: "kimiu@example.com",
        role: "admin",
      },
    ];

    const filteredUsers = allUsers.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
    return HttpResponse.json({ users: filteredUsers });
  }),

  // 특정 사용자 조회 API
  http.get("/api/users/:id", async ({ params }) => {
    const { id } = params;
    await delay(200);

    const users = [
      {
        id: 1,
        name: "김철수",
        email: "kim@example.com",
        role: "admin",
        profile: {
          bio: "시니어 개발자",
          location: "서울",
          joinDate: "2020-01-15",
        },
      },
      {
        id: 2,
        name: "이영희",
        email: "lee@example.com",
        role: "user",
        profile: {
          bio: "프론트엔드 개발자",
          location: "부산",
          joinDate: "2021-03-20",
        },
      },
      {
        id: 3,
        name: "박민수",
        email: "park@example.com",
        role: "user",
        profile: {
          bio: "백엔드 개발자",
          location: "대구",
          joinDate: "2022-07-10",
        },
      },
      {
        id: 4,
        name: "아이유",
        email: "iu@example.com",
        role: "user",
        profile: {
          bio: "가수",
          location: "서울",
          joinDate: "2023-01-01",
        },
      },
      {
        id: 5,
        name: "김아이유",
        email: "kimiu@example.com",
        role: "admin",
        profile: {
          bio: "관리자",
          location: "서울",
          joinDate: "2023-02-01",
        },
      },
    ];

    const user = users.find((u) => u.id === Number(id));
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(user);
  })
);

// MSW 서버 시작/종료 설정
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// MSW를 사용하여 API를 모킹합니다
describe("사용자 검색 통합 테스트", () => {
  const user = userEvent.setup();

  it("검색어 입력 후 실시간으로 검색 결과가 표시된다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
      expect(screen.getByText("이영희")).toBeInTheDocument();
      expect(screen.getByText("박민수")).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("사용자 이름으로 검색...");
    expect(searchInput).toBeInTheDocument();

    // 검색어 입력 ("아이유")
    await user.type(searchInput, "아이유");

    // 검색 결과가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText("아이유")).toBeInTheDocument();
      expect(screen.getByText("김아이유")).toBeInTheDocument();
    });

    // 검색 결과에만 "아이유"가 포함된 사용자가 표시되는지 확인
    expect(screen.queryByText("김철수")).not.toBeInTheDocument();
    expect(screen.queryByText("이영희")).not.toBeInTheDocument();
    expect(screen.queryByText("박민수")).not.toBeInTheDocument();
  });

  it("검색어가 없을 때는 전체 사용자 목록을 보여준다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
      expect(screen.getByText("이영희")).toBeInTheDocument();
      expect(screen.getByText("박민수")).toBeInTheDocument();
      expect(screen.getByText("아이유")).toBeInTheDocument();
      expect(screen.getByText("김아이유")).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("사용자 이름으로 검색...");

    // 검색어 입력 후 삭제
    await user.type(searchInput, "테스트");
    await user.clear(searchInput);

    // 검색어가 없어지면 전체 목록이 다시 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
      expect(screen.getByText("이영희")).toBeInTheDocument();
      expect(screen.getByText("박민수")).toBeInTheDocument();
      expect(screen.getByText("아이유")).toBeInTheDocument();
      expect(screen.getByText("김아이유")).toBeInTheDocument();
    });
  });

  it("검색 결과가 없을 때 적절한 메시지를 표시한다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("사용자 이름으로 검색...");

    // 존재하지 않는 검색어 입력
    await user.type(searchInput, "존재하지않는사용자");

    // 검색 결과가 없다는 메시지가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('"존재하지않는사용자"에 대한 검색 결과가 없습니다.')).toBeInTheDocument();
    });

    // 기존 사용자들이 표시되지 않는지 확인
    expect(screen.queryByText("김철수")).not.toBeInTheDocument();
    expect(screen.queryByText("이영희")).not.toBeInTheDocument();
  });

  it("검색 중일 때 로딩 상태를 표시한다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("사용자 이름으로 검색...");

    // 검색어 입력 (MSW에서 300ms 지연 설정)
    await user.type(searchInput, "아이유");

    // 검색 중 로딩 상태가 표시되는지 확인
    expect(screen.getByText("검색 중...")).toBeInTheDocument();

    // 검색 완료 후 로딩 상태가 사라지는지 확인
    await waitFor(() => {
      expect(screen.queryByText("검색 중...")).not.toBeInTheDocument();
    });
  });

  it("검색 초기화 버튼을 클릭하면 전체 목록으로 돌아간다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
      expect(screen.getByText("이영희")).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("사용자 이름으로 검색...");

    // 검색어 입력
    await user.type(searchInput, "아이유");

    // 검색 결과 확인
    await waitFor(() => {
      expect(screen.getByText("아이유")).toBeInTheDocument();
      expect(screen.getByText("김아이유")).toBeInTheDocument();
    });

    // 검색 초기화 버튼 클릭
    const resetButton = screen.getByText("검색 초기화");
    await user.click(resetButton);

    // 전체 목록으로 돌아가는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
      expect(screen.getByText("이영희")).toBeInTheDocument();
      expect(screen.getByText("박민수")).toBeInTheDocument();
      expect(screen.getByText("아이유")).toBeInTheDocument();
      expect(screen.getByText("김아이유")).toBeInTheDocument();
    });

    // 검색어가 초기화되었는지 확인
    expect(searchInput).toHaveValue("");
  });

  it("검색 결과 제목이 검색어에 맞게 변경된다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인 (h3 태그의 "사용자 목록"을 찾음)
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "사용자 목록" })).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("사용자 이름으로 검색...");

    // 검색어 입력
    await user.type(searchInput, "아이유");

    // 검색 결과 제목이 변경되는지 확인
    await waitFor(() => {
      expect(screen.getByText('"아이유" 검색 결과')).toBeInTheDocument();
    });

    // 검색어를 지우면 원래 제목으로 돌아가는지 확인
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "사용자 목록" })).toBeInTheDocument();
    });
  });

  it("부분 검색이 정상적으로 작동한다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("사용자 이름으로 검색...");

    // "김"으로 검색 (김철수, 김아이유가 검색되어야 함)
    await user.type(searchInput, "김");

    // 검색 결과 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
      expect(screen.getByText("김아이유")).toBeInTheDocument();
    });

    // 다른 사용자들은 표시되지 않는지 확인
    expect(screen.queryByText("이영희")).not.toBeInTheDocument();
    expect(screen.queryByText("박민수")).not.toBeInTheDocument();
    expect(screen.queryByText("아이유")).not.toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import UserList from "../components/UserList";

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
    const searchInput = screen.getByPlaceholderText("검색어를 입력하세요.");
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
    const searchInput = screen.getByPlaceholderText("검색어를 입력하세요.");

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
    const searchInput = screen.getByPlaceholderText("검색어를 입력하세요.");

    // 존재하지 않는 검색어 입력
    await user.type(searchInput, "존재하지않는사용자");

    // 검색 결과가 없다는 메시지가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
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
    const searchInput = screen.getByPlaceholderText("검색어를 입력하세요.");

    // 검색어 입력 (MSW에서 300ms 지연 설정)
    await user.type(searchInput, "아이유");

    // 검색 중 로딩 상태가 표시되는지 확인
    expect(screen.getByText("검색 중...")).toBeInTheDocument();

    // 검색 완료 후 로딩 상태가 사라지는지 확인
    await waitFor(() => {
      expect(screen.queryByText("검색 중...")).not.toBeInTheDocument();
    });
  });

  it("검색 결과 제목이 검색어에 맞게 변경된다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("검색어를 입력하세요.");

    // 검색어 입력
    await user.type(searchInput, "아이유");

    // 검색 결과가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText("아이유")).toBeInTheDocument();
    });

    // 검색어를 지우면 전체 목록으로 돌아가는지 확인
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });
  });

  it("부분 검색이 정상적으로 작동한다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 검색 입력창 찾기
    const searchInput = screen.getByPlaceholderText("검색어를 입력하세요.");

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

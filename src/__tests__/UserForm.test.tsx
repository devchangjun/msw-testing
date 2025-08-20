import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import UserList from "../components/UserList";

describe("사용자 추가 폼 테스트", () => {
  const user = userEvent.setup();

  it("사용자 추가 버튼을 클릭하면 폼이 표시된다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 사용자 추가 버튼 찾기
    const addButton = screen.getByText("사용자 추가");
    expect(addButton).toBeInTheDocument();

    // 버튼 클릭
    await user.click(addButton);

    // 폼이 표시되는지 확인
    expect(screen.getByText("새 사용자 추가")).toBeInTheDocument();
    expect(screen.getByLabelText("이름 *")).toBeInTheDocument();
    expect(screen.getByLabelText("이메일 *")).toBeInTheDocument();
    expect(screen.getByLabelText("역할")).toBeInTheDocument();
    expect(screen.getByText("사용자 추가")).toBeInTheDocument();
    expect(screen.getByText("취소")).toBeInTheDocument();
  });

  it("폼을 닫을 수 있다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 사용자 추가 버튼 클릭
    const addButton = screen.getByText("사용자 추가");
    await user.click(addButton);

    // 폼이 표시되는지 확인
    expect(screen.getByText("새 사용자 추가")).toBeInTheDocument();

    // 폼 닫기 버튼 클릭
    const closeButton = screen.getByText("폼 닫기");
    await user.click(closeButton);

    // 폼이 사라지는지 확인
    expect(screen.queryByText("새 사용자 추가")).not.toBeInTheDocument();
    expect(screen.getByText("사용자 추가")).toBeInTheDocument();
  });

  it("폼 입력이 정상적으로 작동한다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 사용자 추가 버튼 클릭
    const addButton = screen.getByText("사용자 추가");
    await user.click(addButton);

    // 폼 입력 필드 찾기
    const nameInput = screen.getByLabelText("이름 *");
    const emailInput = screen.getByLabelText("이메일 *");
    const roleSelect = screen.getByLabelText("역할");

    // 입력값 입력
    await user.type(nameInput, "홍길동");
    await user.type(emailInput, "hong@example.com");
    await user.selectOptions(roleSelect, "admin");

    // 입력값이 제대로 설정되었는지 확인
    expect(nameInput).toHaveValue("홍길동");
    expect(emailInput).toHaveValue("hong@example.com");
    expect(roleSelect).toHaveValue("admin");
  });

  it("필수 필드가 비어있으면 에러 메시지가 표시된다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 사용자 추가 버튼 클릭
    const addButton = screen.getByText("사용자 추가");
    await user.click(addButton);

    // 폼이 표시되는지 확인
    expect(screen.getByText("새 사용자 추가")).toBeInTheDocument();

    // 폼 제출 전에 에러 메시지가 없는지 확인
    expect(screen.queryByText(/에러:/)).not.toBeInTheDocument();

    // 폼 요소를 태그 이름으로 찾기
    const form = document.querySelector("form");
    expect(form).toBeInTheDocument();

    // 폼 제출 이벤트를 직접 발생시킴
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    form!.dispatchEvent(submitEvent);

    // 에러 메시지가 표시되는지 확인 (더 유연한 검색)
    await waitFor(() => {
      const errorElement =
        screen.queryByText(/에러:/) || screen.queryByText(/필수/) || screen.queryByText(/이름과 이메일/);
      expect(errorElement).toBeInTheDocument();
    });
  });

  it("사용자를 성공적으로 추가할 수 있다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 사용자 추가 버튼 클릭
    const addButton = screen.getByText("사용자 추가");
    await user.click(addButton);

    // 폼 입력
    const nameInput = screen.getByLabelText("이름 *");
    const emailInput = screen.getByLabelText("이메일 *");
    const roleSelect = screen.getByLabelText("역할");

    await user.type(nameInput, "새사용자");
    await user.type(emailInput, "new@example.com");
    await user.selectOptions(roleSelect, "user");

    // 폼 제출
    const submitButton = screen.getByText("사용자 추가");
    await user.click(submitButton);

    // 성공 메시지가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText("사용자가 성공적으로 추가되었습니다!")).toBeInTheDocument();
    });

    // 폼이 초기화되었는지 확인
    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(roleSelect).toHaveValue("user");
  });

  it("이메일 중복 시 에러가 표시된다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 사용자 추가 버튼 클릭
    const addButton = screen.getByText("사용자 추가");
    await user.click(addButton);

    // 중복 이메일로 폼 입력 (MSW에서 kim@example.com은 중복으로 설정됨)
    const nameInput = screen.getByLabelText("이름 *");
    const emailInput = screen.getByLabelText("이메일 *");

    await user.type(nameInput, "중복사용자");
    await user.type(emailInput, "kim@example.com");

    // 폼 제출
    const submitButton = screen.getByText("사용자 추가");
    await user.click(submitButton);

    // 에러 메시지가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText(/에러:/)).toBeInTheDocument();
    });
  });

  it("폼 제출 중에는 입력 필드가 비활성화된다", async () => {
    render(<UserList />);

    // 초기 사용자 목록이 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText("김철수")).toBeInTheDocument();
    });

    // 사용자 추가 버튼 클릭
    const addButton = screen.getByText("사용자 추가");
    await user.click(addButton);

    // 폼 입력
    const nameInput = screen.getByLabelText("이름 *");
    const emailInput = screen.getByLabelText("이메일 *");
    const submitButton = screen.getByText("사용자 추가");

    await user.type(nameInput, "테스트사용자");
    await user.type(emailInput, "test@example.com");

    // 폼 제출 시작
    await user.click(submitButton);

    // 제출 중에는 입력 필드가 비활성화되는지 확인
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("추가 중...");
  });
});

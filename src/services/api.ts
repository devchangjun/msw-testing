import { User, Post, CreateUserRequest, UpdateUserRequest } from "../types";

const API_BASE_URL = "/api";

// 사용자 관련 API
export const userApi = {
  // 사용자 목록 조회
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error("사용자 목록을 가져오는데 실패했습니다.");
    }
    return response.json();
  },

  // 사용자 이름으로 검색
  searchUsers: async (query: string): Promise<User[]> => {
    // MSW가 작동하지 않을 경우를 대비한 임시 모킹
    if (process.env.NODE_ENV === "development") {
      console.log("MSW 대신 임시 모킹 사용:", query);

      // 임시 모킹 데이터
      const mockUsers: User[] = [
        { id: 1, name: "김철수", email: "kim@example.com", role: "admin" as const },
        { id: 2, name: "이영희", email: "lee@example.com", role: "user" as const },
        { id: 3, name: "박민수", email: "park@example.com", role: "user" as const },
        { id: 4, name: "아이유", email: "iu@example.com", role: "user" as const },
        { id: 5, name: "김아이유", email: "kimiu@example.com", role: "admin" as const },
      ];

      // 검색어에 맞는 사용자 필터링
      const filteredUsers = mockUsers.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));

      // 실제 API 호출과 유사한 지연 시간
      await new Promise((resolve) => setTimeout(resolve, 300));

      return filteredUsers;
    }

    // 실제 API 호출
    const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("사용자 검색에 실패했습니다.");
    }
    const data = await response.json();
    return data.users || [];
  },

  // 특정 사용자 조회
  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error("사용자 정보를 가져오는데 실패했습니다.");
    }
    return response.json();
  },

  // 사용자 생성
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("사용자 생성에 실패했습니다.");
    }
    return response.json();
  },

  // 사용자 수정
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("사용자 수정에 실패했습니다.");
    }
    return response.json();
  },

  // 사용자 삭제
  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("사용자 삭제에 실패했습니다.");
    }
  },
};

// 게시물 관련 API
export const postApi = {
  // 게시물 목록 조회
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error("게시물 목록을 가져오는데 실패했습니다.");
    }
    return response.json();
  },
};

import { User } from "../types";

/**
 * 유저 이름으로 검색하는 API
 * @param query 검색할 유저 이름 (부분 일치)
 * @returns 검색된 유저 목록
 */
export const searchUsersByName = async (query: string): Promise<User[]> => {
  try {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`검색 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("유저 검색 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 검색 결과가 없을 때 사용할 기본 응답
 */
export const getEmptySearchResult = (): User[] => {
  return [];
};

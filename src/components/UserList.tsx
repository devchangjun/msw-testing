import { useState, useEffect } from "react";
import { User } from "../types";
import { userApi } from "../services/api";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 사용자 목록 로드
  useEffect(() => {
    fetchUsers();
  }, []);

  // 검색어가 변경될 때마다 검색 실행
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "사용자 목록을 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      console.log("검색 시작:", searchQuery);

      const results = await userApi.searchUsers(searchQuery);
      console.log("검색 결과:", results);
      setSearchResults(results);
    } catch (err) {
      console.error("검색 에러:", err);
      const errorMessage = err instanceof Error ? err.message : "검색에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="search-container">
        <div className="search-loading">
          <p>사용자 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-container">
      {/* 검색창 */}
      <div className="search-input-container">
        <input
          type="text"
          placeholder="검색어를 입력하세요."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="search-icon">🔍</div>
      </div>

      {/* 검색 결과 또는 초기 사용자 목록 */}
      {!isSearching && (
        <div className="search-results">
          {searchQuery.trim() ? (
            // 검색 결과 표시
            searchResults.length > 0 ? (
              <div className="results-list">
                {searchResults.map((user) => (
                  <div key={user.id} className="user-result">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <span className={`role-badge ${user.role}`}>{user.role === "admin" ? "관리자" : "사용자"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h2>검색 결과가 없습니다.</h2>
                <div className="suggestions">
                  <p>• 검색어의 철자와 띄어쓰기가 정확한지 확인해주세요.</p>
                  <p>• 검색어의 단어 수를 줄이거나, 보다 일반적인 단어 등 다른 검색어를 입력해보세요.</p>
                </div>
              </div>
            )
          ) : (
            // 초기 사용자 목록 표시
            <div className="results-list">
              <h2>사용자 목록</h2>
              {users.map((user) => (
                <div key={user.id} className="user-result">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <span className={`role-badge ${user.role}`}>{user.role === "admin" ? "관리자" : "사용자"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 검색 중 로딩 */}
      {isSearching && (
        <div className="search-loading">
          <p>검색 중...</p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="error-message">
          <p>에러: {error}</p>
        </div>
      )}
    </div>
  );
};

export default UserList;

import { useState, useEffect } from "react";
import { User, CreateUserRequest } from "../types";
import { userApi } from "../services/api";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 추가 폼 상태
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: "",
    email: "",
    role: "user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("폼 제출 시작:", formData);

    if (!formData.name.trim() || !formData.email.trim()) {
      console.log("필수 필드 검증 실패");
      setFormError("이름과 이메일은 필수 입력 항목입니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      console.log("API 호출 시작");

      const newUser = await userApi.createUser(formData);
      console.log("사용자 생성 성공:", newUser);

      // 성공 메시지 표시
      setFormSuccess("사용자가 성공적으로 추가되었습니다!");

      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        role: "user",
      });

      console.log("사용자 목록 새로고침 시작");
      // 사용자 목록 새로고침 (로딩 상태 변경 없이)
      try {
        const updatedUsers = await userApi.getUsers();
        setUsers(updatedUsers);
        console.log("사용자 목록 업데이트 완료");
      } catch (fetchError) {
        console.error("사용자 목록 새로고침 실패:", fetchError);
        // 새로고침 실패해도 성공 메시지는 유지
      }

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setFormSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("사용자 생성 에러:", err);
      const errorMessage = err instanceof Error ? err.message : "사용자 추가에 실패했습니다.";
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log("폼 제출 완료");
    }
  };

  // 폼 토글
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      // 폼을 열 때 기존 에러/성공 메시지 초기화
      setFormError(null);
      setFormSuccess(null);
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
      {/* 사용자 추가 버튼 */}
      <div className="add-user-section">
        <button onClick={toggleAddForm} className="add-user-button">
          {showAddForm ? "폼 닫기" : "사용자 추가"}
        </button>
      </div>

      {/* 사용자 추가 폼 */}
      {showAddForm && (
        <div className="add-user-form">
          <h3>새 사용자 추가</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">이름 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="사용자 이름을 입력하세요"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">역할</label>
              <select id="role" name="role" value={formData.role} onChange={handleInputChange} disabled={isSubmitting}>
                <option value="user">사용자</option>
                <option value="admin">관리자</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? "추가 중..." : "사용자 추가"}
              </button>
              <button type="button" onClick={toggleAddForm} className="cancel-button" disabled={isSubmitting}>
                취소
              </button>
            </div>

            {/* 폼 에러 메시지 */}
            {formError && (
              <div className="form-error">
                <p>에러: {formError}</p>
              </div>
            )}

            {/* 폼 성공 메시지 */}
            {formSuccess && (
              <div className="form-success">
                <p>{formSuccess}</p>
              </div>
            )}
          </form>
        </div>
      )}

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

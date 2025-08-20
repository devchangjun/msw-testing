import React, { useState } from "react";
import UserList from "./components/UserList";
import PostList from "./components/PostList";
import MSWTestPanel from "./components/MSWTestPanel";
import "./App.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "posts" | "test">("users");

  return (
    <div className="App">
      <header className="App-header">
        <h1>MSW API Mocking 데모</h1>
        <p>React + TypeScript + MSW를 활용한 API Mocking 프로젝트</p>
      </header>

      <nav className="App-nav">
        <button className={`nav-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          사용자 관리
        </button>
        <button className={`nav-button ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>
          게시물 목록
        </button>
        <button className={`nav-button ${activeTab === "test" ? "active" : ""}`} onClick={() => setActiveTab("test")}>
          MSW 테스트
        </button>
      </nav>

      <main className="App-main">
        {activeTab === "users" ? <UserList /> : activeTab === "posts" ? <PostList /> : <MSWTestPanel />}
      </main>

      <footer className="App-footer">
        <p>
          이 프로젝트는 MSW(Mock Service Worker)를 사용하여 실제 API 없이도 프론트엔드 개발을 진행할 수 있도록
          구성되었습니다.
        </p>
        <p>개발자 도구의 Network 탭에서 MSW가 가로챈 요청들을 확인할 수 있습니다.</p>
      </footer>
    </div>
  );
};

export default App;

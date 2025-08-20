import React, { useState } from 'react'
import './MSWTestPanel.css'

const MSWTestPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addTestResult = (testName: string, result: any, error?: string) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      name: testName,
      result,
      error,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const clearResults = () => {
    setTestResults([])
  }

  // 기본 API 테스트
  const testBasicAPIs = async () => {
    setLoading(true)
    
    try {
      // 사용자 목록 조회 테스트
      const usersResponse = await fetch('/api/users')
      const usersData = await usersResponse.json()
      addTestResult('사용자 목록 조회', { status: usersResponse.status, data: usersData })

      // 게시물 목록 조회 테스트
      const postsResponse = await fetch('/api/posts')
      const postsData = await postsResponse.json()
      addTestResult('게시물 목록 조회', { status: postsResponse.status, data: postsData })

      // 특정 사용자 조회 테스트
      const userResponse = await fetch('/api/users/1')
      const userData = await userResponse.json()
      addTestResult('사용자 ID 1 조회', { status: userResponse.status, data: userData })

    } catch (error) {
      addTestResult('기본 API 테스트', null, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // 에러 케이스 테스트
  const testErrorCases = async () => {
    setLoading(true)
    
    try {
      // 존재하지 않는 사용자 조회 (404)
      const notFoundResponse = await fetch('/api/users/999')
      addTestResult('존재하지 않는 사용자 조회 (404)', { 
        status: notFoundResponse.status, 
        statusText: notFoundResponse.statusText 
      })

      // 네트워크 에러 테스트
      try {
        await fetch('/api/network-error')
      } catch (error) {
        addTestResult('네트워크 에러 테스트', { error: 'Network error caught' })
      }

      // 서버 에러 테스트 (500)
      const serverErrorResponse = await fetch('/api/server-error')
      addTestResult('서버 에러 테스트 (500)', { 
        status: serverErrorResponse.status, 
        statusText: serverErrorResponse.statusText 
      })

    } catch (error) {
      addTestResult('에러 케이스 테스트', null, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // 사용자 생성/수정/삭제 테스트
  const testUserCRUD = async () => {
    setLoading(true)
    
    try {
      // 사용자 생성 테스트
      const createResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '테스트 사용자',
          email: 'test@example.com',
          role: 'user'
        })
      })
      const createData = await createResponse.json()
      addTestResult('사용자 생성', { status: createResponse.status, data: createData })

      // 유효성 검사 실패 테스트 (이름 누락)
      const validationResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid@example.com' })
      })
      const validationData = await validationResponse.json()
      addTestResult('유효성 검사 실패 (이름 누락)', { status: validationResponse.status, data: validationData })

      // 이메일 중복 테스트
      const duplicateResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '김철수',
          email: 'kim@example.com',
          role: 'user'
        })
      })
      const duplicateData = await duplicateResponse.json()
      addTestResult('이메일 중복 테스트 (409)', { status: duplicateResponse.status, data: duplicateData })

    } catch (error) {
      addTestResult('사용자 CRUD 테스트', null, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // 고급 기능 테스트
  const testAdvancedFeatures = async () => {
    setLoading(true)
    
    try {
      // 페이지네이션 테스트
      const page2Response = await fetch('/api/posts?page=2')
      const page2Data = await page2Response.json()
      addTestResult('페이지네이션 테스트 (page=2)', { status: page2Response.status, data: page2Data })

      // 검색 API 테스트
      const searchResponse = await fetch('/api/posts/search?q=MSW')
      const searchData = await searchResponse.json()
      addTestResult('검색 API 테스트 (q=MSW)', { status: searchResponse.status, data: searchData })

      // 빈 검색어 테스트
      const emptySearchResponse = await fetch('/api/posts/search?q=')
      const emptySearchData = await emptySearchResponse.json()
      addTestResult('빈 검색어 테스트', { status: emptySearchResponse.status, data: emptySearchData })

    } catch (error) {
      addTestResult('고급 기능 테스트', null, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // 지연 응답 테스트
  const testSlowResponse = async () => {
    setLoading(true)
    
    try {
      const startTime = Date.now()
      const response = await fetch('/api/slow')
      const endTime = Date.now()
      const data = await response.json()
      
      addTestResult('지연 응답 테스트 (3초)', { 
        status: response.status, 
        data,
        responseTime: `${endTime - startTime}ms`
      })
    } catch (error) {
      addTestResult('지연 응답 테스트', null, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="msw-test-panel">
      <h2>MSW API 테스트 패널</h2>
      <p>MSW를 통해 Mock API가 올바르게 작동하는지 테스트해보세요.</p>
      
      <div className="test-buttons">
        <button 
          onClick={testBasicAPIs} 
          disabled={loading}
          className="test-btn basic"
        >
          기본 API 테스트
        </button>
        
        <button 
          onClick={testErrorCases} 
          disabled={loading}
          className="test-btn error"
        >
          에러 케이스 테스트
        </button>
        
        <button 
          onClick={testUserCRUD} 
          disabled={loading}
          className="test-btn crud"
        >
          사용자 CRUD 테스트
        </button>
        
        <button 
          onClick={testAdvancedFeatures} 
          disabled={loading}
          className="test-btn advanced"
        >
          고급 기능 테스트
        </button>
        
        <button 
          onClick={testSlowResponse} 
          disabled={loading}
          className="test-btn slow"
        >
          지연 응답 테스트
        </button>
        
        <button 
          onClick={clearResults} 
          className="test-btn clear"
        >
          결과 초기화
        </button>
      </div>

      {loading && (
        <div className="loading-indicator">
          테스트 실행 중... <span className="spinner"></span>
        </div>
      )}

      <div className="test-results">
        <h3>테스트 결과 ({testResults.length})</h3>
        
        {testResults.length === 0 ? (
          <p className="no-results">아직 테스트를 실행하지 않았습니다.</p>
        ) : (
          <div className="results-list">
            {testResults.map((result) => (
              <div key={result.id} className={`result-item ${result.error ? 'error' : 'success'}`}>
                <div className="result-header">
                  <span className="result-name">{result.name}</span>
                  <span className="result-time">{result.timestamp}</span>
                </div>
                
                {result.error ? (
                  <div className="result-error">
                    <strong>에러:</strong> {result.error}
                  </div>
                ) : (
                  <div className="result-data">
                    <pre>{JSON.stringify(result.result, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MSWTestPanel

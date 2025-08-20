import React, { useState, useEffect } from 'react'
import { User } from '../types'
import { userApi } from '../services/api'
import './UserList.css'

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as const
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userApi.getUsers()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '사용자 목록을 가져오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = async (userId: number) => {
    try {
      const user = await userApi.getUserById(userId)
      setSelectedUser(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : '사용자 정보를 가져오는데 실패했습니다.')
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await userApi.createUser(newUser)
      setNewUser({ name: '', email: '', role: 'user' })
      setShowCreateForm(false)
      fetchUsers() // 목록 새로고침
    } catch (err) {
      setError(err instanceof Error ? err.message : '사용자 생성에 실패했습니다.')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        await userApi.deleteUser(userId)
        fetchUsers() // 목록 새로고침
        if (selectedUser?.id === userId) {
          setSelectedUser(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '사용자 삭제에 실패했습니다.')
      }
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  if (error) {
    return <div className="error">에러: {error}</div>
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>사용자 목록</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? '취소' : '새 사용자 추가'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateUser} className="create-user-form">
          <h3>새 사용자 추가</h3>
          <div className="form-group">
            <label>이름:</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>이메일:</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>역할:</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
            >
              <option value="user">사용자</option>
              <option value="admin">관리자</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success">생성</button>
        </form>
      )}

      <div className="user-list-content">
        <div className="user-list">
          <h3>사용자 목록</h3>
          <div className="user-grid">
            {users.map((user) => (
              <div 
                key={user.id} 
                className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => handleUserClick(user.id)}
              >
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' ? '관리자' : '사용자'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteUser(user.id)
                  }}
                  className="btn btn-danger btn-sm"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="user-detail">
            <h3>사용자 상세 정보</h3>
            <div className="user-info">
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>이름:</strong> {selectedUser.name}</p>
              <p><strong>이메일:</strong> {selectedUser.email}</p>
              <p><strong>역할:</strong> {selectedUser.role === 'admin' ? '관리자' : '사용자'}</p>
              {selectedUser.profile && (
                <>
                  <p><strong>소개:</strong> {selectedUser.profile.bio}</p>
                  <p><strong>위치:</strong> {selectedUser.profile.location}</p>
                  <p><strong>가입일:</strong> {selectedUser.profile.joinDate}</p>
                </>
              )}
              {selectedUser.createdAt && (
                <p><strong>생성일:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserList

import { User, Post, CreateUserRequest, UpdateUserRequest } from '../types'

const API_BASE_URL = '/api'

// 사용자 관련 API
export const userApi = {
  // 사용자 목록 조회
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) {
      throw new Error('사용자 목록을 가져오는데 실패했습니다.')
    }
    return response.json()
  },

  // 특정 사용자 조회
  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`)
    if (!response.ok) {
      throw new Error('사용자 정보를 가져오는데 실패했습니다.')
    }
    return response.json()
  },

  // 사용자 생성
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error('사용자 생성에 실패했습니다.')
    }
    return response.json()
  },

  // 사용자 수정
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error('사용자 수정에 실패했습니다.')
    }
    return response.json()
  },

  // 사용자 삭제
  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('사용자 삭제에 실패했습니다.')
    }
  },
}

// 게시물 관련 API
export const postApi = {
  // 게시물 목록 조회
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts`)
    if (!response.ok) {
      throw new Error('게시물 목록을 가져오는데 실패했습니다.')
    }
    return response.json()
  },
}

// 사용자 타입 정의
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  profile?: UserProfile
  createdAt?: string
  updatedAt?: string
}

export interface UserProfile {
  bio: string
  location: string
  joinDate: string
}

// 게시물 타입 정의
export interface Post {
  id: number
  title: string
  content: string
  authorId: number
  createdAt: string
}

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// 사용자 생성 요청 타입
export interface CreateUserRequest {
  name: string
  email: string
  role: 'admin' | 'user'
}

// 사용자 수정 요청 타입
export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: 'admin' | 'user'
}

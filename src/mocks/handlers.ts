import { http, HttpResponse } from 'msw'

// 사용자 목록을 가져오는 API
export const getUsers = http.get('/api/users', () => {
  return HttpResponse.json([
    {
      id: 1,
      name: '김철수',
      email: 'kim@example.com',
      role: 'admin'
    },
    {
      id: 2,
      name: '이영희',
      email: 'lee@example.com',
      role: 'user'
    },
    {
      id: 3,
      name: '박민수',
      email: 'park@example.com',
      role: 'user'
    }
  ])
})

// 특정 사용자 정보를 가져오는 API
export const getUserById = http.get('/api/users/:id', ({ params }) => {
  const { id } = params
  
  const users = [
    {
      id: 1,
      name: '김철수',
      email: 'kim@example.com',
      role: 'admin',
      profile: {
        bio: '시니어 개발자',
        location: '서울',
        joinDate: '2020-01-15'
      }
    },
    {
      id: 2,
      name: '이영희',
      email: 'lee@example.com',
      role: 'user',
      profile: {
        bio: '프론트엔드 개발자',
        location: '부산',
        joinDate: '2021-03-20'
      }
    },
    {
      id: 3,
      name: '박민수',
      email: 'park@example.com',
      role: 'user',
      profile: {
        bio: '백엔드 개발자',
        location: '대구',
        joinDate: '2022-07-10'
      }
    }
  ]
  
  const user = users.find(u => u.id === Number(id))
  
  if (!user) {
    return new HttpResponse(null, { status: 404 })
  }
  
  return HttpResponse.json(user)
})

// 사용자 생성 API
export const createUser = http.post('/api/users', async ({ request }) => {
  const body = await request.json()
  
  return HttpResponse.json({
    id: Math.floor(Math.random() * 1000) + 4,
    ...body,
    createdAt: new Date().toISOString()
  }, { status: 201 })
})

// 사용자 수정 API
export const updateUser = http.put('/api/users/:id', async ({ params, request }) => {
  const { id } = params
  const body = await request.json()
  
  return HttpResponse.json({
    id: Number(id),
    ...body,
    updatedAt: new Date().toISOString()
  })
})

// 사용자 삭제 API
export const deleteUser = http.delete('/api/users/:id', ({ params }) => {
  const { id } = params
  
  return new HttpResponse(null, { status: 204 })
})

// 게시물 목록을 가져오는 API
export const getPosts = http.get('/api/posts', () => {
  return HttpResponse.json([
    {
      id: 1,
      title: 'MSW를 활용한 API Mocking',
      content: 'MSW는 실제 API 없이도 프론트엔드 개발을 할 수 있게 해주는 도구입니다.',
      authorId: 1,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'React + TypeScript 개발 팁',
      content: 'TypeScript를 활용하면 더 안전하고 유지보수하기 좋은 코드를 작성할 수 있습니다.',
      authorId: 2,
      createdAt: '2024-01-14T15:30:00Z'
    }
  ])
})

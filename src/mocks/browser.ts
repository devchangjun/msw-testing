import { setupWorker } from 'msw/browser'
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  getPosts,
  searchPosts,
  networkErrorTest,
  serverErrorTest,
  slowResponseTest
} from './handlers'

// MSW Worker를 설정합니다
export const worker = setupWorker(
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getPosts,
  searchPosts,
  networkErrorTest,
  serverErrorTest,
  slowResponseTest
)

import { http, HttpResponse } from "msw";
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
  slowResponseTest,
} from "./handlers";
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getHolidays } from "./eventHandlers";

// MSW 2.x 버전에서는 setupServer 대신 handlers를 직접 export
export const handlers = [
  // 사용자 관련 API
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  // 게시물 관련 API
  getPosts,
  searchPosts,

  // 테스트용 API
  networkErrorTest,
  serverErrorTest,
  slowResponseTest,

  // 이벤트 관련 API
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getHolidays,
];

// MSW 2.x 버전에서는 setupServer를 사용하지 않음
// 대신 테스트 파일에서 직접 handlers를 사용

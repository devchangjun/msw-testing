import { setupWorker } from "msw/browser";
import handlers from "./handlers";

// MSW Worker를 설정합니다
export const worker = setupWorker(
  handlers.getUsers,
  handlers.getUserById,
  handlers.createUser,
  handlers.updateUser,
  handlers.deleteUser,
  handlers.searchUsers,
  handlers.networkErrorTest,
  handlers.serverErrorTest,
  handlers.slowResponseTest
);

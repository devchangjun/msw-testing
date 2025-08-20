import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import handlers from "./mocks/handlers";

// MSW 서버 설정
export const server = setupServer();

beforeAll(async () => {
  // MSW 서버 시작
  await server.listen({ onUnhandledRequest: "warn" });
  console.log("MSW 서버가 시작되었습니다.");
});

beforeEach(async () => {
  // 기본 핸들러를 먼저 설정
  server.use(...Object.values(handlers));
  console.log("MSW 핸들러가 설정되었습니다:", Object.keys(handlers));
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  console.log("MSW 서버가 종료되었습니다.");
});

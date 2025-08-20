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
  // MSW 2.0 이후 버전에서는 setupServer에 핸들러를 동적으로 추가할 수 있게 만듦.
  server.use(...Object.values(handlers));
  console.log("MSW 핸들러가 설정되었습니다:", Object.keys(handlers));
});

afterEach(() => {
  // 테스트가 끝나면 핸들러를 초기화
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  console.log("MSW 서버가 종료되었습니다.");
});

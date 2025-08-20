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

// Node.js 환경에서 필요한 전역 객체들 정의
if (typeof globalThis.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

if (typeof globalThis.Response === "undefined") {
  globalThis.Response = class Response {
    constructor(body?: any, init?: any) {
      // Mock Response 구현
    }
  } as any;
}

if (typeof globalThis.Request === "undefined") {
  globalThis.Request = class Request {
    constructor(input: any, init?: any) {
      // Mock Request 구현
    }
  } as any;
}

if (typeof globalThis.BroadcastChannel === "undefined") {
  globalThis.BroadcastChannel = class BroadcastChannel {
    constructor(name: string) {
      // Mock BroadcastChannel 구현
    }
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  } as any;
}

if (typeof globalThis.MessageChannel === "undefined") {
  globalThis.MessageChannel = class MessageChannel {
    port1: any;
    port2: any;
    constructor() {
      this.port1 = {
        postMessage: () => {},
        close: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      this.port2 = {
        postMessage: () => {},
        close: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    }
  } as any;
}

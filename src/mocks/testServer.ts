import { http, HttpResponse } from "msw";
import { handlers } from "./server";

// MSW 2.x 버전에서는 setupServer 대신 handlers를 직접 사용
// 테스트에서는 실제 fetch 요청을 가로채서 handlers로 처리

// 테스트용 간단한 fetch mock
const originalFetch = global.fetch;

export const setupTestServer = () => {
  // fetch를 mock하여 handlers로 요청 처리
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input.toString());
    const method = init?.method || "GET";

    // handlers에서 해당 요청을 처리할 수 있는지 확인
    for (const handler of handlers) {
      if (handler.info.method === method && handler.info.path === url.pathname) {
        try {
          // handler 실행
          const response = await handler.run({
            request: new Request(url, init),
            params: {},
            cookies: {},
          });
          return response;
        } catch (error) {
          return new Response(JSON.stringify({ error: "Handler execution failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }

    // handler가 없으면 원래 fetch 사용
    return originalFetch(input, init);
  };
};

export const teardownTestServer = () => {
  global.fetch = originalFetch;
};

import "@testing-library/jest-dom";

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

// MSW 테스트 환경 설정

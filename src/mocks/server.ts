import userHandlers from "./handlers";

// MSW 2.x 버전에서는 setupServer 대신 handlers를 직접 export
export const handlers = [
  // 사용자 관련 API (스프레드 문법 사용)
  ...Object.values(userHandlers),
];

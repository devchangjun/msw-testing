async function enableMocking() {
  const { worker } = await import("./browser");

  // MSW Worker를 시작합니다
  return worker.start({
    onUnhandledRequest: "bypass", // 처리되지 않은 요청은 무시
  });
}

export default enableMocking;

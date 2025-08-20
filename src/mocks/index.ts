async function enableMocking() {
  // 개발 환경에서만 MSW를 활성화
  if (process.env.NODE_ENV !== "development") {
    console.log("MSW: 프로덕션 환경에서는 비활성화됨");
    return;
  }

  try {
    const { worker } = await import("./browser");

    console.log("MSW: Worker 시작 중...");

    // MSW Worker를 시작합니다
    await worker.start({
      onUnhandledRequest: "warn", // 처리되지 않은 요청은 경고로 표시
      serviceWorker: {
        url: "/mockServiceWorker.js",
        options: {
          scope: "/",
        },
      },
    });

    console.log("MSW: Worker가 성공적으로 시작됨");
    console.log("MSW: 등록된 핸들러:", worker.listHandlers());

    // MSW가 제대로 작동하는지 테스트
    console.log("MSW: API 요청을 가로채기 시작함");
  } catch (error) {
    console.error("MSW 초기화 실패:", error);
    console.error("MSW 에러 상세:", error);
  }
}

export default enableMocking;

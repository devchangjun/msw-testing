import { http, HttpResponse, delay } from "msw";

// 사용자 목록을 가져오는 API
export const getUsers = http.get("/api/users", async () => {
  // 실제 API와 유사한 지연 시간 추가
  await delay(500);

  return HttpResponse.json([
    {
      id: 1,
      name: "김철수",
      email: "kim@example.com",
      role: "admin",
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      role: "user",
    },
    {
      id: 3,
      name: "박민수",
      email: "park@example.com",
      role: "user",
    },
  ]);
});

// 특정 사용자 정보를 가져오는 API
export const getUserById = http.get("/api/users/:id", async ({ params }) => {
  const { id } = params;

  // 에러 케이스 테스트: 잘못된 ID
  if (id === "999") {
    await delay(300);
    return new HttpResponse(null, {
      status: 404,
      statusText: "User not found",
    });
  }

  const users = [
    {
      id: 1,
      name: "김철수",
      email: "kim@example.com",
      role: "admin",
      profile: {
        bio: "시니어 개발자",
        location: "서울",
        joinDate: "2020-01-15",
      },
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      role: "user",
      profile: {
        bio: "프론트엔드 개발자",
        location: "부산",
        joinDate: "2021-03-20",
      },
    },
    {
      id: 3,
      name: "박민수",
      email: "park@example.com",
      role: "user",
      profile: {
        bio: "백엔드 개발자",
        location: "대구",
        joinDate: "2022-07-10",
      },
    },
  ];

  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    await delay(300);
    return new HttpResponse(null, {
      status: 404,
      statusText: "User not found",
    });
  }

  await delay(200);
  return HttpResponse.json(user);
});

// 사용자 생성 API
export const createUser = http.post("/api/users", async ({ request }) => {
  try {
    const body = (await request.json()) as { name?: string; email?: string; role?: string };

    // 유효성 검사
    if (!body.name || !body.email) {
      return new HttpResponse(
        JSON.stringify({
          error: "Name and email are required",
          code: "VALIDATION_ERROR",
        }),
        {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 이메일 중복 체크
    if (body.email === "kim@example.com") {
      return new HttpResponse(
        JSON.stringify({
          error: "Email already exists",
          code: "DUPLICATE_EMAIL",
        }),
        {
          status: 409,
          statusText: "Conflict",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await delay(800); // 실제 API와 유사한 지연

    return HttpResponse.json(
      {
        id: Math.floor(Math.random() * 1000) + 4,
        name: body.name,
        email: body.email,
        role: body.role || "user",
        createdAt: new Date().toISOString(),
        message: "User created successfully",
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new HttpResponse(
      JSON.stringify({
        error: "Invalid JSON payload",
        code: "INVALID_JSON",
      }),
      {
        status: 400,
        statusText: "Bad Request",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});

// 사용자 수정 API
export const updateUser = http.put("/api/users/:id", async ({ params, request }) => {
  const { id } = params;

  try {
    const body = (await request.json()) as { name?: string; email?: string; role?: string };

    // 존재하지 않는 사용자 수정 시도
    if (id === "999") {
      return new HttpResponse(
        JSON.stringify({
          error: "User not found",
          code: "USER_NOT_FOUND",
        }),
        {
          status: 404,
          statusText: "Not Found",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await delay(600);

    return HttpResponse.json({
      id: Number(id),
      name: body.name,
      email: body.email,
      role: body.role,
      updatedAt: new Date().toISOString(),
      message: "User updated successfully",
    });
  } catch (error) {
    return new HttpResponse(
      JSON.stringify({
        error: "Invalid JSON payload",
        code: "INVALID_JSON",
      }),
      {
        status: 400,
        statusText: "Bad Request",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});

// 사용자 삭제 API
export const deleteUser = http.delete("/api/users/:id", async ({ params }) => {
  const { id } = params;

  // 존재하지 않는 사용자 삭제 시도
  if (id === "999") {
    await delay(300);
    return new HttpResponse(
      JSON.stringify({
        error: "User not found",
        code: "USER_NOT_FOUND",
      }),
      {
        status: 404,
        statusText: "Not Found",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  await delay(400);

  return new HttpResponse(
    JSON.stringify({
      message: "User deleted successfully",
      deletedUserId: Number(id),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});

// 게시물 목록을 가져오는 API
export const getPosts = http.get("/api/posts", async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "10";

  // 페이지네이션 테스트
  if (page === "2") {
    await delay(400);
    return HttpResponse.json([
      {
        id: 3,
        title: "페이지 2의 게시물",
        content: "두 번째 페이지에 표시되는 게시물입니다.",
        authorId: 3,
        createdAt: "2024-01-13T09:00:00Z",
      },
    ]);
  }

  await delay(300);

  return HttpResponse.json([
    {
      id: 1,
      title: "MSW를 활용한 API Mocking",
      content: "MSW는 실제 API 없이도 프론트엔드 개발을 할 수 있게 해주는 도구입니다.",
      authorId: 1,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      title: "React + TypeScript 개발 팁",
      content: "TypeScript를 활용하면 더 안전하고 유지보수하기 좋은 코드를 작성할 수 있습니다.",
      authorId: 2,
      createdAt: "2024-01-14T15:30:00Z",
    },
  ]);
});

// 게시물 검색 API (새로 추가)
export const searchPosts = http.get("/api/posts/search", async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  await delay(500);

  if (!query) {
    return HttpResponse.json([]);
  }

  const allPosts = [
    {
      id: 1,
      title: "MSW를 활용한 API Mocking",
      content: "MSW는 실제 API 없이도 프론트엔드 개발을 할 수 있게 해주는 도구입니다.",
      authorId: 1,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      title: "React + TypeScript 개발 팁",
      content: "TypeScript를 활용하면 더 안전하고 유지보수하기 좋은 코드를 작성할 수 있습니다.",
      authorId: 2,
      createdAt: "2024-01-14T15:30:00Z",
    },
  ];

  const filteredPosts = allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) || post.content.toLowerCase().includes(query.toLowerCase())
  );

  return HttpResponse.json(filteredPosts);
});

// 네트워크 에러 테스트용 API
export const networkErrorTest = http.get("/api/network-error", () => {
  return HttpResponse.error();
});

// 서버 에러 테스트용 API
export const serverErrorTest = http.get("/api/server-error", () => {
  return new HttpResponse(null, {
    status: 500,
    statusText: "Internal Server Error",
  });
});

// 지연 응답 테스트용 API
export const slowResponseTest = http.get("/api/slow", async () => {
  await delay(3000); // 3초 지연
  return HttpResponse.json({ message: "Slow response after 3 seconds" });
});

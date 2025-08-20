import { http, HttpResponse, delay } from "msw";

const handlers = {
  // 사용자 목록을 가져오는 API
  getUsers: http.get("/api/users", async () => {
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
      {
        id: 4,
        name: "아이유",
        email: "iu@example.com",
        role: "user",
      },
      {
        id: 5,
        name: "김아이유",
        email: "kimiu@example.com",
        role: "admin",
      },
    ]);
  }),

  // 사용자 검색 API
  searchUsers: http.get("/api/users/search", async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    await delay(300); // 검색 지연 시간

    if (!query) {
      return HttpResponse.json({ users: [] });
    }

    const allUsers = [
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
      {
        id: 4,
        name: "아이유",
        email: "iu@example.com",
        role: "user",
      },
      {
        id: 5,
        name: "김아이유",
        email: "kimiu@example.com",
        role: "admin",
      },
    ];

    const filteredUsers = allUsers.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
    return HttpResponse.json({ users: filteredUsers });
  }),

  // 특정 사용자 정보를 가져오는 API
  getUserById: http.get("/api/users/:id", async ({ params }) => {
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
  }),

  // 사용자 생성 API
  createUser: http.post("/api/users", async ({ request }) => {
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
  }),

  // 사용자 수정 API
  updateUser: http.put("/api/users/:id", async ({ params, request }) => {
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
  }),

  // 사용자 삭제 API
  deleteUser: http.delete("/api/users/:id", async ({ params }) => {
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
  }),

  // 네트워크 에러 테스트용 API
  networkErrorTest: http.get("/api/network-error", () => {
    return HttpResponse.error();
  }),

  // 서버 에러 테스트용 API
  serverErrorTest: http.get("/api/server-error", () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }),

  // 지연 응답 테스트용 API
  slowResponseTest: http.get("/api/slow", async () => {
    await delay(3000); // 3초 지연
    return HttpResponse.json({ message: "Slow response after 3 seconds" });
  }),
};

export default handlers;

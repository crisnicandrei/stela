import request from "supertest";
import type { NextFunction } from "express";
import createError from "http-errors";
import { db } from "../database";
import { mixpanelClient } from "../mixpanel";
import { app } from "../app";
import { verifyUserOrAdminAuthentication, extractIp } from "../middleware";
import type { CreateEventRequest } from "./models";

jest.mock("../database");
jest.mock("../middleware");
jest.mock("../mixpanel");

const testSubject = "fcb2b59b-df07-4e79-ad20-bf7f067a965e";

const clearDatabase = async (): Promise<void> => {
  await db.query("TRUNCATE event CASCADE");
};

describe("POST /event", () => {
  const agent = request(app);

  beforeEach(async () => {
    (verifyUserOrAdminAuthentication as jest.Mock).mockImplementation(
      (req: Request, __, next: NextFunction) => {
        (req.body as unknown as CreateEventRequest).userSubjectFromAuthToken =
          testSubject;
        next();
      }
    );
    (extractIp as jest.Mock).mockImplementation(
      (req: Request, __, next: NextFunction) => {
        (req.body as unknown as CreateEventRequest).ip = "192.168.0.1";
        next();
      }
    );
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("should return 401 if unauthenticated", async () => {
    (verifyUserOrAdminAuthentication as jest.Mock).mockImplementation(
      (_: Request, __, next: NextFunction) => {
        next(new createError.Unauthorized("You aren't logged in"));
      }
    );
    await agent.post("/api/v2/event").expect(401);
  });

  test("should have actorType user if authenticated as user", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(200);

    const result = await db.query<{ actorType: string }>(
      'SELECT actor_type AS "actorType" FROM event WHERE actor_id = :actorId',
      {
        actorId: testSubject,
      }
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.actorType).toBe("user");
  });

  test("should record actor type admin if authenticated as an admin", async () => {
    (verifyUserOrAdminAuthentication as jest.Mock).mockImplementation(
      (req: Request, __, next: NextFunction) => {
        (req.body as unknown as CreateEventRequest).adminSubjectFromAuthToken =
          testSubject;
        next();
      }
    );
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(200);

    const result = await db.query<{ actorType: string }>(
      'SELECT actor_type AS "actorType" FROM event WHERE actor_id = :actorId',
      {
        actorId: testSubject,
      }
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.actorType).toBe("admin");
  });

  test("should return 400 if no subject from auth token", async () => {
    (verifyUserOrAdminAuthentication as jest.Mock).mockImplementation(
      (_: Request, __, next: NextFunction) => {
        next();
      }
    );
    await agent.post("/api/v2/event").expect(400);
  });

  test("should return 400 if user subject from auth token not a string", async () => {
    (verifyUserOrAdminAuthentication as jest.Mock).mockImplementation(
      (req: Request, __, next: NextFunction) => {
        (
          req.body as unknown as { userSubjectFromAuthToken: number }
        ).userSubjectFromAuthToken = 1;
        next();
      }
    );
    await agent.post("/api/v2/event").expect(400);
  });

  test("should return 400 if user subject from auth token not a uuid", async () => {
    (verifyUserOrAdminAuthentication as jest.Mock).mockImplementation(
      (req: Request, __, next: NextFunction) => {
        (req.body as unknown as CreateEventRequest).userSubjectFromAuthToken =
          "not_a_uuid";
        next();
      }
    );
    await agent.post("/api/v2/event").expect(400);
  });

  test("should return 400 if admin subject from auth token not a string", async () => {
    (verifyUserOrAdminAuthentication as jest.Mock).mockImplementation(
      (req: Request, __, next: NextFunction) => {
        (
          req.body as unknown as { adminSubjectFromAuthToken: number }
        ).adminSubjectFromAuthToken = 1;
        next();
      }
    );
    await agent.post("/api/v2/event").expect(400);
  });

  test("should return 400 if admin subject from auth token not a uuid", async () => {
    (verifyUserOrAdminAuthentication as jest.Mock).mockImplementation(
      (req: Request, __, next: NextFunction) => {
        (req.body as unknown as CreateEventRequest).adminSubjectFromAuthToken =
          "not_a_uuid";
        next();
      }
    );
    await agent.post("/api/v2/event").expect(400);
  });

  test("should return 400 if entity is missing", async () => {
    await agent
      .post("/api/v2/event")
      .send({ action: "create", version: 1, entityId: "123", body: {} })
      .expect(400);
  });

  test("should return 400 if entity is not a string", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: 1,
        action: "create",
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(400);
  });

  test("should return 400 if action is missing", async () => {
    await agent
      .post("/api/v2/event")
      .send({ entity: "account", version: 1, entityId: "123", body: {} })
      .expect(400);
  });

  test("should return 400 if action is not a string", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: 1,
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(400);
  });

  test("should return 400 if version is missing", async () => {
    await agent
      .post("/api/v2/event")
      .send({ entity: "account", action: "create", entityId: "123", body: {} })
      .expect(400);
  });

  test("should return 400 if version is not a number", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: "not_a_number",
        entityId: "123",
        body: {},
      })
      .expect(400);
  });

  test("should return 400 if entityId is missing", async () => {
    await agent
      .post("/api/v2/event")
      .send({ entity: "account", action: "create", version: 1, body: {} })
      .expect(400);
  });

  test("should return 400 if entityId is not a string", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: 123,
        body: {},
      })
      .expect(400);
  });

  test("should return 400 if ip is not an ip", async () => {
    (extractIp as jest.Mock).mockImplementation(
      (req: Request, __, next: NextFunction) => {
        (req.body as unknown as CreateEventRequest).ip = "not_an_ip;";
        next();
      }
    );
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(400);
  });

  test("should return 400 if userAgent is not a string", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        userAgent: 1,
        body: {},
      })
      .expect(400);
  });

  test("should return 400 if body is missing", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
      })
      .expect(400);
  });

  test("should return 400 if body is not an object", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: "not_an_object",
      })
      .expect(400);
  });

  test("should return 400 if body includes analytics object with no event", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {
          analytics: { data: {}, distinctId: "local:123" },
        },
      })
      .expect(400);
  });

  test("should return 400 if body includes analytics object with non-string event", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {
          analytics: { event: 1, data: {}, distinctId: "local:123" },
        },
      })
      .expect(400);
  });

  test("should return 400 if body includes analytics object with no data", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {
          analytics: { event: "test", distinctId: "local:123" },
        },
      })
      .expect(400);
  });

  test("should return 400 if body includes analytics object with non-object data", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {
          analytics: {
            event: "test",
            distinctId: "local:123",
            data: "not_an_object",
          },
        },
      })
      .expect(400);
  });

  test("should return 400 if body includes analytics object missing distinctId", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {
          analytics: { event: "test", data: {} },
        },
      })
      .expect(400);
  });

  test("should return 400 if body includes analytics object and distinctId not a string", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {
          analytics: { event: "test", data: {}, distinct_id: 1 },
        },
      })
      .expect(400);
  });

  test("should record the event in the database", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(200);

    const result = await db.query(
      "SELECT id FROM event WHERE actor_id = :actorId",
      {
        actorId: testSubject,
      }
    );

    expect(result.rows).toHaveLength(1);
  });

  test("should send Mixpanel event if body includes analytics", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {
          analytics: {
            event: "Sign Up",
            distinctId: "local:123",
            data: {
              accountId: "123",
              email: "test+sign_up@permanent.org",
            },
          },
        },
      })
      .expect(200);

    expect(mixpanelClient.track).toHaveBeenCalledWith("Sign Up", {
      distinct_id: "local:123",
      accountId: "123",
      email: "test+sign_up@permanent.org",
    });
  });

  test("should return 500 error if Mixpanel call fails", async () => {
    (mixpanelClient.track as jest.Mock).mockImplementation(() => {
      throw new Error("Mixpanel error");
    });
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {
          analytics: {
            event: "Sign Up",
            distinctId: "local:123",
            data: {
              accountId: "123",
              email: "test+sign_up@permanent.org",
            },
          },
        },
      })
      .expect(500);
  });

  test("should return 500 error if database call fails", async () => {
    jest.spyOn(db, "sql").mockImplementation(() => {
      throw new Error("SQL error");
    });
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "create",
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(500);
  });

  test("should return 400 error if entity value is invalid", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "not_an_entity",
        action: "create",
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(400);
  });

  test("should return 400 error if action value is invalid", async () => {
    await agent
      .post("/api/v2/event")
      .send({
        entity: "account",
        action: "not_an_action",
        version: 1,
        entityId: "123",
        body: {},
      })
      .expect(400);
  });
});

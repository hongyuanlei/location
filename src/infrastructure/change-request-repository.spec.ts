import { createConnection, Connection } from "typeorm";
import { createChangeRequestRepository, SearchableChangeRequest } from "./change-request-repository";

/**
 * The description
 *
 * @group integration
 */
describe("change-request-repository", () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createConnection({
      type: "mysql",
      host: "database",
      port: 3306,
      username: "root",
      password: "password",
      database: "cms",
      entities: [SearchableChangeRequest],
    });
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("add change request", async () => {
    const location = {
      id: "1234",
      status: "ACTIVE",
      geoCoordinate: {
        latitude: 11.111,
        longitude: 121.111,
      },
      name: {
        displayName: {
          "en-GB": "BUILDING en-GB",
          "zh-CN": "BUILDING zh-CN",
          "zh-HK": "BUILDING zh-HK",
        },
      },
    };
    const createdAt = new Date("2021-06-06T12:00:00Z");
    const changeRequest = {
      location,
      creatorId: 1001,
      createdAt: createdAt,
      updatedAt: createdAt,
      status: "SUBMITTED" as any,
    };
    const changeRequestRepository = createChangeRequestRepository(connection);

    const result = await changeRequestRepository.add(changeRequest);

    expect(result.id).toEqual(expect.any(Number));
    expect(result.createdAt).toEqual(createdAt);
    expect(result.updatedAt).toEqual(createdAt);
    expect(result.creatorId).toEqual(1001);
    expect(result.approverId).toBeNull();
    expect(result.approvedAt).toBeNull();
    expect(result.declinedAt).toBeNull();
    expect(result.remark).toBeNull();
    expect(result.status).toEqual("SUBMITTED");
    expect(result.location).toEqual(location);
  });

  it("get latest change request by locationId", async () => {
    const location = {
      id: "1234",
      status: "ACTIVE",
      geoCoordinate: {
        latitude: 11.111,
        longitude: 121.111,
      },
      name: {
        displayName: {
          "en-GB": "BUILDING en-GB",
          "zh-CN": "BUILDING zh-CN",
          "zh-HK": "BUILDING zh-HK",
        },
      },
    };

    const changeRequest1 = {
      location,
      creatorId: 1001,
      createdAt: new Date("2021-06-06T12:00:00Z"),
      updatedAt: new Date("2021-06-06T12:00:00Z"),
      status: "APPROVED" as any,
    };

    const changeRequest2 = {
      location,
      creatorId: 1001,
      createdAt: new Date("2021-06-07T12:00:00Z"),
      updatedAt: new Date("2021-06-07T12:00:00Z"),
      status: "SUBMITTED" as any,
    };

    const changeRequestRepository = createChangeRequestRepository(connection);

    await changeRequestRepository.add(changeRequest1);
    await changeRequestRepository.add(changeRequest2);
    const result = await changeRequestRepository.getLatestByLocationId(location.id);

    expect(result.createdAt).toEqual(new Date("2021-06-07T12:00:00Z"));
    expect(result.location.id).toEqual(location.id);
  });
});

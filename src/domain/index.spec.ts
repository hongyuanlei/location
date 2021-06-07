import {
  createLocationChangeRequestService,
  ChangeRequest,
  ChangeRequestService,
  ChangeRequestRepository,
} from "./index";

it("should add location change request", async () => {
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

  const changeRequest = {
    location,
    userId: 1001,
  };

  const changeRequestRepository: ChangeRequestRepository = {
    getLatestByLocationId: jest.fn().mockResolvedValue(undefined),
    add: jest.fn().mockImplementation((changeRequest) =>
      Promise.resolve({
        id: 1,
        ...changeRequest,
      })
    ),
  };
  const changeRequestService: ChangeRequestService = createLocationChangeRequestService(changeRequestRepository);

  const result: ChangeRequest = await changeRequestService.add(changeRequest);

  expect(result.id).toEqual(1);
  expect(result.createdAt).toEqual(expect.any(Date));
  expect(result.updatedAt).toEqual(expect.any(Date));
  expect(result.createdAt === result.updatedAt).toBeTruthy();
  expect(result.approvedAt).toBeUndefined();
  expect(result.declinedAt).toBeUndefined();
  expect(result.remark).toBeUndefined();
  expect(result.status).toEqual("SUBMITTED");
  expect(result.location).toEqual(location);
});

it("should throw error when a location change request already exist and status is not APPROVED|REJECTED", async () => {
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

  const changeRequest = {
    location,
    userId: 1001,
  };

  const createdAt = new Date("2021-06-06T12:00:00Z");
  const changeRequestRepository: ChangeRequestRepository = {
    getLatestByLocationId: jest.fn().mockImplementation((locationId) =>
      Promise.resolve(
        new ChangeRequest({
          id: 1,
          location: {
            ...location,
          },
          creatorId: 1001,
          createdAt,
          updatedAt: createdAt,
          status: "SUBMITTED",
        })
      )
    ),
    add: jest.fn(),
  };
  const changeRequestService: ChangeRequestService = createLocationChangeRequestService(changeRequestRepository);

  await expect(changeRequestService.add(changeRequest)).rejects.toThrow(
    "Another change request of location not finished!"
  );
});

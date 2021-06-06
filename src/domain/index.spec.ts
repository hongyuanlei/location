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

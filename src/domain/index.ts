const add =
  (changeRequestRepository: ChangeRequestRepository) =>
  async (changeRequest: { userId: number; location: Location }): Promise<ChangeRequest> => {
    const { userId, location } = changeRequest;
    const latestChangeRequest: ChangeRequest = await changeRequestRepository.getLatestByLocationId(location.id);
    if (latestChangeRequest && !latestChangeRequest.isClosed()) {
      throw new Error("Another change request of location not finished!");
    }
    const createdAt = new Date();
    return changeRequestRepository.add({
      createdAt: createdAt,
      updatedAt: createdAt,
      status: "SUBMITTED",
      location: {
        ...location,
      },
      creatorId: userId,
    });
  };

export const createLocationChangeRequestService = (
  changeRequestRepository: ChangeRequestRepository
): ChangeRequestService => {
  return {
    add: add(changeRequestRepository),
  };
};

interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

interface MultiLanguages {
  "en-GB": string;
  "zh-HK"?: string;
  "zh-CN"?: string;
}

interface Name {
  displayName: MultiLanguages;
  slugifiedName?: MultiLanguages;
  newLaunchName?: MultiLanguages;
}

export interface Location {
  id: string;
  status: string;
  geoCoordinate?: GeoCoordinate;
  name: Name;
}

export interface ChangeRequestRepository {
  add: (changeRequest: {
    createdAt: Date;
    updatedAt: Date;
    status: "SUBMITTED";
    creatorId: number;
    location: Location;
  }) => Promise<ChangeRequest>;
  getLatestByLocationId: (locationId: string) => Promise<ChangeRequest>;
}

export interface ChangeRequestService {
  add: (changeRequest: { userId: number; location: Location }) => Promise<ChangeRequest>;
}

export class ChangeRequest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  declinedAt?: Date;
  remark?: string;
  status: "SUBMITTED";
  creatorId: number;
  approverId?: number;
  location: Location;

  constructor(value: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    approvedAt?: Date;
    declinedAt?: Date;
    remark?: string;
    status: "SUBMITTED";
    creatorId: number;
    approverId?: number;
    location: Location;
  }) {
    this.id = value.id;
    this.createdAt = value.createdAt;
    this.updatedAt = value.updatedAt;
    this.approvedAt = value.approvedAt;
    this.declinedAt = value.declinedAt;
    this.remark = value.remark;
    this.status = value.status;
    this.creatorId = value.creatorId;
    this.approverId = value.approverId;
    this.location = value.location;
  }

  public isClosed(): boolean {
    return ["APPROVED", "REJECTED"].includes(this.status);
  }
}

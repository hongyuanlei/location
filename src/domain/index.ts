export const createLocationChangeRequestService = (
  changeRequestRepository: ChangeRequestRepository
): ChangeRequestService => {
  return {
    add: (changeRequest) => {
      const createdAt = new Date();
      return changeRequestRepository.add({
        createdAt: createdAt,
        updatedAt: createdAt,
        status: "SUBMITTED",
        location: {
          ...changeRequest.location,
        },
        creatorId: changeRequest.userId,
      });
    },
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
}

export interface ChangeRequestService {
  add: (changeRequest: { userId: number; location: Location }) => Promise<ChangeRequest>;
}

export interface ChangeRequest {
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
}

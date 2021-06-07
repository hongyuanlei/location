import { ChangeRequestRepository, ChangeRequest, Location } from "../domain";
import { Connection, Repository, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "change_request" })
export class SearchableChangeRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "location_id" })
  locationId: string;

  @Column({ type: "json" })
  location: Location;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "creator_id" })
  creatorId: number;

  @Column({ name: "approver_id", nullable: true })
  approverId?: number;

  @Column({ name: "approved_at", nullable: true })
  approvedAt?: Date;

  @Column({ name: "declined_at", nullable: true })
  declinedAt?: Date;

  @Column({ nullable: true })
  remark?: string;

  @Column()
  status: "SUBMITTED";
}

const add =
  (respository: Repository<SearchableChangeRequest>) =>
  async (changeRequest: {
    createdAt: Date;
    updatedAt: Date;
    status: "SUBMITTED";
    creatorId: number;
    location: Location;
  }): Promise<ChangeRequest> => {
    const { createdAt, updatedAt, status, creatorId, location } = changeRequest;

    const searableChangeRequest = await respository.save({
      locationId: location.id,
      location,
      createdAt,
      updatedAt,
      creatorId,
      status,
    });
    return new ChangeRequest(searableChangeRequest);
  };

export const createChangeRequestRepository = (connection: Connection): ChangeRequestRepository => {
  const repository: Repository<SearchableChangeRequest> = connection.getRepository(SearchableChangeRequest);
  return {
    add: add(repository),
    getLatestByLocationId: (locationId: string) => Promise.resolve(undefined),
  };
};

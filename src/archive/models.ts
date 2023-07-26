export interface Tag {
  tagId: string;
  name: string;
  archiveId: string;
  status: string;
  type: string;
  createdDt: Date;
  updatedDt: Date;
}

export interface AccountStorage {
  accountSpaceId: string;
  accountId: string;
  spaceLeft: string;
  spaceTotal: string;
  filesLeft: string;
  filesTotal: string;
  status: string;
  type: string;
  createdDt: Date;
  updatedDt: Date;
}

import createError from "http-errors";
import { logger } from "@stela/logger";
import { db } from "../database";
import type { ArchiveRecord } from "./models";

export const getRecordById = async (requestQuery: {
  recordIds: string[];
}): Promise<ArchiveRecord[]> => {
  const record = await db
    .sql<ArchiveRecord>("record.queries.get_record_by_id", {
      recordIds: requestQuery.recordIds,
    })
    .catch((err) => {
      logger.error(err);
      throw new createError.InternalServerError(
        "failed to retrieve featured archives"
      );
    });
  return record.rows;
};

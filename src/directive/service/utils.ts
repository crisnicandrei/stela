import createError from "http-errors";
import { db } from "../../database";

interface HasAccessResult {
  hasAccess: boolean;
}

export const confirmArchiveOwnership = async (
  archiveId: number,
  email: string
): Promise<void> => {
  const accessResult = await db.sql<HasAccessResult>(
    "directive.queries.check_archive_ownership",
    {
      archiveId,
      email,
    }
  );
  if (!accessResult.rows[0] || !accessResult.rows[0].hasAccess) {
    throw new createError.NotFound("Archive not found");
  }
};

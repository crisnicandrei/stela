INSERT INTO
  featured_archive (archive_id)
(
  SELECT
    archiveId
  FROM
    archive
  WHERE
    archiveId = :archiveId
    AND public IS NOT NULL
    AND public = 1
)
ON CONFLICT DO NOTHING
RETURNING archive_id;
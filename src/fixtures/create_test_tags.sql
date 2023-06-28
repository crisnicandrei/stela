INSERT INTO
  tag (tagId, name, archiveId, status, type, createdDt, updatedDt)
VALUES
  (1, 'test_public_file', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'test_private_file', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'test_future_public_file', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'test_deleted_file', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 'test_deleted_tag', 1, 'status.generic.deleted', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 'test_deleted_link', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 'test_public_file_in_other_archive', 2, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 'test_public_folder', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, 'test_private_folder', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, 'test_future_public_folder', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (11, 'test_deleted_folder', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (12, 'test_public_folder_in_other_archive', 2, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (13, 'test_unused_tag', 1, 'status.generic.ok', 'type.generic.placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

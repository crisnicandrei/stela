import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { adminService } from "./service";
import { verifyAdminAuthentication } from "../middleware";
import {
  validateRecalculateFolderThumbnailsRequest,
  validateAccountSetNullSubjectsRequest,
} from "./validators";
import { isValidationError } from "../validators/validator_util";

export const adminController = Router();
adminController.post(
  "/folder/recalculate_thumbnails",
  verifyAdminAuthentication,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      validateRecalculateFolderThumbnailsRequest(req.body);
      const results = await adminService.recalculateFolderThumbnails(
        req.body.beginTimestamp,
        req.body.endTimestamp
      );
      if (results.failedFolders.length > 0) {
        res.status(500).json(results);
      } else {
        res.json(results);
      }
    } catch (err) {
      if (isValidationError(err)) {
        res.status(400).json({ error: err });
        return;
      }
      next(err);
    }
  }
);

adminController.post(
  "/account/set_null_subjects",
  verifyAdminAuthentication,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      validateAccountSetNullSubjectsRequest(req.body);
      const response = await adminService.setNullAccountSubjects(
        req.body.accounts
      );
      res.json(response);
    } catch (err) {
      if (isValidationError(err)) {
        res.status(400).json({ error: err });
        return;
      }
      next(err);
    }
  }
);

import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { verifyUserAuthentication } from "../middleware";
import {
  validateUpdateTagsRequest,
  validateBodyFromAuthentication,
} from "./validators";
import { isValidationError } from "../validators/validator_util";
import { accountService } from "./service";

export const accountController = Router();
accountController.put(
  "/tags",
  verifyUserAuthentication,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      validateUpdateTagsRequest(req.body);
      await accountService.updateTags(req.body);
      res.json({});
    } catch (err) {
      if (isValidationError(err)) {
        res.status(400).json({ error: err });
        return;
      }
      next(err);
    }
  }
);
accountController.get(
  "/signup",
  verifyUserAuthentication,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      validateBodyFromAuthentication(req.body);
      const signupDetails = await accountService.getSignupDetails(
        req.body.emailFromAuthToken
      );
      res.json(signupDetails);
    } catch (err) {
      if (isValidationError(err)) {
        res.status(400).json({ error: err });
        return;
      }
      next(err);
    }
  }
);

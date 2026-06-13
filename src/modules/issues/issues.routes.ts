import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { IssueController } from "./issues.controller";

const router = Router();

router.post(
  "/",
  auth("contributor", "maintainer"),
  IssueController.createIssue,
);

router.get("/", IssueController.getAllIssues);
router.get("/:id", IssueController.getSingleIssue);
router.patch(
  "/:id",
  auth("contributor", "maintainer"),
  IssueController.updateIssue,
);

router.delete("/:id", auth("maintainer"), IssueController.deleteIssue);
router.patch(
  "/:id/status",
  auth("maintainer"),
  IssueController.updateIssueStatus,
);

export const IssueRoutes = router;

import { Request, Response } from "express";
import { IssueService } from "./issue.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createIssue = catchAsync(async (req, res) => {
  const result = await IssueService.createIssue(req.body, req.user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Issue created successfully",
    data: result,
  });
});

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;

    const result = await IssueService.getAllIssues(
      sort as string,
      type as string,
      status as string,
    );

    res.status(200).json({
      success: true,
      message: "Issues retrived successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const result = await IssueService.getSingleIssue(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const result = await IssueService.updateIssue(
      Number(req.params.id),
      req.body,
      req.user,
    );

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(409).json({
      success: false,
      message,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    await IssueService.deleteIssue(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(404).json({
      success: false,
      message,
    });
  }
};
const updateIssueStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["open", "in_progress", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be open, in_progress, or resolved",
      });
    }

    const result = await IssueService.updateIssueStatus(
      Number(req.params.id),
      status,
    );

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(404).json({
      success: false,
      message,
    });
  }
};
export const IssueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
  updateIssueStatus,
};

import { pool } from "../../config/db";
import { IIssue } from "./issue.interface";

const createIssue = async (payload: IIssue, reporterId: number) => {
  const query = `
    INSERT INTO issues(
      title,
      description,
      type,
      reporter_id
    )
    VALUES($1,$2,$3,$4)
    RETURNING *
  `;

  const values = [payload.title, payload.description, payload.type, reporterId];

  const result = await pool.query(query, values);

  return result.rows[0];
};


const getAllIssues = async (
  sort = "newest",
  type?: string,
  status?: string,
) => {
  let query = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issuesResult = await pool.query(query, values);

  const issues = issuesResult.rows;

  if (!issues.length) return [];

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const usersResult = await pool.query(
    `SELECT id,name,role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  const usersMap = new Map();

  usersResult.rows.forEach((user) => {
    usersMap.set(user.id, user);
  });

  return issues.map((issue) => ({
    ...issue,
    reporter: usersMap.get(issue.reporter_id),
  }));
};

const getSingleIssue = async (id: number) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);

  if (!issueResult.rows.length) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  const userResult = await pool.query(
    `SELECT id,name,role FROM users WHERE id=$1`,
    [issue.reporter_id],
  );

  return {
    ...issue,
    reporter: userResult.rows[0],
  };
};


const updateIssue = async (
  issueId: number,
  payload: Partial<IIssue>,
  user: any,
) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    issueId,
  ]);

  if (!issueResult.rows.length) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error("You can only update your own issue");
    }

    if (issue.status !== "open") {
      throw new Error("Cannot update non-open issue");
    }
  }

  const result = await pool.query(
    `
      UPDATE issues
      SET
        title=$1,
        description=$2,
        type=$3,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$4
      RETURNING *
    `,
    [
      payload.title ?? issue.title,
      payload.description ?? issue.description,
      payload.type ?? issue.type,
      issueId,
    ],
  );

  return result.rows[0];
};

const deleteIssue = async (issueId: number) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id=$1 RETURNING *`,
    [issueId],
  );

  if (!result.rows.length) {
    throw new Error("Issue not found");
  }

  return true;
};
const updateIssueStatus = async (
  issueId: number,
  status: "open" | "in_progress" | "resolved",
) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    issueId,
  ]);

  if (!issueResult.rows.length) {
    throw new Error("Issue not found");
  }

  const result = await pool.query(
    `
      UPDATE issues
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
    [status, issueId],
  );

  return result.rows[0];
};
export const IssueService = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
  updateIssueStatus,
};

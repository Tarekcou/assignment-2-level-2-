import express from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { IssueRoutes } from "./modules/issues/issues.routes";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("DevPulse API Running");
});
app.use("/api/auth", AuthRoutes);
app.use("/api/issues", IssueRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});
app.use(globalErrorHandler);
export default app;

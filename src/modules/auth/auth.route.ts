import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/user", auth("contributor", "maintainer"), (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
export const AuthRoutes = router;

import { Router } from "express";
import { signup, login } from "./auth.controller";
import { refreshAccessToken } from "./refreshToken.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
export default router;

import { Router } from "express";
import { authenticate, AuthRequest } from "../modules/auth/auth.middleware";
import { authorize } from "../modules/auth/role.middleware";
import { Response } from "express";

const router = Router();

// Test route for JWT + RBAC
router.get("/protected", authenticate, authorize("admin","employee"), (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: "JWT and role middleware working fine!",
    user: req.user,
  });
});

export default router;

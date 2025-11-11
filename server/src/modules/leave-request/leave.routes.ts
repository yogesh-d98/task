import express from "express";
import {
  applyLeave,
  viewLeaves,
  editLeave,
  cancelLeave,
} from "./leave.controller"
// import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../auth/role.middleware";
import { authenticate } from "../auth/auth.middleware";

const router = express.Router();

/**
   POST /api/leave/apply
    Apply for a leave (Employee only)
 */
router.post("/apply", authenticate, authorize("employee"), applyLeave);

/**
  GET /api/leave/view
    View leaves (Employee → own leaves, Admin → all)
 */
router.get("/view",authenticate, authorize("employee", "admin"), viewLeaves);

/**
   PUT /api/leave/edit/:id
     Edit pending leave (Employee only)
 */
router.put("/edit/:id",authenticate, authorize("employee"), editLeave);

/**
  DELETE /api/leave/cancel/:id
    Cancel leave (Employee only)
 */
router.delete("/cancel/:id",authenticate, authorize("employee"), cancelLeave);

export default router;

import { Router } from "express";
// import { authenticate, authorize } from "../middleware/auth.middleware";
import { authenticate } from "../auth/auth.middleware";
import { authorize } from "../auth/role.middleware";
import {
  filterLeaves,
  approveLeave,
  rejectLeave,
  getAdminDashboard,
} from "../admin/adminLeaveManage.controller";

const router = Router();



// Filter leaves by employee name, leave type, or status
router.get("/filter", authenticate, authorize("admin"), filterLeaves);

// Approve or Reject leave
router.put("/:id/approve", authenticate, authorize("admin"), approveLeave);
router.put("/:id/reject", authenticate, authorize("admin"), rejectLeave);

// Dashboard summary
router.get("/dashboard/summary", authenticate, authorize("admin"), getAdminDashboard);

export default router;

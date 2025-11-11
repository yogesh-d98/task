import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import testRoutes from "./test.routes";
import leaveRoutes from "../modules/leave-request/leave.routes";
import adminLeaveAccessRoutes from '../modules/admin/leaveAdminAcess.routes';
const router = Router();

router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/leave",leaveRoutes);
router.use('/admin-leave',adminLeaveAccessRoutes);
export default router;

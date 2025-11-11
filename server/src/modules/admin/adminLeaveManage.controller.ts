import { Request, Response } from "express";
import { LeaveModel } from "../leave-request/leave.model"
import UserModel from "../auth/auth.model"; // assuming User model exists
import { sendResponse } from "../../utils/response";


//TODO: FILTER BY NAME DROP DOWN CONFIRMATION
// 1️⃣ Filter leaves
export const filterLeaves = async (req: Request, res: Response) => {
  try {
    const { employeeName, leaveType, status } = req.query;
    const query: any = { isDeleted: false };

    // If filters provided, add dynamically
    if (leaveType) query.leaveType = leaveType;
    if (status) query.status = status;

    // If filtering by employee name, lookup by User collection
    if (employeeName) {
      const employees = await UserModel.find({
        name: { $regex: employeeName as string, $options: "i" },
      }).select("_id");

      query.employeeId = { $in: employees.map((emp) => emp._id) };
    }

    const leaves = await LeaveModel.find(query)
      .populate("employeeId", "name email role")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, "Filtered leaves fetched successfully", leaves);
  } catch (error: any) {
    return sendResponse(res, 500, "Failed to filter leaves", error.message);
  }
};
export const approveLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const leave = await LeaveModel.findOne({ _id: id, isDeleted: false });
    if (!leave) return sendResponse(res, 404, "Leave not found");

    if (leave.status !== "Pending") {
      return sendResponse(res, 400, "Only pending leaves can be approved");
    }

    leave.status = "Approved";
    await leave.save();

    return sendResponse(res, 200, "Leave approved successfully", leave);
  } catch (error: any) {
    return sendResponse(res, 500, "Failed to approve leave", error.message);
  }
};
export const rejectLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const leave = await LeaveModel.findOne({ _id: id, isDeleted: false });
    if (!leave) return sendResponse(res, 404, "Leave not found");

    if (leave.status !== "Pending") {
      return sendResponse(res, 400, "Only pending leaves can be rejected");
    }

    leave.status = "Rejected";
    await leave.save();

    return sendResponse(res, 200, "Leave rejected successfully", leave);
  } catch (error: any) {
    return sendResponse(res, 500, "Failed to reject leave", error.message);
  }
};
export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const totalEmployees = await UserModel.countDocuments({ role: "employee" }); //COUNT DOCUMENTS MONGOOSE QUERY TO COUNT THE NO OF DOCUMENTS MATCHES THE FILTER
    const totalLeaves = await LeaveModel.countDocuments({ isDeleted: false });
    const pendingLeaves = await LeaveModel.countDocuments({ status: "Pending", isDeleted: false });
    const approvedLeaves = await LeaveModel.countDocuments({ status: "Approved", isDeleted: false });
    const rejectedLeaves = await LeaveModel.countDocuments({ status: "Rejected", isDeleted: false });

    const summary = {
      totalEmployees,
      totalLeaves,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
    };

    return sendResponse(res, 200, "Dashboard summary fetched successfully", summary);
  } catch (error: any) {
    return sendResponse(res, 500, "Failed to get dashboard summary", error.message);
  }
};

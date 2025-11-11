import { Request, Response } from "express";
import { LeaveModel } from "./leave.model";
import { createLeaveSchema, updateLeaveSchema } from "./leave.validation";
import { sendResponse } from "../../utils/response";
import { z, ZodError } from "zod";
import { AuthRequest } from "../auth/auth.middleware";

//  Apply for Leave
export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createLeaveSchema.parse(req.body);
    const { id } = req.user!;

    const newLeave = await LeaveModel.create({
      employeeId: id,
      ...parsed,
    });

    return sendResponse(res, 201, "Leave applied successfully", newLeave);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const messages = error.issues.map((issue) => issue.message).join(", ");
      return sendResponse(res, 400, messages);
    }
    return sendResponse(res, 500, "Internal server error", error.message);
  }
};

// ✅ View Leaves (Employee sees own, Admin sees all)
export const viewLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const { id, role } = req.user!;
    console.log(req.user)
    const filter = role === "employee" ? { employeeId: id, isDeleted: false } : { isDeleted: false };
    console.log(filter, 'filter employee details')
    const leaves = await LeaveModel.find(filter).sort({ createdAt: -1 });

    return sendResponse(res, 200, "Leaves fetched successfully", leaves);
  } catch (error: any) {
    return sendResponse(res, 500, "Failed to fetch leaves", error.message);
  }
};

// ✅ Edit Leave (only if pending)
export const editLeave = async (req: AuthRequest, res: Response) => {
  try {
    const { id: loggedInEmployeeId } = req.user!; 
    const leaveId = req.params.id;

    
    const leave = await LeaveModel.findOne({ _id: leaveId, isDeleted: false });
    if (!leave) return sendResponse(res, 404, "Leave not found");

    // Validate employee ownership => another employee should not edit the employee already created a req -> secondary validation
    if (leave.employeeId.toString() !== loggedInEmployeeId.toString()) {
      return sendResponse(res, 403, "Unauthorized: You cannot edit another employee's leave");
    }

    // 3️⃣ Only pending leaves can be edited
    if (leave.status !== "Pending") {
      return sendResponse(res, 400, "Cannot edit non-pending leave");
    }

    // 4️⃣ Validate and update data
    const parsed = updateLeaveSchema.parse(req.body);
    Object.assign(leave, parsed);
    await leave.save();

    return sendResponse(res, 200, "Leave updated successfully", leave);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const messages = error.issues.map((issue) => issue.message).join(", ");
      return sendResponse(res, 400, messages);
    }
    return sendResponse(res, 500, "Failed to update leave", error.message);
  }
};

// ✅ Cancel Leave
export const cancelLeave = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.user!;
    const leaveId = req.params.id;

    const leave = await LeaveModel.findOne({ _id: leaveId, employeeId: id, isDeleted: false });
    if (!leave) return sendResponse(res, 404, "Leave not found");

    if (["Approved", "Rejected"].includes(leave.status))
      return sendResponse(res, 400, "Cannot cancel approved or rejected leave");

    leave.status = "Cancelled";
    leave.isDeleted = true;
    await leave.save();

    return sendResponse(res, 200, "Leave cancelled successfully", leave);
  } catch (error: any) {
    return sendResponse(res, 500, "Failed to cancel leave", error.message);
  }
};

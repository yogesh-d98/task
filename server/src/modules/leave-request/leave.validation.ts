import { z } from "zod";

export const createLeaveSchema = z.object({
  leaveType: z.string().min(1, "Leave type is required"),
  fromDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid fromDate",
  }),
  toDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid toDate",
  }),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
});

export const updateLeaveSchema = z.object({
  leaveType: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  reason: z.string().optional(),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>;

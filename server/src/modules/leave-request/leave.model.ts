import { Schema, model, Document } from "mongoose";

export interface ILeave extends Document {
  employeeId: Schema.Types.ObjectId;
  leaveType: 'Sick' | 'Paid' | 'Casual' | 'Mandatory';
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  isDeleted: boolean;
}

const leaveSchema = new Schema<ILeave>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    leaveType: { type: String, enum: ["Sick", "Paid", "Casual", "Mandatory"],
      default: "Casual"},
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const LeaveModel = model<ILeave>("Leave", leaveSchema);

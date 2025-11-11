import React, { useState } from "react";
import Header from "../../components/Header";
import { useGetEmployeeDashboardSummaryQuery, useCancelLeaveRequestMutation, useApplyLeaveMutation } from "../../api/employeeLeaveApi";
// import { isSession } from "react-router-dom";
const Home = () => {

  const {
    data: employeeData,
    isLoading: employeeLeaveDataLoading,
    isSuccess,
    refetch,
  } = useGetEmployeeDashboardSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,  // unmount the component so that when another user logged in then the previous cached data will removed and current data will be shown
  });
  const [applyLeave, { isLoading: isApplying }] = useApplyLeaveMutation();

  const [cancelLeave, { isLoading: isCancelling }] = useCancelLeaveRequestMutation({});
  console.log(employeeData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  console.log(isSuccess, 'success loading')
  if (employeeLeaveDataLoading) return <p className="p-4">Loading...</p>;

  // handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submitting leave request form:
  // submitting leave request form:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await applyLeave(formData).unwrap();
      alert("Leave Request Submitted Successfully!");
      setFormData({ leaveType: "", fromDate: "", toDate: "", reason: "" });
      setShowForm(false);
    } catch (err: any) {
      console.error("Leave apply failed:", err);
      alert("Failed to apply leave. Please try again.");
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this leave?")) {
      try {
        await cancelLeave(id).unwrap();
        alert("Leave cancelled successfully!");
      } catch (err) {
        console.error("Approval failed:", err);
        alert("Failed to approve leave");
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Employee Dashboard</h2>


        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Leave Request
        </button>

        {/* Popup Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add Leave Request</h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Leave Type</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="border w-full rounded px-3 py-1 mt-1"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Casual">Casual</option>
                    <option value="Sick">Sick</option>
                    <option value="Paid">Paid</option>
                    <option value="Mandatory">Mandatory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    className="border w-full rounded px-3 py-1 mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    className="border w-full rounded px-3 py-1 mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="border w-full rounded px-3 py-1 mt-1"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  >
                    {isApplying ? "Submitting..." : "Submit"}
                  </button>

                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <span className="text-xl font-semibold mb-4">Leave Details</span>
      {!employeeLeaveDataLoading && isSuccess && //added a conditional check to load the table only the states gets loaded completely
        <table className="w-full text-left text-sm">

          <thead className="bg-gray-200 ">
            <tr>

              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">From</th>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2">Actions</th>

            </tr>
          </thead>
          <tbody>
            {employeeData?.result?.length ? (
              employeeData.result.map((employeeLeaveData: any) => (

                <tr key={employeeLeaveData._id} className="border-t">

                  {/* <td className="px-3 py-2">{employeeLeaveData.employeeId?.name || "N/A"}</td> */}
                  <td className="px-3 py-2">{employeeLeaveData.leaveType}</td>
                  <td className="px-3 py-2">
                    {new Date(employeeLeaveData.fromDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(employeeLeaveData.toDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{employeeLeaveData.status}</td>
                  <td className="px-3 py-2">{employeeLeaveData.reason}</td>

                  <td>
                    {employeeLeaveData.status === "Pending" &&
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                        // onClick={() => handleApprove(leave._id)}
                        // disabled={isRejecting}
                        >Edit</button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                          onClick={() => handleCancel(employeeLeaveData._id)}
                          disabled={isCancelling}
                        >Cancel</button>
                      </>}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-3 text-gray-500">
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      }
    </div>
  );
};

export default Home;

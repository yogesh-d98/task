import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQuery'; // same as in your authApi
// import type { LeaveResponse, DashboardSummary } from '../types';
import type { EmployeeDashboardSummary } from '../types/employeeLeaveAccess';
export const employeeLeaveApi = createApi({
    reducerPath: 'employeeLeaveApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['EmployeeLeaves'],
    endpoints: (builder) => ({


        getEmployeeDashboardSummary: builder.query<EmployeeDashboardSummary, void>({
            query: () => ({ url: '/leave/view', method: 'GET' }),
            providesTags: ['EmployeeLeaves'],
        }),
        cancelLeaveRequest: builder.mutation<EmployeeDashboardSummary, string>({
            query: (leaveId) => ({
                url: `leave/cancel/${leaveId}`,
                //  `/admin-leave/${leaveId}/approve`,
                method: 'DELETE',
            }),
            invalidatesTags: ['EmployeeLeaves'],
        }),
        // Apply new leave
        applyLeave: builder.mutation<any, Record<string, any>>({
            query: (newLeaveData) => ({
                url: "/leave/apply",
                method: "POST",
                body: newLeaveData,
            }),
            invalidatesTags: ["EmployeeLeaves"],
        }),
        editLeave: builder.mutation<any, { id: string; data: Record<string, any> }>({
            query: ({ id, data }) => ({
                url: `/leave/edit/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["EmployeeLeaves"],
        }),

    }),
});

export const {
    useGetEmployeeDashboardSummaryQuery,
    useCancelLeaveRequestMutation,
    useApplyLeaveMutation,
    useEditLeaveMutation
} = employeeLeaveApi;

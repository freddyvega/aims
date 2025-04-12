"use client";

import React, { useState } from "react";
import { FaUser, FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AuditPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data for audit logs
  const auditLogs = [
    {
      id: 1,
      timestamp: "2024-02-20T14:30:00Z",
      user: "John Smith",
      action: "Created Agent",
      component: "Customer Service Bot",
    },
    {
      id: 2,
      timestamp: "2024-02-20T13:45:00Z",
      user: "Sarah Johnson",
      action: "Updated Risk",
      component: "Fraud Detection System",
    },
    {
      id: 3,
      timestamp: "2024-02-20T12:15:00Z",
      user: "Michael Chen",
      action: "Modified Policy",
      component: "AI Ethics Policy",
    },
    {
      id: 4,
      timestamp: "2024-02-20T11:30:00Z",
      user: "Emily Davis",
      action: "Created Risk",
      component: "Content Recommendation Engine",
    },
    {
      id: 5,
      timestamp: "2024-02-20T10:45:00Z",
      user: "David Wilson",
      action: "Updated Agent",
      component: "Document Classification System",
    },
    {
      id: 6,
      timestamp: "2024-02-20T09:30:00Z",
      user: "Lisa Brown",
      action: "Approved Policy",
      component: "Data Privacy Framework",
    },
    {
      id: 7,
      timestamp: "2024-02-19T16:20:00Z",
      user: "Robert Taylor",
      action: "Created Agent",
      component: "Image Recognition System",
    },
    {
      id: 8,
      timestamp: "2024-02-19T15:10:00Z",
      user: "Jennifer Lee",
      action: "Updated Risk",
      component: "Predictive Maintenance AI",
    },
    {
      id: 9,
      timestamp: "2024-02-19T14:05:00Z",
      user: "James Miller",
      action: "Modified Policy",
      component: "Model Development Guidelines",
    },
    {
      id: 10,
      timestamp: "2024-02-19T13:00:00Z",
      user: "Patricia White",
      action: "Created Risk",
      component: "Customer Service Bot",
    },
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track all changes and activities in the AIMS platform
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <FaHistory className="text-primary-600 text-xl mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatTimestamp(log.timestamp)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{log.user}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.component}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                  <span className="font-medium">50</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
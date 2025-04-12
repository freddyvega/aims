import React from "react";
import { FaFileAlt, FaCheck, FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function CompliancePage() {
  // Dummy data for ISO 42001 clauses
  const clauses = [
    {
      id: "5.3",
      summary: "AI Policy and Objectives",
      status: "Met",
      evidence: "AI Policy Document v2.1",
    },
    {
      id: "5.4",
      summary: "Roles, Responsibilities, and Authorities",
      status: "Partial",
      evidence: "RACI Matrix v1.0",
    },
    {
      id: "6.1",
      summary: "Actions to Address Risks and Opportunities",
      status: "Gap",
      evidence: "Not Available",
    },
    {
      id: "6.2",
      summary: "AI Objectives and Planning to Achieve Them",
      status: "Met",
      evidence: "Strategic Plan 2024",
    },
    {
      id: "7.1",
      summary: "Resources",
      status: "Partial",
      evidence: "Resource Allocation Plan",
    },
    {
      id: "7.2",
      summary: "Competence",
      status: "Met",
      evidence: "Training Records 2024",
    },
    {
      id: "7.3",
      summary: "Awareness",
      status: "Gap",
      evidence: "Not Available",
    },
    {
      id: "7.4",
      summary: "Communication",
      status: "Partial",
      evidence: "Communication Plan Draft",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Met":
        return <FaCheck className="text-green-500" />;
      case "Partial":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "Gap":
        return <FaTimes className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Met":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      case "Gap":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">ISO 42001 Compliance Status</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage compliance with ISO 42001 requirements
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clause ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evidence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clauses.map((clause) => (
                <tr key={clause.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{clause.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{clause.summary}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(clause.status)}`}>
                        {getStatusIcon(clause.status)}
                        <span className="ml-1">{clause.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                        clause.evidence === "Not Available"
                          ? "text-gray-600 bg-gray-100 hover:bg-gray-200"
                          : "text-primary-600 bg-primary-50 hover:bg-primary-100"
                      }`}
                    >
                      <FaFileAlt className="mr-2" />
                      {clause.evidence}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
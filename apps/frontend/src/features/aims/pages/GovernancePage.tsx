"use client";

import React from 'react';
import { FaGavel, FaFileAlt, FaCheck, FaClock, FaEdit } from 'react-icons/fa';
import { FaRobot } from 'react-icons/fa';

export default function GovernancePage() {
  // Dummy data for governance policies
  const policies = [
    {
      id: 1,
      name: "AI Ethics Policy",
      type: "Org-wide",
      lastUpdated: "2024-02-15",
      status: "Approved",
      linkedAgents: ["Customer Service Bot", "Content Recommendation Engine", "Document Classification System"],
    },
    {
      id: 2,
      name: "Data Privacy Framework",
      type: "Org-wide",
      lastUpdated: "2024-02-10",
      status: "Review Needed",
      linkedAgents: ["Content Recommendation Engine", "Fraud Detection System"],
    },
    {
      id: 3,
      name: "Model Development Guidelines",
      type: "Project-level",
      lastUpdated: "2024-01-28",
      status: "Approved",
      linkedAgents: ["Predictive Maintenance AI", "Image Recognition System"],
    },
    {
      id: 4,
      name: "AI System Monitoring Protocol",
      type: "Org-wide",
      lastUpdated: "2024-02-01",
      status: "Draft",
      linkedAgents: ["All Systems"],
    },
    {
      id: 5,
      name: "Bias Mitigation Framework",
      type: "Project-level",
      lastUpdated: "2024-02-05",
      status: "Approved",
      linkedAgents: ["Customer Service Bot", "Content Recommendation Engine"],
    },
    {
      id: 6,
      name: "AI System Documentation Standards",
      type: "Org-wide",
      lastUpdated: "2024-01-20",
      status: "Review Needed",
      linkedAgents: ["All Systems"],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <FaCheck className="text-green-500" />;
      case "Review Needed":
        return <FaClock className="text-yellow-500" />;
      case "Draft":
        return <FaEdit className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Review Needed":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Org-wide" 
      ? "bg-purple-100 text-purple-800" 
      : "bg-indigo-100 text-indigo-800";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Governance Policies</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track AI governance policies across the organization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FaGavel className="text-primary-600 text-xl mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{policy.name}</h3>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                  {getStatusIcon(policy.status)}
                  <span className="ml-1">{policy.status}</span>
                </span>
              </div>

              <div className="mt-4 flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(policy.type)}`}>
                  {policy.type}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  Updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Linked Agents</h4>
                <div className="flex flex-wrap gap-2">
                  {policy.linkedAgents.map((agent, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <FaRobot className="mr-1" />
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
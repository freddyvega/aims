"use client";

import React, { useState } from "react";
import { FaExclamationTriangle, FaRobot, FaFilter } from "react-icons/fa";

export default function RisksPage() {
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dummy data for AI risks
  const risks = [
    {
      id: 1,
      area: "Bias",
      description: "Potential bias in customer service chatbot responses affecting certain demographic groups",
      severity: "High",
      status: "Open",
      agentName: "Customer Service Bot",
    },
    {
      id: 2,
      area: "Explainability",
      description: "Limited transparency in fraud detection system's decision-making process",
      severity: "Medium",
      status: "Mitigating",
      agentName: "Fraud Detection System",
    },
    {
      id: 3,
      area: "Data Privacy",
      description: "Risk of personal data exposure in content recommendation system",
      severity: "High",
      status: "Open",
      agentName: "Content Recommendation Engine",
    },
    {
      id: 4,
      area: "Performance",
      description: "Potential degradation in document classification accuracy over time",
      severity: "Medium",
      status: "Mitigating",
      agentName: "Document Classification System",
    },
    {
      id: 5,
      area: "Security",
      description: "Vulnerability to adversarial attacks in image recognition system",
      severity: "High",
      status: "Open",
      agentName: "Image Recognition System",
    },
    {
      id: 6,
      area: "Compliance",
      description: "Need to update AI system documentation for new regulatory requirements",
      severity: "Low",
      status: "Closed",
      agentName: "Predictive Maintenance AI",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800";
      case "Mitigating":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Risk Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage risks associated with AI systems
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="flex items-center">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Mitigating">Mitigating</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{risk.area}</h3>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                  {risk.severity}
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-600">{risk.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(risk.status)}`}>
                  {risk.status}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FaRobot className="mr-1" />
                  {risk.agentName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
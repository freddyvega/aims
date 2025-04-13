"use client";

import React, { useState, useEffect } from "react";
import { FaFileAlt, FaCheck, FaExclamationTriangle, FaTimes, FaFilter, FaEdit } from "react-icons/fa";
import { getClauses, updateClause, Clause, CreateClauseDto, UpdateClauseDto, UI_TO_API_STATUS, API_TO_UI_STATUS } from "../services/aims-api";
import { toast } from "@/libs/toast";


// ClauseModal component
interface ClauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clause: UpdateClauseDto, clauseId: string) => void;
  clause?: Clause;
}

function ClauseModal({ isOpen, onClose, onSubmit, clause }: ClauseModalProps) {
  const [formData, setFormData] = useState<{
    status: string;
    evidenceLink: string;
  }>({
    status: 'Met',
    evidenceLink: ''
  });

  // Reset form when modal opens/closes or clause changes
  useEffect(() => {
    if (isOpen && clause) {
      setFormData({
        status: API_TO_UI_STATUS[clause.status as keyof typeof API_TO_UI_STATUS],
        evidenceLink: clause.evidenceLink || ''
      });
    }
  }, [isOpen, clause]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map UI status to API status format
    const apiStatus = UI_TO_API_STATUS[formData.status as keyof typeof UI_TO_API_STATUS] || 'pending';
    
    // Prepare update payload with only status and evidenceLink
    const updatePayload: UpdateClauseDto = {
      status: apiStatus as 'pending' | 'gap' | 'compliant' | 'non_compliant',
      evidenceLink: formData.evidenceLink || null
    };
    
    if (clause) {
      onSubmit(updatePayload, clause.id);
    }
  };

  if (!isOpen || !clause) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Update Compliance Status
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Clause ID
            </label>
            <input
              type="text"
              value={clause.id}
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={clause.title}
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={clause.description}
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
              rows={3}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="Met">Met</option>
              <option value="Partial">Partial</option>
              <option value="Gap">Gap</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="evidenceLink">
              Evidence Link
            </label>
            <input
              type="text"
              id="evidenceLink"
              name="evidenceLink"
              value={formData.evidenceLink || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Link to Evidence"
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [filteredClauses, setFilteredClauses] = useState<Clause[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentClause, setCurrentClause] = useState<Clause | undefined>(undefined);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const fetchClauses = async () => {
    try {
      setLoading(true);
      const data = await getClauses();
      setClauses(data);
      setFilteredClauses(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching clauses:", err);
      setError("Failed to load clauses. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClauses();
  }, []);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredClauses([...clauses].sort((a, b) => a.sortOrder - b.sortOrder));
    } else {
      const apiStatus = UI_TO_API_STATUS[statusFilter];
      const filtered = clauses.filter(clause => clause.status === apiStatus);
      setFilteredClauses(filtered.sort((a, b) => a.sortOrder - b.sortOrder));
    }
  }, [statusFilter, clauses]);

  const handleEditClause = (clause: Clause) => {
    setCurrentClause(clause);
    setIsModalOpen(true);
    setSubmitError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmitError(null);
  };

  const handleSubmitClause = async (formData: UpdateClauseDto, clauseId: string) => {
    try {
      setSubmitLoading(true);
      setSubmitError(null);

      await updateClause(clauseId, formData);
      
      // Close modal and refresh data
      setIsModalOpen(false);
      await fetchClauses();
      
      // Show success notification
      toast.success("Clause updated");
      
    } catch (err) {
      console.error("Error submitting clause:", err);
      setSubmitError("Failed to save clause. Please try again.");
      toast.error("Failed to update clause");
    } finally {
      setSubmitLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">ISO 42001 Compliance Status</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Track and manage compliance with ISO 42001 requirements
                </p>
              </div>
              <div className="flex items-center">
                <div className="relative inline-block">
                  <div className="flex items-center space-x-2">
                    <FaFilter className="text-gray-500" />
                    <select
                      className="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Met">Met</option>
                      <option value="Partial">Partial</option>
                      <option value="Gap">Gap</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clause ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evidence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Linked Agents
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClauses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No clauses found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredClauses.map((clause) => (
                    <tr key={clause.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{clause.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{clause.title}</div>
                        <div className="text-sm text-gray-500">{clause.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(clause.status)}`}>
                            {getStatusIcon(clause.status)}
                            <span className="ml-1">{API_TO_UI_STATUS[clause.status]}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                            !clause.evidenceLink
                              ? "text-gray-600 bg-gray-100 hover:bg-gray-200"
                              : "text-primary-600 bg-primary-50 hover:bg-primary-100"
                          }`}
                        >
                          <FaFileAlt className="mr-2" />
                          {clause.evidenceLink || "No Evidence"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {clause.agents && clause.agents.length > 0 ? (
                            clause.agents.map(agent => (
                              <span 
                                key={agent.id} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {agent.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">No agents linked</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditClause(clause)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FaEdit />
                          <span className="ml-1">Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for editing clauses */}
        <ClauseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitClause}
          clause={currentClause}
        />
      </div>
    </>
  );
} 
"use client";

import React, { useEffect, useState } from "react";
import { FaRobot, FaEye, FaEdit, FaTimes, FaBook, FaLink, FaTrash, FaPencilAlt, FaCog } from "react-icons/fa";
import { 
  getAgents, 
  getClauses,
  createAgent, 
  updateAgent, 
  createAgentClauseAssessment,
  updateAgentClauseAssessment,
  deleteAgentClauseAssessment,
  CreateAgentDto, 
  Agent, 
  Clause,
  CreateAgentClauseAssessmentDto,
  UpdateAgentClauseAssessmentDto,
  AgentClauseAssessment
} from "../services/aims-api";
import { toast } from "../../../../libs/toast";

export default function RegistryPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAgentDto>({
    name: "",
    type: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  
  // State for managing clauses modal
  const [isManageClausesModalOpen, setIsManageClausesModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [clauseLinkFormData, setClauseLinkFormData] = useState<CreateAgentClauseAssessmentDto>({
    agentId: "",
    clauseId: "",
    evidenceLink: ""
  });
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [loadingClauses, setLoadingClauses] = useState(false);
  
  // State for edit evidence link modal
  const [isEditEvidenceLinkModalOpen, setIsEditEvidenceLinkModalOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<AgentClauseAssessment | null>(null);
  const [updatedEvidenceLink, setUpdatedEvidenceLink] = useState("");
  
  // Dummy agent types for dropdown : TODO: replace with actual agent types from the backend
  const agentTypes = [
    "Chat Agent",
    "Document Summarization Agent",
    "Code Generation Agent",
    "Data Analysis Agent",
    "RAG Agent - Document Retrieval",
    "RAG Agent - Code Retrieval",
    "RAG Agent - Image Retrieval",
    "RAG Agent - Video Retrieval",
    "RAG Agent - Audio Retrieval",
    "RAG Agent - General Retrieval",
    "RAG Agent - Multi-Modal Retrieval",
    "Computer Vision Agent",
    "General Purpose Agent"
  ];

  // Fetch agents data from API
  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAgents();
      console.log("API agents data:", data);
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Failed to fetch agents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clauses data from API
  const fetchClauses = async () => {
    setLoadingClauses(true);
    
    try {
      const data = await getClauses();
      setClauses(data);
    } catch (err) {
      console.error("Failed to fetch clauses:", err);
      toast.error("Failed to load clauses. Please try again.");
    } finally {
      setLoadingClauses(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditMode && currentAgentId) {
        // Update existing agent
        result = await updateAgent(currentAgentId, formData);
        
        // Update the local state to reflect the changes
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === currentAgentId ? result : agent
          )
        );
        
        toast.success(`Agent "${result.name}" was successfully updated`);
      } else {
        // Create new agent
        result = await createAgent(formData);
        
        // Refresh the agent list to include the new agent
        await fetchAgents();
        
        toast.success(`Agent "${result.name}" was successfully created`);
      }
      
      console.log(isEditMode ? "Updated agent:" : "Created agent:", result);
      
      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
      
    } catch (err) {
      console.error(isEditMode ? "Error updating agent:" : "Error creating agent:", err);
      
      // Show error toast
      toast.error(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} agent. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenModal = (agent?: Agent) => {
    if (agent) {
      // Edit mode - pre-fill the form with agent data
      setIsEditMode(true);
      setCurrentAgentId(agent.id);
      setFormData({
        name: agent.name,
        type: agent.type,
        description: agent.description
      });
    } else {
      // Create mode - reset the form
      resetForm();
    }
    setIsModalOpen(true);
  };
  
  const resetForm = () => {
    setIsEditMode(false);
    setCurrentAgentId(null);
    setFormData({ name: "", type: "", description: "" });
  };

  // Handle opening the manage clauses modal
  const handleOpenManageClausesModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setClauseLinkFormData({
      agentId: String(agent.id),
      clauseId: "",
      evidenceLink: ""
    });
    setIsManageClausesModalOpen(true);
    
    // Fetch clauses if we haven't already
    if (clauses.length === 0) {
      fetchClauses();
    }
  };
  
  // Handle closing the manage clauses modal
  const handleCloseManageClausesModal = () => {
    setIsManageClausesModalOpen(false);
    setSelectedAgent(null);
    setClauseLinkFormData({
      agentId: "",
      clauseId: "",
      evidenceLink: ""
    });
  };
  
  // Handle input change for clause link form
  const handleClauseLinkInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClauseLinkFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle submission of clause link form
  const handleClauseLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createAgentClauseAssessment(clauseLinkFormData);
      
      // Refresh the agent list to include the new assessment
      await fetchAgents();
      
      toast.success("Clause successfully linked to agent");
      
      // Reset form but keep the modal open for more edits
      setClauseLinkFormData({
        agentId: selectedAgent ? String(selectedAgent.id) : "",
        clauseId: "",
        evidenceLink: ""
      });
      
    } catch (err) {
      console.error("Error linking clause to agent:", err);
      
      // Show error toast
      toast.error(err instanceof Error ? err.message : "Failed to link clause to agent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle opening the edit evidence link modal
  const handleOpenEditEvidenceLinkModal = (assessment: AgentClauseAssessment) => {
    setCurrentAssessment(assessment);
    setUpdatedEvidenceLink(assessment.evidenceLink || "");
    setIsEditEvidenceLinkModalOpen(true);
  };
  
  // Handle delete assessment confirmation and deletion
  const handleDeleteAssessment = async (assessmentId: string) => {
    if (window.confirm("Are you sure you want to remove this clause from the agent?")) {
      setIsSubmitting(true);
      
      try {
        await deleteAgentClauseAssessment(assessmentId);
        
        // Refresh the agent list to remove the deleted assessment
        await fetchAgents();
        
        toast.success("Clause successfully unlinked from agent");
      } catch (err) {
        console.error("Error unlinking clause from agent:", err);
        
        // Show error toast
        toast.error(err instanceof Error ? err.message : "Failed to unlink clause from agent. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Handle evidence link update submission
  const handleUpdateEvidenceLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAssessment) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: UpdateAgentClauseAssessmentDto = {
        evidenceLink: updatedEvidenceLink
      };
      
      await updateAgentClauseAssessment(currentAssessment.id, updateData);
      
      // Refresh the agent list to show the updated evidence link
      await fetchAgents();
      
      toast.success("Evidence link successfully updated");
      
      // Close modal
      setIsEditEvidenceLinkModalOpen(false);
      setCurrentAssessment(null);
      setUpdatedEvidenceLink("");
    } catch (err) {
      console.error("Error updating evidence link:", err);
      
      // Show error toast
      toast.error(err instanceof Error ? err.message : "Failed to update evidence link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Registry</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your AI systems
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaRobot className="mr-2 h-4 w-4" />
          Add AI Agent
        </button>
      </div>

      {/* Optional error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p>Error loading data: {error}</p>
        </div>
      )}

      {/* Loading or empty state */}
      {loading ? (
        <div className="mb-6 text-gray-500">
          <p>Loading agents data...</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-md text-center">
          <FaRobot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No agents found</h3>
          <p className="text-gray-500">Click "Add AI Agent" to create your first agent.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaRobot className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {agent.type}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-6">
                  {agent.description}
                </p>
                
                {/* Scoped Clauses Section - modified to make only gear icon and "manage" text clickable */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <FaBook className="h-4 w-4 text-gray-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700">Scoped Clauses</h4>
                    <div className="flex items-center ml-2 cursor-pointer hover:text-primary-600 transition-colors">
                      <FaCog 
                        className="h-3.5 w-3.5 text-gray-400 hover:text-primary-600 transition-colors" 
                        onClick={() => handleOpenManageClausesModal(agent)}
                      />
                      <span 
                        className="text-xs text-gray-400 ml-1 hover:text-primary-600"
                        onClick={() => handleOpenManageClausesModal(agent)}
                      >(manage)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {agent.scopedAssessments && agent.scopedAssessments.length > 0 ? (
                      agent.scopedAssessments.map(assessment => {
                        // Try to get the clause title from either the assessment or the clauses array
                        const clauseTitle = assessment.clause?.title || 
                          clauses.find(c => c.id === assessment.clauseId)?.title || 
                          `Clause ${assessment.clauseId}`;
                          
                        return (
                          <div key={assessment.id} className="inline-flex items-center group">
                            <span 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              title={clauseTitle}
                            >
                              {assessment.clauseId}
                            </span>
                            
                            {assessment.evidenceLink && (
                              <a 
                                href={assessment.evidenceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-blue-600 hover:text-blue-800"
                                title="View evidence"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400">No clauses scoped</span>
                        <button 
                          className="ml-1 text-xs text-primary-600 hover:text-primary-800 hover:underline"
                          onClick={() => handleOpenManageClausesModal(agent)}
                        >
                          (add)
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <FaEye className="mr-2 h-4 w-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleOpenModal(agent)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditMode ? 'Edit AI Agent' : 'Add New AI Agent'}
                  </h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter agent name"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select a type</option>
                      {agentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Describe the AI agent"
                    ></textarea>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting 
                        ? isEditMode ? "Updating..." : "Creating..." 
                        : isEditMode ? "Update Agent" : "Create Agent"
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Clauses Modal */}
      {isManageClausesModalOpen && selectedAgent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={handleCloseManageClausesModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Manage Scoped Clauses for {selectedAgent.name}
                  </h3>
                  <button 
                    onClick={handleCloseManageClausesModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                {/* Current scoped clauses */}
                {selectedAgent.scopedAssessments && selectedAgent.scopedAssessments.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Current Scoped Clauses</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedAgent.scopedAssessments.map(assessment => {
                        // Try to get the clause title from either the assessment or the clauses array
                        const clauseTitle = assessment.clause?.title || 
                          clauses.find(c => c.id === assessment.clauseId)?.title || 
                          `Clause ${assessment.clauseId}`;
                          
                        return (
                          <div 
                            key={assessment.id} 
                            className="flex justify-between items-center py-2 px-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="flex items-center overflow-hidden">
                              <span 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 flex-shrink-0"
                                title={clauseTitle}
                              >
                                {assessment.clauseId}
                              </span>
                              {assessment.evidenceLink ? (
                                <div className="flex items-center overflow-hidden">
                                  <a 
                                    href={assessment.evidenceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-sm hover:text-blue-800 truncate max-w-[150px]"
                                    title={assessment.evidenceLink}
                                  >
                                    {assessment.evidenceLink.replace(/^https?:\/\//, '').substring(0, 20)}
                                    {assessment.evidenceLink.length > 20 ? '...' : ''}
                                  </a>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditEvidenceLinkModal(assessment);
                                    }}
                                    className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0"
                                    title="Edit evidence link"
                                  >
                                    <FaPencilAlt className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">No evidence link</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAssessment(assessment.id);
                              }}
                              className="text-gray-400 hover:text-red-600 focus:outline-none ml-2 flex-shrink-0"
                              title="Remove clause"
                            >
                              <FaTrash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Divider line */}
                <div className="border-t border-gray-200 mb-6 -mx-4 px-4"></div>

                {/* Add clause form */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Scope New Clause</h4>
                  <form onSubmit={handleClauseLinkSubmit}>
                    <div className="mb-4">
                      <label htmlFor="clauseId" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Clause
                      </label>
                      {loadingClauses ? (
                        <div className="text-sm text-gray-500">Loading clauses...</div>
                      ) : (
                        <select
                          id="clauseId"
                          name="clauseId"
                          value={clauseLinkFormData.clauseId}
                          onChange={handleClauseLinkInputChange}
                          required
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a clause to scope</option>
                          {clauses.map((clause) => (
                            <option key={clause.id} value={clause.id}>
                              {clause.id} - {clause.title}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="evidenceLink" className="block text-sm font-medium text-gray-700 mb-1">
                        Evidence Link (Optional)
                      </label>
                      <input
                        type="url"
                        id="evidenceLink"
                        name="evidenceLink"
                        value={clauseLinkFormData.evidenceLink || ""}
                        onChange={handleClauseLinkInputChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="https://example.com/evidence"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting || !clauseLinkFormData.clauseId}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Adding..." : "Add Clause"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseManageClausesModal}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Evidence Link Modal */}
      {isEditEvidenceLinkModalOpen && currentAssessment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setIsEditEvidenceLinkModalOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Update Evidence Link
                  </h3>
                  <button 
                    onClick={() => setIsEditEvidenceLinkModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateEvidenceLink}>
                  <div className="mb-2">
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      Clause:
                    </span>
                    <span className="block text-sm text-gray-900">
                      {currentAssessment.clauseId}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="evidenceLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Evidence Link
                    </label>
                    <input
                      type="url"
                      id="evidenceLink"
                      value={updatedEvidenceLink || ""}
                      onChange={(e) => setUpdatedEvidenceLink(e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com/evidence"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditEvidenceLinkModalOpen(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Updating..." : "Update Link"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
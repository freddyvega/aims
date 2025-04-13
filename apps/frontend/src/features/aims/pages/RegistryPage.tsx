"use client";

import React, { useEffect, useState } from "react";
import { FaRobot, FaEye, FaEdit, FaTimes } from "react-icons/fa";
import { getAgents, createAgent, updateAgent, CreateAgentDto, Agent } from "../services/aims-api";
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
  
  // Dummy agent types for dropdown
  const agentTypes = [
    "Chatbot",
    "Security AI",
    "Recommendation AI",
    "NLP AI",
    "Industrial AI",
    "Computer Vision"
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
    </div>
  );
} 
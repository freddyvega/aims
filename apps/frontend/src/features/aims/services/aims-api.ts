/**
 * API service for interacting with the AIMS backend
 */

export interface Agent {
  id: number;
  name: string;
  type: string;
  description: string;
}

export interface CreateAgentDto {
  name: string;
  type: string;
  description: string;
}

/**
 * Fetches the list of AI agents from the backend
 */
export async function getAgents(): Promise<Agent[]> {
  try {
    const response = await fetch('http://localhost:3001/api/agents');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
}

/**
 * Creates a new AI agent
 */
export async function createAgent(agent: CreateAgentDto): Promise<Agent> {
  try {
    const response = await fetch('http://localhost:3001/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agent),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
}

/**
 * Updates an existing AI agent
 */
export async function updateAgent(id: number, agent: CreateAgentDto): Promise<Agent> {
  try {
    const response = await fetch(`http://localhost:3001/api/agents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agent),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating agent:', error);
    throw error;
  }
} 
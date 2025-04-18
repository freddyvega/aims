/**
 * API service for interacting with the AIMS backend
 */

export interface Agent {
  id: number;
  name: string;
  type: string;
  description: string;
  clauses?: Clause[];
  scopedAssessments?: AgentClauseAssessment[];
}

export interface CreateAgentDto {
  name: string;
  type: string;
  description: string;
}

export interface Clause {
  id: string;
  title: string;
  description: string;
  status: 'Met' | 'Partial' | 'Gap' | 'Pending';
  evidenceLink?: string | null;
  sortOrder: number;
  agents?: Agent[];
}

export interface CreateClauseDto {
  id: string;
  title: string;
  description: string;
  status: 'Met' | 'Partial' | 'Gap' | 'Pending';
  evidenceLink?: string | null;
}

export interface UpdateClauseDto {
  status?: 'pending' | 'gap' | 'compliant' | 'non_compliant';
  evidenceLink?: string | null;
}

export interface AgentClauseAssessment {
  id: string;
  agentId: string;
  clauseId: string;
  evidenceLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
  clause?: Clause;
}

export interface CreateAgentClauseAssessmentDto {
  agentId: string;
  clauseId: string;
  evidenceLink?: string | null;
}

export interface UpdateAgentClauseAssessmentDto {
  evidenceLink?: string | null;
}

// Status mapping constants
export const UI_TO_API_STATUS = {
  'Met': 'compliant',
  'Partial': 'non_compliant',
  'Gap': 'gap',
  'Pending': 'pending'
};

export const API_TO_UI_STATUS = {
  'compliant': 'Met',
  'non_compliant': 'Partial',
  'gap': 'Gap',
  'pending': 'Pending'
};

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
 * Fetches the list of ISO 42001 clauses from the backend
 */
export async function getClauses(): Promise<Clause[]> {
  try {
    const response = await fetch('http://localhost:3001/api/clauses');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching clauses:', error);
    // Return mock data for now
    return [];
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

/**
 * Creates a new ISO 42001 clause
 */
export async function createClause(clause: CreateClauseDto): Promise<Clause> {
  try {
    const response = await fetch('http://localhost:3001/api/clauses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clause),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating clause:', error);
    throw error;
  }
}

/**
 * Updates an existing ISO 42001 clause
 */
export async function updateClause(id: string, clause: UpdateClauseDto): Promise<Clause> {
  try {
    const response = await fetch(`http://localhost:3001/api/clauses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clause),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating clause:', error);
    throw error;
  }
}

/**
 * Creates a new agent-clause assessment linkage
 */
export async function createAgentClauseAssessment(assessment: CreateAgentClauseAssessmentDto): Promise<AgentClauseAssessment> {
  try {
    const response = await fetch('http://localhost:3001/api/agent-clause-assessments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessment),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating agent-clause assessment:', error);
    throw error;
  }
}

/**
 * Updates an existing agent-clause assessment
 */
export async function updateAgentClauseAssessment(id: string, assessment: UpdateAgentClauseAssessmentDto): Promise<AgentClauseAssessment> {
  try {
    const response = await fetch(`http://localhost:3001/api/agent-clause-assessments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessment),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating agent-clause assessment:', error);
    throw error;
  }
}

/**
 * Deletes an agent-clause assessment
 */
export async function deleteAgentClauseAssessment(id: string): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3001/api/agent-clause-assessments/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error deleting agent-clause assessment:', error);
    throw error;
  }
} 
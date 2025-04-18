/**
 * Test script to verify agent API returns scopedAssessments
 *
 * To run:
 * ts-node apps/backend/scripts/test-agent-api.ts
 */

async function testAgentApi() {
  try {
    console.log('Fetching agents from API...');
    const response = await fetch('http://localhost:3001/api/agents');

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const agents = await response.json();
    console.log(`Retrieved ${agents.length} agents`);

    // Check for scopedAssessments
    if (agents.length > 0) {
      const firstAgent = agents[0];
      console.log(
        'First agent structure:',
        JSON.stringify(
          {
            id: firstAgent.id,
            name: firstAgent.name,
            hasClausesArray: Array.isArray(firstAgent.clauses),
            hasScopedAssessments: Array.isArray(firstAgent.scopedAssessments),
            scopedAssessmentsCount: firstAgent.scopedAssessments?.length || 0,
          },
          null,
          2,
        ),
      );

      // Log the first assessment if available
      if (
        firstAgent.scopedAssessments &&
        firstAgent.scopedAssessments.length > 0
      ) {
        console.log(
          'First assessment:',
          JSON.stringify(firstAgent.scopedAssessments[0], null, 2),
        );
      }
    }

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error testing agent API:', error);
  }
}

testAgentApi();

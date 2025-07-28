/**
 * API client for z-agent framework integration
 */

import ApiClient from '../utils/apiClient.js';

class AgentApiClient extends ApiClient {
  constructor() {
    // Default to localhost for development, can be configured via environment variables
    const baseURL = process.env.REACT_APP_AGENT_API_URL || 'http://localhost:8000';
    super(baseURL);
  }

  /**
   * Search for tools based on a query
   * @param {string} query - Search query for tools
   * @returns {Promise<Array>} List of matching tools
   */
  async searchTools(query) {
    try {
      const response = await this.get('/tool_search', { query });
      return response;
    } catch (error) {
      console.error('Tool search failed:', error);
      throw new Error(`Failed to search tools: ${error.message}`);
    }
  }

  /**
   * Search for agents based on a query
   * @param {string} query - Search query for agents
   * @returns {Promise<Array>} List of matching agents
   */
  async searchAgents(query) {
    try {
      const response = await this.get('/agent_search', { query });
      return response;
    } catch (error) {
      console.error('Agent search failed:', error);
      throw new Error(`Failed to search agents: ${error.message}`);
    }
  }

  /**
   * Save a new agent to the framework
   * @param {Object} agentData - Agent configuration data
   * @param {string} agentData.name - Agent name
   * @param {string} agentData.description - Agent description
   * @param {Array} agentData.tasks - List of tasks for the agent
   * @param {Array} agentData.tools - List of tools the agent can use
   * @param {Object} agentData.argumentSchema - Schema for agent arguments
   * @returns {Promise<Object>} Saved agent data with ID
   */
  async saveAgent(agentData) {
    try {
      const response = await this.post('/save_agent', agentData);
      return response;
    } catch (error) {
      console.error('Agent save failed:', error);
      throw new Error(`Failed to save agent: ${error.message}`);
    }
  }

  /**
   * Execute an agent with given arguments
   * @param {string} agentId - ID of the agent to execute
   * @param {Object} args - Arguments to pass to the agent
   * @returns {Promise<Object>} Agent execution result
   */
  async executeAgent(agentId, args = {}) {
    try {
      const response = await this.post('/agent_call', {
        agent_id: agentId,
        arguments: args
      });
      return response;
    } catch (error) {
      console.error('Agent execution failed:', error);
      throw new Error(`Failed to execute agent: ${error.message}`);
    }
  }

  /**
   * Get list of all available agents
   * @returns {Promise<Array>} List of all agents
   */
  async getAgents() {
    try {
      // This endpoint might not exist in the original framework, 
      // but we'll implement it for better UX
      const response = await this.get('/agents');
      return response;
    } catch (error) {
      console.error('Failed to get agents:', error);
      // Fallback to empty search if endpoint doesn't exist
      return this.searchAgents('');
    }
  }

  /**
   * Get list of all available tools
   * @returns {Promise<Array>} List of all tools
   */
  async getTools() {
    try {
      // This endpoint might not exist in the original framework,
      // but we'll implement it for better UX
      const response = await this.get('/tools');
      return response;
    } catch (error) {
      console.error('Failed to get tools:', error);
      // Fallback to empty search if endpoint doesn't exist
      return this.searchTools('');
    }
  }
}

// Create and export a singleton instance
const agentApi = new AgentApiClient();
export default agentApi;

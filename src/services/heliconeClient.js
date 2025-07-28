/**
 * Helicone client for LLM observability and monitoring
 */

class HeliconeClient {
  constructor() {
    this.apiKey = process.env.REACT_APP_HELICONE_API_KEY;
    this.baseURL = process.env.REACT_APP_HELICONE_API_URL || 'https://api.helicone.ai';
    this.enabled = !!this.apiKey;
    
    if (!this.enabled) {
      console.warn('Helicone API key not found. Observability features will be disabled.');
    }
  }

  /**
   * Check if Helicone is properly configured
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Create headers for Helicone requests
   */
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make a request to Helicone API
   */
  async request(endpoint, options = {}) {
    if (!this.enabled) {
      console.warn('Helicone is not enabled. Skipping request.');
      return null;
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Helicone API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Helicone request failed:', error);
      throw error;
    }
  }

  /**
   * Log agent execution start
   */
  async logExecutionStart(agentId, agentName, arguments, sessionId = null) {
    if (!this.enabled) return null;

    try {
      const logData = {
        event_type: 'agent_execution_start',
        agent_id: agentId,
        agent_name: agentName,
        arguments: arguments,
        session_id: sessionId || this.generateSessionId(),
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'z-agent-framework',
          version: '1.0.0'
        }
      };

      return await this.request('/v1/log', {
        method: 'POST',
        body: JSON.stringify(logData)
      });
    } catch (error) {
      console.error('Failed to log execution start:', error);
      return null;
    }
  }

  /**
   * Log agent execution completion
   */
  async logExecutionComplete(agentId, agentName, result, sessionId, executionTime = null) {
    if (!this.enabled) return null;

    try {
      const logData = {
        event_type: 'agent_execution_complete',
        agent_id: agentId,
        agent_name: agentName,
        result: result,
        session_id: sessionId,
        execution_time: executionTime,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'z-agent-framework',
          version: '1.0.0',
          success: !result.error
        }
      };

      return await this.request('/v1/log', {
        method: 'POST',
        body: JSON.stringify(logData)
      });
    } catch (error) {
      console.error('Failed to log execution completion:', error);
      return null;
    }
  }

  /**
   * Log agent execution error
   */
  async logExecutionError(agentId, agentName, error, sessionId, executionTime = null) {
    if (!this.enabled) return null;

    try {
      const logData = {
        event_type: 'agent_execution_error',
        agent_id: agentId,
        agent_name: agentName,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        session_id: sessionId,
        execution_time: executionTime,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'z-agent-framework',
          version: '1.0.0',
          success: false
        }
      };

      return await this.request('/v1/log', {
        method: 'POST',
        body: JSON.stringify(logData)
      });
    } catch (error) {
      console.error('Failed to log execution error:', error);
      return null;
    }
  }

  /**
   * Get execution metrics for an agent
   */
  async getAgentMetrics(agentId, timeRange = '24h') {
    if (!this.enabled) return null;

    try {
      return await this.request(`/v1/metrics/agent/${agentId}?timeRange=${timeRange}`);
    } catch (error) {
      console.error('Failed to get agent metrics:', error);
      return null;
    }
  }

  /**
   * Get execution history for an agent
   */
  async getExecutionHistory(agentId, limit = 50, offset = 0) {
    if (!this.enabled) return null;

    try {
      return await this.request(`/v1/executions/agent/${agentId}?limit=${limit}&offset=${offset}`);
    } catch (error) {
      console.error('Failed to get execution history:', error);
      return null;
    }
  }

  /**
   * Get overall system metrics
   */
  async getSystemMetrics(timeRange = '24h') {
    if (!this.enabled) return null;

    try {
      return await this.request(`/v1/metrics/system?timeRange=${timeRange}`);
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      return null;
    }
  }

  /**
   * Search execution logs
   */
  async searchLogs(query, filters = {}, limit = 100) {
    if (!this.enabled) return null;

    try {
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
        ...filters
      });

      return await this.request(`/v1/logs/search?${params}`);
    } catch (error) {
      console.error('Failed to search logs:', error);
      return null;
    }
  }

  /**
   * Generate a unique session ID for tracking related operations
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a custom event log
   */
  async logCustomEvent(eventType, data, sessionId = null) {
    if (!this.enabled) return null;

    try {
      const logData = {
        event_type: eventType,
        data: data,
        session_id: sessionId || this.generateSessionId(),
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'z-agent-framework',
          version: '1.0.0'
        }
      };

      return await this.request('/v1/log', {
        method: 'POST',
        body: JSON.stringify(logData)
      });
    } catch (error) {
      console.error('Failed to log custom event:', error);
      return null;
    }
  }

  /**
   * Batch log multiple events
   */
  async logBatch(events) {
    if (!this.enabled) return null;

    try {
      const batchData = {
        events: events.map(event => ({
          ...event,
          timestamp: event.timestamp || new Date().toISOString(),
          metadata: {
            source: 'z-agent-framework',
            version: '1.0.0',
            ...event.metadata
          }
        }))
      };

      return await this.request('/v1/log/batch', {
        method: 'POST',
        body: JSON.stringify(batchData)
      });
    } catch (error) {
      console.error('Failed to log batch events:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const heliconeClient = new HeliconeClient();
export default heliconeClient;


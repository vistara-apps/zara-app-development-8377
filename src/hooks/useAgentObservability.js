/**
 * Custom hook for agent observability using Helicone
 */

import { useState, useCallback, useRef } from 'react';
import heliconeClient from '../services/heliconeClient';

export function useAgentObservability() {
  const [observabilityData, setObservabilityData] = useState({
    metrics: null,
    history: [],
    logs: [],
    loading: false,
    error: null
  });

  const sessionRef = useRef(null);

  /**
   * Start tracking an agent execution
   */
  const startExecution = useCallback(async (agentId, agentName, arguments) => {
    if (!heliconeClient.isEnabled()) {
      console.warn('Helicone observability is not enabled');
      return null;
    }

    try {
      const sessionId = heliconeClient.generateSessionId();
      sessionRef.current = sessionId;

      await heliconeClient.logExecutionStart(agentId, agentName, arguments, sessionId);
      
      return sessionId;
    } catch (error) {
      console.error('Failed to start execution tracking:', error);
      setObservabilityData(prev => ({
        ...prev,
        error: error.message
      }));
      return null;
    }
  }, []);

  /**
   * Complete tracking an agent execution
   */
  const completeExecution = useCallback(async (agentId, agentName, result, executionTime) => {
    if (!heliconeClient.isEnabled() || !sessionRef.current) {
      return;
    }

    try {
      await heliconeClient.logExecutionComplete(
        agentId, 
        agentName, 
        result, 
        sessionRef.current, 
        executionTime
      );
      
      sessionRef.current = null;
    } catch (error) {
      console.error('Failed to complete execution tracking:', error);
      setObservabilityData(prev => ({
        ...prev,
        error: error.message
      }));
    }
  }, []);

  /**
   * Log an execution error
   */
  const logExecutionError = useCallback(async (agentId, agentName, error, executionTime) => {
    if (!heliconeClient.isEnabled() || !sessionRef.current) {
      return;
    }

    try {
      await heliconeClient.logExecutionError(
        agentId, 
        agentName, 
        error, 
        sessionRef.current, 
        executionTime
      );
      
      sessionRef.current = null;
    } catch (error) {
      console.error('Failed to log execution error:', error);
      setObservabilityData(prev => ({
        ...prev,
        error: error.message
      }));
    }
  }, []);

  /**
   * Get metrics for a specific agent
   */
  const getAgentMetrics = useCallback(async (agentId, timeRange = '24h') => {
    if (!heliconeClient.isEnabled()) {
      return null;
    }

    setObservabilityData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const metrics = await heliconeClient.getAgentMetrics(agentId, timeRange);
      
      setObservabilityData(prev => ({
        ...prev,
        metrics,
        loading: false
      }));

      return metrics;
    } catch (error) {
      console.error('Failed to get agent metrics:', error);
      setObservabilityData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return null;
    }
  }, []);

  /**
   * Get execution history for an agent
   */
  const getExecutionHistory = useCallback(async (agentId, limit = 50, offset = 0) => {
    if (!heliconeClient.isEnabled()) {
      return [];
    }

    setObservabilityData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const history = await heliconeClient.getExecutionHistory(agentId, limit, offset);
      
      setObservabilityData(prev => ({
        ...prev,
        history: history || [],
        loading: false
      }));

      return history || [];
    } catch (error) {
      console.error('Failed to get execution history:', error);
      setObservabilityData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return [];
    }
  }, []);

  /**
   * Get system-wide metrics
   */
  const getSystemMetrics = useCallback(async (timeRange = '24h') => {
    if (!heliconeClient.isEnabled()) {
      return null;
    }

    setObservabilityData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const metrics = await heliconeClient.getSystemMetrics(timeRange);
      
      setObservabilityData(prev => ({
        ...prev,
        metrics: metrics,
        loading: false
      }));

      return metrics;
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      setObservabilityData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return null;
    }
  }, []);

  /**
   * Search execution logs
   */
  const searchLogs = useCallback(async (query, filters = {}, limit = 100) => {
    if (!heliconeClient.isEnabled()) {
      return [];
    }

    setObservabilityData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const logs = await heliconeClient.searchLogs(query, filters, limit);
      
      setObservabilityData(prev => ({
        ...prev,
        logs: logs || [],
        loading: false
      }));

      return logs || [];
    } catch (error) {
      console.error('Failed to search logs:', error);
      setObservabilityData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return [];
    }
  }, []);

  /**
   * Log a custom event
   */
  const logCustomEvent = useCallback(async (eventType, data) => {
    if (!heliconeClient.isEnabled()) {
      return;
    }

    try {
      await heliconeClient.logCustomEvent(eventType, data, sessionRef.current);
    } catch (error) {
      console.error('Failed to log custom event:', error);
      setObservabilityData(prev => ({
        ...prev,
        error: error.message
      }));
    }
  }, []);

  /**
   * Clear observability data
   */
  const clearData = useCallback(() => {
    setObservabilityData({
      metrics: null,
      history: [],
      logs: [],
      loading: false,
      error: null
    });
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setObservabilityData(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  /**
   * Check if observability is enabled
   */
  const isEnabled = useCallback(() => {
    return heliconeClient.isEnabled();
  }, []);

  /**
   * Get current session ID
   */
  const getCurrentSession = useCallback(() => {
    return sessionRef.current;
  }, []);

  return {
    // Data
    ...observabilityData,
    
    // Actions
    startExecution,
    completeExecution,
    logExecutionError,
    getAgentMetrics,
    getExecutionHistory,
    getSystemMetrics,
    searchLogs,
    logCustomEvent,
    clearData,
    clearError,
    
    // Utilities
    isEnabled,
    getCurrentSession,
  };
}

export default useAgentObservability;


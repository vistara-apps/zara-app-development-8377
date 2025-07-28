/**
 * React context for managing agent-related state and operations
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import agentApi from '../services/agentApi.js';

// Initial state
const initialState = {
  agents: [],
  tools: [],
  currentAgent: null,
  executionResults: {},
  loading: {
    agents: false,
    tools: false,
    execution: false,
    saving: false,
  },
  errors: {
    agents: null,
    tools: null,
    execution: null,
    saving: null,
  },
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_AGENTS: 'SET_AGENTS',
  SET_TOOLS: 'SET_TOOLS',
  SET_CURRENT_AGENT: 'SET_CURRENT_AGENT',
  ADD_AGENT: 'ADD_AGENT',
  SET_EXECUTION_RESULT: 'SET_EXECUTION_RESULT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
function agentReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.value,
        },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.type]: action.payload.error,
        },
        loading: {
          ...state.loading,
          [action.payload.type]: false,
        },
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.type]: null,
        },
      };

    case ActionTypes.SET_AGENTS:
      return {
        ...state,
        agents: action.payload,
        loading: {
          ...state.loading,
          agents: false,
        },
        errors: {
          ...state.errors,
          agents: null,
        },
      };

    case ActionTypes.SET_TOOLS:
      return {
        ...state,
        tools: action.payload,
        loading: {
          ...state.loading,
          tools: false,
        },
        errors: {
          ...state.errors,
          tools: null,
        },
      };

    case ActionTypes.SET_CURRENT_AGENT:
      return {
        ...state,
        currentAgent: action.payload,
      };

    case ActionTypes.ADD_AGENT:
      return {
        ...state,
        agents: [...state.agents, action.payload],
        loading: {
          ...state.loading,
          saving: false,
        },
        errors: {
          ...state.errors,
          saving: null,
        },
      };

    case ActionTypes.SET_EXECUTION_RESULT:
      return {
        ...state,
        executionResults: {
          ...state.executionResults,
          [action.payload.agentId]: action.payload.result,
        },
        loading: {
          ...state.loading,
          execution: false,
        },
        errors: {
          ...state.errors,
          execution: null,
        },
      };

    default:
      return state;
  }
}

// Create context
const AgentContext = createContext();

// Context provider component
export function AgentProvider({ children }) {
  const [state, dispatch] = useReducer(agentReducer, initialState);

  // Load agents
  const loadAgents = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'agents', value: true } });
    try {
      const agents = await agentApi.getAgents();
      dispatch({ type: ActionTypes.SET_AGENTS, payload: agents });
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: { type: 'agents', error: error.message } 
      });
    }
  }, []);

  // Load tools
  const loadTools = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'tools', value: true } });
    try {
      const tools = await agentApi.getTools();
      dispatch({ type: ActionTypes.SET_TOOLS, payload: tools });
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: { type: 'tools', error: error.message } 
      });
    }
  }, []);

  // Search tools
  const searchTools = useCallback(async (query) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'tools', value: true } });
    try {
      const tools = await agentApi.searchTools(query);
      dispatch({ type: ActionTypes.SET_TOOLS, payload: tools });
      return tools;
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: { type: 'tools', error: error.message } 
      });
      throw error;
    }
  }, []);

  // Search agents
  const searchAgents = useCallback(async (query) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'agents', value: true } });
    try {
      const agents = await agentApi.searchAgents(query);
      dispatch({ type: ActionTypes.SET_AGENTS, payload: agents });
      return agents;
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: { type: 'agents', error: error.message } 
      });
      throw error;
    }
  }, []);

  // Save agent
  const saveAgent = useCallback(async (agentData) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'saving', value: true } });
    try {
      const savedAgent = await agentApi.saveAgent(agentData);
      dispatch({ type: ActionTypes.ADD_AGENT, payload: savedAgent });
      return savedAgent;
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: { type: 'saving', error: error.message } 
      });
      throw error;
    }
  }, []);

  // Execute agent
  const executeAgent = useCallback(async (agentId, args) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: { type: 'execution', value: true } });
    try {
      const result = await agentApi.executeAgent(agentId, args);
      dispatch({ 
        type: ActionTypes.SET_EXECUTION_RESULT, 
        payload: { agentId, result } 
      });
      return result;
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: { type: 'execution', error: error.message } 
      });
      throw error;
    }
  }, []);

  // Set current agent
  const setCurrentAgent = useCallback((agent) => {
    dispatch({ type: ActionTypes.SET_CURRENT_AGENT, payload: agent });
  }, []);

  // Clear error
  const clearError = useCallback((type) => {
    dispatch({ type: ActionTypes.CLEAR_ERROR, payload: { type } });
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    loadAgents,
    loadTools,
    searchTools,
    searchAgents,
    saveAgent,
    executeAgent,
    setCurrentAgent,
    clearError,
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

// Custom hook to use the agent context
export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}

export default AgentContext;

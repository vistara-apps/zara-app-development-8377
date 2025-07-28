/**
 * Component for executing agents with custom arguments and displaying progress
 */

import React, { useState, useEffect } from 'react';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAgent } from '../context/AgentContext';

function AgentExecutor({ agent, onExecutionComplete, onClose }) {
  const { executeAgent, loading, errors, executionResults } = useAgent();
  
  const [arguments, setArguments] = useState({});
  const [executionStatus, setExecutionStatus] = useState('idle'); // 'idle', 'running', 'completed', 'error'
  const [validationErrors, setValidationErrors] = useState({});

  // Get execution result for this agent
  const executionResult = executionResults[agent?.id];

  // Initialize arguments based on agent's argument schema
  useEffect(() => {
    if (agent?.argumentSchema) {
      const initialArgs = {};
      Object.keys(agent.argumentSchema).forEach(key => {
        const schema = agent.argumentSchema[key];
        initialArgs[key] = schema.default || '';
      });
      setArguments(initialArgs);
    }
  }, [agent]);

  // Update execution status based on loading state
  useEffect(() => {
    if (loading.execution) {
      setExecutionStatus('running');
    } else if (errors.execution) {
      setExecutionStatus('error');
    } else if (executionResult) {
      setExecutionStatus('completed');
    }
  }, [loading.execution, errors.execution, executionResult]);

  const handleArgumentChange = (key, value) => {
    setArguments(prev => ({
      ...prev,
      [key]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[key]) {
      setValidationErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
  };

  const validateArguments = () => {
    const errors = {};

    if (agent?.argumentSchema) {
      Object.keys(agent.argumentSchema).forEach(key => {
        const schema = agent.argumentSchema[key];
        const value = arguments[key];

        if (schema.required && (!value || value.toString().trim() === '')) {
          errors[key] = `${key} is required`;
        }

        if (schema.type === 'number' && value && isNaN(Number(value))) {
          errors[key] = `${key} must be a number`;
        }

        if (schema.minLength && value && value.length < schema.minLength) {
          errors[key] = `${key} must be at least ${schema.minLength} characters`;
        }

        if (schema.maxLength && value && value.length > schema.maxLength) {
          errors[key] = `${key} must be no more than ${schema.maxLength} characters`;
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleExecute = async () => {
    if (!validateArguments()) {
      return;
    }

    try {
      setExecutionStatus('running');
      const result = await executeAgent(agent.id, arguments);
      
      if (onExecutionComplete) {
        onExecutionComplete(result);
      }
    } catch (error) {
      console.error('Agent execution failed:', error);
      setExecutionStatus('error');
    }
  };

  const handleStop = () => {
    // Note: The z-agent framework might not support stopping executions
    // This is a placeholder for future implementation
    setExecutionStatus('idle');
  };

  const renderArgumentInput = (key, schema) => {
    const value = arguments[key] || '';
    const error = validationErrors[key];

    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? 'border-red-300' : 'border-gray-300'
    }`;

    switch (schema.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleArgumentChange(key, e.target.value)}
            className={baseClasses}
            placeholder={schema.description || `Enter ${key}`}
            min={schema.min}
            max={schema.max}
          />
        );

      case 'boolean':
        return (
          <select
            value={value.toString()}
            onChange={(e) => handleArgumentChange(key, e.target.value === 'true')}
            className={baseClasses}
          >
            <option value="">Select...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleArgumentChange(key, e.target.value)}
            className={baseClasses}
            rows={4}
            placeholder={schema.description || `Enter ${key}`}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleArgumentChange(key, e.target.value)}
            className={baseClasses}
            placeholder={schema.description || `Enter ${key}`}
          />
        );
    }
  };

  const getStatusIcon = () => {
    switch (executionStatus) {
      case 'running':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Play className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (executionStatus) {
      case 'running':
        return 'Executing...';
      case 'completed':
        return 'Execution completed';
      case 'error':
        return 'Execution failed';
      default:
        return 'Ready to execute';
    }
  };

  if (!agent) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">No agent selected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{agent.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm text-gray-600">{getStatusText()}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Agent Tasks */}
        {agent.tasks && agent.tasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tasks</h3>
            <ul className="space-y-1">
              {agent.tasks.map((task, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Arguments Form */}
        {agent.argumentSchema && Object.keys(agent.argumentSchema).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Arguments</h3>
            <div className="space-y-4">
              {Object.entries(agent.argumentSchema).map(([key, schema]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {schema.label || key}
                    {schema.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderArgumentInput(key, schema)}
                  {schema.description && (
                    <p className="mt-1 text-xs text-gray-500">{schema.description}</p>
                  )}
                  {validationErrors[key] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {errors.execution && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Execution failed: {errors.execution}</p>
          </div>
        )}

        {/* Execution Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {executionStatus === 'running' ? (
              <button
                onClick={handleStop}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleExecute}
                disabled={loading.execution}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.execution ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute Agent
                  </>
                )}
              </button>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentExecutor;


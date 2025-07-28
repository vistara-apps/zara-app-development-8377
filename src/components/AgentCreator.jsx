/**
 * Component for creating new agents with tool selection and task definition
 */

import React, { useState } from 'react';
import { Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import ToolSearch from './ToolSearch';

function AgentCreator({ onAgentCreated, onCancel }) {
  const { saveAgent, loading, errors } = useAgent();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tasks: [''],
    tools: [],
    argumentSchema: {}
  });

  const [showToolSearch, setShowToolSearch] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...formData.tasks];
    newTasks[index] = value;
    setFormData(prev => ({
      ...prev,
      tasks: newTasks
    }));
  };

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const removeTask = (index) => {
    if (formData.tasks.length > 1) {
      const newTasks = formData.tasks.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        tasks: newTasks
      }));
    }
  };

  const handleToolSelect = (tool) => {
    if (!formData.tools.find(t => t.id === tool.id || t.name === tool.name)) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, tool]
      }));
    }
  };

  const handleToolDeselect = (tool) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t.id !== tool.id && t.name !== tool.name)
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Agent name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Agent description is required';
    }

    if (formData.tasks.every(task => !task.trim())) {
      errors.tasks = 'At least one task is required';
    }

    if (formData.tools.length === 0) {
      errors.tools = 'At least one tool must be selected';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const agentData = {
        ...formData,
        tasks: formData.tasks.filter(task => task.trim()),
        argumentSchema: formData.argumentSchema || {}
      };

      const savedAgent = await saveAgent(agentData);
      
      if (onAgentCreated) {
        onAgentCreated(savedAgent);
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Create New Agent</h2>
        <p className="text-sm text-gray-600 mt-1">
          Define your agent's capabilities and tasks
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter agent name"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe what this agent does"
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.description}
              </p>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tasks *
          </label>
          <div className="space-y-3">
            {formData.tasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Task ${index + 1}`}
                />
                {formData.tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTask}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </button>
          </div>
          {validationErrors.tasks && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.tasks}
            </p>
          )}
        </div>

        {/* Tools Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Tools *
            </label>
            <button
              type="button"
              onClick={() => setShowToolSearch(!showToolSearch)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showToolSearch ? 'Hide Tool Search' : 'Search Tools'}
            </button>
          </div>
          
          {showToolSearch && (
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <ToolSearch
                selectedTools={formData.tools}
                onToolSelect={handleToolSelect}
                onToolDeselect={handleToolDeselect}
              />
            </div>
          )}

          {formData.tools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.tools.map((tool, index) => (
                <div
                  key={tool.id || tool.name || index}
                  className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {tool.name || tool.title || 'Unnamed Tool'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {tool.description || 'No description'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToolDeselect(tool)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">No tools selected</p>
              <button
                type="button"
                onClick={() => setShowToolSearch(true)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Search and select tools
              </button>
            </div>
          )}
          
          {validationErrors.tools && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.tools}
            </p>
          )}
        </div>

        {/* Error Display */}
        {errors.saving && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to create agent: {errors.saving}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading.saving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Agent
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgentCreator;


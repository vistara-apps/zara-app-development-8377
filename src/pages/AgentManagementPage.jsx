/**
 * Main page for managing agents - viewing, creating, and organizing agents
 */

import React, { useState, useEffect } from 'react';
import { Plus, Search, Bot, Settings, Play } from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import AgentCreator from '../components/AgentCreator';

function AgentManagementPage() {
  const { 
    agents, 
    loading, 
    errors, 
    loadAgents, 
    searchAgents, 
    setCurrentAgent 
  } = useAgent();
  
  const [view, setView] = useState('list'); // 'list' or 'create'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Load agents on component mount
  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        searchAgents(searchQuery);
      } else {
        loadAgents();
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchQuery, searchAgents, loadAgents]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAgentCreated = (agent) => {
    setView('list');
    // Optionally show a success message
  };

  const handleAgentSelect = (agent) => {
    setCurrentAgent(agent);
    // Navigate to agent execution or details view
  };

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AgentCreator
            onAgentCreated={handleAgentCreated}
            onCancel={() => setView('list')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
              <p className="text-gray-600 mt-1">
                Create, manage, and execute your AI agents
              </p>
            </div>
            <button
              onClick={() => setView('create')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {errors.agents && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error loading agents: {errors.agents}</p>
            <button 
              onClick={loadAgents}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading.agents && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading agents...</span>
          </div>
        )}

        {/* Agents Grid */}
        {!loading.agents && !errors.agents && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No agents found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? 'No agents match your search criteria.' 
                    : 'Get started by creating your first agent.'
                  }
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setView('create')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Agent
                  </button>
                )}
              </div>
            ) : (
              agents.map((agent, index) => (
                <div
                  key={agent.id || agent.name || index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleAgentSelect(agent)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">
                          {agent.name || 'Unnamed Agent'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {agent.id ? `ID: ${agent.id}` : 'No ID'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgentSelect(agent);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Execute Agent"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle agent settings/edit
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Agent Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {agent.description || 'No description available'}
                  </p>

                  <div className="space-y-2">
                    {agent.tasks && agent.tasks.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Tasks ({agent.tasks.length})
                        </span>
                        <div className="mt-1">
                          {agent.tasks.slice(0, 2).map((task, taskIndex) => (
                            <div key={taskIndex} className="text-sm text-gray-600 truncate">
                              • {task}
                            </div>
                          ))}
                          {agent.tasks.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{agent.tasks.length - 2} more tasks
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {agent.tools && agent.tools.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Tools ({agent.tools.length})
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.tools.slice(0, 3).map((tool, toolIndex) => (
                            <span
                              key={toolIndex}
                              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {tool.name || tool.title || 'Tool'}
                            </span>
                          ))}
                          {agent.tools.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                              +{agent.tools.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentManagementPage;


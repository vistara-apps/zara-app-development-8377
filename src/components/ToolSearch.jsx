/**
 * Component for searching and selecting tools for agent creation
 */

import React, { useState, useEffect } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { useAgent } from '../context/AgentContext';

function ToolSearch({ selectedTools = [], onToolSelect, onToolDeselect }) {
  const { tools, loading, errors, searchTools, loadTools } = useAgent();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Load tools on component mount
  useEffect(() => {
    loadTools();
  }, [loadTools]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        searchTools(searchQuery);
      } else {
        loadTools();
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchQuery, searchTools, loadTools]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const isToolSelected = (tool) => {
    return selectedTools.some(selected => selected.id === tool.id || selected.name === tool.name);
  };

  const handleToolToggle = (tool) => {
    if (isToolSelected(tool)) {
      onToolDeselect(tool);
    } else {
      onToolSelect(tool);
    }
  };

  if (errors.tools) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading tools: {errors.tools}</p>
        <button 
          onClick={loadTools}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search for tools..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading.tools && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Searching tools...</span>
        </div>
      )}

      {/* Tools List */}
      {!loading.tools && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tools.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No tools found matching your search.' : 'No tools available.'}
            </div>
          ) : (
            tools.map((tool, index) => (
              <div
                key={tool.id || tool.name || index}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  isToolSelected(tool)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleToolToggle(tool)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {tool.name || tool.title || 'Unnamed Tool'}
                      </h3>
                      {isToolSelected(tool) ? (
                        <Check className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {tool.description || 'No description available'}
                    </p>
                    {tool.parameters && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Parameters: {Object.keys(tool.parameters).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Selected Tools Summary */}
      {selectedTools.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Selected Tools ({selectedTools.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedTools.map((tool, index) => (
              <span
                key={tool.id || tool.name || index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tool.name || tool.title || 'Unnamed Tool'}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToolDeselect(tool);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolSearch;


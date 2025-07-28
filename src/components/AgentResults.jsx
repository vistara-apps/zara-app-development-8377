/**
 * Component for displaying agent execution results and output
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Copy, 
  Download, 
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

function AgentResults({ result, agent, onClose }) {
  const [expandedSections, setExpandedSections] = useState({
    output: true,
    metadata: false,
    logs: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could show a toast notification here
      console.log('Copied to clipboard');
    });
  };

  const downloadResult = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-result-${agent?.name || 'unknown'}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'running':
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderValue = (value, key = '') => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">null</span>;
    }

    if (typeof value === 'boolean') {
      return (
        <span className={`px-2 py-1 rounded text-xs ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value.toString()}
        </span>
      );
    }

    if (typeof value === 'string') {
      // Check if it's a URL
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {value}
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        );
      }

      // Long text handling
      if (value.length > 200) {
        return (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
              {value}
            </pre>
            <button
              onClick={() => copyToClipboard(value)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </button>
          </div>
        );
      }

      return <span className="text-gray-900">{value}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-gray-900 font-mono">{value}</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-gray-400 text-sm">{index}:</span>
              <div className="flex-1">{renderValue(item, `${key}[${index}]`)}</div>
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="space-y-2 pl-4 border-l-2 border-gray-200">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="space-y-1">
              <span className="text-sm font-medium text-gray-700">{k}:</span>
              <div className="ml-2">{renderValue(v, `${key}.${k}`)}</div>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-900">{String(value)}</span>;
  };

  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">No execution result available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(result.status)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Execution Results
              </h2>
              <p className="text-sm text-gray-600">
                {agent?.name || 'Unknown Agent'} • {formatTimestamp(result.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadResult}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Download Results"
            >
              <Download className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1 text-gray-600 hover:text-gray-800"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Output Section */}
        <div>
          <button
            onClick={() => toggleSection('output')}
            className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-gray-700"
          >
            {expandedSections.output ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
            <span>Output</span>
          </button>
          
          {expandedSections.output && (
            <div className="mt-4 space-y-4">
              {result.output ? (
                renderValue(result.output)
              ) : result.result ? (
                renderValue(result.result)
              ) : result.response ? (
                renderValue(result.response)
              ) : (
                <p className="text-gray-500 italic">No output available</p>
              )}
            </div>
          )}
        </div>

        {/* Metadata Section */}
        {(result.metadata || result.execution_time || result.tokens_used) && (
          <div>
            <button
              onClick={() => toggleSection('metadata')}
              className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-gray-700"
            >
              {expandedSections.metadata ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span>Metadata</span>
            </button>
            
            {expandedSections.metadata && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.execution_time && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Execution Time:</span>
                      <p className="text-sm text-gray-900">{result.execution_time}ms</p>
                    </div>
                  )}
                  {result.tokens_used && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tokens Used:</span>
                      <p className="text-sm text-gray-900">{result.tokens_used}</p>
                    </div>
                  )}
                  {result.model && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Model:</span>
                      <p className="text-sm text-gray-900">{result.model}</p>
                    </div>
                  )}
                  {result.cost && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Cost:</span>
                      <p className="text-sm text-gray-900">${result.cost}</p>
                    </div>
                  )}
                </div>
                
                {result.metadata && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Additional Metadata:</span>
                    <div className="mt-2">
                      {renderValue(result.metadata)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Logs Section */}
        {(result.logs || result.debug_info) && (
          <div>
            <button
              onClick={() => toggleSection('logs')}
              className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-gray-700"
            >
              {expandedSections.logs ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span>Logs & Debug Info</span>
            </button>
            
            {expandedSections.logs && (
              <div className="mt-4">
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {result.logs || result.debug_info || 'No logs available'}
                  </pre>
                </div>
                <button
                  onClick={() => copyToClipboard(result.logs || result.debug_info || '')}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Logs
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error Section */}
        {result.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-900 mb-2">Error</h3>
            <p className="text-red-700">{result.error}</p>
            {result.error_details && (
              <div className="mt-2">
                <details className="text-sm">
                  <summary className="cursor-pointer text-red-600 hover:text-red-800">
                    Error Details
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-red-600">
                    {JSON.stringify(result.error_details, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentResults;


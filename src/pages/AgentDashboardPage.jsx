/**
 * Dashboard page for viewing agent performance and observability data
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Activity, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import useAgentObservability from '../hooks/useAgentObservability';

function AgentDashboardPage() {
  const { agents, loadAgents } = useAgent();
  const { 
    metrics, 
    history, 
    loading, 
    error, 
    getSystemMetrics, 
    getExecutionHistory,
    isEnabled 
  } = useAgentObservability();

  const [timeRange, setTimeRange] = useState('24h');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadAgents();
    if (isEnabled()) {
      getSystemMetrics(timeRange);
    }
  }, [loadAgents, getSystemMetrics, timeRange, isEnabled]);

  // Load agent-specific data when agent is selected
  useEffect(() => {
    if (selectedAgent && isEnabled()) {
      getExecutionHistory(selectedAgent.id);
    }
  }, [selectedAgent, getExecutionHistory, isEnabled]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAgents();
      if (isEnabled()) {
        await getSystemMetrics(timeRange);
        if (selectedAgent) {
          await getExecutionHistory(selectedAgent.id);
        }
      }
    } finally {
      setRefreshing(false);
    }
  };

  const formatDuration = (ms) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Mock data for when Helicone is not available
  const mockMetrics = {
    totalExecutions: 42,
    successRate: 94.2,
    avgExecutionTime: 2340,
    totalCost: 12.45,
    activeAgents: agents.length,
    errorRate: 5.8
  };

  const displayMetrics = isEnabled() ? metrics : mockMetrics;

  if (!isEnabled()) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Monitor and analyze your AI agent performance
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-900">
                  Observability Not Configured
                </h3>
                <p className="text-yellow-700 mt-1">
                  Helicone observability is not configured. Add your Helicone API key to environment variables to enable detailed monitoring and analytics.
                </p>
                <div className="mt-4">
                  <code className="bg-yellow-100 px-2 py-1 rounded text-sm">
                    REACT_APP_HELICONE_API_KEY=your_api_key_here
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Basic metrics without Helicone */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Framework Status</p>
                  <p className="text-2xl font-bold text-gray-900">Ready</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Integration</p>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                </div>
              </div>
            </div>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Monitor and analyze your AI agent performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error loading dashboard data: {error}</p>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(displayMetrics?.totalExecutions)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {displayMetrics?.successRate?.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Execution Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(displayMetrics?.avgExecutionTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${displayMetrics?.totalCost?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Performance</h3>
          <div className="flex items-center space-x-4 mb-6">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedAgent?.id || ''}
              onChange={(e) => {
                const agent = agents.find(a => a.id === e.target.value);
                setSelectedAgent(agent || null);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent.id || agent.name} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Execution History */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading execution history...</span>
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.slice(0, 10).map((execution, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      execution.status === 'success' ? 'bg-green-500' : 
                      execution.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{execution.agent_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(execution.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDuration(execution.execution_time)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {execution.tokens_used ? `${execution.tokens_used} tokens` : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No execution history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentDashboardPage;


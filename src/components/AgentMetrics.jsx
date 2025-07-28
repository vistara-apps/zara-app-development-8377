/**
 * Component for displaying detailed agent metrics and performance data
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  DollarSign,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import useAgentObservability from '../hooks/useAgentObservability';

function AgentMetrics({ agent, timeRange = '24h' }) {
  const { 
    getAgentMetrics, 
    getExecutionHistory, 
    loading, 
    error, 
    isEnabled 
  } = useAgentObservability();

  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (agent && isEnabled()) {
      loadMetrics();
    }
  }, [agent, timeRange, isEnabled]);

  const loadMetrics = async () => {
    if (!agent?.id) return;

    try {
      const [metricsData, historyData] = await Promise.all([
        getAgentMetrics(agent.id, timeRange),
        getExecutionHistory(agent.id, 100)
      ]);

      setMetrics(metricsData);
      setHistory(historyData || []);
    } catch (error) {
      console.error('Failed to load agent metrics:', error);
    }
  };

  const calculateMetrics = () => {
    if (!history.length) {
      return {
        totalExecutions: 0,
        successRate: 0,
        avgExecutionTime: 0,
        totalCost: 0,
        errorRate: 0,
        tokensUsed: 0
      };
    }

    const successful = history.filter(h => h.status === 'success').length;
    const failed = history.filter(h => h.status === 'error').length;
    const totalExecutions = history.length;
    
    const avgExecutionTime = history.reduce((sum, h) => sum + (h.execution_time || 0), 0) / totalExecutions;
    const totalCost = history.reduce((sum, h) => sum + (h.cost || 0), 0);
    const tokensUsed = history.reduce((sum, h) => sum + (h.tokens_used || 0), 0);

    return {
      totalExecutions,
      successRate: totalExecutions > 0 ? (successful / totalExecutions) * 100 : 0,
      errorRate: totalExecutions > 0 ? (failed / totalExecutions) * 100 : 0,
      avgExecutionTime,
      totalCost,
      tokensUsed
    };
  };

  const formatDuration = (ms) => {
    if (!ms) return '0ms';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return Math.round(num).toString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'running':
        return <Activity className="w-4 h-4 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!agent) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">No agent selected</p>
      </div>
    );
  }

  if (!isEnabled()) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center text-yellow-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Observability not configured. Enable Helicone to view detailed metrics.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Error loading metrics: {error}</p>
        </div>
      </div>
    );
  }

  const calculatedMetrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Agent Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
            <p className="text-gray-600 mt-1">{agent.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Time Range</p>
            <p className="font-medium text-gray-900">{timeRange}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(calculatedMetrics.totalExecutions)}
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
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">
                  {calculatedMetrics.successRate.toFixed(1)}%
                </p>
                {calculatedMetrics.successRate >= 90 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 ml-2" />
                ) : calculatedMetrics.successRate < 70 ? (
                  <TrendingDown className="w-4 h-4 text-red-500 ml-2" />
                ) : null}
              </div>
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
                {formatDuration(calculatedMetrics.avgExecutionTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${calculatedMetrics.totalCost.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tokens Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(calculatedMetrics.tokensUsed)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">
                  {calculatedMetrics.errorRate.toFixed(1)}%
                </p>
                {calculatedMetrics.errorRate > 10 ? (
                  <TrendingUp className="w-4 h-4 text-red-500 ml-2" />
                ) : calculatedMetrics.errorRate < 5 ? (
                  <TrendingDown className="w-4 h-4 text-green-500 ml-2" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Executions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Recent Executions</h4>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading executions...</span>
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.slice(0, 10).map((execution, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${getStatusColor(execution.status)}`}>
                      {getStatusIcon(execution.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Execution #{execution.id || index + 1}
                      </p>
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
                      {execution.tokens_used ? `${formatNumber(execution.tokens_used)} tokens` : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No execution history available for this agent
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentMetrics;


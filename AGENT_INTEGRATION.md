# Agent Framework Integration

This document describes the integration of the z-agent framework functionality into the TripHub application.

## Overview

The agent framework integration adds the ability to create, manage, and execute AI agents within the TripHub application. It includes:

- **Agent Creation**: UI for creating new agents with tool selection and task definition
- **Agent Management**: Dashboard for viewing and organizing agents
- **Agent Execution**: Interface for running agents with custom arguments
- **Observability**: Helicone integration for monitoring and analytics
- **Dashboard**: Performance metrics and execution history

## Architecture

### Components

```
src/
├── components/
│   ├── AgentCreator.jsx       # Agent creation form
│   ├── AgentExecutor.jsx      # Agent execution interface
│   ├── AgentResults.jsx       # Execution results display
│   ├── AgentMetrics.jsx       # Performance metrics
│   └── ToolSearch.jsx         # Tool discovery and selection
├── pages/
│   ├── AgentManagementPage.jsx # Main agent management page
│   └── AgentDashboardPage.jsx  # Analytics dashboard
├── context/
│   └── AgentContext.jsx       # React context for agent state
├── services/
│   ├── agentApi.js           # Z-agent framework API client
│   └── heliconeClient.js     # Helicone observability client
├── hooks/
│   └── useAgentObservability.js # Observability hook
└── config/
    └── agentConfig.js        # Configuration constants
```

### API Integration

The integration communicates with the z-agent framework through these endpoints:

- `GET /tool_search?query={query}` - Search for available tools
- `GET /agent_search?query={query}` - Search for existing agents
- `POST /save_agent` - Create a new agent
- `POST /agent_call` - Execute an agent

### State Management

Agent state is managed through React Context (`AgentContext`) which provides:

- Agent list and current selection
- Tool discovery and selection
- Execution results and status
- Loading states and error handling

## Setup

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Z-Agent Framework Configuration
REACT_APP_AGENT_API_URL=http://localhost:8000

# Helicone Observability Configuration
REACT_APP_HELICONE_API_KEY=your_helicone_api_key_here
REACT_APP_HELICONE_API_URL=https://api.helicone.ai

# Optional: Additional API Keys for Agent Tools
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_SERPER_API_KEY=your_serper_api_key_here
```

### 2. Z-Agent Framework Backend

Ensure the z-agent framework backend is running:

```bash
# Clone the framework
git clone https://github.com/z-agent/framework.git
cd framework

# Install dependencies
python3 -m venv ./env
source ./env/bin/activate
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY=your_openai_api_key
export SERPER_API_KEY=your_serper_api_key

# Run the server
python3 -m src.server.main
```

The server will be available at `http://localhost:8000`.

### 3. Helicone Setup (Optional)

1. Sign up at [helicone.ai](https://helicone.ai)
2. Get your API key from the dashboard
3. Add it to your `.env` file as `REACT_APP_HELICONE_API_KEY`

## Features

### Agent Creation

1. Navigate to "AI Agents" in the main navigation
2. Click "Create Agent"
3. Fill in agent details:
   - **Name**: Unique identifier for the agent
   - **Description**: What the agent does
   - **Tasks**: List of tasks the agent will perform
   - **Tools**: Select from available tools using the search interface

### Agent Execution

1. Select an agent from the management page
2. Fill in any required arguments
3. Click "Execute Agent"
4. View real-time execution status and results

### Dashboard & Analytics

The dashboard provides:

- **System Metrics**: Overall execution statistics
- **Agent Performance**: Individual agent metrics
- **Execution History**: Recent execution logs
- **Cost Tracking**: Token usage and costs (with Helicone)

## Configuration

### Agent Configuration

Modify `src/config/agentConfig.js` to customize:

- API endpoints and timeouts
- UI behavior and pagination
- Feature flags
- Validation rules
- Error messages

### Feature Flags

Enable/disable features in `agentConfig.js`:

```javascript
export const FEATURES = {
  agentCreation: true,
  agentExecution: true,
  observability: true,
  dashboard: true,
  metrics: true,
};
```

## API Reference

### AgentContext

```javascript
const {
  // State
  agents,
  tools,
  currentAgent,
  executionResults,
  loading,
  errors,
  
  // Actions
  loadAgents,
  loadTools,
  searchTools,
  searchAgents,
  saveAgent,
  executeAgent,
  setCurrentAgent,
  clearError,
} = useAgent();
```

### useAgentObservability Hook

```javascript
const {
  // Data
  metrics,
  history,
  logs,
  loading,
  error,
  
  // Actions
  startExecution,
  completeExecution,
  logExecutionError,
  getAgentMetrics,
  getExecutionHistory,
  getSystemMetrics,
  searchLogs,
  logCustomEvent,
  
  // Utilities
  isEnabled,
  getCurrentSession,
} = useAgentObservability();
```

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Validation Errors**: Client-side validation with user feedback
- **API Errors**: Graceful degradation and error messages
- **Timeout Handling**: Configurable timeouts for long-running operations

## Security Considerations

- API keys are stored in environment variables
- All API requests include proper error handling
- Input validation prevents malicious data
- CORS configuration required for cross-origin requests

## Performance Optimization

- **Debounced Search**: Search queries are debounced to reduce API calls
- **Pagination**: Large datasets are paginated
- **Caching**: Agent and tool data is cached in React state
- **Lazy Loading**: Components are loaded on demand

## Troubleshooting

### Common Issues

1. **Agent API Unavailable**
   - Check if z-agent framework backend is running
   - Verify `REACT_APP_AGENT_API_URL` configuration
   - Check network connectivity

2. **Helicone Not Working**
   - Verify `REACT_APP_HELICONE_API_KEY` is set
   - Check Helicone service status
   - Review browser console for errors

3. **Agent Execution Fails**
   - Check agent configuration and tools
   - Verify required arguments are provided
   - Review execution logs for details

### Debug Mode

Enable debug mode by setting:

```bash
REACT_APP_DEBUG=true
```

This will:
- Enable console logging
- Show additional debug information
- Display development tools

## Future Enhancements

Potential improvements:

- **Batch Execution**: Execute multiple agents simultaneously
- **Agent Templates**: Pre-configured agent templates
- **Custom Tools**: Upload and register custom tools
- **Workflow Builder**: Visual agent workflow creation
- **Real-time Collaboration**: Multi-user agent development
- **Version Control**: Agent versioning and rollback
- **A/B Testing**: Compare agent performance

## Contributing

When contributing to the agent integration:

1. Follow existing code patterns and structure
2. Add proper error handling and validation
3. Include comprehensive documentation
4. Test with both mock and real data
5. Consider accessibility and mobile responsiveness

## License

This integration follows the same license as the main TripHub application.


/**
 * Configuration for agent framework integration
 */

// Z-Agent Framework Configuration
export const AGENT_CONFIG = {
  // API Base URL for z-agent framework
  apiUrl: process.env.REACT_APP_AGENT_API_URL || 'http://localhost:8000',
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // Retry configuration
  retries: 3,
  retryDelay: 1000,
  
  // Default pagination
  defaultPageSize: 20,
  maxPageSize: 100,
};

// Helicone Observability Configuration
export const HELICONE_CONFIG = {
  // API Key for Helicone
  apiKey: process.env.REACT_APP_HELICONE_API_KEY,
  
  // API Base URL
  apiUrl: process.env.REACT_APP_HELICONE_API_URL || 'https://api.helicone.ai',
  
  // Enable/disable observability
  enabled: !!process.env.REACT_APP_HELICONE_API_KEY,
  
  // Batch logging configuration
  batchSize: 10,
  batchTimeout: 5000,
  
  // Default time ranges for metrics
  defaultTimeRange: '24h',
  availableTimeRanges: ['1h', '24h', '7d', '30d'],
};

// Agent Execution Configuration
export const EXECUTION_CONFIG = {
  // Default timeout for agent execution
  defaultTimeout: 60000, // 1 minute
  
  // Maximum timeout for agent execution
  maxTimeout: 300000, // 5 minutes
  
  // Polling interval for execution status
  statusPollInterval: 2000, // 2 seconds
  
  // Maximum number of status polls
  maxStatusPolls: 150, // 5 minutes at 2-second intervals
};

// UI Configuration
export const UI_CONFIG = {
  // Default number of items per page
  itemsPerPage: 10,
  
  // Search debounce delay
  searchDebounceDelay: 300,
  
  // Auto-refresh intervals
  autoRefreshInterval: 30000, // 30 seconds
  
  // Maximum file size for uploads (if needed)
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  // Supported file types for uploads
  supportedFileTypes: ['.json', '.txt', '.csv'],
};

// Feature Flags
export const FEATURES = {
  // Enable/disable specific features
  agentCreation: true,
  agentExecution: true,
  observability: HELICONE_CONFIG.enabled,
  dashboard: true,
  metrics: HELICONE_CONFIG.enabled,
  
  // Experimental features
  batchExecution: false,
  agentTemplates: false,
  customTools: false,
};

// Error Messages
export const ERROR_MESSAGES = {
  AGENT_API_UNAVAILABLE: 'Agent framework API is not available. Please check your configuration.',
  HELICONE_UNAVAILABLE: 'Helicone observability is not configured. Some features may be limited.',
  EXECUTION_TIMEOUT: 'Agent execution timed out. Please try again or increase the timeout.',
  EXECUTION_FAILED: 'Agent execution failed. Please check the logs for more details.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  AGENT_CREATED: 'Agent created successfully!',
  AGENT_UPDATED: 'Agent updated successfully!',
  AGENT_DELETED: 'Agent deleted successfully!',
  EXECUTION_STARTED: 'Agent execution started successfully!',
  EXECUTION_COMPLETED: 'Agent execution completed successfully!',
  DATA_REFRESHED: 'Data refreshed successfully!',
};

// Validation Rules
export const VALIDATION_RULES = {
  AGENT_NAME: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
    message: 'Agent name must be 3-50 characters and contain only letters, numbers, spaces, hyphens, and underscores.',
  },
  AGENT_DESCRIPTION: {
    minLength: 10,
    maxLength: 500,
    message: 'Agent description must be 10-500 characters.',
  },
  TASK_DESCRIPTION: {
    minLength: 5,
    maxLength: 200,
    message: 'Task description must be 5-200 characters.',
  },
};

// Default Values
export const DEFAULTS = {
  AGENT: {
    name: '',
    description: '',
    tasks: [''],
    tools: [],
    argumentSchema: {},
  },
  EXECUTION: {
    timeout: EXECUTION_CONFIG.defaultTimeout,
    arguments: {},
  },
  SEARCH: {
    query: '',
    limit: UI_CONFIG.itemsPerPage,
    offset: 0,
  },
};

// Development Configuration
export const DEV_CONFIG = {
  // Enable debug logging
  debug: process.env.REACT_APP_DEBUG === 'true',
  
  // Mock data when APIs are unavailable
  useMockData: process.env.REACT_APP_ENV === 'development' && !AGENT_CONFIG.apiUrl.includes('localhost'),
  
  // Show development tools
  showDevTools: process.env.REACT_APP_ENV === 'development',
};

// Export all configurations
export default {
  AGENT_CONFIG,
  HELICONE_CONFIG,
  EXECUTION_CONFIG,
  UI_CONFIG,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  DEFAULTS,
  DEV_CONFIG,
};


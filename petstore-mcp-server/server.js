#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PetStoreMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'petstore-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {
            schemes: ['file'],
            methods: ['read', 'list', 'watch']
          }
        }
      }
    );

    this.apiSpecPath = join(__dirname, 'petstore-api.json');
    this.setupHandlers();
  }

  setupHandlers() {
    // Tool handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_api_specification',
            description: 'Get the complete OpenAPI specification for the Pet Store API',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'list_endpoints',
            description: 'List all available API endpoints',
            inputSchema: {
              type: 'object',
              properties: {
                tag: {
                  type: 'string',
                  description: 'Filter by tag (pets, orders)',
                  enum: ['pets', 'orders']
                }
              },
              required: []
            }
          },
          {
            name: 'get_endpoint_details',
            description: 'Get detailed information about a specific endpoint',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'API path (e.g., /pets, /pets/{petId})'
                },
                method: {
                  type: 'string',
                  description: 'HTTP method (GET, POST, PUT, DELETE)',
                  enum: ['GET', 'POST', 'PUT', 'DELETE']
                }
              },
              required: ['path', 'method']
            }
          },
          {
            name: 'get_schemas',
            description: 'Get all data schemas used by the API',
            inputSchema: {
              type: 'object',
              properties: {
                schema_name: {
                  type: 'string',
                  description: 'Specific schema name to retrieve (Pet, Order, Category, Tag, Error)'
                }
              },
              required: []
            }
          },
          {
            name: 'generate_markdown_docs',
            description: 'Generate markdown documentation for the API',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  description: 'Documentation format',
                  enum: ['full', 'endpoints', 'schemas', 'overview'],
                  default: 'full'
                },
                include_examples: {
                  type: 'boolean',
                  description: 'Include example requests/responses',
                  default: true
                }
              },
              required: []
            }
          },
          {
            name: 'get_api_info',
            description: 'Get basic API information (title, version, description)',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        switch (name) {
          case 'get_api_specification':
            return await this.getApiSpecification(args);
          case 'list_endpoints':
            return await this.listEndpoints(args);
          case 'get_endpoint_details':
            return await this.getEndpointDetails(args);
          case 'get_schemas':
            return await this.getSchemas(args);
          case 'generate_markdown_docs':
            return await this.generateMarkdownDocs(args);
          case 'get_api_info':
            return await this.getApiInfo(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ]
        };
      }
    });

    // Resource handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'file:///petstore-api.json',
            name: 'Pet Store API Specification',
            description: 'Complete OpenAPI 3.0 specification for the Pet Store API',
            mimeType: 'application/json'
          }
        ]
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      if (uri === 'file:///petstore-api.json') {
        const content = await readFile(this.apiSpecPath, 'utf-8');
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: content
            }
          ]
        };
      }
      
      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  async loadApiSpec() {
    const content = await readFile(this.apiSpecPath, 'utf-8');
    return JSON.parse(content);
  }

  async getApiSpecification(args = {}) {
    const spec = await this.loadApiSpec();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(spec, null, 2)
        }
      ]
    };
  }

  async listEndpoints(args = {}) {
    const spec = await this.loadApiSpec();
    const { tag } = args;
    
    let endpoints = [];
    
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (tag && operation.tags && !operation.tags.includes(tag)) {
          continue;
        }
        
        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: operation.summary,
          description: operation.description,
          tags: operation.tags || [],
          operationId: operation.operationId
        });
      }
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(endpoints, null, 2)
        }
      ]
    };
  }

  async getEndpointDetails(args) {
    const { path, method } = args;
    const spec = await this.loadApiSpec();
    
    const pathData = spec.paths[path];
    if (!pathData) {
      throw new Error(`Path not found: ${path}`);
    }
    
    const methodData = pathData[method.toLowerCase()];
    if (!methodData) {
      throw new Error(`Method ${method} not found for path ${path}`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(methodData, null, 2)
        }
      ]
    };
  }

  async getSchemas(args = {}) {
    const spec = await this.loadApiSpec();
    const { schema_name } = args;
    
    if (schema_name) {
      const schema = spec.components.schemas[schema_name];
      if (!schema) {
        throw new Error(`Schema not found: ${schema_name}`);
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(schema, null, 2)
          }
        ]
      };
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(spec.components.schemas, null, 2)
        }
      ]
    };
  }

  async generateMarkdownDocs(args = {}) {
    const { format = 'full', include_examples = true } = args;
    const spec = await this.loadApiSpec();
    
    let markdown = '';
    
    if (format === 'overview' || format === 'full') {
      markdown += `# ${spec.info.title}\n\n`;
      markdown += `${spec.info.description}\n\n`;
      markdown += `**Version:** ${spec.info.version}\n`;
      markdown += `**Contact:** ${spec.info.contact.name} (${spec.info.contact.email})\n\n`;
      
      if (spec.servers) {
        markdown += `## Servers\n\n`;
        spec.servers.forEach(server => {
          markdown += `- **${server.description}:** \`${server.url}\`\n`;
        });
        markdown += '\n';
      }
    }
    
    if (format === 'endpoints' || format === 'full') {
      markdown += `## API Endpoints\n\n`;
      
      // Group by tags
      const endpointsByTag = {};
      for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, operation] of Object.entries(methods)) {
          const tags = operation.tags || ['default'];
          for (const tag of tags) {
            if (!endpointsByTag[tag]) {
              endpointsByTag[tag] = [];
            }
            endpointsByTag[tag].push({ path, method, operation });
          }
        }
      }
      
      for (const [tag, endpoints] of Object.entries(endpointsByTag)) {
        markdown += `### ${tag.charAt(0).toUpperCase() + tag.slice(1)}\n\n`;
        
        for (const { path, method, operation } of endpoints) {
          markdown += `#### ${method.toUpperCase()} ${path}\n\n`;
          markdown += `${operation.summary}\n\n`;
          
          if (operation.description) {
            markdown += `${operation.description}\n\n`;
          }
          
          if (include_examples && operation.parameters) {
            markdown += `**Parameters:**\n`;
            operation.parameters.forEach(param => {
              markdown += `- \`${param.name}\` (${param.in}) - ${param.description || 'No description'}\n`;
            });
            markdown += '\n';
          }
          
          if (include_examples && operation.responses) {
            markdown += `**Responses:**\n`;
            for (const [code, response] of Object.entries(operation.responses)) {
              markdown += `- \`${code}\` - ${response.description}\n`;
            }
            markdown += '\n';
          }
        }
      }
    }
    
    if (format === 'schemas' || format === 'full') {
      markdown += `## Data Models\n\n`;
      
      for (const [name, schema] of Object.entries(spec.components.schemas)) {
        markdown += `### ${name}\n\n`;
        
        if (schema.description) {
          markdown += `${schema.description}\n\n`;
        }
        
        if (schema.properties) {
          markdown += `**Properties:**\n`;
          for (const [propName, prop] of Object.entries(schema.properties)) {
            const required = schema.required?.includes(propName) ? ' (required)' : '';
            markdown += `- \`${propName}\` (${prop.type})${required} - ${prop.description || 'No description'}\n`;
          }
          markdown += '\n';
        }
        
        if (schema.enum) {
          markdown += `**Allowed values:** ${schema.enum.join(', ')}\n\n`;
        }
      }
    }
    
    return {
      content: [
        {
          type: 'text',
          text: markdown
        }
      ]
    };
  }

  async getApiInfo(args = {}) {
    const spec = await this.loadApiSpec();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            title: spec.info.title,
            version: spec.info.version,
            description: spec.info.description,
            contact: spec.info.contact,
            servers: spec.servers
          }, null, 2)
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Pet Store MCP Server started');
  }
}

const server = new PetStoreMCPServer();
server.run().catch(console.error); 
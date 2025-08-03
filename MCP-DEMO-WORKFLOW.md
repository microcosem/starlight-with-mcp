# MCP Demo Workflow

This project demonstrates a complete MCP (Model Context Protocol) workflow for generating documentation:

1. **MCP Client** in the docs infrastructure connects to external MCP servers
2. **Pet Store MCP Server** provides API documentation from OpenAPI specs
3. **Starlight MCP Server** manages existing documentation
4. **Automated documentation generation** combines content from multiple sources

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Starlight     │    │   MCP Client     │    │  Pet Store      │
│   Docs Site     │◄───┤   (Orchestrator) │◄───┤  MCP Server     │
│                 │    │                  │    │                 │
│ - Guides        │    │ - Connects to    │    │ - OpenAPI Spec  │
│ - Reference     │    │   multiple MCP   │    │ - API Endpoints │
│ - API Docs      │    │   servers        │    │ - Data Schemas  │
│ - Generated     │    │ - Generates docs │    │ - Examples      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install MCP server dependencies
cd mcp-server && npm install && cd ..
cd petstore-mcp-server && npm install && cd ..
cd mcp-client && npm install && cd ..
```

### 2. Run the Complete Demo

```bash
# This will:
# 1. Connect to Pet Store MCP server
# 2. Generate API documentation
# 3. Connect to Starlight MCP server
# 4. Generate combined documentation
# 5. Create files in src/content/docs/
npm run demo
```

### 3. View the Documentation

```bash
npm run dev
# Open http://localhost:4321
```

## 📋 Individual Components

### Pet Store MCP Server

Located in `petstore-mcp-server/`, this server provides API documentation tools:

**Available Tools:**
- `get_api_specification` - Get complete OpenAPI spec
- `list_endpoints` - List all API endpoints
- `get_endpoint_details` - Get details for specific endpoint
- `get_schemas` - Get data models/schemas
- `generate_markdown_docs` - Generate markdown documentation
- `get_api_info` - Get basic API information

**Demo:**
```bash
npm run demo-petstore
```

### Starlight MCP Server

Located in `mcp-server/`, this server manages existing documentation:

**Available Tools:**
- `list_docs` - List all documentation pages
- `search_docs` - Search documentation content
- `get_doc_content` - Get specific page content
- `get_site_structure` - Get site navigation structure

**Demo:**
```bash
npm run demo-starlight
```

### MCP Client

Located in `mcp-client/`, this orchestrates the entire workflow:

**Key Features:**
- Connects to multiple MCP servers simultaneously
- Generates API documentation from Pet Store server
- Integrates with existing Starlight documentation
- Creates combined documentation structure
- Can be integrated into CI/CD pipelines

**Demo:**
```bash
npm run demo
```

## 🔧 Integration Options

### Option 1: Build-time Generation

The documentation is automatically generated during the build process:

```bash
npm run build  # This runs generate-docs first
```

### Option 2: Manual Generation

Generate documentation manually:

```bash
npm run generate-docs
```

### Option 3: Development Workflow

For development, you can run the demo and then start the dev server:

```bash
npm run demo
npm run dev
```

## 📁 Generated Files

After running the demo, these files will be created:

```
src/content/docs/
├── index.mdx                    # Updated index page
└── api/
    └── petstore-api.md         # Generated API documentation
```

## 🛠️ Customization

### Adding New API Servers

1. Create a new MCP server (see `petstore-mcp-server/` as example)
2. Add connection logic to `mcp-client/client.js`
3. Update the documentation generation workflow

### Modifying Documentation Format

Edit the `generateMarkdownDocs` method in `petstore-mcp-server/server.js` to customize the output format.

### Adding New Documentation Sources

Extend the `StarlightMCPClient` class to connect to additional MCP servers and integrate their content.

## 🔍 API Documentation Features

The generated Pet Store API documentation includes:

- **Complete API Reference** - All endpoints with parameters and responses
- **Data Models** - Detailed schema documentation
- **Examples** - Request/response examples
- **Server Information** - Available environments
- **Contact Information** - API support details

## 🎯 Use Cases

This workflow is ideal for:

1. **API Documentation Sites** - Automatically generate docs from OpenAPI specs
2. **Multi-source Documentation** - Combine content from different MCP servers
3. **CI/CD Integration** - Generate docs as part of build process
4. **Developer Portals** - Create comprehensive developer documentation
5. **Microservices Documentation** - Aggregate docs from multiple services

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure no other processes are using the required ports
2. **Permission errors**: Make sure all scripts are executable (`chmod +x *.js`)
3. **Missing dependencies**: Run `npm install` in all directories
4. **Path issues**: Ensure you're running commands from the project root

### Debug Mode

For debugging, you can run individual components:

```bash
# Test Pet Store server directly
cd petstore-mcp-server && npm run demo

# Test Starlight server directly  
cd mcp-server && npm run demo

# Test client with verbose logging
cd mcp-client && node client.js
```

## 📚 Next Steps

1. **Extend the Pet Store API** - Add more endpoints and schemas
2. **Add Authentication** - Implement secure MCP server connections
3. **Create More MCP Servers** - Add servers for other documentation sources
4. **Implement Caching** - Cache generated documentation for performance
5. **Add Webhooks** - Trigger documentation updates automatically

## 🤝 Contributing

This is a demo project showcasing MCP capabilities. Feel free to:

- Add new MCP servers
- Improve documentation generation
- Add more integration examples
- Create additional demo scenarios

## 📄 License

MIT License - see individual component licenses for details. 
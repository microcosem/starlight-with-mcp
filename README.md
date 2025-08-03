# Starlight MCP demo

A demonstration of using MCP (Model Context Protocol) to generate documentation from multiple sources.

## 🚀 Quick start

### 1. Install dependencies

```bash
npm install
cd mcp-server && npm install && cd ..
cd petstore-mcp-server && npm install && cd ..
cd mcp-client && npm install && cd ..
```

### 2. Test the workflow

```bash
# Test all components
npm run test-workflow

# Run the complete demo
npm run demo

# View the documentation
npm run dev
```

## 📋 What this demo shows

This project demonstrates a complete MCP workflow for automated documentation generation from multiple sources.

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

## 🔧 MCP client/server architecture

This project demonstrates a complete **Model Context Protocol (MCP)** workflow for automated documentation generation. It consists of three main components:

### 🎯 **MCP client** (`mcp-client/client.js`)

The **StarlightMCPClient** serves as the orchestrator that connects to multiple MCP servers and coordinates documentation generation:

**Key features:**
- **Multi-server connectivity**: Can connect to multiple MCP servers simultaneously
- **Tool execution**: Calls tools on remote servers and processes responses
- **Resource management**: Reads and lists resources from connected servers
- **Documentation generation**: Automatically generates combined documentation from multiple sources
- **File system integration**: Writes generated documentation to the Starlight docs structure

**Main methods:**
- `connectToServer()` - Establishes connections to MCP servers
- `generateApiDocs()` - Generates API documentation from Pet Store server
- `generateStarlightDocs()` - Retrieves existing Starlight documentation structure
- `generateCombinedDocs()` - Creates unified documentation combining multiple sources

### 🏪 **Pet Store MCP server** (`petstore-mcp-server/server.js`)

This server provides API documentation tools based on OpenAPI specifications:

**Available tools:**
- `get_api_specification` - Returns complete OpenAPI spec
- `list_endpoints` - Lists all API endpoints (filterable by tag)
- `get_endpoint_details` - Gets detailed information about specific endpoints
- `get_schemas` - Retrieves data models and schemas
- `generate_markdown_docs` - Generates formatted markdown documentation
- `get_api_info` - Returns basic API metadata

**Key capabilities:**
- **OpenAPI integration**: Reads from `petstore-api.json` specification
- **Flexible output**: Supports different documentation formats (full, endpoints, schemas, overview)
- **Example generation**: Includes request/response examples
- **Resource access**: Provides access to the raw API specification file

### 📚 **Starlight MCP server** (`mcp-server/server.js`)

This server manages existing Starlight documentation and provides tools for content discovery:

**Available tools:**
- `list_docs` - Lists all documentation pages (filterable by category)
- `search_docs` - Searches documentation content by keyword
- `get_doc_content` - Retrieves specific page content with frontmatter
- `get_site_structure` - Returns complete site navigation structure

**Key capabilities:**
- **Content discovery**: Scans the `src/content/docs/` directory
- **Frontmatter processing**: Extracts metadata from markdown files
- **Search functionality**: Full-text search across documentation
- **Structure analysis**: Provides site navigation and organization
- **Resource access**: Lists and reads documentation files

### 🔄 **Workflow process**

The typical workflow follows this pattern:

1. **Client initialization**: MCP client starts and prepares to connect to servers
2. **Server connections**: Client connects to both Pet Store and Starlight MCP servers
3. **Content retrieval**: 
   - Pet Store server provides API documentation from OpenAPI spec
   - Starlight server provides existing documentation structure
4. **Documentation generation**: Client combines content and generates unified documentation
5. **File output**: Generated documentation is written to `src/content/docs/`
6. **Cleanup**: Client disconnects from all servers

### 🏗️ **Architecture benefits**

- **Modular design**: Each server has a specific responsibility
- **Extensible**: Easy to add new MCP servers for different content sources
- **Automated**: Documentation generation can be integrated into CI/CD pipelines
- **Standards-based**: Uses the official MCP SDK and protocol
- **Content-aware**: Understands both API specs and existing documentation

## 🧞 Available commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site (includes doc generation) |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run demo`            | Run the complete MCP workflow demo               |
| `npm run test-workflow`   | Test all MCP components                          |
| `npm run generate-docs`   | Generate documentation from MCP servers          |
| `npm run demo-petstore`   | Test Pet Store MCP server only                   |
| `npm run demo-starlight`  | Test Starlight MCP server only                   |

## 📁 Project structure

```
.
├── mcp-server/              # Starlight MCP server
├── petstore-mcp-server/     # Pet Store API MCP server
├── mcp-client/              # MCP client orchestrator
├── src/content/docs/        # Generated documentation
├── test-workflow.js         # Workflow test script
└── MCP-DEMO-WORKFLOW.md     # Detailed documentation
```

## 🔍 Generated documentation

After running the demo, you'll find:

- **API documentation**: `src/content/docs/api/petstore-api.md`
- **Updated index**: `src/content/docs/index.mdx`

## 📚 Learn more

- [MCP Demo Workflow Guide](MCP-DEMO-WORKFLOW.md) - Detailed documentation
- [Starlight Documentation](https://starlight.astro.build/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 👀 Want to learn more?

Check out [Starlight's docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).

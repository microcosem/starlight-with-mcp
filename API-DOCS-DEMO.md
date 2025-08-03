# API Documentation Demo with MCP

This demo shows how the MCP (Model Context Protocol) client can automatically pull in changes to API documentation from the Pet Store MCP server and update your documentation site.

## Overview

The demo demonstrates:
- Connecting to the Pet Store MCP server
- Generating API documentation in different formats
- Simulating API changes and detecting them
- Automatically updating documentation files
- Creating change logs and summaries

## Prerequisites

Make sure you have the following installed:
- Node.js (v16 or higher)
- All dependencies installed (`npm install` in both `mcp-client/` and `petstore-mcp-server/` directories)

## Quick Start

### 1. Simple Demo (Recommended for first-time users)

Run the simple demo to see basic functionality:

```bash
cd mcp-client
node simple-api-demo.js
```

This demo will:
- Generate current API documentation
- Show available MCP tools
- Demonstrate different documentation formats
- Display API information, endpoints, and schemas

### 2. Advanced Demo (Shows change detection)

Run the advanced demo to see how the system detects and handles API changes:

```bash
cd mcp-client
node demo-api-changes.js
```

This demo will:
- Generate current documentation
- Simulate API changes (adds new health endpoints and schemas)
- Generate updated documentation
- Compare old vs new documentation
- Create a change log
- Restore the original API specification

## Demo Files Generated

After running the demos, you'll find these files in `src/content/docs/api/`:

- `petstore-api.md` - Full API documentation
- `petstore-api-current.md` - Current version (advanced demo)
- `petstore-api-updated.md` - Updated version (advanced demo)
- `petstore-overview.md` - Overview format
- `petstore-endpoints.md` - Endpoints only
- `petstore-schemas.md` - Schemas only
- `petstore-full.md` - Full documentation
- `changelog.md` - Change log (advanced demo)

## How It Works

### 1. MCP Client Connection

The client connects to the Pet Store MCP server using stdio transport:

```javascript
const client = new StarlightMCPClient();
await client.connectToServer('petstore', 'node', [
  join(__dirname, '..', 'petstore-mcp-server', 'server.js')
]);
```

### 2. Available Tools

The Pet Store MCP server provides these tools:

- `get_api_specification` - Get complete OpenAPI spec
- `list_endpoints` - List all API endpoints
- `get_endpoint_details` - Get details for specific endpoint
- `get_schemas` - Get all data schemas
- `generate_markdown_docs` - Generate markdown documentation
- `get_api_info` - Get basic API information

### 3. Documentation Generation

Generate documentation in different formats:

```javascript
const docs = await client.callTool('petstore', 'generate_markdown_docs', {
  format: 'full', // 'overview', 'endpoints', 'schemas', 'full'
  include_examples: true
});
```

### 4. Change Detection

The advanced demo simulates API changes by:
- Modifying the OpenAPI specification file
- Adding new endpoints and schemas
- Regenerating documentation
- Comparing old vs new versions

## Real-World Usage

### Automated Documentation Updates

You can set up a CI/CD pipeline to automatically update documentation:

```bash
# Run this in your CI/CD pipeline
cd mcp-client
node simple-api-demo.js
```

### Monitoring API Changes

Create a script to monitor for API changes:

```javascript
import StarlightMCPClient from './client.js';

async function checkForAPIChanges() {
  const client = new StarlightMCPClient();
  
  try {
    // Get current API info
    await client.connectToServer('petstore', 'node', ['../petstore-mcp-server/server.js']);
    const apiInfo = await client.callTool('petstore', 'get_api_info', {});
    const info = JSON.parse(apiInfo[0].text);
    
    // Check if version has changed
    const lastVersion = await readLastVersion(); // Your implementation
    if (info.version !== lastVersion) {
      console.log(`API version changed from ${lastVersion} to ${info.version}`);
      
      // Generate new documentation
      await client.generateApiDocs();
      
      // Update version tracking
      await saveLastVersion(info.version);
    }
  } finally {
    await client.disconnectAll();
  }
}
```

### Integration with Documentation Sites

The generated markdown files can be used with:
- Starlight (Astro-based documentation)
- Docusaurus
- GitBook
- Any markdown-based documentation system

## Customization

### Adding New Documentation Formats

You can extend the Pet Store MCP server to support new formats:

```javascript
// In petstore-mcp-server/server.js
{
  name: 'generate_html_docs',
  description: 'Generate HTML documentation for the API',
  inputSchema: {
    type: 'object',
    properties: {
      theme: { type: 'string', enum: ['light', 'dark'] }
    }
  }
}
```

### Custom Change Detection

Implement your own change detection logic:

```javascript
async function detectChanges(oldSpec, newSpec) {
  const changes = {
    newEndpoints: [],
    removedEndpoints: [],
    modifiedEndpoints: [],
    newSchemas: [],
    removedSchemas: []
  };
  
  // Compare endpoints
  const oldPaths = Object.keys(oldSpec.paths);
  const newPaths = Object.keys(newSpec.paths);
  
  changes.newEndpoints = newPaths.filter(path => !oldPaths.includes(path));
  changes.removedEndpoints = oldPaths.filter(path => !newPaths.includes(path));
  
  return changes;
}
```

## Troubleshooting

### Common Issues

1. **Connection failed**: Make sure the Pet Store MCP server is running and accessible
2. **Permission denied**: Ensure you have write permissions to the docs directory
3. **Module not found**: Run `npm install` in both client and server directories

### Debug Mode

Enable debug logging:

```javascript
const client = new StarlightMCPClient();
client.debug = true; // Add this to see detailed logs
```

## Next Steps

1. **Extend the Pet Store MCP server** with additional tools
2. **Add more API specifications** to the server
3. **Integrate with your CI/CD pipeline** for automated updates
4. **Add webhook support** to trigger updates when APIs change
5. **Implement caching** to avoid regenerating unchanged documentation

## Resources

- [MCP SDK Documentation](https://modelcontextprotocol.io/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build/) 
# Starlight MCP Server

An MCP (Model Context Protocol) server for interacting with Starlight documentation sites built with Astro.

## Features

This MCP server provides tools and resources for:

- **Listing documentation pages** - Get all documentation files with metadata
- **Searching content** - Search through documentation by keywords
- **Reading specific pages** - Get the full content of any documentation page
- **Site structure analysis** - Understand the complete site organization
- **Resource access** - Direct access to markdown files as resources

## Available Tools

### `list_docs`
List all documentation pages in the Starlight site.

**Parameters:**
- `category` (optional): Filter by category (`all`, `guides`, `reference`)

**Example:**
```json
{
  "name": "list_docs",
  "arguments": {
    "category": "guides"
  }
}
```

### `search_docs`
Search documentation content by keyword.

**Parameters:**
- `query` (required): Search query
- `category` (optional): Filter by category (`all`, `guides`, `reference`)

**Example:**
```json
{
  "name": "search_docs",
  "arguments": {
    "query": "getting started",
    "category": "guides"
  }
}
```

### `get_doc_content`
Get the content of a specific documentation page.

**Parameters:**
- `path` (required): Path to the documentation file (relative to docs directory)

**Example:**
```json
{
  "name": "get_doc_content",
  "arguments": {
    "path": "guides/example.md"
  }
}
```

### `get_site_structure`
Get the complete site structure and navigation.

**Example:**
```json
{
  "name": "get_site_structure",
  "arguments": {}
}
```

## Available Resources

The server provides access to all markdown files in the documentation as resources with the `file:///` scheme.

## Installation

1. Navigate to the mcp-server directory:
   ```bash
   cd mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make the server executable:
   ```bash
   chmod +x server.js
   ```

## Usage

### Running the Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

### Testing and Demo

```bash
# Run unit tests
npm test

# Run working demo (recommended)
npm run demo
```

### Integration with MCP Clients

To use this server with an MCP client, configure it to use the server:

```json
{
  "mcpServers": {
    "starlight": {
      "command": "node",
      "args": ["/path/to/mcp-server/server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Project Structure

```
mcp-server/
├── server.js          # Main MCP server implementation
├── package.json       # Dependencies and scripts
├── test.js           # Unit tests
├── working-demo.js   # Working demo (recommended)
├── demo-client.js    # Demo using MCP client library (experimental)
├── mcp-config.json   # MCP configuration example
└── README.md         # This file
```

> **Note**: The `demo-client.js` uses the MCP client library which may have compatibility issues. Use `working-demo.js` for reliable testing.

## Dependencies

- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `gray-matter`: Frontmatter parsing for markdown files
- `markdown-it`: Markdown to HTML conversion
- `glob`: File pattern matching

## Development

The server is designed to work with Starlight documentation sites. It automatically detects the content directory structure and provides tools for common documentation tasks.

### Adding New Tools

To add new tools, extend the `setupHandlers` method in the `StarlightMCPServer` class:

1. Add the tool definition to the `ListToolsRequestSchema` handler
2. Add the tool implementation to the `CallToolRequestSchema` handler
3. Implement the corresponding method in the class

### Error Handling

The server includes comprehensive error handling for file operations and provides meaningful error messages when operations fail.

## License

MIT 
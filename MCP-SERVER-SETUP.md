# Starlight MCP server setup

This document explains the complete setup of an MCP (Model Context Protocol) server for your Starlight documentation site.

## What is MCP?

The Model Context Protocol (MCP) is a standard for AI assistants to interact with external data sources and tools. It allows AI models to:

- Access and search documentation
- Read specific files
- Execute tools and commands
- Get real-time information from various sources

## Project structure

```
starlight-mcp/
├── src/                    # Starlight documentation site
│   ├── content/
│   │   └── docs/
│   │       ├── guides/
│   │       ├── reference/
│   │       └── index.mdx
│   └── assets/
├── mcp-server/            # MCP server implementation
│   ├── server.js          # Main MCP server
│   ├── package.json       # Dependencies
│   ├── test.js           # Unit tests
│   ├── demo-client.js    # Demo client
│   ├── mcp-config.json   # MCP configuration
│   └── README.md         # Detailed documentation
└── MCP-SERVER-SETUP.md   # This file
```

## MCP server features

### Available tools

1. **`list_docs`** - List all documentation pages with metadata
2. **`search_docs`** - Search documentation content by keywords
3. **`get_doc_content`** - Get full content of specific pages
4. **`get_site_structure`** - Get complete site organization

### Available resources

- Direct access to all markdown files via `file:///` scheme
- Frontmatter parsing and metadata extraction
- HTML rendering of markdown content

## Installation & setup

### 1. Install dependencies

```bash
cd mcp-server
npm install
```

### 2. Make server executable

```bash
chmod +x server.js
```

### 3. Test the server

```bash
npm test
```

### 4. Run demo client

```bash
npm run demo
```

## Usage examples

### Basic server usage

```bash
# Start the server
npm start

# Development mode with auto-restart
npm run dev
```

### Programmatic Usage

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Connect to the server
const transport = new StdioClientTransport(serverProcess.stdin, serverProcess.stdout);
const client = new Client({
  name: 'my-client',
  version: '1.0.0'
});

await client.connect(transport);

// List all documentation
const docs = await client.callTool({
  name: 'list_docs',
  arguments: { category: 'all' }
});

// Search for content
const results = await client.callTool({
  name: 'search_docs',
  arguments: { query: 'getting started' }
});
```

### Integration with AI assistants

To integrate with AI assistants that support MCP:

1. Configure the assistant to use the MCP server
2. Point to the server.js file
3. The assistant can now:
   - Search your documentation
   - Read specific pages
   - Understand site structure
   - Provide context-aware help

## Configuration

### MCP client configuration

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

### Environment variables

- `NODE_ENV`: Set to `production` for production use
- Content directory is automatically detected relative to the server

## Development

### Adding new tools

1. Add tool definition to `ListToolsRequestSchema` handler
2. Add tool implementation to `CallToolRequestSchema` handler
3. Implement the corresponding method in the class
4. Add tests to `test.js`

### Extending functionality

The server is designed to be extensible. You can add:

- New search algorithms
- Content analysis tools
- Integration with external APIs
- Custom resource types
- Real-time content watching

## Troubleshooting

### Common issues

1. **Import errors**: Make sure all dependencies are installed
2. **Path issues**: Ensure the server can find the content directory
3. **Permission errors**: Make sure server.js is executable

### Debug mode

Run with Node.js debug flags:

```bash
node --inspect server.js
```

## Security considerations

- The server only reads files, it doesn't modify them
- File access is restricted to the documentation directory
- No external network access by default
- Input validation on all tool parameters

## Performance

- File operations are cached where possible
- Search is performed efficiently using glob patterns
- Large files are processed in chunks
- Memory usage is optimized for typical documentation sizes

## Future enhancements

Potential improvements:

1. **Real-time watching**: Monitor file changes
2. **Advanced search**: Full-text search with indexing
3. **Content analysis**: Extract topics, keywords, and relationships
4. **API integration**: Connect to external documentation sources
5. **Caching**: Implement persistent caching for better performance

## Support

For issues or questions:

1. Check the test output for errors
2. Review the server logs
3. Verify file permissions and paths
4. Ensure all dependencies are installed

## License

This MCP server is provided under the MIT license. 
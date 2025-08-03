#!/usr/bin/env node

import SimpleMCPClient from './simple-client.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateIndex() {
  console.log('📚 Generating documentation index...\n');
  
  const client = new SimpleMCPClient();
  
  try {
    // Connect to starlight server only (for site structure)
    await client.connectToServer('starlight', 'node', [
      join(__dirname, '..', 'mcp-server', 'server.js')
    ]);
    
    // Get existing Starlight docs structure
    const starlightStructure = await client.callTool('starlight', 'get_site_structure', {});
    const structure = starlightStructure.content[0].text;
    
    // Create an index page that links to the plugin-generated API docs
    const indexContent = `---
title: Documentation
description: Welcome to our documentation
---

# Documentation

Welcome to our comprehensive documentation site.

## API Documentation

- [Pet Store API](/api/petstore-api/) - Complete API reference with examples

## Guides

- [Getting Started](/guides/example/) - Quick start guide
- [Examples](/guides/example/) - Code examples and tutorials

## Reference

- [API Reference](/reference/example/) - Detailed API documentation
- [Configuration](/reference/example/) - Configuration options

## Generated Content

This documentation is automatically generated using MCP (Model Context Protocol) servers and the starlight-openapi plugin.

- **Pet Store API**: Generated from OpenAPI specification using starlight-openapi plugin
- **Starlight Docs**: Managed through Starlight MCP server
`;

    const indexPath = join(__dirname, '..', 'src', 'content', 'docs', 'index.mdx');
    await writeFile(indexPath, indexContent);
    
    console.log('\n✅ Index generation completed successfully!');
    console.log('\n📁 Generated files:');
    console.log(`   - Index Page: ${indexPath}`);
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Review the generated documentation');
    console.log('   2. Run "npm run dev" to preview the site');
    console.log('   3. Commit the changes to version control');
    
    return { indexPath };
    
  } catch (error) {
    console.error('❌ Index generation failed:', error.message);
    process.exit(1);
  } finally {
    await client.disconnectAll();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateIndex();
}

export default generateIndex; 
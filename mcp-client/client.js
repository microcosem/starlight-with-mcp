#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFile, mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class StarlightMCPClient {
  constructor() {
    this.servers = new Map();
    this.clients = new Map();
  }

  async connectToServer(name, command, args = [], env = {}) {
    console.log(`🔌 Connecting to ${name} MCP server...`);
    
    const transport = new StdioClientTransport({
      command,
      args,
      env: { ...process.env, ...env }
    });
    
    const client = new Client({
      name: `${name}-client`,
      version: '1.0.0',
    });
    
    await client.connect(transport);
    
    this.servers.set(name, transport);
    this.clients.set(name, client);
    
    console.log(`✅ Connected to ${name} MCP server`);
    return client;
  }

  async disconnectFromServer(name) {
    const transport = this.servers.get(name);
    const client = this.clients.get(name);
    
    if (client) {
      await client.close();
      this.clients.delete(name);
    }
    
    if (transport) {
      await transport.close();
      this.servers.delete(name);
    }
    
    console.log(`🔌 Disconnected from ${name} MCP server`);
  }

  async disconnectAll() {
    for (const name of this.clients.keys()) {
      await this.disconnectFromServer(name);
    }
  }

  async listTools(serverName) {
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`Not connected to ${serverName} server`);
    }
    
    const response = await client.listTools();
    return response.tools;
  }

  async callTool(serverName, toolName, args = {}) {
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`Not connected to ${serverName} server`);
    }
    
    const response = await client.callTool({
      name: toolName,
      arguments: args
    });
    
    return response.content;
  }

  async listResources(serverName) {
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`Not connected to ${serverName} server`);
    }
    
    const response = await client.listResources();
    return response.resources;
  }

  async readResource(serverName, uri) {
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`Not connected to ${serverName} server`);
    }
    
    const response = await client.readResource({ uri });
    return response.contents;
  }

  async generateApiDocs() {
    console.log('📚 Generating API documentation...');
    
    try {
      // Connect to Pet Store MCP server
      await this.connectToServer('petstore', 'node', [
        join(__dirname, '..', 'petstore-mcp-server', 'server.js')
      ]);
      
      // Get API information
      const apiInfo = await this.callTool('petstore', 'get_api_info', {});
      const info = JSON.parse(apiInfo[0].text);
      
      // Generate full documentation
      const docs = await this.callTool('petstore', 'generate_markdown_docs', {
        format: 'full',
        include_examples: true
      });
      
      const markdown = docs[0].text;
      
      // Create docs directory if it doesn't exist
      const docsDir = join(__dirname, '..', 'src', 'content', 'docs', 'api');
      await mkdir(docsDir, { recursive: true });
      
      // Write the documentation
      const docPath = join(docsDir, 'petstore-api.md');
      await writeFile(docPath, markdown);
      
      console.log(`✅ API documentation generated: ${docPath}`);
      
      return {
        title: info.title,
        version: info.version,
        path: docPath,
        content: markdown
      };
      
    } finally {
      await this.disconnectFromServer('petstore');
    }
  }

  async generateStarlightDocs() {
    console.log('📚 Generating Starlight documentation...');
    
    try {
      // Connect to Starlight MCP server
      await this.connectToServer('starlight', 'node', [
        join(__dirname, '..', 'mcp-server', 'server.js')
      ]);
      
      // Get site structure
      const structure = await this.callTool('starlight', 'get_site_structure', {});
      const structureData = JSON.parse(structure[0].text);
      
      // List all docs
      const docs = await this.callTool('starlight', 'list_docs', {});
      const docsData = JSON.parse(docs[0].text);
      
      console.log(`✅ Found ${docsData.length} documentation pages`);
      
      return {
        structure: structureData,
        docs: docsData
      };
      
    } finally {
      await this.disconnectFromServer('starlight');
    }
  }

  async generateCombinedDocs() {
    console.log('🔄 Generating combined documentation...');
    
    try {
      // Connect to both servers
      await this.connectToServer('petstore', 'node', [
        join(__dirname, '..', 'petstore-mcp-server', 'server.js')
      ]);
      
      await this.connectToServer('starlight', 'node', [
        join(__dirname, '..', 'mcp-server', 'server.js')
      ]);
      
      // Get API documentation
      const apiDocs = await this.callTool('petstore', 'generate_markdown_docs', {
        format: 'full',
        include_examples: true
      });
      
      // Get existing Starlight docs structure
      const starlightStructure = await this.callTool('starlight', 'get_site_structure', {});
      const structure = JSON.parse(starlightStructure[0].text);
      
      // Create a combined documentation structure
      const combinedDocs = {
        api: {
          title: 'Pet Store API',
          content: apiDocs[0].text,
          sections: ['overview', 'endpoints', 'schemas']
        },
        starlight: {
          structure: structure,
          sections: ['guides', 'reference', 'api']
        }
      };
      
      // Create docs directory
      const docsDir = join(__dirname, '..', 'src', 'content', 'docs');
      await mkdir(join(docsDir, 'api'), { recursive: true });
      
      // Write API documentation
      const apiPath = join(docsDir, 'api', 'petstore-api.md');
      await writeFile(apiPath, apiDocs[0].text);
      
      // Create an index page that links to both
      const indexContent = `---
title: Documentation
description: Welcome to our documentation
---

# Documentation

Welcome to our comprehensive documentation site.

## API documentation

- [Pet Store API](/api/petstore-api/) - Complete API reference with examples

## Guides

- [Getting Started](/guides/example/) - Quick start guide
- [Examples](/guides/example/) - Code examples and tutorials

## Reference

- [API Reference](/reference/example/) - Detailed API documentation
- [Configuration](/reference/example/) - Configuration options

## Generated content

This documentation is automatically generated using MCP (Model Context Protocol) servers.

- **Pet Store API**: Generated from OpenAPI specification
- **Starlight Docs**: Managed through Starlight MCP server
`;

      const indexPath = join(docsDir, 'index.mdx');
      await writeFile(indexPath, indexContent);
      
      console.log(`✅ Combined documentation generated:`);
      console.log(`   - API docs: ${apiPath}`);
      console.log(`   - Index: ${indexPath}`);
      
      return {
        apiPath,
        indexPath,
        structure: combinedDocs
      };
      
    } finally {
      await this.disconnectAll();
    }
  }

  async runDemo() {
    console.log('🚀 Starting MCP Client Demo\n');
    
    try {
      // Demo 1: Generate API docs
      console.log('📋 Demo 1: Generating Pet Store API Documentation');
      const apiResult = await this.generateApiDocs();
      console.log(`   Generated: ${apiResult.title} v${apiResult.version}\n`);
      
      // Demo 2: Generate Starlight docs info
      console.log('📋 Demo 2: Getting Starlight Documentation Structure');
      const starlightResult = await this.generateStarlightDocs();
      console.log(`   Found ${starlightResult.docs.length} documentation pages\n`);
      
      // Demo 3: Generate combined docs
      console.log('📋 Demo 3: Generating Combined Documentation');
      const combinedResult = await this.generateCombinedDocs();
      console.log(`   Combined docs generated successfully\n`);
      
      console.log('🎉 Demo completed successfully!');
      
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    }
  }
}

// Export for use in other modules
export default StarlightMCPClient;

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const client = new StarlightMCPClient();
  client.runDemo().catch(console.error);
} 
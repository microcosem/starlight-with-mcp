#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFile, mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SimpleMCPClient {
  constructor() {
    this.servers = new Map();
  }

  async connectToServer(name, command, args = []) {
    console.log(`🔌 Connecting to ${name} MCP server...`);
    
    const process = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    this.servers.set(name, process);
    
    // Wait for server to be ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 5000);
      
      process.stderr.on('data', (data) => {
        const message = data.toString();
        if (message.includes('started') || message.includes('ready')) {
          clearTimeout(timeout);
          resolve();
        }
      });
      
      process.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    
    console.log(`✅ Connected to ${name} MCP server`);
    return process;
  }

  async disconnectFromServer(name) {
    const process = this.servers.get(name);
    if (process) {
      process.kill();
      this.servers.delete(name);
      console.log(`🔌 Disconnected from ${name} MCP server`);
    }
  }

  async disconnectAll() {
    for (const name of this.servers.keys()) {
      await this.disconnectFromServer(name);
    }
  }

  async callTool(serverName, toolName, args = {}) {
    const process = this.servers.get(serverName);
    if (!process) {
      throw new Error(`Not connected to ${serverName} server`);
    }
    
    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };
    
    return new Promise((resolve, reject) => {
      const responseHandler = (data) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.result) {
            resolve(response.result);
          } else if (response.error) {
            reject(new Error(response.error.message));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      process.stdout.once('data', responseHandler);
      process.stdin.write(JSON.stringify(request) + '\n');
    });
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
      const info = JSON.parse(apiInfo.content[0].text);
      
      // Generate full documentation
      const docs = await this.callTool('petstore', 'generate_markdown_docs', {
        format: 'full',
        include_examples: true
      });
      
      const markdown = docs.content[0].text;
      
      // Create docs directory if it doesn't exist
      const docsDir = join(__dirname, '..', 'src', 'content', 'docs', 'api');
      await mkdir(docsDir, { recursive: true });
      
      // Add frontmatter to the markdown
      const frontmatter = `---
title: Pet Store API
description: Complete API reference for the Pet Store API with endpoints, schemas, and examples
---

`;
      const fullMarkdown = frontmatter + markdown;
      
      // Write the documentation
      const docPath = join(docsDir, 'petstore-api.md');
      await writeFile(docPath, fullMarkdown);
      
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
      const structureText = structure.content[0].text;
      
      // List all docs
      const docs = await this.callTool('starlight', 'list_docs', {});
      const docsText = docs.content[0].text;
      
      // Parse the docs list (it's in a specific format)
      const docsMatch = docsText.match(/Found (\d+) documentation files:/);
      const docsCount = docsMatch ? parseInt(docsMatch[1]) : 0;
      
      console.log(`✅ Found ${docsCount} documentation pages`);
      
      return {
        structure: structureText,
        docs: docsText,
        docsCount
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
      const structure = starlightStructure.content[0].text;
      
      // Create docs directory
      const docsDir = join(__dirname, '..', 'src', 'content', 'docs');
      await mkdir(join(docsDir, 'api'), { recursive: true });
      
      // Add frontmatter to the API documentation
      const apiFrontmatter = `---
title: Pet Store API
description: Complete API reference for the Pet Store API with endpoints, schemas, and examples
---

`;
      const fullApiMarkdown = apiFrontmatter + apiDocs.content[0].text;
      
      // Write API documentation
      const apiPath = join(docsDir, 'api', 'petstore-api.md');
      await writeFile(apiPath, fullApiMarkdown);
      
      // Create an index page that links to both
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
        structure: {
          api: {
            title: 'Pet Store API',
            content: apiDocs.content[0].text,
            sections: ['overview', 'endpoints', 'schemas']
          },
          starlight: {
            structure: structure,
            sections: ['guides', 'reference', 'api']
          }
        }
      };
      
    } finally {
      await this.disconnectAll();
    }
  }

  async runDemo() {
    console.log('🚀 Starting Simple MCP Client Demo\n');
    
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
      throw error;
    }
  }
}

// Export for use in other modules
export default SimpleMCPClient;

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const client = new SimpleMCPClient();
  client.runDemo().catch(console.error);
} 
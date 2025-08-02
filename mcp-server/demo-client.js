#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

class StarlightMCPDemo {
  constructor() {
    this.client = null;
  }

  async connect() {
    // Get the current directory and server.js path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const serverPath = join(__dirname, 'server.js');
    
    // Spawn the MCP server process
    this.serverProcess = spawn('node', [serverPath], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Handle server process errors
    this.serverProcess.on('error', (error) => {
      console.error('Server process error:', error);
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.error('Server stderr:', data.toString());
    });

    // Wait a moment for the server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create transport and client
    const transport = new StdioClientTransport(this.serverProcess.stdin, this.serverProcess.stdout);
    this.client = new Client({
      name: 'starlight-demo-client',
      version: '1.0.0'
    });

    await this.client.connect(transport);
    console.log('✅ Connected to Starlight MCP Server\n');
  }

  async listTools() {
    console.log('🔧 Available Tools:');
    const tools = await this.client.listTools();
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();
  }

  async demoListDocs() {
    console.log('📚 Listing all documentation:');
    const result = await this.client.callTool({
      name: 'list_docs',
      arguments: { category: 'all' }
    });
    console.log(result.content[0].text);
    console.log();
  }

  async demoSearchDocs() {
    console.log('🔍 Searching for "example":');
    const result = await this.client.callTool({
      name: 'search_docs',
      arguments: { query: 'example' }
    });
    console.log(result.content[0].text);
    console.log();
  }

  async demoGetSiteStructure() {
    console.log('🏗️  Getting site structure:');
    const result = await this.client.callTool({
      name: 'get_site_structure',
      arguments: {}
    });
    console.log(result.content[0].text);
    console.log();
  }

  async demoGetDocContent() {
    console.log('📄 Getting specific document content:');
    const result = await this.client.callTool({
      name: 'get_doc_content',
      arguments: { path: 'guides/example.md' }
    });
    console.log(result.content[0].text.substring(0, 500) + '...');
    console.log();
  }

  async run() {
    try {
      await this.connect();
      await this.listTools();
      await this.demoListDocs();
      await this.demoSearchDocs();
      await this.demoGetSiteStructure();
      await this.demoGetDocContent();
      
      console.log('🎉 Demo completed successfully!');
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    } finally {
      if (this.client) {
        await this.client.close();
      }
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
    }
  }
}

// Run the demo
const demo = new StarlightMCPDemo();
demo.run(); 
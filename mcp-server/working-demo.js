#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

class WorkingDemo {
  constructor() {
    this.serverProcess = null;
    this.requestId = 1;
  }

  async connect() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const serverPath = join(__dirname, 'server.js');
    
    this.serverProcess = spawn('node', [serverPath], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.log('Server:', data.toString().trim());
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Server started\n');
  }

  async sendRequest(method, params = {}) {
    const request = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method,
      params
    };

    return new Promise((resolve, reject) => {
      let responseData = '';
      
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000);

      const dataHandler = (data) => {
        responseData += data.toString();
        try {
          const response = JSON.parse(responseData);
          if (response.id === request.id) {
            clearTimeout(timeout);
            this.serverProcess.stdout.removeListener('data', dataHandler);
            resolve(response);
          }
        } catch (e) {
          // Incomplete JSON, continue reading
        }
      };

      this.serverProcess.stdout.on('data', dataHandler);
      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async listTools() {
    console.log('🔧 Available Tools:');
    const response = await this.sendRequest('tools/list');
    response.result.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();
  }

  async demoListDocs() {
    console.log('📚 Listing all documentation:');
    const response = await this.sendRequest('tools/call', {
      name: 'list_docs',
      arguments: { category: 'all' }
    });
    console.log(response.result.content[0].text);
    console.log();
  }

  async demoSearchDocs() {
    console.log('🔍 Searching for "example":');
    const response = await this.sendRequest('tools/call', {
      name: 'search_docs',
      arguments: { query: 'example' }
    });
    console.log(response.result.content[0].text);
    console.log();
  }

  async demoGetSiteStructure() {
    console.log('🏗️  Getting site structure:');
    const response = await this.sendRequest('tools/call', {
      name: 'get_site_structure',
      arguments: {}
    });
    console.log(response.result.content[0].text);
    console.log();
  }

  async demoGetDocContent() {
    console.log('📄 Getting specific document content:');
    const response = await this.sendRequest('tools/call', {
      name: 'get_doc_content',
      arguments: { path: 'guides/example.md' }
    });
    console.log(response.result.content[0].text.substring(0, 500) + '...');
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
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
    }
  }
}

const demo = new WorkingDemo();
demo.run(); 
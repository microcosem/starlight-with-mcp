#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function demoPetStoreMCPServer() {
  console.log('🚀 Starting Pet Store MCP Server Demo\n');
  
  // Start the MCP server
  const serverProcess = spawn('node', [join(__dirname, 'server.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let serverReady = false;
  
  serverProcess.stderr.on('data', (data) => {
    const message = data.toString();
    if (message.includes('Pet Store MCP Server started')) {
      serverReady = true;
      console.log('✅ Pet Store MCP Server is ready!\n');
      runDemo();
    }
  });
  
  async function runDemo() {
    try {
      console.log('📋 Demo 1: Getting API Information');
      await callTool('get_api_info', {});
      
      console.log('\n📋 Demo 2: Listing All Endpoints');
      await callTool('list_endpoints', {});
      
      console.log('\n📋 Demo 3: Getting Pet Endpoints Only');
      await callTool('list_endpoints', { tag: 'pets' });
      
      console.log('\n📋 Demo 4: Getting Details for GET /pets');
      await callTool('get_endpoint_details', { path: '/pets', method: 'GET' });
      
      console.log('\n📋 Demo 5: Getting Pet Schema');
      await callTool('get_schemas', { schema_name: 'Pet' });
      
      console.log('\n📋 Demo 6: Generating Full API Documentation');
      await callTool('generate_markdown_docs', { format: 'full', include_examples: true });
      
      console.log('\n🎉 Demo completed successfully!');
      
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    } finally {
      serverProcess.kill();
    }
  }
  
  async function callTool(name, args) {
    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name,
        arguments: args
      }
    };
    
    return new Promise((resolve, reject) => {
      const responseHandler = (data) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.result) {
            console.log(`\n📤 Request: ${name}(${JSON.stringify(args)})`);
            console.log(`📥 Response: ${response.result.content[0].text.substring(0, 200)}...`);
            resolve(response.result);
          } else if (response.error) {
            reject(new Error(response.error.message));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      serverProcess.stdout.once('data', responseHandler);
      serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }
  
  // Handle server startup timeout
  setTimeout(() => {
    if (!serverReady) {
      console.error('❌ Server failed to start within timeout');
      serverProcess.kill();
    }
  }, 5000);
}

demoPetStoreMCPServer().catch(console.error); 
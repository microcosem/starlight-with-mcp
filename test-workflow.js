#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testWorkflow() {
  console.log('🧪 Testing MCP Workflow Components...\n');
  
  // Test 1: Pet Store MCP Server
  console.log('1️⃣ Testing Pet Store MCP Server...');
  try {
    const petstoreProcess = spawn('node', [join(__dirname, 'petstore-mcp-server', 'demo.js')], {
      stdio: 'pipe'
    });
    
    await new Promise((resolve, reject) => {
      let output = '';
      petstoreProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      petstoreProcess.stderr.on('data', (data) => {
        output += data.toString();
      });
      petstoreProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Pet Store MCP Server: PASSED');
          resolve();
        } else {
          console.log('❌ Pet Store MCP Server: FAILED');
          reject(new Error(`Exit code: ${code}`));
        }
      });
    });
  } catch (error) {
    console.log('❌ Pet Store MCP Server test failed:', error.message);
  }
  
  // Test 2: Starlight MCP Server
  console.log('\n2️⃣ Testing Starlight MCP Server...');
  try {
    const starlightProcess = spawn('node', [join(__dirname, 'mcp-server', 'working-demo.js')], {
      stdio: 'pipe'
    });
    
    await new Promise((resolve, reject) => {
      let output = '';
      starlightProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      starlightProcess.stderr.on('data', (data) => {
        output += data.toString();
      });
      starlightProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Starlight MCP Server: PASSED');
          resolve();
        } else {
          console.log('❌ Starlight MCP Server: FAILED');
          reject(new Error(`Exit code: ${code}`));
        }
      });
    });
  } catch (error) {
    console.log('❌ Starlight MCP Server test failed:', error.message);
  }
  
  // Test 3: MCP Client
  console.log('\n3️⃣ Testing MCP Client...');
  try {
    const clientProcess = spawn('node', [join(__dirname, 'mcp-client', 'demo.js')], {
      stdio: 'pipe'
    });
    
    await new Promise((resolve, reject) => {
      let output = '';
      clientProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      clientProcess.stderr.on('data', (data) => {
        output += data.toString();
      });
      clientProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ MCP Client: PASSED');
          resolve();
        } else {
          console.log('❌ MCP Client: FAILED');
          reject(new Error(`Exit code: ${code}`));
        }
      });
    });
  } catch (error) {
    console.log('❌ MCP Client test failed:', error.message);
  }
  
  console.log('\n🎉 Workflow test completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run "npm run demo" to see the full workflow');
  console.log('   2. Run "npm run dev" to view the generated documentation');
  console.log('   3. Check the generated files in src/content/docs/');
}

testWorkflow().catch(console.error); 
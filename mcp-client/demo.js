#!/usr/bin/env node

import SimpleMCPClient from './simple-client.js';

async function runDemo() {
  console.log('🚀 Starlight MCP Client Demo\n');
  console.log('This demo shows the complete workflow:\n');
  console.log('1. Connect to Pet Store MCP Server');
  console.log('2. Generate API documentation');
  console.log('3. Connect to Starlight MCP Server');
  console.log('4. Generate combined documentation');
  console.log('5. View the results\n');
  
  const client = new SimpleMCPClient();
  
  try {
    await client.runDemo();
    
    console.log('\n📁 Generated Files:');
    console.log('   - src/content/docs/api/petstore-api.md');
    console.log('   - src/content/docs/index.mdx');
    
    console.log('\n🌐 To view the documentation:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Open: http://localhost:4321');
    console.log('   3. Navigate to the API documentation section');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

runDemo(); 
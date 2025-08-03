#!/usr/bin/env node

import { join, dirname } from 'path';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import StarlightMCPClient from './client.js';

async function simpleAPIDemo() {
  console.log('🚀 Simple API Documentation Demo\n');
  
  const client = new StarlightMCPClient();
  
  try {
    // Step 1: Generate current API documentation
    console.log('📋 Step 1: Generating Current API Documentation');
    const apiResult = await client.generateApiDocs();
    console.log(`   Generated: ${apiResult.title} v${apiResult.version}`);
    console.log(`   File: ${apiResult.path}\n`);
    
    // Step 2: Show what tools are available
    console.log('📋 Step 2: Available MCP Tools');
    await client.connectToServer('petstore', 'node', [
      join(dirname(fileURLToPath(import.meta.url)), '..', 'petstore-mcp-server', 'server.js')
    ]);
    
    const tools = await client.listTools('petstore');
    console.log(`   Found ${tools.length} tools:`);
    tools.forEach(tool => {
      console.log(`     - ${tool.name}: ${tool.description}`);
    });
    
    // Step 3: Demonstrate different documentation formats
    console.log('\n📋 Step 3: Different Documentation Formats');
    
    const formats = ['overview', 'endpoints', 'schemas', 'full'];
    for (const format of formats) {
      console.log(`   Generating ${format} format...`);
      const docs = await client.callTool('petstore', 'generate_markdown_docs', {
        format: format,
        include_examples: true
      });
      
      const docPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'docs', 'api', `petstore-${format}.md`);
      await writeFile(docPath, docs[0].text);
      console.log(`     ✅ Saved to: ${docPath}`);
    }
    
    // Step 4: Show API information
    console.log('\n📋 Step 4: API Information');
    const apiInfo = await client.callTool('petstore', 'get_api_info', {});
    const info = JSON.parse(apiInfo[0].text);
    console.log(`   Title: ${info.title}`);
    console.log(`   Version: ${info.version}`);
    console.log(`   Description: ${info.description.substring(0, 100)}...`);
    console.log(`   Contact: ${info.contact.name} (${info.contact.email})`);
    
    // Step 5: List endpoints
    console.log('\n📋 Step 5: Available Endpoints');
    const endpoints = await client.callTool('petstore', 'list_endpoints', {});
    const endpointList = JSON.parse(endpoints[0].text);
    console.log(`   Found ${endpointList.length} endpoints:`);
    endpointList.slice(0, 5).forEach(endpoint => {
      console.log(`     - ${endpoint.method} ${endpoint.path}: ${endpoint.summary}`);
    });
    if (endpointList.length > 5) {
      console.log(`     ... and ${endpointList.length - 5} more`);
    }
    
    // Step 6: Show schemas
    console.log('\n📋 Step 6: Data Schemas');
    const schemas = await client.callTool('petstore', 'get_schemas', {});
    const schemaList = JSON.parse(schemas[0].text);
    console.log(`   Found ${Object.keys(schemaList).length} schemas:`);
    Object.keys(schemaList).forEach(schemaName => {
      console.log(`     - ${schemaName}`);
    });
    
    console.log('\n🎉 Demo completed successfully!');
    console.log('\n💡 How to use this in practice:');
    console.log('   1. Run this script periodically to check for API changes');
    console.log('   2. Compare generated files to detect updates');
    console.log('   3. Automatically update your documentation site');
    console.log('   4. Use the MCP client to pull real-time API information');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  } finally {
    await client.disconnectAll();
  }
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  simpleAPIDemo().catch(console.error);
}

export default simpleAPIDemo; 